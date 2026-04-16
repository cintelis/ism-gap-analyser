import { useRef } from "react";
import { palette } from "../theme.js";
import { Badge } from "./Badge.jsx";

export function UploadPanel({ previousJson, onUpload, onSample, onClear, sampleEnabled }) {
  const fileInputRef = useRef(null);

  return (
    <div
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
          style={{
            background: palette.accent + "18",
            border: `1px solid ${palette.accent}44`,
            color: palette.accent,
            padding: "8px 18px",
            borderRadius: 5,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Upload Previous ISM JSON
        </button>
        <button
          onClick={onSample}
          disabled={!sampleEnabled}
          style={{
            background: "transparent",
            border: `1px solid ${palette.border}`,
            color: palette.textMuted,
            padding: "8px 18px",
            borderRadius: 5,
            fontSize: 13,
            fontWeight: 500,
            cursor: sampleEnabled ? "pointer" : "not-allowed",
            opacity: sampleEnabled ? 1 : 0.5,
          }}
        >
          Use Sample (Demo)
        </button>
        {previousJson && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge color={palette.green}>Loaded</Badge>
            <span
              style={{
                fontSize: 12,
                color: palette.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {previousJson}
            </span>
            <button
              onClick={onClear}
              aria-label="Clear previous ISM"
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
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12, color: palette.textDim, lineHeight: 1.6 }}>
        Upload a previously completed ISM OSCAL resolved profile catalog JSON (e.g. from a prior ISM
        release at{" "}
        <a
          href="https://github.com/AustralianCyberSecurityCentre/ism-oscal/releases"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: palette.accent }}
        >
          github.com/AustralianCyberSecurityCentre/ism-oscal/releases
        </a>
        ). The gap analysis compares your previous set against the latest current baseline to
        identify new and removed controls.
      </p>
    </div>
  );
}
