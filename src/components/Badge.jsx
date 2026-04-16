import { palette } from "../theme.js";

export function Badge({ children, color = palette.accent, outline = false }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: outline ? "transparent" : color + "18",
        color: color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  );
}
