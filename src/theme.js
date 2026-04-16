export const palette = {
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

export const CLASSIFICATIONS = [
  { id: "NON_CLASSIFIED", label: "Non-Classified", color: "#3B82F6" },
  { id: "OFFICIAL_SENSITIVE", label: "OFFICIAL: Sensitive", color: "#8B5CF6" },
  { id: "PROTECTED", label: "PROTECTED", color: "#F59E0B" },
  { id: "SECRET", label: "SECRET", color: "#EF4444" },
  { id: "TOP_SECRET", label: "TOP SECRET", color: "#DC2626" },
];

export const E8_LEVELS = [
  { id: "E8_ML1", label: "Essential Eight ML1", color: "#10B981" },
  { id: "E8_ML2", label: "Essential Eight ML2", color: "#06B6D4" },
  { id: "E8_ML3", label: "Essential Eight ML3", color: "#6366F1" },
];

export const ALL_PROFILES = [...CLASSIFICATIONS, ...E8_LEVELS];

export const GITHUB_BASE =
  "https://raw.githubusercontent.com/AustralianCyberSecurityCentre/ism-oscal/main";
