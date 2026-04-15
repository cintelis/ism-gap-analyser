import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const GITHUB_BASE = "https://raw.githubusercontent.com/AustralianCyberSecurityCentre/ism-oscal/main";

const CLASSIFICATIONS = [
  { id: "NON_CLASSIFIED", label: "Non-Classified", color: "#3B82F6" },
  { id: "OFFICIAL_SENSITIVE", label: "OFFICIAL: Sensitive", color: "#8B5CF6" },
  { id: "PROTECTED", label: "PROTECTED", color: "#F59E0B" },
  { id: "SECRET", label: "SECRET", color: "#EF4444" },
  { id: "TOP_SECRET", label: "TOP SECRET", color: "#DC2626" },
];

const E8_LEVELS = [
  { id: "E8_ML1", label: "Essential Eight ML1", color: "#10B981" },
  { id: "E8_ML2", label: "Essential Eight ML2", color: "#06B6D4" },
  { id: "E8_ML3", label: "Essential Eight ML3", color: "#6366F1" },
];

const ALL_PROFILES = [...CLASSIFICATIONS, ...E8_LEVELS];

function extractControls(catalog) {
  const controls = [];
  
  function walkGroups(groups) {
    if (!groups) return;
    for (const group of groups) {
      if (group.controls) {
        for (const ctrl of group.controls) {
          controls.push({
            ...ctrl,
            groupTitle: group.title || "Ungrouped",
            groupId: group.id || "",
          });
        }
      }
      if (group.groups) walkGroups(group.groups);
    }
  }
  
  if (catalog?.catalog?.groups) walkGroups(catalog.catalog.groups);
  if (catalog?.catalog?.controls) {
    for (const ctrl of catalog.catalog.controls) {
      controls.push({ ...ctrl, groupTitle: "Ungrouped", groupId: "" });
    }
  }
  return controls;
}

function getControlProp(control, propName, ns) {
  if (!control.props) return null;
  const prop = control.props.find(p => {
    const nameMatch = p.name === propName;
    if (ns) return nameMatch && p.ns === ns;
    return nameMatch;
  });
  return prop ? prop.value : null;
}

function getControlProps(control, propName, ns) {
  if (!control.props) return [];
  return control.props
    .filter(p => {
      const nameMatch = p.name === propName;
      if (ns) return nameMatch && p.ns === ns;
      return nameMatch;
    })
    .map(p => ({ value: p.value, class: p.class }));
}

function getControlDescription(control) {
  if (!control.parts) return "";
  const stmt = control.parts.find(p => p.name === "statement");
  if (stmt && stmt.prose) return stmt.prose;
  if (stmt && stmt.parts) {
    return stmt.parts.map(p => p.prose).filter(Boolean).join("\n");
  }
  const overview = control.parts.find(p => p.name === "overview");
  if (overview && overview.prose) return overview.prose;
  return "";
}

function getControlRevision(control) {
  return getControlProp(control, "revision") || 
         getControlProp(control, "label", "https://www.cyber.gov.au/ism/oscal/v1") ||
         "";
}

function getCatalogVersion(catalog) {
  return catalog?.catalog?.metadata?.version || null;
}

function getCatalogPublished(catalog) {
  return catalog?.catalog?.metadata?.published || catalog?.catalog?.metadata?.["last-modified"] || null;
}

function getControlGuideline(control) {
  if (!control.parts) return "";
  const guideline = control.parts.find(p => p.name === "guideline" || p.name === "guidance");
  if (guideline && guideline.prose) return guideline.prose;
  return "";
}

// ─── STYLES ───────────────────────────────────────────────────────────

