/**
 * Adds a page locally and to the db
 *
 * @param {string|URL} url - the url of the site without the path
 * @param {string} pagePath - the path of the page you wish to add
 * @param {string} sitePath - the path of the site in the db
 * @param {function} addPage - the function to add the page to the client
 */
export function addPage(url, pagePath, sitePath, addPage) {
  pagePath += pagePath.endsWith("/") ? "" : "/";

  url = new URL(url);
  url.pathname = pagePath;

  const newPage = {
    url: url.toString(),
    screenshots: {},
    failing: false,
  };

  addPage(url.pathname, newPage);

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
