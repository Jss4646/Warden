/**
 * Adds a page locally and to the db
 *
 * @param {string|URL} url - the url of the site without the path
 * @param {string} pagePath - the path of the page you wish to add
 * @param {string} sitePath - the path of the site in the db
 * @param {function} addLocalPage - the function to add the page to the client
 */
export function addPage(url, pagePath, sitePath, addLocalPage) {
  pagePath += pagePath.endsWith("/") ? "" : "/";

  url = new URL(url);
  url.pathname = pagePath;

  const newPage = {
    url: url.toString(),
    pagePath,
    screenshots: {},
    failing: false,
    trimPages: true,
  };

  addLocalPage(url.pathname, newPage);

  const params = {
    sitePath,
    pagePath,
    ...newPage,
  };

  const fetchUrl = new URL(`${window.location.origin}/api/add-site-page`);
  fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).catch(console.error);
}

/**
 * Removes a page from the client and db
 *
 * @param {string} pagePath - the path of the page you wish to remove
 * @param {string} sitePath - the path of the site in the db
 * @param {function} removeLocalPage - the function to remove the page from the client
 */
export function removePage(pagePath, sitePath, removeLocalPage) {
  removeLocalPage(pagePath);

  const params = {
    pagePath,
    sitePath,
  };

  fetch(`${window.location.origin}/api/delete-site-page`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).catch(console.error);
}
