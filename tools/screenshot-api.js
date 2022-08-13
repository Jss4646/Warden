const { Cluster } = require("puppeteer-cluster");
const {
  addDeviceScreenshots,
  getFailingThreshold,
  updateScreenshotLoading,
  getSitePages,
} = require("./database-calls");
const { imgDiff } = require("img-diff-js");
const sharp = require("sharp");
const fs = require("fs");
const logger = require("./logger");
const { broadcastData } = require("./websocket-server");

/**
 * Starts screenshot cluster which manages the screenshot queue serverside
 *
 * @returns {Promise<*>}
 */
async function initialiseCluster() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    retryLimit: 1,
    timeout: 500000,
    // monitor: true,
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
 * @param {string} url - The url of the page to be screenshotted
 * @param {String} cookieData - Cookies to be passed to the browser before loading the page
 * @param {{width: number, height: number}} resolution - The resolution of the browser
 * @param {String} userAgent - The user agent to be passed to the browser before loading the page
 * @param res - response object used by express
 *
 * @returns {Promise<void>}
 */
async function takeScreenshot({
  page,
  data: { url, cookieData, resolution, userAgent, fileName },
}) {
  logger.log("info", `Taking screenshot at ${url}`);
  logger.log(
    "debug",
    `Setting resolution to ${resolution.width}x${resolution.height}`
  );
  await page.setViewport(resolution);
  // .catch((err) => sendError("Couldn't set viewport", err, res));

  logger.log({ level: "debug", message: `Setting user agent to ${userAgent}` });
  await page.setUserAgent(userAgent.toString());
  // .catch((err) => sendError("Couldn't set user agent", err, res));

  if (cookieData) {
    logger.log("debug", `Setting cookies to: `, cookieData);
    const parsedCookieData = JSON.parse(cookieData);
    await page.setCookie(...parsedCookieData);
  }
  // .catch((err) => sendError("Couldn't set cookies", err, res));

  logger.log("debug", `Loading page at ${url}`);
  await page.goto(url, { timeout: 120000, waitUntil: "networkidle0" });
  // .catch((err) => sendError("Couldn't navigate to page", err, res));

  // logger.log("debug", "Waiting for images to load");
  // await page.evaluate(async () => {
  //   document.body.scrollIntoView(false);
  //
  //   const selectors = Array.from(document.querySelectorAll("img"));
  //   await Promise.all(
  //     selectors.map((img) => {
  //       if (img.complete) return;
  //       return new Promise((resolve, reject) => {
  //         img.addEventListener("load", resolve);
  //         img.addEventListener("error", reject);
  //       });
  //     })
  //   );
  // });

  logger.log("debug", `Taking screenshot with filename ${fileName}`);
  const screenshot = await page.screenshot({
    fullPage: true,
    path: `${__dirname}/../screenshots/${fileName}.png`,
  });
  // .catch((err) => sendError("Couldn't take screenshot", err, res));

  logger.log("debug", "Converting screenshot to webp");
  await sharp(screenshot)
    .webp({ quality: 50, effort: 6 })
    .toFile(`${__dirname}/../screenshots/${fileName}.webp`)
    .catch((err) => logger.log("error", err));

  await page.close();
  logger.log("info", `Finished taking and converting screenshot at ${url}`);
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
  const screenshot = await cluster.execute({ screenshotData: req.body });
  res.send(screenshot);
}

/**
 * The endpoint to generate and compare two screenshots
 *
 * @param screenshotData {Object}
 * @param generateBaselines {boolean}
 * @param cluster {Cluster}
 * @param db {Db}
 * @returns {Promise<void>}
 */
async function compareScreenshots(
  screenshotData,
  generateBaselines,
  cluster,
  db
) {
  const {
    baselineUrl,
    baselineFileName,
    comparisonUrl,
    comparisonFileName,
    cookieData,
    resolution,
    userAgent,
    sitePath,
    device,
    id,
  } = screenshotData;

  logger.log("info", "Starting new comparison");
  logger.log("info", `Comparing ${baselineUrl} to ${comparisonUrl}`);

  await updateScreenshotLoading(db, id, device, true);

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );

  const defaultData = { cookieData, resolution, userAgent };

  logger.log("debug", `Loading comparison screenshot at ${comparisonUrl}`);
  const comparisonScreenshotPromise = cluster.execute({
    url: comparisonUrl,
    fileName: comparisonFileName,
    ...defaultData,
  });

  if (generateBaselines) {
    logger.log("debug", `Loading baseline screenshot at ${baselineUrl}`);
    const baselineScreenshotPromise = cluster.execute({
      url: baselineUrl,
      fileName: baselineFileName,
      ...defaultData,
    });

    await Promise.all([baselineScreenshotPromise, comparisonScreenshotPromise]);
  } else {
    await comparisonScreenshotPromise;
  }

  logger.log("debug", `Running comparison`);
  const diffData = await imgDiff({
    actualFilename: `${__dirname}/../screenshots/${baselineFileName}.png`,
    expectedFilename: `${__dirname}/../screenshots/${comparisonFileName}.png`,
    diffFilename: `${__dirname}/../screenshots/${baselineFileName}-diff.png`,
  });

  logger.log("debug", "Reading diff image");
  const diffFile = await fs.readFileSync(
    `${__dirname}/../screenshots/${baselineFileName}-diff.png`
  );

  logger.log("debug", "converting diff image to webp");
  await sharp(diffFile)
    .webp({ quality: 50, effort: 6 })
    .toFile(`${__dirname}/../screenshots/${baselineFileName}-diff.webp`)
    .catch((err) => logger.log("error", err));

  const { width, height, diffCount } = diffData;
  const percentageDiff = (diffCount / (width * height)) * 100;
  logger.log("debug", `${percentageDiff}% pixels different`);
  const failingThreshold = await getFailingThreshold(db, sitePath);
  const failed = percentageDiff > failingThreshold;
  logger.log("debug", `${failed ? "Failed" : "Passed"}`);

  const screenshots = {
    baselineScreenshot: `/api/screenshots/${baselineFileName}.webp`,
    comparisonScreenshot: `/api/screenshots/${comparisonFileName}.webp`,
    diffImage: `/api/screenshots/${baselineFileName}-diff.webp`,
    failing: failed,
    loading: false,
  };

  logger.log("debug", "Adding screenshots to database");
  await addDeviceScreenshots(db, id, screenshots, device);

  logger.log("debug", "Updating screenshot loading");
  await updateScreenshotLoading(db, id, device, false);

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );

  logger.log(
    "info",
    `Finished comparing ${baselineFileName} to ${comparisonFileName}`
  );
}

function runComparison(req, res, cluster, db) {
  const { pages: screenshots, generateBaselines } = req.body;

  screenshots.forEach((screenshot) => {
    compareScreenshots(screenshot, generateBaselines, cluster, db);
  });

  res.send("running");
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
  runComparison,
};
