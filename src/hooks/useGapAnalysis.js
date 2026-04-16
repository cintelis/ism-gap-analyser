import { useMemo } from "react";
import { extractControls, groupControlsBySection, isControlModified } from "../lib/oscal.js";

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
        modifiedControls: [],
        unchangedControls: [],
        newCount: currentControls.length,
        removedCount: 0,
        modifiedCount: 0,
        unchangedCount: 0,
        modifiedByCurrentId: new Map(),
        groups: groupControlsBySection(currentControls, [], [], []),
      };
    }

    const previousControls = extractControls(previousData);
    const previousIds = new Set(previousControls.map((c) => c.id));
    const previousById = new Map(previousControls.map((c) => [c.id, c]));

    const newControls = currentControls.filter((c) => !previousIds.has(c.id));
    const removedControls = previousControls.filter((c) => !currentIds.has(c.id));

    const modifiedControls = [];
    const unchangedControls = [];
    for (const curr of currentControls) {
      const prev = previousById.get(curr.id);
      if (!prev) continue;
      if (isControlModified(prev, curr)) modifiedControls.push({ previous: prev, current: curr });
      else unchangedControls.push(curr);
    }

    const modifiedByCurrentId = new Map(modifiedControls.map((p) => [p.current.id, p.previous]));

    return {
      currentControls,
      currentCount: currentControls.length,
      previousCount: previousControls.length,
      newControls,
      removedControls,
      modifiedControls,
      unchangedControls,
      newCount: newControls.length,
      removedCount: removedControls.length,
      modifiedCount: modifiedControls.length,
      unchangedCount: unchangedControls.length,
      modifiedByCurrentId,
      groups: groupControlsBySection(newControls, removedControls, unchangedControls, modifiedControls),
    };
  }, [currentData, previousData]);
}
