export function clearSiteData() {
  return {
    type: "CLEAR_SITE_DATA",
  };
}

export function loadSiteData(siteData) {
  return {
    type: "LOAD_SITE_DATA",
    siteData,
  };
}
