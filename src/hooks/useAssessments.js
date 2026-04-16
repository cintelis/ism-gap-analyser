import { useCallback, useEffect, useState } from "react";
import { loadAssessments, saveAssessments, updateAssessment } from "../lib/assessments.js";

export function useAssessments() {
  const [assessments, setAssessments] = useState(() => loadAssessments());

  useEffect(() => {
    saveAssessments(assessments);
  }, [assessments]);

  const update = useCallback((controlId, patch) => {
    setAssessments((prev) => updateAssessment(prev, controlId, patch));
  }, []);

  const replaceAll = useCallback((next) => {
    setAssessments(next || {});
  }, []);

  const clear = useCallback(() => setAssessments({}), []);

  return { assessments, update, replaceAll, clear };
}
