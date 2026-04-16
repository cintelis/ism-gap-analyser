import { palette } from "../theme.js";

export function ReviewAlert({ count, onFilter }) {
  if (!count) return null;
  return (
    <div
      role="alert"
      style={{
        background: palette.yellow + "14",
        border: `1px solid ${palette.yellow}55`,
        borderLeft: `3px solid ${palette.yellow}`,
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 260 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: palette.yellow,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          ± Re-review needed
        </div>
        <div style={{ fontSize: 13, color: palette.text, lineHeight: 1.5 }}>
          <strong>{count}</strong> of your assessed control{count === 1 ? " was" : "s were"} modified
          in this release. Re-check{count === 1 ? " it" : " them"} first so your existing evidence
          still applies.
        </div>
      </div>
      <button
        onClick={onFilter}
        style={{
          background: palette.yellow + "22",
          border: `1px solid ${palette.yellow}66`,
          color: palette.yellow,
          padding: "8px 16px",
          borderRadius: 5,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
      >
        Show these controls →
      </button>
    </div>
  );
}
