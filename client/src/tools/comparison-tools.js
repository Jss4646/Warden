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
 * @param baselineScreenshotData {screenshotData}
 * @param comparisonScreenshotData {screenshotData}
 * @param sitePath {string}
 * @param device {string}
 * @param generateBaselines {boolean}
 * @returns {Promise<string>}
 */
export async function generateScreenshots(
  baselineScreenshotData,
  comparisonScreenshotData,
  sitePath,
  device,
  generateBaselines
) {
  return await fetch(`${window.location.origin}/api/run-comparison`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      baselineScreenshotData,
      comparisonScreenshotData,
      sitePath,
      device,
      generateBaselines,
    }),
    // TODO cancel button
    // signal: abortSignal,
  }).then((res) => res.json());
}

/**
 * Generates comparison screenshots for a given paeg
 *
 * @param siteData {Object}
 * @param siteData.devices {Array.<string>}
 * @param siteData.url {string}
 * @param siteData.comparisonUrl {string}
 * @param siteData.sitePath {string}
 * @param siteData.pages {Object}
 * @param page {string}
 * @param addScreenshots {function}
 * @param setIsScreenshotFailing {function}
 * @param [generateBaselines] {boolean}
 */
export async function runPageComparison(
  siteData,
  page,
  addScreenshots,
  setIsScreenshotFailing,
  generateBaselines = false
) {
  const { devices, url, comparisonUrl, sitePath, pages } = siteData;

  const fullUrl = `${url}${page}`;
  const fullComparisonUrl = `${comparisonUrl}${page}`;

  for (const device of devices) {
    const currentScreenshots = pages[page].screenshots[device];
    const { height, width, userAgent } = devicesData[device];
    const screenshotData = {
      resolution: { height, width },
      userAgent,
    };

    generateBaselines =
      currentScreenshots?.baselineScreenshot === undefined || generateBaselines;

    const baselineFilename = generateBaselines
      ? createFilename(fullUrl, device)
      : currentScreenshots.baselineScreenshot.slice(17, -4);
    const comparisonFilename = createFilename(fullComparisonUrl, device);

    let baselineScreenshotData;

    if (generateBaselines) {
      baselineScreenshotData = {
        ...screenshotData,
        url: fullUrl,
        fileName: baselineFilename,
      };

      addScreenshots(new URL(fullUrl).pathname, device, {});
    } else {
      baselineScreenshotData = {
        fileName: baselineFilename,
        url: fullUrl,
      };

      addScreenshots(new URL(fullUrl).pathname, device, {
        baselineScreenshot: `/api/screenshots/${baselineFilename}.png`,
      });
    }

    const comparisonScreenshotData = {
      ...screenshotData,
      url: fullComparisonUrl,
      fileName: comparisonFilename,
    };

    generateScreenshots(
      baselineScreenshotData,
      comparisonScreenshotData,
      sitePath,
      device,
      generateBaselines
    ).then((screenshotFailed) => {
      addScreenshots(page, device, {
        baselineScreenshot: `/api/screenshots/${baselineFilename}.png`,
        comparisonScreenshot: `/api/screenshots/${comparisonFilename}.png`,
        diffImage: `/api/screenshots/${baselineFilename}-diff.png`,
      });

      console.log("Screenshot failed: ", screenshotFailed);
      setIsScreenshotFailing(page, device, screenshotFailed);
    });
  }
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
