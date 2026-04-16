import { palette } from "../theme.js";
import { Badge } from "./Badge.jsx";
import { ControlCard } from "./ControlCard.jsx";

export function ControlsList({ groups, expandedIds, onToggleExpand, modifiedByCurrentId, onShowGuideline, guidelineSections }) {
  if (groups.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: palette.textDim }}>
        <div style={{ fontSize: 32, marginBottom: 12 }} aria-hidden="true">
          ∅
        </div>
        <div style={{ fontSize: 14 }}>No controls match your current filters.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {groups.map((group) => (
        <div key={group.title}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
              paddingBottom: 6,
              borderBottom: `1px solid ${palette.border}`,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: palette.text,
                letterSpacing: "-0.01em",
              }}
            >
              {group.title}
            </h3>
            <span style={{ fontSize: 11, color: palette.textDim }}>
              {group.new.length + group.removed.length + (group.modified?.length ?? 0) + group.unchanged.length} controls
            </span>
            {group.new.length > 0 && <Badge color={palette.green}>{group.new.length} new</Badge>}
            {group.removed.length > 0 && (
              <Badge color={palette.red}>{group.removed.length} removed</Badge>
            )}
            {group.modified?.length > 0 && (
              <Badge color={palette.yellow}>{group.modified.length} modified</Badge>
            )}
            {onShowGuideline && guidelineSections?.[group.title] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowGuideline(group.title);
                }}
                aria-label={`Show guideline for ${group.title}`}
                title="Show ASD guideline"
                style={{
                  background: "transparent",
                  border: `1px solid ${palette.border}`,
                  color: palette.cyan,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  marginLeft: "auto",
                }}
              >
                ⓘ
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {group.new.map((c) => (
              <ControlCard
                key={c.id}
                control={c}
                isNew
                expanded={expandedIds.has(c.id)}
                onToggle={() => onToggleExpand(c.id)}
              />
            ))}
            {group.removed.map((c) => (
              <ControlCard
                key={c.id}
                control={c}
                isRemoved
                expanded={expandedIds.has(c.id)}
                onToggle={() => onToggleExpand(c.id)}
              />
            ))}
            {(group.modified ?? []).map((c) => (
              <ControlCard
                key={c.id}
                control={c}
                isModified
                previousControl={modifiedByCurrentId?.get(c.id)}
                expanded={expandedIds.has(c.id)}
                onToggle={() => onToggleExpand(c.id)}
              />
            ))}
            {group.unchanged.map((c) => (
              <ControlCard
                key={c.id}
                control={c}
                expanded={expandedIds.has(c.id)}
                onToggle={() => onToggleExpand(c.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
