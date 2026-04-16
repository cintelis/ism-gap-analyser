export function GlobalStyles() {
  return (
    <style>{`
      /* Focus-visible outline (not just :focus — keyboard users only) */
      button:focus-visible,
      [role="button"]:focus-visible,
      [role="radio"]:focus-visible,
      input:focus-visible,
      select:focus-visible,
      a:focus-visible {
        outline: 2px solid #F59E0B;
        outline-offset: 2px;
      }

      /* Hover feedback on interactive cards */
      .control-card:hover {
        border-color: #3A4166 !important;
      }

      /* Mobile layout — below 540px, tighten padding and shrink text */
      @media (max-width: 540px) {
        .app-container { padding: 16px !important; }
        .app-header { padding: 16px 18px !important; }
        .app-header h1 { font-size: 17px !important; }
        .app-header p { font-size: 11px !important; }
      }

      /* Guideline drawer prose */
      .guideline-body p { margin-bottom: 12px; }
      .guideline-body ul, .guideline-body ol { margin: 8px 0 12px 20px; }
      .guideline-body li { margin-bottom: 4px; }
      .guideline-body a { color: #F59E0B; text-decoration: none; }
      .guideline-body a:hover { text-decoration: underline; }
      .guideline-body h4 { font-size: 14px; font-weight: 600; color: #E2E8F0; margin: 16px 0 6px; }
      .guideline-body table { border-collapse: collapse; margin: 8px 0; width: 100%; }
      .guideline-body td, .guideline-body th { border: 1px solid #252A42; padding: 6px 10px; font-size: 13px; }

      /* Print: strip dark theme, expand cards, hide chrome */
      @media print {
        @page { margin: 18mm; }
        body, html { background: #fff !important; color: #000 !important; }
        [data-print-hide] { display: none !important; }
        [data-print-expand] { page-break-inside: avoid; }
        a { color: #000 !important; text-decoration: underline; }
        h1, h2, h3 { color: #000 !important; }
        * {
          background: transparent !important;
          color: #000 !important;
          border-color: #999 !important;
          box-shadow: none !important;
        }
      }
    `}</style>
  );
}
