import { useCallback, useMemo, useState } from "react";
import { palette } from "./theme.js";
import { usePersistedState, usePersistedSet } from "./hooks/usePersistedState.js";
import { useCurrentISM } from "./hooks/useCurrentISM.js";
import { useGapAnalysis } from "./hooks/useGapAnalysis.js";
import { getControlDescription } from "./lib/oscal.js";
import { exportGapReport, exportCSV } from "./lib/export.js";
import { buildSamplePrevious } from "./lib/sample.js";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { ClassificationPicker } from "./components/ClassificationPicker.jsx";
import { UploadPanel } from "./components/UploadPanel.jsx";
import { VersionBanner } from "./components/VersionBanner.jsx";
import { StatsGrid } from "./components/StatsGrid.jsx";
import { CoverageChart } from "./components/CoverageChart.jsx";
import { Toolbar } from "./components/Toolbar.jsx";
import { ControlsList } from "./components/ControlsList.jsx";
import { Spinner } from "./components/Spinner.jsx";

export default function ISMGapAnalyser() {
  const [classification, setClassification] = usePersistedState("classification", "PROTECTED");
  const [filterMode, setFilterMode] = usePersistedState("filterMode", "all");
  const [expandedIds, setExpandedIds] = usePersistedSet("expandedIds");
  const [searchTerm, setSearchTerm] = useState("");

  const [previousData, setPreviousData] = useState(null);
  const [previousJson, setPreviousJson] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const { currentData, loading, error, loadingMessage } = useCurrentISM(classification);
  const analysis = useGapAnalysis(currentData, previousData);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setPreviousData(data);
        setPreviousJson(file.name);
        setUploadError(null);
      } catch (err) {
        setUploadError(`Failed to parse JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }, []);

  const loadSamplePrevious = useCallback(() => {
    const sample = buildSamplePrevious(currentData);
    if (!sample) return;
    setPreviousData(sample);
    setPreviousJson("sample-previous.json (simulated)");
  }, [currentData]);

  const clearPrevious = useCallback(() => {
    setPreviousData(null);
    setPreviousJson(null);
  }, []);

  const toggleExpand = useCallback(
    (id) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [setExpandedIds]
  );

  const expandAll = useCallback(() => {
    if (!analysis) return;
    const allIds = new Set();
    analysis.groups.forEach((g) => {
      [...g.new, ...g.removed, ...g.unchanged].forEach((c) => allIds.add(c.id));
    });
    setExpandedIds(allIds);
  }, [analysis, setExpandedIds]);

  const collapseAll = useCallback(() => setExpandedIds(new Set()), [setExpandedIds]);

  const filteredGroups = useMemo(() => {
    if (!analysis) return [];
    const term = searchTerm.toLowerCase().trim();
    const filterControls = (ctrls) => {
      if (!term) return ctrls;
      return ctrls.filter(
        (c) =>
          c.id?.toLowerCase().includes(term) ||
          c.title?.toLowerCase().includes(term) ||
          getControlDescription(c).toLowerCase().includes(term)
      );
    };
    return analysis.groups
      .map((group) => ({
        ...group,
        new: filterMode === "removed" ? [] : filterControls(group.new),
        removed: filterMode === "new" ? [] : filterControls(group.removed),
        unchanged: filterMode !== "all" ? [] : filterControls(group.unchanged),
      }))
      .filter((g) => g.new.length + g.removed.length + g.unchanged.length > 0);
  }, [analysis, searchTerm, filterMode]);

  const combinedError = error || uploadError;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        color: palette.text,
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px" }}>
        <ClassificationPicker classification={classification} onChange={setClassification} />

        <UploadPanel
          previousJson={previousJson}
          onUpload={handleFileUpload}
          onSample={loadSamplePrevious}
          onClear={clearPrevious}
          sampleEnabled={!!currentData}
        />

        {loading && (
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, padding: 20, color: palette.textMuted }}
            role="status"
            aria-live="polite"
          >
            <Spinner /> <span>{loadingMessage || "Loading..."}</span>
          </div>
        )}

        {combinedError && (
          <div
            role="alert"
            style={{
              background: palette.red + "12",
              border: `1px solid ${palette.red}33`,
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
              fontSize: 13,
              color: palette.red,
            }}
          >
            {combinedError}
          </div>
        )}

        {analysis && !loading && (
          <>
            <VersionBanner currentData={currentData} previousData={previousData} />
            <StatsGrid analysis={analysis} />
            {previousData && <CoverageChart analysis={analysis} />}

            <Toolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterMode={filterMode}
              onFilterChange={setFilterMode}
              onExpandAll={expandAll}
              onCollapseAll={collapseAll}
              onExportTxt={() => exportGapReport(analysis, classification, currentData, previousData)}
              onExportCsv={() => exportCSV(analysis, classification)}
            />

            <ControlsList
              groups={filteredGroups}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
            />
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
