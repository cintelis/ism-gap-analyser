import { useEffect, useRef } from "react";
import { palette } from "../theme.js";

export function GuidelineDrawer({ guideline, onClose }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!guideline) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    drawerRef.current?.focus();
    return () => window.removeEventListener("keydown", handler);
  }, [guideline, onClose]);

  if (!guideline) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }}
      />
      <aside
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-label={`Guideline: ${guideline.heading}`}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(560px, 90vw)",
          height: "100vh",
          background: palette.surface,
          borderLeft: `1px solid ${palette.border}`,
          zIndex: 1000,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "20px 24px 12px",
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: palette.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              {guideline.topicTitle || "ISM Guideline"}
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: palette.text }}>
              {guideline.heading}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guideline"
            style={{
              background: "transparent",
              border: "none",
              color: palette.textMuted,
              cursor: "pointer",
              fontSize: 20,
              padding: "4px 8px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div
          className="guideline-body"
          style={{
            padding: "20px 24px",
            flex: 1,
            fontSize: 14,
            color: palette.textMuted,
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: guideline.html }}
        />

        <div
          style={{
            padding: "12px 24px",
            borderTop: `1px solid ${palette.border}`,
            fontSize: 11,
            color: palette.textDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Source: ASD ISM (CC BY 4.0)</span>
          <a
            href={guideline.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: palette.accent, textDecoration: "none" }}
          >
            View on cyber.gov.au ↗
          </a>
        </div>
      </aside>
    </>
  );
}
