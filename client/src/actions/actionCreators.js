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
