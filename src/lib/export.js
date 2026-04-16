import {
  getCatalogVersion,
  getCatalogPublished,
  getControlDescription,
  getControlGuideline,
  getControlRevision,
} from "./oscal.js";
import { getStatusMeta } from "./assessments.js";
import { PROTECTED_PROFILE } from "../theme.js";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function controlLine(c, status) {
  return `${c.id}\t${c.title || ""}\t${c.groupTitle}\t${status || ""}\t${getControlDescription(c)}`;
}

function statusOf(assessments, id) {
  const s = assessments?.[id]?.status;
  return s ? getStatusMeta(s)?.label || s : "";
}

function notesOf(assessments, id) {
  return assessments?.[id]?.notes || "";
}

export function exportGapReport(analysis, currentData, previousData, assessments = {}) {
  if (!analysis) return;
  const lines = [
    `ISM Gap Analysis Report`,
    `Classification: ${PROTECTED_PROFILE.label}`,
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
    ...analysis.newControls.map((c) => controlLine(c, statusOf(assessments, c.id))),
    ``,
    `=== REMOVED CONTROLS ===`,
    ...analysis.removedControls.map((c) => controlLine(c, statusOf(assessments, c.id))),
    ``,
    `=== MODIFIED CONTROLS ===`,
    ...(analysis.modifiedControls ?? []).map((p) =>
      controlLine(p.current, statusOf(assessments, p.current.id))
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  triggerDownload(blob, `ism-gap-report-PROTECTED-${Date.now()}.txt`);
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function exportCSV(analysis, assessments = {}) {
  if (!analysis) return;
  const header = [
    "Control ID",
    "Title",
    "Group",
    "Status",
    "Assessment",
    "Evidence/Notes",
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
      csvEscape(statusOf(assessments, c.id)),
      csvEscape(notesOf(assessments, c.id)),
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
  triggerDownload(blob, `ism-gap-analysis-PROTECTED-${Date.now()}.csv`);
}

export function exportJSON(analysis, currentData, previousData, assessments = {}) {
  if (!analysis) return;

  const shape = (c, status, extras = {}) => {
    const a = assessments?.[c.id];
    return {
      id: c.id,
      status,
      title: c.title || null,
      group: c.groupTitle,
      groupId: c.groupId,
      revision: getControlRevision(c),
      statement: getControlDescription(c),
      guideline: getControlGuideline(c),
      props: c.props || [],
      assessment: a
        ? { status: a.status, notes: a.notes, updatedAt: a.updatedAt }
        : null,
      ...extras,
    };
  };

  const report = {
    reportVersion: 1,
    generated: new Date().toISOString(),
    classification: PROTECTED_PROFILE.id,
    classificationLabel: PROTECTED_PROFILE.label,
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
    assessmentSummary: {
      total: Object.keys(assessments || {}).length,
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
  triggerDownload(blob, `ism-gap-report-PROTECTED-${Date.now()}.json`);
}
