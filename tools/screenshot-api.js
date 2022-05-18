const { Cluster } = require("puppeteer-cluster");
const {
  addDeviceScreenshots,
  getFailingThreshold,
  addFailingScreenshot,
} = require("./db-endpoints");
const { imgDiff } = require("img-diff-js");

/**
 * Starts screenshot cluster which manages the screenshot queue serverside
 *
 * @returns {Promise<*>}
 */
async function initialiseCluster() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    retryLimit: 1,
    timeout: 500000,
    puppeteerOptions: {
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        `${process.env.singleProcess || null}`,
      ],
    },
  });

  await cluster.task(takeScreenshot);
  return cluster;
}

/**
 * Sets up a headless browser to take a screenshot of a given website
 *
 * @param page - Puppeteer cluster page
 * @param {Object} screenshotData - Data used to setup page for screenshot
 * @param {string} screenshotData.url - The url of the page to be screenshotted
 * @param {String} screenshotData.cookieData - Cookies to be passed to the browser before loading the page
 * @param {{width: number, height: number}} screenshotData.resolution - The resolution of the browser
 * @param {String} screenshotData.userAgent - The user agent to be passed to the browser before loading the page
 * @param res - response object used by express
 *
 * @returns {Promise<void>}
 */
async function takeScreenshot({ page, data: { screenshotData, res } }) {
  let { url, cookieData, resolution, userAgent, fileName } = screenshotData;
  console.log(`Setting up page for ${url}`);

  await page
    .setViewport(resolution)
    .catch((err) => sendError("Couldn't set viewport", err, res));

  await page
    .setUserAgent(userAgent.toString())
    .catch((err) => sendError("Couldn't set user agent", err, res));

  if (cookieData)
    await page
      .setCookie(...cookieData)
      .catch((err) => sendError("Couldn't set cookies", err, res));

  await page
    .goto(url, { timeout: 120000 })
    .catch((err) => sendError("Couldn't navigate to page", err, res));

  console.log(`Screenshotting Website: ${url}`);

  const screenshot = await page
    .screenshot({
      fullPage: true,
      path: `${__dirname}/../screenshots/${fileName}.png`,
    })
    .catch((err) => sendError("Couldn't take screenshot", err, res));
  console.log(`Screenshot taken: ${url}\n`);
  await page.close();
  return screenshot;
}

/**
 * The /take-screenshot endpoint function
 * Adds a screenshot to the queue
 *
 * @param req
 * @param res
 * @param cluster
 * @returns {Promise<void>}
 */
async function generateScreenshot(req, res, cluster) {
  const screenshot = await cluster.execute({ screenshotData: req.body, res });
  res.send(screenshot);
}

/**
 * The endpoint to generate and compare two screenshots
 *
 * @param req {Request}
 * @param res {Response}
 * @param cluster {Cluster}
 * @param db {Db}
 * @returns {Promise<void>}
 */
async function compareScreenshots(req, res, cluster, db) {
  const {
    baselineScreenshotData,
    comparisonScreenshotData,
    sitePath,
    device,
    generateBaselines,
  } = req.body;

  console.log("Starting to take screenshot");
  const comparisonScreenshotPromise = cluster.execute({
    screenshotData: comparisonScreenshotData,
    res,
  });

  if (generateBaselines) {
    const baselineScreenshotPromise = cluster.execute({
      screenshotData: baselineScreenshotData,
      res,
    });

    await Promise.all([baselineScreenshotPromise, comparisonScreenshotPromise]);
  } else {
    await comparisonScreenshotPromise;
  }

  console.log("Finished taking screenshots");

  const diffData = await imgDiff({
    actualFilename: `${__dirname}/../screenshots/${baselineScreenshotData.fileName}.png`,
    expectedFilename: `${__dirname}/../screenshots/${comparisonScreenshotData.fileName}.png`,
    diffFilename: `${__dirname}/../screenshots/${baselineScreenshotData.fileName}-diff.png`,
  });

  const { width, height, diffCount } = diffData;
  const percentageDiff = (diffCount / (width * height)) * 100;
  const failingThreshold = await getFailingThreshold(db, sitePath);
  const failed = percentageDiff > failingThreshold;
  console.log("Failing threshold", failingThreshold);

  const parsedUrl = new URL(baselineScreenshotData.url);
  const screenshots = {
    baselineScreenshot: `/api/screenshots/${baselineScreenshotData.fileName}.png`,
    comparisonScreenshot: `/api/screenshots/${comparisonScreenshotData.fileName}.png`,
    diffImage: `/api/screenshots/${baselineScreenshotData.fileName}-diff.png`,
    failing: false,
  };

  await addDeviceScreenshots(
    db,
    sitePath,
    parsedUrl.pathname,
    screenshots,
    device
  );

  console.log(`Did screenshot fail ${failed}`);
  if (failed) {
    const pathname = new URL(baselineScreenshotData.url).pathname;
    await addFailingScreenshot(db, sitePath, pathname, device);
  }

  res.send(failed);
}

/**
 * Sends an error to the client with a given error message
 *
 * @param {String} errMessage - error message you want to send to the client
 * @param {Object} err
 * @param res
 */
function sendError(errMessage, err, res) {
  console.error(err);
  res.status(500);
  res.send(errMessage);
}

module.exports = {
  initialiseCluster,
  generateScreenshot,
  compareScreenshots,
};
