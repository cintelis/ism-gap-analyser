import { palette } from "../theme.js";
import { loadJSON, saveJSON } from "./storage.js";

const KEY = "assessments";

export const ASSESSMENT_STATUSES = [
  { id: "implemented", label: "Implemented", short: "IMP", color: palette.green },
  { id: "alternate", label: "Alternate Control", short: "ALT", color: palette.cyan },
  { id: "not_implemented", label: "Not Implemented", short: "NOT", color: palette.red },
  { id: "not_applicable", label: "Not Applicable", short: "N/A", color: palette.textDim },
];

export function getStatusMeta(statusId) {
  return ASSESSMENT_STATUSES.find((s) => s.id === statusId) || null;
}

export function loadAssessments() {
  return loadJSON(KEY, {});
}

export function saveAssessments(assessments) {
  saveJSON(KEY, assessments);
}

export function updateAssessment(assessments, controlId, patch) {
  const existing = assessments[controlId] || { status: null, notes: "" };
  const merged = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  if (!merged.status && !merged.notes) {
    const { [controlId]: _, ...rest } = assessments;
    return rest;
  }
  return { ...assessments, [controlId]: merged };
}

export function countByStatus(assessments) {
  const counts = { implemented: 0, alternate: 0, not_implemented: 0, not_applicable: 0, unset: 0 };
  for (const entry of Object.values(assessments || {})) {
    if (entry?.status) counts[entry.status] = (counts[entry.status] || 0) + 1;
    else counts.unset++;
  }
  return counts;
}
