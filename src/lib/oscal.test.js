import { describe, it, expect } from "vitest";
import {
  extractControls,
  getControlProp,
  getControlDescription,
  getControlGuideline,
  getCatalogVersion,
  getCatalogPublished,
  groupControlsBySection,
} from "./oscal.js";

const sampleCatalog = {
  catalog: {
    metadata: { version: "2024.12", published: "2024-12-01T00:00:00Z" },
    groups: [
      {
        id: "gov",
        title: "Governance",
        controls: [
          {
            id: "gov-1",
            title: "Policy",
            props: [{ name: "revision", value: "A" }],
            parts: [{ name: "statement", prose: "Have a policy." }],
          },
        ],
        groups: [
          {
            id: "gov-sub",
            title: "Sub-Governance",
            controls: [
              {
                id: "gov-1.1",
                title: "Nested",
                parts: [
                  { name: "statement", parts: [{ prose: "One." }, { prose: "Two." }] },
                  { name: "guideline", prose: "Do the thing." },
                ],
              },
            ],
          },
        ],
      },
    ],
    controls: [{ id: "top-1", title: "Top-level", parts: [{ name: "overview", prose: "Overview." }] }],
  },
};

describe("extractControls", () => {
  it("flattens nested groups and top-level controls", () => {
    const out = extractControls(sampleCatalog);
    expect(out.map((c) => c.id)).toEqual(["gov-1", "gov-1.1", "top-1"]);
    expect(out[0].groupTitle).toBe("Governance");
    expect(out[1].groupTitle).toBe("Sub-Governance");
    expect(out[2].groupTitle).toBe("Ungrouped");
  });

  it("returns empty array for null/missing catalog", () => {
    expect(extractControls(null)).toEqual([]);
    expect(extractControls({})).toEqual([]);
  });
});

describe("getControlProp", () => {
  it("finds prop by name", () => {
    const ctrl = { props: [{ name: "revision", value: "A" }] };
    expect(getControlProp(ctrl, "revision")).toBe("A");
  });

  it("returns null when missing or no props array", () => {
    expect(getControlProp({}, "revision")).toBeNull();
    expect(getControlProp({ props: [] }, "revision")).toBeNull();
  });
});

describe("getControlDescription", () => {
  it("returns statement prose when present", () => {
    const ctrl = { parts: [{ name: "statement", prose: "hello" }] };
    expect(getControlDescription(ctrl)).toBe("hello");
  });

  it("joins nested statement parts", () => {
    const ctrl = {
      parts: [{ name: "statement", parts: [{ prose: "A" }, { prose: "B" }] }],
    };
    expect(getControlDescription(ctrl)).toBe("A\nB");
  });

  it("falls back to overview", () => {
    const ctrl = { parts: [{ name: "overview", prose: "ov" }] };
    expect(getControlDescription(ctrl)).toBe("ov");
  });

  it("returns empty string when no parts", () => {
    expect(getControlDescription({})).toBe("");
  });
});

describe("getControlGuideline", () => {
  it("returns guideline prose", () => {
    const ctrl = { parts: [{ name: "guideline", prose: "g" }] };
    expect(getControlGuideline(ctrl)).toBe("g");
  });

  it("accepts 'guidance' alias", () => {
    const ctrl = { parts: [{ name: "guidance", prose: "g" }] };
    expect(getControlGuideline(ctrl)).toBe("g");
  });
});

describe("getCatalogVersion / getCatalogPublished", () => {
  it("reads metadata", () => {
    expect(getCatalogVersion(sampleCatalog)).toBe("2024.12");
    expect(getCatalogPublished(sampleCatalog)).toBe("2024-12-01T00:00:00Z");
  });

  it("returns null when metadata missing", () => {
    expect(getCatalogVersion(null)).toBeNull();
    expect(getCatalogPublished({ catalog: {} })).toBeNull();
  });
});

describe("groupControlsBySection", () => {
  it("groups controls by groupTitle with new/removed/unchanged buckets", () => {
    const ctrl = (id, groupTitle) => ({ id, groupTitle });
    const groups = groupControlsBySection(
      [ctrl("a", "G1")],
      [ctrl("b", "G2")],
      [ctrl("c", "G1")]
    );
    expect(groups).toHaveLength(2);
    const g1 = groups.find((g) => g.title === "G1");
    const g2 = groups.find((g) => g.title === "G2");
    expect(g1.new).toHaveLength(1);
    expect(g1.unchanged).toHaveLength(1);
    expect(g2.removed).toHaveLength(1);
  });
});
