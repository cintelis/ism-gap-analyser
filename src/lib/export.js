import {
  getCatalogVersion,
  getCatalogPublished,
  getControlDescription,
  getControlGuideline,
  getControlRevision,
} from "./oscal.js";
import { CLASSIFICATIONS } from "../theme.js";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function classificationLabel(id) {
  return CLASSIFICATIONS.find((c) => c.id === id)?.label || id;
}

function controlLine(c) {
  return `${c.id}\t${c.title || ""}\t${c.groupTitle}\t${getControlDescription(c)}`;
}

export function exportGapReport(analysis, classification, currentData, previousData) {
  if (!analysis) return;
  const lines = [
    `ISM Gap Analysis Report`,
    `Classification: ${classificationLabel(classification)}`,
    `Generated: ${new Date().toISOString()}`,
    `Current Version: ${getCatalogVersion(currentData) || "unknown"}`,
    `Current Published: ${getCatalogPublished(currentData) || "unknown"}`,
    `Previous Version: ${getCatalogVersion(previousData) || "unknown"}`,
    `Current Controls: ${analysis.currentCount}`,
    `Previous Controls: ${analysis.previousCount}`,
    `New (Gap): ${analysis.newCount}`,
    `Removed: ${analysis.removedCount}`,
    `Modified: ${analysis.modifiedCount ?? 0}`,
    `Unchanged: ${analysis.unchangedCount}`,
    ``,
    `=== NEW CONTROLS (GAP) ===`,
    ...analysis.newControls.map(controlLine),
    ``,
    `=== REMOVED CONTROLS ===`,
    ...analysis.removedControls.map(controlLine),
    ``,
    `=== MODIFIED CONTROLS ===`,
    ...(analysis.modifiedControls ?? []).map((p) => controlLine(p.current)),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  triggerDownload(blob, `ism-gap-report-${classification}-${Date.now()}.txt`);
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function exportCSV(analysis, classification) {
  if (!analysis) return;
  const header = [
    "Control ID",
    "Title",
    "Group",
    "Status",
    "Revision",
    "Description",
    "Guideline",
    "Props",
  ].join(",");

  const row = (c, status) => {
    const propsStr = (c.props || []).map((p) => `${p.name}=${p.value}`).join("; ");
    return [
      c.id,
      csvEscape(c.title || ""),
      csvEscape(c.groupTitle),
      status,
      csvEscape(getControlRevision(c)),
      csvEscape(getControlDescription(c)),
      csvEscape(getControlGuideline(c)),
      csvEscape(propsStr),
    ].join(",");
  };

  const rows = [
    header,
    ...analysis.newControls.map((c) => row(c, "NEW")),
    ...analysis.removedControls.map((c) => row(c, "REMOVED")),
    ...(analysis.modifiedControls ?? []).map((p) => row(p.current, "MODIFIED")),
    ...analysis.unchangedControls.map((c) => row(c, "UNCHANGED")),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  triggerDownload(blob, `ism-gap-analysis-${classification}-${Date.now()}.csv`);
}

export function exportJSON(analysis, classification, currentData, previousData) {
  if (!analysis) return;

  const shape = (c, status, extras = {}) => ({
    id: c.id,
    status,
    title: c.title || null,
    group: c.groupTitle,
    groupId: c.groupId,
    revision: getControlRevision(c),
    statement: getControlDescription(c),
    guideline: getControlGuideline(c),
    props: c.props || [],
    ...extras,
  });

  const report = {
    reportVersion: 1,
    generated: new Date().toISOString(),
    classification,
    classificationLabel: classificationLabel(classification),
    currentVersion: getCatalogVersion(currentData),
    currentPublished: getCatalogPublished(currentData),
    previousVersion: getCatalogVersion(previousData),
    previousPublished: getCatalogPublished(previousData),
    counts: {
      current: analysis.currentCount,
      previous: analysis.previousCount,
      new: analysis.newCount,
      removed: analysis.removedCount,
      modified: analysis.modifiedCount ?? 0,
      unchanged: analysis.unchangedCount,
    },
    controls: [
      ...analysis.newControls.map((c) => shape(c, "NEW")),
      ...analysis.removedControls.map((c) => shape(c, "REMOVED")),
      ...(analysis.modifiedControls ?? []).map((p) =>
        shape(p.current, "MODIFIED", {
          previous: {
            title: p.previous.title || null,
            statement: getControlDescription(p.previous),
            guideline: getControlGuideline(p.previous),
            props: p.previous.props || [],
          },
        })
      ),
      ...analysis.unchangedControls.map((c) => shape(c, "UNCHANGED")),
    ],
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  triggerDownload(blob, `ism-gap-report-${classification}-${Date.now()}.json`);
}
