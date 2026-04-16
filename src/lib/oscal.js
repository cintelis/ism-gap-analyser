export function extractControls(catalog) {
  const controls = [];

  function walkGroups(groups) {
    if (!groups) return;
    for (const group of groups) {
      if (group.controls) {
        for (const ctrl of group.controls) {
          controls.push({
            ...ctrl,
            groupTitle: group.title || "Ungrouped",
            groupId: group.id || "",
          });
        }
      }
      if (group.groups) walkGroups(group.groups);
    }
  }

  if (catalog?.catalog?.groups) walkGroups(catalog.catalog.groups);
  if (catalog?.catalog?.controls) {
    for (const ctrl of catalog.catalog.controls) {
      controls.push({ ...ctrl, groupTitle: "Ungrouped", groupId: "" });
    }
  }
  return controls;
}

export function getControlProp(control, propName, ns) {
  if (!control.props) return null;
  const prop = control.props.find((p) => {
    const nameMatch = p.name === propName;
    if (ns) return nameMatch && p.ns === ns;
    return nameMatch;
  });
  return prop ? prop.value : null;
}

export function getControlProps(control, propName, ns) {
  if (!control.props) return [];
  return control.props
    .filter((p) => {
      const nameMatch = p.name === propName;
      if (ns) return nameMatch && p.ns === ns;
      return nameMatch;
    })
    .map((p) => ({ value: p.value, class: p.class }));
}

export function getControlDescription(control) {
  if (!control.parts) return "";
  const stmt = control.parts.find((p) => p.name === "statement");
  if (stmt && stmt.prose) return stmt.prose;
  if (stmt && stmt.parts) {
    return stmt.parts
      .map((p) => p.prose)
      .filter(Boolean)
      .join("\n");
  }
  const overview = control.parts.find((p) => p.name === "overview");
  if (overview && overview.prose) return overview.prose;
  return "";
}

export function getControlGuideline(control) {
  if (!control.parts) return "";
  const guideline = control.parts.find((p) => p.name === "guideline" || p.name === "guidance");
  if (guideline && guideline.prose) return guideline.prose;
  return "";
}

export function getControlRevision(control) {
  return (
    getControlProp(control, "revision") ||
    getControlProp(control, "label", "https://www.cyber.gov.au/ism/oscal/v1") ||
    ""
  );
}

export function getCatalogVersion(catalog) {
  return catalog?.catalog?.metadata?.version || null;
}

export function getCatalogPublished(catalog) {
  return (
    catalog?.catalog?.metadata?.published ||
    catalog?.catalog?.metadata?.["last-modified"] ||
    null
  );
}

export function groupControlsBySection(newCtrls, removedCtrls, unchangedCtrls) {
  const groups = {};
  const addToGroup = (ctrl, type) => {
    const key = ctrl.groupTitle || "Ungrouped";
    if (!groups[key]) groups[key] = { title: key, new: [], removed: [], unchanged: [] };
    groups[key][type].push(ctrl);
  };
  newCtrls.forEach((c) => addToGroup(c, "new"));
  removedCtrls.forEach((c) => addToGroup(c, "removed"));
  unchangedCtrls.forEach((c) => addToGroup(c, "unchanged"));
  return Object.values(groups).sort((a, b) => a.title.localeCompare(b.title));
}
