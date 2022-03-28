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
  }).then((res) => res.text());
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
 * @param [generateBaselines] {boolean}
 */
export function runPageComparison(
  siteData,
  page,
  addScreenshots,
  generateBaselines = false
) {
  const { devices, url, comparisonUrl, sitePath, pages } = siteData;

  const fullUrl = `${url}${page}`;
  const fullComparisonUrl = `${comparisonUrl}${page}`;

  for (const device of devices) {
    console.log(pages[page].screenshots[device]);
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
    } else {
      baselineScreenshotData = {
        fileName: baselineFilename,
        url: fullUrl,
      };
    }

    const comparisonScreenshotData = {
      ...screenshotData,
      url: fullComparisonUrl,
      fileName: comparisonFilename,
    };

    console.log("Baseline", baselineScreenshotData);
    console.log("Comparison", comparisonScreenshotData);

    addScreenshots(new URL(fullUrl).pathname, device, {});

    generateScreenshots(
      baselineScreenshotData,
      comparisonScreenshotData,
      sitePath,
      device,
      generateBaselines
    ).then((percentageDiff) => {
      console.log(percentageDiff);
      addScreenshots(new URL(fullUrl).pathname, device, {
        baselineScreenshot: `/api/screenshots/${baselineFilename}.png`,
        comparisonScreenshot: `/api/screenshots/${comparisonFilename}.png`,
        diffImage: `/api/screenshots/${baselineFilename}-diff.png`,
      });
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
