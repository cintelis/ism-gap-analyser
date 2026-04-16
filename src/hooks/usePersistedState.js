import { useState, useEffect, useRef } from "react";
import { loadJSON, saveJSON } from "../lib/storage.js";

export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => loadJSON(key, initial));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveJSON(key, value);
  }, [key, value]);

  return [value, setValue];
}

export function usePersistedSet(key) {
  const [set, setSet] = useState(() => new Set(loadJSON(key, [])));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveJSON(key, Array.from(set));
  }, [key, set]);

  return [set, setSet];
}
