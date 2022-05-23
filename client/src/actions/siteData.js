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

export function setSiteStatus(siteStatus) {
  return {
    type: "SET_SITE_STATUS",
    siteStatus,
  };
}

export function addPage(pagePath, page) {
  return {
    type: "ADD_PAGE",
    pagePath,
    page,
  };
}

export function removePage(pagePath) {
  return {
    type: "REMOVE_PAGE",
    pagePath,
  };
}

export function setCurrentPage(pagePath) {
  return {
    type: "SET_CURRENT_PAGE",
    pagePath,
  };
}

export function removeAllPages() {
  return {
    type: "REMOVE_ALL_PAGES",
  };
}

export function addScreenshots(page, device, screenshots) {
  return {
    type: "ADD_SCREENSHOTS",
    page,
    device,
    screenshots,
  };
}

export function setAllScreenshots(pages) {
  return {
    type: "SET_ALL_SCREENSHOTS",
    pages,
  };
}

export function setBaselineUrl(url) {
  return {
    type: "SET_BASELINE_URL",
    url,
  };
}

export function setComparisonUrl(url) {
  return {
    type: "SET_COMPARISON_URL",
    url,
  };
}

export function setNumOfFailing(numOfFailing) {
  return {
    type: "SET_NUM_OF_FAILING",
    numOfFailing,
  };
}

export function setNumInQueue(numInQueue) {
  return {
    type: "SET_NUM_IN_QUEUE",
    numInQueue,
  };
}
