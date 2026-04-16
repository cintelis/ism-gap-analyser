import { palette } from "../theme.js";

export function StatsGrid({ analysis }) {
  const stats = [
    { label: "Current Controls", value: analysis.currentCount, color: palette.blue },
    { label: "Previous Controls", value: analysis.previousCount, color: palette.purple },
    { label: "New (Gap)", value: analysis.newCount, color: palette.green },
    { label: "Removed", value: analysis.removedCount, color: palette.red },
    { label: "Unchanged", value: analysis.unchangedCount, color: palette.textDim },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        marginBottom: 20,
      }}
      role="region"
      aria-label="Gap analysis statistics"
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: 8,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: s.color,
              letterSpacing: "-0.02em",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: palette.textDim,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
