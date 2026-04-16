import { palette } from "../theme.js";

export function Header({ navigate, currentPath = "/" }) {
  const linkTarget = currentPath.startsWith("/irap-guide") ? "/" : "/irap-guide";
  const linkLabel = currentPath.startsWith("/irap-guide") ? "← Back to Dashboard" : "IRAP Process Guide →";

  return (
    <div
      className="app-header"
      data-print-hide
      style={{
        background: `linear-gradient(135deg, ${palette.surface} 0%, ${palette.bg} 100%)`,
        borderBottom: `1px solid ${palette.border}`,
        padding: "24px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          onClick={(e) => {
            if (navigate) {
              e.preventDefault();
              navigate("/");
            }
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
        >
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
        </a>
        {navigate && (
          <a
            href={linkTarget}
            onClick={(e) => {
              e.preventDefault();
              navigate(linkTarget);
            }}
            style={{
              color: palette.accent,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 5,
              border: `1px solid ${palette.accent}44`,
              background: palette.accent + "14",
              letterSpacing: "0.02em",
            }}
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}
