import { default as devicesData } from "../data/devices.json";

/**
 * @typedef screenshotData {Object}
 * @param resolution {object}
 * @param resolution.width {number}
 * @param resolution.height {number}
 * @param userAgent {String}
 * @param url {string}
 * @param fileName {string}
 */

/**
 * Makes the call to the api to generate the screenshots and diff image
 *
 * @param pagesRequestData {Array[screenshotData]}
 * @param siteRequestData {Object}
 * @param generateBaselines {boolean}
 * @returns {Promise<string>}
 */
export function generateScreenshots(
  pagesRequestData,
  siteRequestData,
  generateBaselines
) {
  return fetch(`${window.location.origin}/api/run-comparison`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pages: pagesRequestData,
      siteRequestData,
      generateBaselines,
    }),
    // TODO cancel button
    // signal: abortSignal,
  });
}

/**
 * Starts a comparison for given pages
 *
 * @param {Object} siteData - The site data
 * @param {Object} pages - The pages data
 * @param {Boolean} generateBaselines - Whether to generate baseline screenshots
 */
export function runPageComparison(siteData, pages, generateBaselines = false) {
  const pagesRequestData = [];

  for (const page of pages) {
    const pageRequestData = createPageRequestData(
      siteData,
      page,
      generateBaselines
    );
    pagesRequestData.push(...pageRequestData);
  }

  let {
    cookies,
    sitePath,
    siteUsername,
    sitePassword,
    devices,
    failingPercentage,
    validJS,
    injectedJS,
    scrollPage,
    pageTimeout,
  } = siteData;

  if (cookies && !validateCookies(cookies)) {
    cookies = "";
  } else if (!cookies) {
    cookies = "";
  }
  cookies = cookies.replaceAll("\n", "");

  const siteRequestData = {
    sitePath,
    cookieData: cookies,
    devices,
    failingThreshold: failingPercentage,
    injectedJS: validJS ? injectedJS : "",
    siteLogin: { username: siteUsername, password: sitePassword },
    scrollPage,
    pageTimeout,
  };

  generateScreenshots(
    pagesRequestData,
    siteRequestData,
    generateBaselines
  ).catch(console.error);
}

/**
 * Generates comparison screenshots for a given page
 *
 * @param siteData {Object}
 * @param siteData.devices {Array.<string>}
 * @param siteData.url {string}
 * @param siteData.comparisonUrl {string}
 * @param siteData.sitePath {string}
 * @param siteData.screenshotPages {Object}
 * @param siteData.scrollPage {boolean}
 * @param page {Array[string]}
 * @param [generateBaselines] {boolean}
 */
function createPageRequestData(siteData, page, generateBaselines = false) {
  const pagesRequestData = [];

  let { devices, url, comparisonUrl, pages } = siteData;

  url = new URL(url).href.slice(0, -1);
  comparisonUrl = new URL(comparisonUrl).href.slice(0, -1);

  const fullUrl = `${url}${page}`;
  const fullComparisonUrl = `${comparisonUrl}${page}`;

  for (const device of devices) {
    const currentScreenshots = pages[page].screenshots[device];
    const { height, width, userAgent, scale, touch } = devicesData[device];

    generateBaselines =
      currentScreenshots?.baselineScreenshot === undefined || generateBaselines;

    const baselineFileName = generateBaselines
      ? createFilename(fullUrl, device)
      : currentScreenshots.baselineScreenshot
          .split("/")
          .pop()
          .split(".webp")[0];
    const comparisonFileName = createFilename(fullComparisonUrl, device);
    console.log(comparisonFileName);

    let screenshotData = {
      resolution: { height, width },
      userAgent,
      scale,
      touch,
      comparisonUrl: fullComparisonUrl,
      comparisonFileName,
      baselineUrl: fullUrl,
      baselineFileName,
      device,
      page,
      id: pages[page]._id,
    };

    pagesRequestData.push(screenshotData);
  }
  return pagesRequestData;
}

/**
 * Creates the file name for the screenshot
 *
 * @param url {string}
 * @param device {string}
 * @returns {string}
 */
export function createFilename(url, device) {
  const parsedUrl = new URL(url);
  let deviceSanitised = device.replaceAll("/", "-");
  console.log(parsedUrl.host);
  return `${parsedUrl.host}-${deviceSanitised}`;
}

/**
 * Validates that the inputted cookies are JSON
 *
 * @param {string} cookies
 * @returns {boolean}
 */
export function validateCookies(cookies) {
  try {
    JSON.parse(cookies);
  } catch (e) {
    return false;
  }

  return true;
}
