const FILE_SCHEMA = "ism-gap-analyser-assessment";
const FILE_VERSION = 1;

export function buildExport(assessments) {
  return {
    tool: FILE_SCHEMA,
    exportVersion: FILE_VERSION,
    exportedAt: new Date().toISOString(),
    classification: "PROTECTED",
    notice:
      "This file may contain sensitive IRAP assessment evidence. Store and transmit accordingly.",
    assessments,
  };
}

export function downloadAssessment(assessments) {
  const payload = buildExport(assessments);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ism-assessment-PROTECTED-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseAssessmentFile(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  if (data?.tool !== FILE_SCHEMA) {
    throw new Error(`Not an assessment file (expected tool="${FILE_SCHEMA}").`);
  }
  if (typeof data.exportVersion !== "number" || data.exportVersion > FILE_VERSION) {
    throw new Error(`Unsupported export version ${data.exportVersion}.`);
  }
  if (!data.assessments || typeof data.assessments !== "object") {
    throw new Error("Missing assessments object.");
  }
  return data.assessments;
}

export function mergeAssessments(current, incoming) {
  const merged = { ...current };
  for (const [controlId, entry] of Object.entries(incoming)) {
    const existing = merged[controlId];
    if (!existing) {
      merged[controlId] = entry;
      continue;
    }
    const existingTime = existing.updatedAt || "";
    const incomingTime = entry.updatedAt || "";
    merged[controlId] = incomingTime >= existingTime ? entry : existing;
  }
  return merged;
}
