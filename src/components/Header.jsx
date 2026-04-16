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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <a
            href="https://github.com/cintelis/ism-gap-analyser"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            title="View source on GitHub"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 5,
              border: `1px solid ${palette.border}`,
              color: palette.textMuted,
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
