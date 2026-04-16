import { describe, it, expect, beforeEach } from "vitest";
import { loadJSON, saveJSON, removeKey } from "./storage.js";

beforeEach(() => localStorage.clear());

describe("storage", () => {
  it("roundtrips values", () => {
    saveJSON("k", { a: 1, b: [2, 3] });
    expect(loadJSON("k", null)).toEqual({ a: 1, b: [2, 3] });
  });

  it("returns fallback for missing key", () => {
    expect(loadJSON("missing", "fallback")).toBe("fallback");
  });

  it("returns fallback for corrupt JSON", () => {
    localStorage.setItem("ism-gap-analyser:corrupt", "{not json");
    expect(loadJSON("corrupt", "fb")).toBe("fb");
  });

  it("removes keys", () => {
    saveJSON("k", 1);
    removeKey("k");
    expect(loadJSON("k", null)).toBeNull();
  });
});
