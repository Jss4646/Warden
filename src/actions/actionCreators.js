/**
 * Updates the users username
 *
 * @param username
 * @returns {{type: string, username: *}}
 */
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
