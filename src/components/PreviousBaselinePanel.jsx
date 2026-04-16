import { useRef, useState } from "react";
import { palette } from "../theme.js";
import { Badge } from "./Badge.jsx";
import { Spinner } from "./Spinner.jsx";
import { useReleases } from "../hooks/useReleases.js";

export function PreviousBaselinePanel({
  previousLabel,
  onSelectRelease,
  onUpload,
  onSample,
  onClear,
  sampleEnabled,
  selectLoading,
  selectError,
}) {
  const fileInputRef = useRef(null);
  const { releases, loading: releasesLoading, error: releasesError } = useReleases();
  const [selectedTag, setSelectedTag] = useState("");

  const hasPrevious = !!previousLabel;

  return (
    <div
      data-print-hide
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: palette.textDim,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        Previous ISM Baseline (for comparison)
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <label
          style={{ fontSize: 12, color: palette.textMuted, fontWeight: 500 }}
          htmlFor="ism-release-select"
        >
          Release:
        </label>
        <select
          id="ism-release-select"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          disabled={releasesLoading || !!releasesError || !releases}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            color: palette.text,
            padding: "7px 12px",
            borderRadius: 5,
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minWidth: 180,
            cursor: releasesLoading ? "wait" : "pointer",
          }}
        >
          <option value="">
            {releasesLoading
              ? "Loading releases..."
              : releasesError
                ? "Failed to load releases"
                : "Select a release…"}
          </option>
          {releases?.map((r) => (
            <option key={r.tag} value={r.tag}>
              {r.tag}
              {r.published ? ` · ${r.published.slice(0, 10)}` : ""}
              {r.prerelease ? " (pre)" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={() => selectedTag && onSelectRelease(selectedTag)}
          disabled={!selectedTag || selectLoading}
          style={{
            background: palette.accent + "18",
            border: `1px solid ${palette.accent}44`,
            color: palette.accent,
            padding: "8px 18px",
            borderRadius: 5,
            fontSize: 13,
            fontWeight: 600,
            cursor: selectedTag && !selectLoading ? "pointer" : "not-allowed",
            opacity: selectedTag && !selectLoading ? 1 : 0.5,
          }}
        >
          {selectLoading ? "Loading…" : "Load Release"}
        </button>

        <span style={{ color: palette.textDim, fontSize: 12 }}>or</span>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onUpload}
          style={{ display: "none" }}
          aria-label="Upload previous ISM OSCAL JSON"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={ghostBtn}
        >
          Upload JSON
        </button>
        <button onClick={onSample} disabled={!sampleEnabled} style={ghostBtn}>
          Use Sample (Demo)
        </button>
      </div>

      {selectLoading && (
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, color: palette.textMuted, fontSize: 12 }}
          role="status"
        >
          <Spinner size={14} /> Fetching release…
        </div>
      )}

      {selectError && (
        <div
          role="alert"
          style={{
            marginTop: 10,
            fontSize: 12,
            color: palette.red,
            background: palette.red + "12",
            border: `1px solid ${palette.red}33`,
            borderRadius: 4,
            padding: "6px 10px",
          }}
        >
          {selectError}
        </div>
      )}

      {hasPrevious && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <Badge color={palette.green}>Loaded</Badge>
          <span
            style={{
              fontSize: 12,
              color: palette.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {previousLabel}
          </span>
          <button
            onClick={onClear}
            aria-label="Clear previous baseline"
            style={{
              background: "transparent",
              border: "none",
              color: palette.red,
              cursor: "pointer",
              fontSize: 14,
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <p style={{ margin: "10px 0 0", fontSize: 12, color: palette.textDim, lineHeight: 1.6 }}>
        The gap compares the latest PROTECTED ISM against the selected previous release. Pick a
        tagged release from the dropdown (fetched from the ASD ism-oscal GitHub repository), or
        upload a custom OSCAL resolved-profile catalog JSON.
      </p>
    </div>
  );
}

const ghostBtn = {
  background: "transparent",
  border: `1px solid ${palette.border}`,
  color: palette.textMuted,
  padding: "8px 14px",
  borderRadius: 5,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};
