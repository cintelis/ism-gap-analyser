import { palette } from "../theme.js";

export function CoverageChart({ analysis }) {
  if (analysis.currentCount === 0) return null;
  const unchangedPct = (analysis.unchangedCount / analysis.currentCount) * 100;
  const newPct = (analysis.newCount / analysis.currentCount) * 100;

  return (
    <div
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
          marginBottom: 14,
        }}
      >
        Coverage Overview
      </div>
      <div
        style={{
          display: "flex",
          height: 28,
          borderRadius: 6,
          overflow: "hidden",
          background: palette.bg,
        }}
      >
        {analysis.unchangedCount > 0 && (
          <Segment width={unchangedPct} color={palette.blue} bg={palette.blue + "55"} label="COVERED" />
        )}
        {analysis.newCount > 0 && (
          <Segment width={newPct} color={palette.green} bg={palette.green + "33"} label="GAP" />
        )}
      </div>
    </div>
  );
}

function Segment({ width, color, bg, label }) {
  return (
    <div
      style={{
        width: `${width}%`,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 700,
        color,
        letterSpacing: "0.04em",
      }}
    >
      {Math.round(width)}% {label}
    </div>
  );
}
