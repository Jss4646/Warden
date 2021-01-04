export function updateUsername(username) {
  return {
    type: "UPDATE_USERNAME",
    username,
  };
}

export function updateCurrentUrl(url) {
  return {
    type: "UPDATE_CURRENT_URL",
    newUrl: url,
  };
}

export function updateIsCurrentUrlValid(isValid) {
  return {
    type: "UPDATE_IS_CURRENT_URL_VALID",
    isValid,
  };
}

export function addUrlToUrlList(url) {
  return {
    type: "ADD_URL_TO_URL_LIST",
    url,
  };
}

export function removeUrlFromUrlList(urlIndex) {
  return {
    type: "REMOVE_URL_FROM_URL_LIST",
    urlIndex,
  };
}

export function clearUrls() {
  return {
    type: "CLEAR_URLS",
  };
}
