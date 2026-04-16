import { palette } from "../theme.js";
import { Badge } from "./Badge.jsx";
import { getCatalogVersion, getCatalogPublished } from "../lib/oscal.js";

function formatDate(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

export function VersionBanner({ currentData, previousData, cacheStatus }) {
  const currentVersion = getCatalogVersion(currentData);
  const currentPublished = formatDate(getCatalogPublished(currentData));
  const previousVersion = getCatalogVersion(previousData);
  const previousPublished = formatDate(getCatalogPublished(previousData));
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
      <VersionBlock label="Previous" color={palette.purple} version={previousVersion} published={previousPublished} />
      <span style={{ color: palette.textDim, fontSize: 14 }} aria-hidden="true">
        →
      </span>
      <VersionBlock label="Current" color={palette.blue} version={currentVersion} published={currentPublished} />
      {cacheStatus === "hit" && (
        <span style={{ marginLeft: "auto" }}>
          <Badge color={palette.cyan} outline>
            Cached
          </Badge>
        </span>
      )}
    </div>
  );
}

function VersionBlock({ label, color, version, published }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Badge color={color}>{label}</Badge>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={versionStyle}>{version || "—"}</span>
        {published && (
          <span style={{ fontSize: 11, color: palette.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
            {published}
          </span>
        )}
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
