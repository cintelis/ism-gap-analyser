import { palette, ALL_PROFILES } from "../theme.js";

export function ClassificationPicker({ classification, onChange }) {
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
        Classification Level
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} role="radiogroup" aria-label="Classification level">
        {ALL_PROFILES.map((c) => {
          const active = classification === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              role="radio"
              aria-checked={active}
              style={{
                background: active ? c.color + "22" : "transparent",
                border: `1px solid ${active ? c.color : palette.border}`,
                color: active ? c.color : palette.textMuted,
                padding: "6px 14px",
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                letterSpacing: "0.02em",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
