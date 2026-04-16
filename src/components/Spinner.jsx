import { palette } from "../theme.js";

export function Spinner({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: "spin 1s linear infinite" }}
      aria-hidden="true"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke={palette.border} strokeWidth="3" fill="none" />
      <path
        d="M12 2 A10 10 0 0 1 22 12"
        stroke={palette.accent}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
