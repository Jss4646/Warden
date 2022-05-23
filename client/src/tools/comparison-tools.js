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
 * @param generateBaselines {boolean}
 * @returns {Promise<string>}
 */
export function generateScreenshots(pagesRequestData, generateBaselines) {
  fetch(`${window.location.origin}/api/run-comparison`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pages: pagesRequestData,
      generateBaselines,
    }),
    // TODO cancel button
    // signal: abortSignal,
  });
}

/**
 * Generates comparison screenshots for a given paeg
 *
 * @param siteData {Object}
 * @param siteData.devices {Array.<string>}
 * @param siteData.url {string}
 * @param siteData.comparisonUrl {string}
 * @param siteData.sitePath {string}
 * @param siteData.screenshotPages {Object}
 * @param page {Array[string]}
 * @param addScreenshots {function}
 * @param setIsScreenshotFailing {function}
 * @param [generateBaselines] {boolean}
 */
export function runPageComparison(
  siteData,
  page,
  addScreenshots,
  setIsScreenshotFailing,
  generateBaselines = false
) {
  const pagesRequestData = [];

  const { devices, url, comparisonUrl, sitePath, pages } = siteData;

  const fullUrl = `${url}${page}`;
  const fullComparisonUrl = `${comparisonUrl}${page}`;

  for (const device of devices) {
    const currentScreenshots = pages[page].screenshots[device];
    const { height, width, userAgent } = devicesData[device];

    generateBaselines =
      currentScreenshots?.baselineScreenshot === undefined || generateBaselines;

    const baselineFileName = generateBaselines
      ? createFilename(fullUrl, device)
      : currentScreenshots.baselineScreenshot.slice(17, -4);
    const comparisonFileName = createFilename(fullComparisonUrl, device);

    let screenshotData = {
      resolution: { height, width },
      userAgent,
      comparisonUrl: fullComparisonUrl,
      comparisonFileName,
      baselineUrl: fullUrl,
      baselineFileName,
      sitePath,
      device,
    };

    console.log(screenshotData);

    if (generateBaselines) {
      addScreenshots(new URL(fullUrl).pathname, device, {});
    } else {
      addScreenshots(new URL(fullUrl).pathname, device, {
        baselineScreenshot: `/api/screenshots/${baselineFileName}.png`,
      });
    }

    pagesRequestData.push(screenshotData);
  }

  generateScreenshots(pagesRequestData, generateBaselines);
}

/**
 * Creates the file name for the screenshot
 *
 * @param url {string}
 * @param device {string}
 * @returns {string}
 */
export function createFilename(url, device) {
  const date = new Date();
  const parsedUrl = new URL(url);

  let path = parsedUrl.pathname === "/" ? "" : `${parsedUrl.pathname}-`;
  path = path.replaceAll("/", "-");

  let deviceSanitised = device.replaceAll("/", "-");

  const fileNameDate = `${date.getMilliseconds()}-${date.getSeconds()}-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}-${deviceSanitised}`;
  return `${parsedUrl.host}-${path}${fileNameDate}`;
}
