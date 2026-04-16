import { palette } from "../theme.js";
import { ASSESSMENT_STATUSES, getStatusMeta } from "../lib/assessments.js";

export function ProgressDashboard({ counts, total, onFilterUnassessed, onFilterStatus, activeStatusFilter }) {
  const assessed = counts.implemented + counts.alternate + counts.not_implemented + counts.not_applicable;
  const percent = total > 0 ? (assessed / total) * 100 : 0;
  const unassessed = Math.max(0, total - assessed);

  return (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
          flexWrap: "wrap",
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
          Assessment Progress
        </div>
        <div style={{ fontSize: 13, color: palette.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          <span style={{ color: palette.text, fontWeight: 700 }}>{assessed}</span>
          <span style={{ color: palette.textDim }}> / {total} controls</span>
          <span style={{ color: palette.accent, marginLeft: 8, fontWeight: 600 }}>
            {percent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 5,
          overflow: "hidden",
          background: palette.bg,
          marginBottom: 12,
        }}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Assessment completion"
      >
        {ASSESSMENT_STATUSES.map((s) => {
          const n = counts[s.id] || 0;
          if (!n) return null;
          return (
            <div
              key={s.id}
              style={{ width: `${(n / total) * 100}%`, background: s.color }}
              title={`${n} ${s.label}`}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        {ASSESSMENT_STATUSES.map((s) => {
          const n = counts[s.id] || 0;
          const clickable = n > 0 && !!onFilterStatus;
          const active = activeStatusFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={clickable ? () => onFilterStatus(s.id) : undefined}
              disabled={!clickable}
              aria-pressed={active}
              title={clickable ? `Show only ${s.label}` : `${n} ${s.label}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 4,
                background: active ? s.color + "22" : "transparent",
                border: `1px solid ${active ? s.color : "transparent"}`,
                color: n > 0 ? palette.text : palette.textDim,
                cursor: clickable ? "pointer" : "default",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: s.color,
                  opacity: n > 0 ? 1 : 0.35,
                }}
              />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{n}</span>
              <span style={{ color: palette.textMuted }}>{s.label}</span>
            </button>
          );
        })}
        {unassessed > 0 && (
          <button
            onClick={onFilterUnassessed}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: `1px solid ${palette.border}`,
              color: palette.textMuted,
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            {unassessed} unassessed →
          </button>
        )}
      </div>
    </div>
  );
}

export { getStatusMeta };
