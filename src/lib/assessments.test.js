import { describe, it, expect, beforeEach } from "vitest";
import {
  ASSESSMENT_STATUSES,
  getStatusMeta,
  updateAssessment,
  countByStatus,
} from "./assessments.js";
import { buildExport, parseAssessmentFile, mergeAssessments } from "./assessmentsIO.js";

beforeEach(() => localStorage.clear());

describe("assessments lib", () => {
  it("has all four status values with the expected shape", () => {
    expect(ASSESSMENT_STATUSES).toHaveLength(4);
    for (const s of ASSESSMENT_STATUSES) {
      expect(s.id).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(s.color).toBeTruthy();
    }
  });

  it("getStatusMeta resolves known statuses and returns null for unknown", () => {
    expect(getStatusMeta("implemented")?.label).toBe("Implemented");
    expect(getStatusMeta("nope")).toBeNull();
  });

  it("updateAssessment adds, patches, and stamps updatedAt", () => {
    const a = updateAssessment({}, "c1", { status: "implemented" });
    expect(a.c1.status).toBe("implemented");
    expect(a.c1.updatedAt).toBeTruthy();
    const b = updateAssessment(a, "c1", { notes: "evidence here" });
    expect(b.c1.status).toBe("implemented");
    expect(b.c1.notes).toBe("evidence here");
  });

  it("updateAssessment drops entry when both status and notes are cleared", () => {
    const a = updateAssessment({}, "c1", { status: "implemented", notes: "x" });
    const b = updateAssessment(a, "c1", { status: null, notes: "" });
    expect(b.c1).toBeUndefined();
  });

  it("countByStatus tallies correctly", () => {
    const a = {
      c1: { status: "implemented" },
      c2: { status: "implemented" },
      c3: { status: "alternate" },
      c4: { status: null, notes: "pending" },
    };
    const counts = countByStatus(a);
    expect(counts.implemented).toBe(2);
    expect(counts.alternate).toBe(1);
    expect(counts.unset).toBe(1);
  });
});

describe("assessmentsIO", () => {
  it("buildExport produces the expected envelope", () => {
    const payload = buildExport({ c1: { status: "implemented" } });
    expect(payload.tool).toBe("ism-gap-analyser-assessment");
    expect(payload.exportVersion).toBe(1);
    expect(payload.assessments.c1.status).toBe("implemented");
  });

  it("parseAssessmentFile rejects non-JSON / wrong tool / missing assessments", () => {
    expect(() => parseAssessmentFile("not json")).toThrow();
    expect(() => parseAssessmentFile('{"tool":"other","exportVersion":1,"assessments":{}}')).toThrow();
    expect(() => parseAssessmentFile('{"tool":"ism-gap-analyser-assessment","exportVersion":99,"assessments":{}}')).toThrow();
  });

  it("parseAssessmentFile accepts a valid export", () => {
    const out = buildExport({ c1: { status: "implemented", updatedAt: "2026-04-16T00:00:00Z" } });
    const roundtripped = parseAssessmentFile(JSON.stringify(out));
    expect(roundtripped.c1.status).toBe("implemented");
  });

  it("mergeAssessments keeps the newer updatedAt on conflict", () => {
    const a = { c1: { status: "implemented", updatedAt: "2026-04-01T00:00:00Z" } };
    const b = { c1: { status: "not_implemented", updatedAt: "2026-04-16T00:00:00Z" } };
    const merged = mergeAssessments(a, b);
    expect(merged.c1.status).toBe("not_implemented");

    const reverse = mergeAssessments(b, a);
    expect(reverse.c1.status).toBe("not_implemented");
  });

  it("mergeAssessments adds non-conflicting entries", () => {
    const a = { c1: { status: "implemented" } };
    const b = { c2: { status: "alternate" } };
    expect(Object.keys(mergeAssessments(a, b))).toHaveLength(2);
  });
});