const palette = {
  bg: "#0C0F1A",
  surface: "#141829",
  surfaceHover: "#1A1F36",
  border: "#252A42",
  borderLight: "#2E3454",
  text: "#E2E8F0",
  textMuted: "#8B93B0",
  textDim: "#5C6484",
  accent: "#F59E0B",
  accentDim: "#B27108",
  green: "#10B981",
  red: "#EF4444",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

// ─── COMPONENTS ───────────────────────────────────────────────────────

function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke={palette.border} strokeWidth="3" fill="none" />
      <path d="M12 2 A10 10 0 0 1 22 12" stroke={palette.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Badge({ children, color = palette.accent, outline = false }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.03em", textTransform: "uppercase", whiteSpace: "nowrap",
      background: outline ? "transparent" : color + "18",
      color: color, border: `1px solid ${color}44`,
    }}>
      {children}
    </span>
  );
}

function ControlCard({ control, isNew, isRemoved, expanded, onToggle }) {
  const desc = getControlDescription(control);
  const revision = getControlRevision(control);
  const guideline = getControlGuideline(control);

  return (
    <div
      onClick={onToggle}
      style={{
        background: palette.surface,
        border: `1px solid ${isNew ? palette.green + "44" : isRemoved ? palette.red + "44" : palette.border}`,
        borderLeft: `3px solid ${isNew ? palette.green : isRemoved ? palette.red : palette.border}`,
        borderRadius: 6, padding: "12px 16px", cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13, fontWeight: 700, color: palette.accent, letterSpacing: "0.02em",
          }}>
            {control.id}
          </span>
          {isNew && <Badge color={palette.green}>NEW</Badge>}
          {isRemoved && <Badge color={palette.red}>REMOVED</Badge>}
          {revision && <Badge color={palette.textDim} outline>{revision}</Badge>}
        </div>
        <span style={{ color: palette.textDim, fontSize: 14, flexShrink: 0, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
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
          {desc && (
            <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.65, marginBottom: guideline ? 12 : 0 }}>
              <span style={{ fontWeight: 600, color: palette.textDim, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                Statement
              </span>
              {desc}
            </div>
          )}
          {guideline && (
            <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.65 }}>
              <span style={{ fontWeight: 600, color: palette.textDim, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                Guideline
              </span>
              {guideline}
            </div>
          )}
          {control.props && control.props.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <span style={{ fontWeight: 600, color: palette.textDim, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                Properties
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {control.props.map((p, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: "2px 6px", borderRadius: 3,
                    background: palette.bg, color: palette.textMuted, border: `1px solid ${palette.border}`,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  }}>
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

// ─── MAIN APP ─────────────────────────────────────────────────────────

export default function ISMGapAnalyser() {
  const [classification, setClassification] = useState("PROTECTED");
  const [currentData, setCurrentData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [previousJson, setPreviousJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // all, new, removed
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [groupBySection, setGroupBySection] = useState(true);
  const fileInputRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Load current ISM from GitHub
  const loadCurrentISM = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    setLoadingMessage(`Fetching ISM ${classId} baseline...`);
    try {
      const filename = `ISM_${classId}-baseline-resolved-profile_catalog.json`;
      const url = `${GITHUB_BASE}/${filename}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      setCurrentData(data);
      setLoadingMessage("");
    } catch (err) {
      setError(`Failed to load current ISM: ${err.message}. Check your network connection and try again.`);
      setLoadingMessage("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentISM(classification);
  }, [classification, loadCurrentISM]);

  // Handle upload of previously completed ISM
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setLoadingMessage("Parsing uploaded catalog...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setPreviousData(data);
        setPreviousJson(file.name);
        setLoadingMessage("");
      } catch (err) {
        setError(`Failed to parse JSON: ${err.message}`);
        setLoadingMessage("");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }, []);

  // Use a demo / sample previous data derived from current with some controls removed
  const loadSamplePrevious = useCallback(() => {
    if (!currentData) return;
    // Clone and remove ~15% controls to simulate a previous version
    const cloned = JSON.parse(JSON.stringify(currentData));
    function pruneControls(groups) {
      if (!groups) return;
      for (const g of groups) {
        if (g.controls) {
          const originalLen = g.controls.length;
          g.controls = g.controls.filter((_, i) => i % 7 !== 0);
        }
        if (g.groups) pruneControls(g.groups);
      }
    }
    pruneControls(cloned?.catalog?.groups);
    setPreviousData(cloned);
    setPreviousJson("sample-previous.json (simulated)");
  }, [currentData]);

  // Analysis
  const analysis = useMemo(() => {
    if (!currentData) return null;

    const currentControls = extractControls(currentData);
    const currentIds = new Set(currentControls.map(c => c.id));
    const currentMap = new Map(currentControls.map(c => [c.id, c]));

    if (!previousData) {
      return {
        currentControls,
        currentCount: currentControls.length,
        previousCount: 0,
        newControls: currentControls,
        removedControls: [],
        unchangedControls: [],
        newCount: currentControls.length,
        removedCount: 0,
        unchangedCount: 0,
        groups: groupControlsBySection(currentControls, [], []),
      };
    }

    const previousControls = extractControls(previousData);
    const previousIds = new Set(previousControls.map(c => c.id));
    const previousMap = new Map(previousControls.map(c => [c.id, c]));

    const newControls = currentControls.filter(c => !previousIds.has(c.id));
    const removedControls = previousControls.filter(c => !currentIds.has(c.id));
    const unchangedControls = currentControls.filter(c => previousIds.has(c.id));

    return {
      currentControls,
      currentCount: currentControls.length,
      previousCount: previousControls.length,
      newControls,
      removedControls,
      unchangedControls,
      newCount: newControls.length,
      removedCount: removedControls.length,
      unchangedCount: unchangedControls.length,
      groups: groupControlsBySection(newControls, removedControls, unchangedControls),
    };
  }, [currentData, previousData]);

  function groupControlsBySection(newCtrls, removedCtrls, unchangedCtrls) {
    const groups = {};
    const addToGroup = (ctrl, type) => {
      const key = ctrl.groupTitle || "Ungrouped";
      if (!groups[key]) groups[key] = { title: key, new: [], removed: [], unchanged: [] };
      groups[key][type].push(ctrl);
    };
    newCtrls.forEach(c => addToGroup(c, "new"));
    removedCtrls.forEach(c => addToGroup(c, "removed"));
    unchangedCtrls.forEach(c => addToGroup(c, "unchanged"));
    return Object.values(groups).sort((a, b) => a.title.localeCompare(b.title));
  }

  // Filtered controls
  const filteredGroups = useMemo(() => {
    if (!analysis) return [];
    const term = searchTerm.toLowerCase().trim();
    
    return analysis.groups.map(group => {
      const filterControls = (ctrls) => {
        if (!term) return ctrls;
        return ctrls.filter(c =>
          c.id?.toLowerCase().includes(term) ||
          c.title?.toLowerCase().includes(term) ||
          getControlDescription(c).toLowerCase().includes(term)
        );
      };
      
      return {
        ...group,
        new: filterMode === "removed" ? [] : filterControls(group.new),
        removed: filterMode === "new" ? [] : filterControls(group.removed),
        unchanged: filterMode !== "all" ? [] : filterControls(group.unchanged),
      };
    }).filter(g => g.new.length + g.removed.length + g.unchanged.length > 0);
  }, [analysis, searchTerm, filterMode]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (!analysis) return;
    const allIds = new Set();
    analysis.groups.forEach(g => {
      [...g.new, ...g.removed, ...g.unchanged].forEach(c => allIds.add(c.id));
    });
    setExpandedIds(allIds);
  };

  const collapseAll = () => setExpandedIds(new Set());

  const exportGapReport = () => {
    if (!analysis) return;
    const lines = [
      `ISM Gap Analysis Report`,
      `Classification: ${CLASSIFICATIONS.find(c => c.id === classification)?.label || classification}`,
      `Generated: ${new Date().toISOString()}`,
      `Current Version: ${getCatalogVersion(currentData) || "unknown"}`,
      `Previous Version: ${getCatalogVersion(previousData) || "unknown"}`,
      `Current Controls: ${analysis.currentCount}`,
      `Previous Controls: ${analysis.previousCount}`,
      `New (Gap): ${analysis.newCount}`,
      `Removed: ${analysis.removedCount}`,
      ``,
      `═══ NEW CONTROLS (GAP) ═══`,
      ...analysis.newControls.map(c => `${c.id}\t${c.title || ""}\t${c.groupTitle}\t${getControlDescription(c)}`),
      ``,
      `═══ REMOVED CONTROLS ═══`,
      ...analysis.removedControls.map(c => `${c.id}\t${c.title || ""}\t${c.groupTitle}\t${getControlDescription(c)}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ism-gap-report-${classification}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!analysis) return;
    const rows = [
      ["Control ID", "Title", "Group", "Status", "Description"].join(","),
      ...analysis.newControls.map(c =>
        [c.id, `"${(c.title||"").replace(/"/g,'""')}"`, `"${c.groupTitle}"`, "NEW", `"${getControlDescription(c).replace(/"/g,'""')}"`].join(",")
      ),
      ...analysis.removedControls.map(c =>
        [c.id, `"${(c.title||"").replace(/"/g,'""')}"`, `"${c.groupTitle}"`, "REMOVED", `"${getControlDescription(c).replace(/"/g,'""')}"`].join(",")
      ),
      ...analysis.unchangedControls.map(c =>
        [c.id, `"${(c.title||"").replace(/"/g,'""')}"`, `"${c.groupTitle}"`, "UNCHANGED", `"${getControlDescription(c).replace(/"/g,'""')}"`].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ism-gap-analysis-${classification}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const classInfo = ALL_PROFILES.find(c => c.id === classification);

  return (
    <div style={{
      minHeight: "100vh", background: palette.bg, color: palette.text,
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${palette.surface} 0%, ${palette.bg} 100%)`,
        borderBottom: `1px solid ${palette.border}`,
        padding: "24px 32px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDim})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: palette.bg,
            }}>
              △
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: palette.text }}>
                ISM Gap Analyser
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: palette.textDim, letterSpacing: "0.04em" }}>
                Australian Information Security Manual · OSCAL Control Gap Analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px" }}>
        {/* CLASSIFICATION PICKER */}
        <div style={{
          background: palette.surface, border: `1px solid ${palette.border}`,
          borderRadius: 8, padding: 20, marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: palette.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Classification Level
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_PROFILES.map(c => (
              <button
                key={c.id}
                onClick={() => setClassification(c.id)}
                style={{
                  background: classification === c.id ? c.color + "22" : "transparent",
                  border: `1px solid ${classification === c.id ? c.color : palette.border}`,
                  color: classification === c.id ? c.color : palette.textMuted,
                  padding: "6px 14px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.02em",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div style={{
          background: palette.surface, border: `1px solid ${palette.border}`,
          borderRadius: 8, padding: 20, marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: palette.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Previous ISM Baseline (for comparison)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: palette.accent + "18", border: `1px solid ${palette.accent}44`,
                color: palette.accent, padding: "8px 18px", borderRadius: 5,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Upload Previous ISM JSON
            </button>
            <button
              onClick={loadSamplePrevious}
              disabled={!currentData}
              style={{
                background: "transparent", border: `1px solid ${palette.border}`,
                color: palette.textMuted, padding: "8px 18px", borderRadius: 5,
                fontSize: 13, fontWeight: 500, cursor: currentData ? "pointer" : "not-allowed",
                opacity: currentData ? 1 : 0.5,
              }}
            >
              Use Sample (Demo)
            </button>
            {previousJson && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Badge color={palette.green}>Loaded</Badge>
                <span style={{ fontSize: 12, color: palette.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                  {previousJson}
                </span>
                <button
                  onClick={() => { setPreviousData(null); setPreviousJson(null); }}
                  style={{
                    background: "transparent", border: "none", color: palette.red,
                    cursor: "pointer", fontSize: 14, padding: "2px 6px",
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: palette.textDim, lineHeight: 1.6 }}>
            Upload a previously completed ISM OSCAL resolved profile catalog JSON (e.g. from a prior ISM release at{" "}
            <a href="https://github.com/AustralianCyberSecurityCentre/ism-oscal/releases" target="_blank" rel="noopener" style={{ color: palette.accent }}>
              github.com/AustralianCyberSecurityCentre/ism-oscal/releases
            </a>).
            The gap analysis compares your previous set against the latest current baseline to identify new and removed controls.
          </p>
        </div>

        {/* LOADING / ERROR */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20, color: palette.textMuted }}>
            <Spinner /> <span>{loadingMessage || "Loading..."}</span>
          </div>
        )}
        {error && (
          <div style={{
            background: palette.red + "12", border: `1px solid ${palette.red}33`,
            borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 13, color: palette.red,
          }}>
            {error}
          </div>
        )}

        {/* VERSION COMPARISON BANNER */}
        {analysis && !loading && (() => {
          const currentVersion = getCatalogVersion(currentData);
          const previousVersion = getCatalogVersion(previousData);
          if (!currentVersion && !previousVersion) return null;
          return (
            <div style={{
              background: palette.surface, border: `1px solid ${palette.border}`,
              borderRadius: 8, padding: "14px 20px", marginBottom: 20,
              display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: palette.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Comparing
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Badge color={palette.purple}>Previous</Badge>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: palette.text }}>
                  {previousVersion || "—"}
                </span>
              </div>
              <span style={{ color: palette.textDim, fontSize: 14 }}>→</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Badge color={palette.blue}>Current</Badge>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: palette.text }}>
                  {currentVersion || "—"}
                </span>
              </div>
            </div>
          );
        })()}

        {/* STATS */}
        {analysis && !loading && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Current Controls", value: analysis.currentCount, color: palette.blue },
                { label: "Previous Controls", value: analysis.previousCount, color: palette.purple },
                { label: "New (Gap)", value: analysis.newCount, color: palette.green },
                { label: "Removed", value: analysis.removedCount, color: palette.red },
                { label: "Unchanged", value: analysis.unchangedCount, color: palette.textDim },
              ].map((s, i) => (
                <div key={i} style={{
                  background: palette.surface, border: `1px solid ${palette.border}`,
                  borderRadius: 8, padding: "16px 18px",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.02em",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: palette.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4, fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* GAP CHART */}
            {previousData && analysis.currentCount > 0 && (
              <div style={{
                background: palette.surface, border: `1px solid ${palette.border}`,
                borderRadius: 8, padding: 20, marginBottom: 20,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: palette.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  Coverage Overview
                </div>
                <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", background: palette.bg }}>
                  {analysis.unchangedCount > 0 && (
                    <div style={{
                      width: `${(analysis.unchangedCount / analysis.currentCount) * 100}%`,
                      background: palette.blue + "55", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: palette.blue, letterSpacing: "0.04em",
                    }}>
                      {Math.round((analysis.unchangedCount / analysis.currentCount) * 100)}% COVERED
                    </div>
                  )}
                  {analysis.newCount > 0 && (
                    <div style={{
                      width: `${(analysis.newCount / analysis.currentCount) * 100}%`,
                      background: palette.green + "33", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: palette.green, letterSpacing: "0.04em",
                    }}>
                      {Math.round((analysis.newCount / analysis.currentCount) * 100)}% GAP
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TOOLBAR */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
              marginBottom: 16, padding: "12px 0",
              borderBottom: `1px solid ${palette.border}`,
            }}>
              <input
                type="text"
                placeholder="Search controls by ID, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: "1 1 260px", minWidth: 200, background: palette.surface,
                  border: `1px solid ${palette.border}`, borderRadius: 5,
                  padding: "8px 14px", color: palette.text, fontSize: 13,
                  outline: "none", fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { id: "all", label: "All" },
                  { id: "new", label: "New (Gap)" },
                  { id: "removed", label: "Removed" },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterMode(f.id)}
                    style={{
                      background: filterMode === f.id ? palette.accent + "18" : "transparent",
                      border: `1px solid ${filterMode === f.id ? palette.accent : palette.border}`,
                      color: filterMode === f.id ? palette.accent : palette.textMuted,
                      padding: "6px 12px", borderRadius: 4, fontSize: 12, fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={expandAll} style={{
                  background: "transparent", border: `1px solid ${palette.border}`,
                  color: palette.textMuted, padding: "6px 10px", borderRadius: 4, fontSize: 11,
                  cursor: "pointer",
                }}>
                  Expand All
                </button>
                <button onClick={collapseAll} style={{
                  background: "transparent", border: `1px solid ${palette.border}`,
                  color: palette.textMuted, padding: "6px 10px", borderRadius: 4, fontSize: 11,
                  cursor: "pointer",
                }}>
                  Collapse
                </button>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={exportGapReport} style={{
                  background: "transparent", border: `1px solid ${palette.border}`,
                  color: palette.textMuted, padding: "6px 10px", borderRadius: 4, fontSize: 11,
                  cursor: "pointer",
                }}>
                  Export TXT
                </button>
                <button onClick={exportCSV} style={{
                  background: "transparent", border: `1px solid ${palette.border}`,
                  color: palette.textMuted, padding: "6px 10px", borderRadius: 4, fontSize: 11,
                  cursor: "pointer",
                }}>
                  Export CSV
                </button>
              </div>
            </div>

            {/* CONTROLS LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filteredGroups.map((group) => (
                <div key={group.title}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    marginBottom: 10, paddingBottom: 6,
                    borderBottom: `1px solid ${palette.border}`,
                  }}>
                    <h3 style={{
                      margin: 0, fontSize: 14, fontWeight: 700, color: palette.text,
                      letterSpacing: "-0.01em",
                    }}>
                      {group.title}
                    </h3>
                    <span style={{ fontSize: 11, color: palette.textDim }}>
                      {group.new.length + group.removed.length + group.unchanged.length} controls
                    </span>
                    {group.new.length > 0 && <Badge color={palette.green}>{group.new.length} new</Badge>}
                    {group.removed.length > 0 && <Badge color={palette.red}>{group.removed.length} removed</Badge>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {group.new.map(c => (
                      <ControlCard
                        key={c.id} control={c} isNew expanded={expandedIds.has(c.id)}
                        onToggle={() => toggleExpand(c.id)}
                      />
                    ))}
                    {group.removed.map(c => (
                      <ControlCard
                        key={c.id} control={c} isRemoved expanded={expandedIds.has(c.id)}
                        onToggle={() => toggleExpand(c.id)}
                      />
                    ))}
                    {group.unchanged.map(c => (
                      <ControlCard
                        key={c.id} control={c} expanded={expandedIds.has(c.id)}
                        onToggle={() => toggleExpand(c.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: palette.textDim }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>∅</div>
                <div style={{ fontSize: 14 }}>No controls match your current filters.</div>
              </div>
            )}
          </>
        )}

        {/* FOOTER */}
        <div style={{
          marginTop: 40, padding: "20px 0", borderTop: `1px solid ${palette.border}`,
          fontSize: 11, color: palette.textDim, lineHeight: 1.8,
        }}>
          Data source: ASD ISM OSCAL — github.com/AustralianCyberSecurityCentre/ism-oscal (CC BY 4.0).
          This tool performs a set-based comparison of OSCAL control IDs between the current ISM baseline and
          a previously completed baseline to identify gaps. Upload any ISM OSCAL resolved profile catalog JSON
          from a prior release to compare.
        </div>
      </div>
    </div>
  );
}
