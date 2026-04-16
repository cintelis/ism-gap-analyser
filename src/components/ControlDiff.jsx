import { diffWordsWithSpace } from "diff";
import { palette } from "../theme.js";
import { getControlDescription, getControlGuideline } from "../lib/oscal.js";

function DiffBlock({ label, prev, curr }) {
  if (prev === curr && !prev && !curr) return null;
  const parts = diffWordsWithSpace(prev || "", curr || "");
  if (parts.every((p) => !p.added && !p.removed)) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <span
        style={{
          fontWeight: 600,
          color: palette.textDim,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
        {parts.map((part, i) => {
          if (part.added)
            return (
              <span
                key={i}
                style={{
                  background: palette.green + "22",
                  color: palette.green,
                  padding: "0 2px",
                  borderRadius: 2,
                }}
              >
                {part.value}
              </span>
            );
          if (part.removed)
            return (
              <span
                key={i}
                style={{
                  background: palette.red + "22",
                  color: palette.red,
                  textDecoration: "line-through",
                  padding: "0 2px",
                  borderRadius: 2,
                }}
              >
                {part.value}
              </span>
            );
          return <span key={i}>{part.value}</span>;
        })}
      </div>
    </div>
  );
}

export function ControlDiff({ previous, current }) {
  return (
    <div>
      <DiffBlock label="Title" prev={previous.title} curr={current.title} />
      <DiffBlock
        label="Statement"
        prev={getControlDescription(previous)}
        curr={getControlDescription(current)}
      />
      <DiffBlock
        label="Guideline"
        prev={getControlGuideline(previous)}
        curr={getControlGuideline(current)}
      />
    </div>
  );
}
