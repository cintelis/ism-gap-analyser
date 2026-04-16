import { getStatusMeta } from "../lib/assessments.js";

export function AssessmentBadge({ statusId }) {
  const meta = getStatusMeta(statusId);
  if (!meta) return null;
  return (
    <span
      title={`Assessment: ${meta.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
        background: meta.color + "22",
        color: meta.color,
        border: `1px solid ${meta.color}44`,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {meta.short}
    </span>
  );
}
