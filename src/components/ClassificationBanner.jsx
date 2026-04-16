import { palette, PROTECTED_PROFILE } from "../theme.js";

export function ClassificationBanner() {
  return (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `3px solid ${PROTECTED_PROFILE.color}`,
        borderRadius: 8,
        padding: "14px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
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
        Classification
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: PROTECTED_PROFILE.color,
          letterSpacing: "0.04em",
        }}
      >
        {PROTECTED_PROFILE.label}
      </span>
      <span style={{ fontSize: 11, color: palette.textDim, marginLeft: "auto" }}>
        IRAP baseline
      </span>
    </div>
  );
}
