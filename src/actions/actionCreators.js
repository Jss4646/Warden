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
