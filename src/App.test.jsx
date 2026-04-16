import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ISMGapAnalyser from "./App.jsx";

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: () =>
        Promise.resolve({
          catalog: { metadata: { version: "test" }, groups: [], controls: [] },
        }),
    })
  );
});

describe("<ISMGapAnalyser />", () => {
  it("renders the header and fixed PROTECTED classification banner", async () => {
    render(<ISMGapAnalyser />);
    expect(screen.getByRole("heading", { name: /ISM Gap Analyser/i })).toBeInTheDocument();
    expect(screen.getByText(/IRAP baseline/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PROTECTED/).length).toBeGreaterThan(0);
  });
});
