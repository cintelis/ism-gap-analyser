import { palette } from "../theme.js";
import { ASSESSMENT_STATUSES } from "../lib/assessments.js";

export function AssessmentPanel({ controlId, assessment, onUpdate }) {
  const status = assessment?.status || null;
  const notes = assessment?.notes || "";

  return (
    <div
      data-print-expand
      style={{
        marginTop: 16,
        paddingTop: 12,
        borderTop: `1px dashed ${palette.border}`,
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          fontWeight: 600,
          color: palette.textDim,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 8,
        }}
      >
        Implementation Status
      </div>
      <div
        role="radiogroup"
        aria-label="Implementation status"
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}
      >
        {ASSESSMENT_STATUSES.map((s) => {
          const active = status === s.id;
          return (
            <button
              key={s.id}
              role="radio"
              aria-checked={active}
              onClick={() => onUpdate(controlId, { status: active ? null : s.id })}
              style={{
                background: active ? s.color + "22" : "transparent",
                border: `1px solid ${active ? s.color : palette.border}`,
                color: active ? s.color : palette.textMuted,
                padding: "6px 12px",
                borderRadius: 5,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontWeight: 600,
          color: palette.textDim,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        Evidence / Justification
      </div>
      <textarea
        value={notes}
        onChange={(e) => onUpdate(controlId, { notes: e.target.value })}
        placeholder="Record the evidence, compensating controls, or reasoning for the status above…"
        rows={3}
        style={{
          width: "100%",
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 5,
          padding: "8px 10px",
          color: palette.text,
          fontSize: 13,
          fontFamily: "inherit",
          lineHeight: 1.5,
          outline: "none",
          resize: "vertical",
        }}
      />
      {assessment?.updatedAt && (
        <div style={{ marginTop: 6, fontSize: 10, color: palette.textDim }}>
          Last updated: {new Date(assessment.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
