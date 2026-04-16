import { palette } from "../theme.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New (Gap)" },
  { id: "modified", label: "Modified" },
  { id: "removed", label: "Removed" },
  { id: "unassessed", label: "Unassessed" },
  { id: "review-needed", label: "Re-review", conditional: true },
];

export function Toolbar({
  searchTerm,
  onSearchChange,
  filterMode,
  onFilterChange,
  onExpandAll,
  onCollapseAll,
  onExportTxt,
  onExportCsv,
  onExportJson,
  onPrint,
  onExportAssessment,
  onImportAssessment,
  assessmentCount = 0,
  reviewNeededCount = 0,
}) {
  return (
    <div
      data-print-hide
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        marginBottom: 16,
        padding: "12px 0",
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <input
        type="text"
        placeholder="Search controls by ID, title, or description..."
        aria-label="Search controls"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: "1 1 260px",
          minWidth: 200,
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 5,
          padding: "8px 14px",
          color: palette.text,
          fontSize: 13,
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }} role="group" aria-label="Filter controls">
        {FILTERS.filter((f) => !f.conditional || reviewNeededCount > 0).map((f) => {
          const isActive = filterMode === f.id;
          const countSuffix = f.id === "review-needed" && reviewNeededCount > 0 ? ` (${reviewNeededCount})` : "";
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              aria-pressed={isActive}
              style={{
                background: isActive ? palette.accent + "18" : "transparent",
                border: `1px solid ${isActive ? palette.accent : palette.border}`,
                color: isActive ? palette.accent : palette.textMuted,
                padding: "6px 12px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {f.label}
              {countSuffix}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <GhostButton onClick={onExpandAll}>Expand All</GhostButton>
        <GhostButton onClick={onCollapseAll}>Collapse</GhostButton>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <GhostButton onClick={onExportTxt}>Export TXT</GhostButton>
        <GhostButton onClick={onExportCsv}>Export CSV</GhostButton>
        <GhostButton onClick={onExportJson}>Export JSON</GhostButton>
        <GhostButton onClick={onPrint}>Print / PDF</GhostButton>
      </div>
      {(onExportAssessment || onImportAssessment) && (
        <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {onImportAssessment && <GhostButton onClick={onImportAssessment}>Import Assessment</GhostButton>}
          {onExportAssessment && (
            <GhostButton onClick={onExportAssessment}>
              Export Assessment{assessmentCount ? ` (${assessmentCount})` : ""}
            </GhostButton>
          )}
        </div>
      )}
    </div>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: `1px solid ${palette.border}`,
        color: palette.textMuted,
        padding: "6px 10px",
        borderRadius: 4,
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
