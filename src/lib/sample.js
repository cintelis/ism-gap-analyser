export function buildSamplePrevious(currentData) {
  if (!currentData) return null;
  const cloned = JSON.parse(JSON.stringify(currentData));
  function pruneControls(groups) {
    if (!groups) return;
    for (const g of groups) {
      if (g.controls) {
        g.controls = g.controls.filter((_, i) => i % 7 !== 0);
      }
      if (g.groups) pruneControls(g.groups);
    }
  }
  pruneControls(cloned?.catalog?.groups);
  return cloned;
}
