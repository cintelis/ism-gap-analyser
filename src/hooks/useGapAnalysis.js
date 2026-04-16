import { useMemo } from "react";
import { extractControls, groupControlsBySection } from "../lib/oscal.js";

export function useGapAnalysis(currentData, previousData) {
  return useMemo(() => {
    if (!currentData) return null;

    const currentControls = extractControls(currentData);
    const currentIds = new Set(currentControls.map((c) => c.id));

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
    const previousIds = new Set(previousControls.map((c) => c.id));

    const newControls = currentControls.filter((c) => !previousIds.has(c.id));
    const removedControls = previousControls.filter((c) => !currentIds.has(c.id));
    const unchangedControls = currentControls.filter((c) => previousIds.has(c.id));

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
}
