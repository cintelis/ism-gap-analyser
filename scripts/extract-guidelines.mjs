#!/usr/bin/env node
// Extract ISM guideline text from ASD's HTML into public/guidelines.json.
// Keys = OSCAL group titles (h3-level headings on cyber.gov.au).
// Re-run on each ISM release.
//
// Usage: node scripts/extract-guidelines.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { JSDOM } from "jsdom";

const BASE = "https://www.cyber.gov.au";
const INDEX =
  BASE + "/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines";

const NAV_H2 = new Set([
  "What are you looking for?",
  "About us",
  "Learn the basics",
  "Protect yourself",
  "Threats",
  "Report and recover",
  "For business and government",
  "Popular pages",
  "Breadcrumb",
]);

const ALLOWED_TAGS = new Set([
  "p", "ul", "ol", "li", "strong", "em", "b", "i", "a",
  "h4", "h5", "br", "code", "table", "thead", "tbody", "tr", "td", "th",
]);

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "user-agent": "ism-gap-analyser-extractor" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function serializeClean(node) {
  if (node.nodeType === 3) return node.textContent.replace(/\s+/g, " ");
  if (node.nodeType !== 1) return "";
  const tag = node.tagName.toLowerCase();
  const inner = [...node.childNodes].map(serializeClean).join("");
  if (!ALLOWED_TAGS.has(tag)) return inner;
  if (tag === "a") {
    let href = node.getAttribute("href") || "";
    if (href.startsWith("/")) href = BASE + href;
    return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  }
  return `<${tag}>${inner}</${tag}>`;
}

async function findGuidelineUrls() {
  const html = await fetchHtml(INDEX);
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll(
    'a[href*="/cyber-security-guidelines/guidelines-for-"], a[href*="/cyber-security-principles"]'
  );
  const urls = new Set();
  for (const a of anchors) {
    let href = a.getAttribute("href");
    if (!href) continue;
    if (href.startsWith("/")) href = BASE + href;
    if (!href.startsWith(BASE)) continue;
    urls.add(href);
  }
  return [...urls];
}

function extractSections(dom, pageUrl, topicTitle) {
  const doc = dom.window.document;
  const article = doc.querySelector("article") || doc.querySelector("main") || doc.body;

  const sections = [];
  let currentH2 = null;
  let currentH3 = null;

  const walker = doc.createTreeWalker(article, dom.window.NodeFilter.SHOW_ELEMENT, null);
  let node;
  while ((node = walker.nextNode())) {
    const tag = node.tagName.toLowerCase();
    if (tag === "h2") {
      const heading = node.textContent.trim().replace(/\s+/g, " ");
      if (NAV_H2.has(heading) || !heading) {
        currentH2 = null;
        currentH3 = null;
        continue;
      }
      currentH2 = heading;
      currentH3 = null;
    } else if (tag === "h3" && currentH2) {
      const heading = node.textContent.trim().replace(/\s+/g, " ");
      if (!heading) continue;
      currentH3 = { heading, parentH2: currentH2, html: [] };
      sections.push(currentH3);
    } else if (currentH3 && /^(p|ul|ol|h4|table)$/.test(tag)) {
      let skip = false;
      for (let p = node.parentElement; p && p !== article; p = p.parentElement) {
        if (/^(p|ul|ol|table)$/.test(p.tagName.toLowerCase())) { skip = true; break; }
      }
      if (skip) continue;
      const clean = serializeClean(node);
      if (clean.trim()) currentH3.html.push(clean);
    }
  }

  return sections
    .filter((s) => s.html.length)
    .map((s) => ({
      heading: s.heading,
      parentSection: s.parentH2,
      html: s.html.join("\n"),
      sourceUrl: pageUrl,
      topicTitle,
    }));
}

async function extractPage(url) {
  const html = await fetchHtml(url);
  const dom = new JSDOM(html);
  const topicTitle =
    dom.window.document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " ") ||
    url.split("/").pop();
  const sections = extractSections(dom, url, topicTitle);
  return { topicTitle, sections, url };
}

async function main() {
  console.log("Discovering guideline pages...");
  const urls = await findGuidelineUrls();
  console.log(`Found ${urls.length} pages.`);

  const out = {};
  const topics = {};
  let totalSections = 0;
  for (const url of urls) {
    process.stdout.write(`  ${url.split("/").pop()} … `);
    try {
      const page = await extractPage(url);
      topics[page.topicTitle] = {
        url: page.url,
        sectionHeadings: page.sections.map((s) => s.heading),
      };
      for (const s of page.sections) {
        const key = s.heading;
        if (out[key]) out[`${key} (${s.parentSection})`] = s;
        else out[key] = s;
        totalSections++;
      }
      console.log(`${page.sections.length} sections`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  const payload = {
    generated: new Date().toISOString(),
    source: INDEX,
    license: "CC BY 4.0 (ASD / Australian Government)",
    topics,
    sections: out,
  };

  mkdirSync("public", { recursive: true });
  writeFileSync("public/guidelines.json", JSON.stringify(payload, null, 2));
  const size = JSON.stringify(payload).length;
  console.log(
    `\nWrote public/guidelines.json: ${totalSections} sections across ${Object.keys(topics).length} topics (${(size / 1024).toFixed(1)} KB).`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
