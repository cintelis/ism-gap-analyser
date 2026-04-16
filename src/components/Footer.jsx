import { palette } from "../theme.js";

export function Footer() {
  return (
    <div
      style={{
        marginTop: 40,
        padding: "20px 0",
        borderTop: `1px solid ${palette.border}`,
        fontSize: 11,
        color: palette.textDim,
        lineHeight: 1.8,
      }}
    >
      Data source: ASD ISM OSCAL — github.com/AustralianCyberSecurityCentre/ism-oscal (CC BY 4.0).
      This tool performs a set-based comparison of OSCAL control IDs between the current ISM
      baseline and a previously completed baseline to identify gaps. Upload any ISM OSCAL resolved
      profile catalog JSON from a prior release to compare.
    </div>
  );
}
