import { palette } from "../theme.js";
import { Badge } from "./Badge.jsx";
import { getCatalogVersion } from "../lib/oscal.js";

export function VersionBanner({ currentData, previousData }) {
  const currentVersion = getCatalogVersion(currentData);
  const previousVersion = getCatalogVersion(previousData);
  if (!currentVersion && !previousVersion) return null;

  return (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        padding: "14px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: palette.textDim,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Comparing
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge color={palette.purple}>Previous</Badge>
        <span style={versionStyle}>{previousVersion || "—"}</span>
      </div>
      <span style={{ color: palette.textDim, fontSize: 14 }} aria-hidden="true">
        →
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge color={palette.blue}>Current</Badge>
        <span style={versionStyle}>{currentVersion || "—"}</span>
      </div>
    </div>
  );
}

const versionStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
  fontWeight: 600,
  color: palette.text,
};
