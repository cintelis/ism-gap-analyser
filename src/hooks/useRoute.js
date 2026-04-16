import { useEffect, useState, useCallback } from "react";

function currentPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((newPath) => {
    if (newPath === currentPath()) return;
    window.history.pushState({}, "", newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return { path, navigate };
}
