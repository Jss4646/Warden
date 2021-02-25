export function resetAppState() {
  return {
    type: "RESET_APP_STATE",
  };
}

/**
 *
 * @param {string} username
 * @returns {{type: string, username: string}}
 */
export function updateUsername(username) {
  return {
    type: "UPDATE_USERNAME",
    username,
  };
}

/**
 *
 * @param {string} url
 * @returns {{newUrl: string, type: string}}
 */
export function updateCurrentUrl(url) {
  return {
    type: "UPDATE_CURRENT_URL",
    newUrl: url,
  };
}

/**
 *
 * @param {boolean} isValid
 * @returns {{isValid: boolean, type: string}}
 */
export function updateIsCurrentUrlValid(isValid) {
  return {
    type: "UPDATE_IS_CURRENT_URL_VALID",
    isValid,
  };
}

/**
 *
 * @param {string} url
 * @returns {{type: string, url: string}}
 */
export function addUrlToUrlList(url) {
  return {
    type: "ADD_URL_TO_URL_LIST",
    url,
  };
}

/**
 *
 * @param {number} urlIndex
 * @returns {{urlIndex: number, type: string}}
 */
export function removeUrlFromUrlList(urlIndex) {
  return {
    type: "REMOVE_URL_FROM_URL_LIST",
    urlIndex,
  };
}

/**
 *
 * @returns {{type: string}}
 */
export function clearUrls() {
  return {
    type: "CLEAR_URLS",
  };
}

/**
 *
 * @param {string[]} urls
 * @returns {{newUrls: string[], type: string}}
 */
export function importUrls(urls) {
  return {
    type: "IMPORT_URLS",
    newUrls: urls,
  };
}

/**
 *
 * @param {boolean} isCrawling
 * @returns {{type: string, isCrawling: boolean}}
 */
export function updateIsLoadingUrls(isCrawling) {
  return {
    type: "UPDATE_IS_LOADING_URLS",
    isCrawling,
  };
}

/**
 *
 * @param {string[]} selectedDevices
 * @returns {{type: string, selectedDevices: string[]}}
 */
export function setSelectedDevices(selectedDevices) {
  return {
    type: "SET_SELECTED_DEVICES",
    selectedDevices,
  };
}

/**
 *
 * @returns {{type: string}}
 */
export function selectAllDevices() {
  return {
    type: "SELECT_ALL_DEVICES",
  };
}

/**
 *
 * @returns {{type: string}}
 */
export function deselectAllDevices() {
  return {
    type: "DESELECT_ALL_DEVICES",
  };
}

/**
 *
 * @param {Object} screenshot
 * @returns {{screenshot: Object, type: string}}
 */
export function addScreenshot(screenshot) {
  return {
    type: "ADD_SCREENSHOT",
    screenshot,
  };
}

/**
 *
 * @param {Object} screenshot
 * @param {String} screenshotImage
 * @returns {{screenshotImage: String, screenshot: Object}}
 */
export function addScreenshotImage(screenshot, screenshotImage) {
  return {
    type: "ADD_SCREENSHOT_IMAGE",
    screenshot,
    screenshotImage,
  };
}

/**
 *
 * @param {String} host
 * @param {String} path
 * @param {number} index
 * @returns {{index: number, type: string}}
 */
export function removeScreenshot(host, path, index) {
  return {
    type: "REMOVE_SCREENSHOT",
    host,
    path,
    index,
  };
}

/**
 * @param {string} host
 * @param {String} path
 * @returns {{type: string}}
 */
export function removeScreenshots(host, path) {
  return {
    type: "REMOVE_SCREENSHOTS",
    host,
    path,
  };
}

/**
 *
 * @param {Array} screenshots
 * @returns {{type: string, screenshots: Array}}
 */
export function setScreenshots(screenshots) {
  return {
    type: "SET_SCREENSHOTS",
    screenshots,
  };
}

/**
 *
 * @param {String} textContent
 * @param {String} environment
 * @returns {{environment: string, textContent: string, type: string}}
 */
export function addActivityLogLine(textContent, environment) {
  return {
    type: "ADD_ACTIVITY_LOG_LINE",
    textContent,
    environment,
  };
}
