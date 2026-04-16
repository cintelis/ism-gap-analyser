import { palette } from "../theme.js";

export function Header() {
  return (
    <div
      className="app-header"
      style={{
        background: `linear-gradient(135deg, ${palette.surface} 0%, ${palette.bg} 100%)`,
        borderBottom: `1px solid ${palette.border}`,
        padding: "24px 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDim})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: palette.bg,
            }}
            aria-hidden="true"
          >
            △
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: palette.text,
              }}
            >
              ISM Gap Analyser
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: palette.textDim,
                letterSpacing: "0.04em",
              }}
            >
              Australian Information Security Manual · OSCAL Control Gap Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
