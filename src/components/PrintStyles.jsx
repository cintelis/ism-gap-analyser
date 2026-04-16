export function PrintStyles() {
  return (
    <style>{`
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
