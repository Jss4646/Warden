const { Cluster } = require("puppeteer-cluster");
const { createDiffImage } = require("./comparison.js");
const { addDeviceScreenshots } = require("./db-endpoints");

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
  url = new URL(url);
  console.log(`Setting up page for ${url}`);
  console.log(url, cookieData, resolution, userAgent, fileName);

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
    .goto(url.toString(), { timeout: 120000 })
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
 * @param client {MongoClient}
 * @returns {Promise<void>}
 */
async function compareScreenshots(req, res, cluster, client) {
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

  await createDiffImage(
    baselineScreenshotData.fileName,
    comparisonScreenshotData.fileName
  );

  const parsedUrl = new URL(baselineScreenshotData.url);
  const screenshots = {
    baselineScreenshot: `/api/screenshots/${baselineScreenshotData.fileName}.png`,
    comparisonScreenshot: `/api/screenshots/${comparisonScreenshotData.fileName}.png`,
    diffImage: `/api/screenshots/${baselineScreenshotData.fileName}-diff.png`,
  };

  await addDeviceScreenshots(
    client,
    sitePath,
    parsedUrl.pathname,
    screenshots,
    device
  );

  res.send("Images created");
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
