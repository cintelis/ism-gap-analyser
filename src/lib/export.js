import { getCatalogVersion, getControlDescription } from "./oscal.js";
import { CLASSIFICATIONS } from "../theme.js";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportGapReport(analysis, classification, currentData, previousData) {
  if (!analysis) return;
  const lines = [
    `ISM Gap Analysis Report`,
    `Classification: ${CLASSIFICATIONS.find((c) => c.id === classification)?.label || classification}`,
    `Generated: ${new Date().toISOString()}`,
    `Current Version: ${getCatalogVersion(currentData) || "unknown"}`,
    `Previous Version: ${getCatalogVersion(previousData) || "unknown"}`,
    `Current Controls: ${analysis.currentCount}`,
    `Previous Controls: ${analysis.previousCount}`,
    `New (Gap): ${analysis.newCount}`,
    `Removed: ${analysis.removedCount}`,
    ``,
    `=== NEW CONTROLS (GAP) ===`,
    ...analysis.newControls.map(
      (c) => `${c.id}\t${c.title || ""}\t${c.groupTitle}\t${getControlDescription(c)}`
    ),
    ``,
    `=== REMOVED CONTROLS ===`,
    ...analysis.removedControls.map(
      (c) => `${c.id}\t${c.title || ""}\t${c.groupTitle}\t${getControlDescription(c)}`
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  triggerDownload(blob, `ism-gap-report-${classification}-${Date.now()}.txt`);
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function exportCSV(analysis, classification) {
  if (!analysis) return;
  const row = (c, status) =>
    [c.id, csvEscape(c.title || ""), csvEscape(c.groupTitle), status, csvEscape(getControlDescription(c))].join(",");

  const rows = [
    ["Control ID", "Title", "Group", "Status", "Description"].join(","),
    ...analysis.newControls.map((c) => row(c, "NEW")),
    ...analysis.removedControls.map((c) => row(c, "REMOVED")),
    ...analysis.unchangedControls.map((c) => row(c, "UNCHANGED")),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  triggerDownload(blob, `ism-gap-analysis-${classification}-${Date.now()}.csv`);
}
