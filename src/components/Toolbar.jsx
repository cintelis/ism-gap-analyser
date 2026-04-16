import { palette } from "../theme.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New (Gap)" },
  { id: "modified", label: "Modified" },
  { id: "removed", label: "Removed" },
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
      <div style={{ display: "flex", gap: 4 }} role="group" aria-label="Filter controls">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            aria-pressed={filterMode === f.id}
            style={{
              background: filterMode === f.id ? palette.accent + "18" : "transparent",
              border: `1px solid ${filterMode === f.id ? palette.accent : palette.border}`,
              color: filterMode === f.id ? palette.accent : palette.textMuted,
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
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
