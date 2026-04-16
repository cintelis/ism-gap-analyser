import { palette } from "../theme.js";
import { Badge } from "./Badge.jsx";
import { ControlDiff } from "./ControlDiff.jsx";
import { getControlDescription, getControlGuideline, getControlRevision } from "../lib/oscal.js";

export function ControlCard({ control, isNew, isRemoved, isModified, previousControl, expanded, onToggle }) {
  const desc = getControlDescription(control);
  const revision = getControlRevision(control);
  const guideline = getControlGuideline(control);
  const accentBorder = isNew
    ? palette.green
    : isRemoved
      ? palette.red
      : isModified
        ? palette.yellow
        : palette.border;

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        background: palette.surface,
        border: `1px solid ${accentBorder + (isNew || isRemoved || isModified ? "44" : "")}`,
        borderLeft: `3px solid ${accentBorder}`,
        borderRadius: 6,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: palette.accent,
              letterSpacing: "0.02em",
            }}
          >
            {control.id}
          </span>
          {isNew && <Badge color={palette.green}>NEW</Badge>}
          {isRemoved && <Badge color={palette.red}>REMOVED</Badge>}
          {isModified && <Badge color={palette.yellow}>MODIFIED</Badge>}
          {revision && (
            <Badge color={palette.textDim} outline>
              {revision}
            </Badge>
          )}
        </div>
        <span
          style={{
            color: palette.textDim,
            fontSize: 14,
            flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
          aria-hidden="true"
        >
          ▾
        </span>
      </div>

      {control.title && (
        <div style={{ marginTop: 6, fontSize: 13, color: palette.text, lineHeight: 1.5, fontWeight: 500 }}>
          {control.title}
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${palette.border}` }}>
          {isModified && previousControl ? (
            <ControlDiff previous={previousControl} current={control} />
          ) : (
            <>
              {desc && (
                <Section label="Statement" marginBottom={guideline ? 12 : 0}>
                  {desc}
                </Section>
              )}
              {guideline && <Section label="Guideline">{guideline}</Section>}
            </>
          )}
          {control.props && control.props.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <SectionLabel>Properties</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {control.props.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: palette.bg,
                      color: palette.textMuted,
                      border: `1px solid ${palette.border}`,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {p.name}={p.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
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
      {children}
    </span>
  );
}

function Section({ label, marginBottom = 0, children }) {
  return (
    <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.65, marginBottom }}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}
