const { Cluster } = require("puppeteer-cluster");
const {
  addDeviceScreenshots,
  getFailingThreshold,
  updateScreenshotLoading,
} = require("./database-calls");
const { imgDiff } = require("img-diff-js");
const path = require("path");
const sharp = require("sharp");
const fsPromises = require("fs/promises");
const fs = require("fs");

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
  await page.setViewport(resolution);
  // .catch((err) => sendError("Couldn't set viewport", err, res));

  await page.setUserAgent(userAgent.toString());
  // .catch((err) => sendError("Couldn't set user agent", err, res));

  if (cookieData) {
    const parsedCookieData = JSON.parse(cookieData);
    await page.setCookie(...parsedCookieData);
  }
  // .catch((err) => sendError("Couldn't set cookies", err, res));

  await page.goto(url, { timeout: 120000 });
  // .catch((err) => sendError("Couldn't navigate to page", err, res));

  const screenshot = await page.screenshot({
    fullPage: true,
    path: `${__dirname}/../screenshots/${fileName}.png`,
  });
  // .catch((err) => sendError("Couldn't take screenshot", err, res));

  await sharp(screenshot)
    .webp({ quality: 50, effort: 6 })
    .toFile(`${__dirname}/../screenshots/${fileName}.webp`);

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
  } = screenshotData;

  const parsedUrl = new URL(baselineUrl);
  await updateScreenshotLoading(db, sitePath, parsedUrl.pathname, device, true);

  const defaultData = { cookieData, resolution, userAgent };

  const comparisonScreenshotPromise = cluster.execute({
    url: comparisonUrl,
    fileName: comparisonFileName,
    ...defaultData,
  });

  if (generateBaselines) {
    const baselineScreenshotPromise = cluster.execute({
      url: baselineUrl,
      fileName: baselineFileName,
      ...defaultData,
    });

    await Promise.all([baselineScreenshotPromise, comparisonScreenshotPromise]);
  } else {
    await comparisonScreenshotPromise;
  }

  const diffData = await imgDiff({
    actualFilename: `${__dirname}/../screenshots/${baselineFileName}.png`,
    expectedFilename: `${__dirname}/../screenshots/${comparisonFileName}.png`,
    diffFilename: `${__dirname}/../screenshots/${baselineFileName}-diff.png`,
  });

  const diffFile = await fs.readFileSync(
    `${__dirname}/../screenshots/${baselineFileName}-diff.png`
  );

  await sharp(diffFile)
    .webp({ quality: 50, effort: 6 })
    .toFile(`${__dirname}/../screenshots/${baselineFileName}-diff.webp`)
    .catch(console.log);

  const { width, height, diffCount } = diffData;
  const percentageDiff = (diffCount / (width * height)) * 100;
  const failingThreshold = await getFailingThreshold(db, sitePath);
  const failed = percentageDiff > failingThreshold;

  const screenshots = {
    baselineScreenshot: `/api/screenshots/${baselineFileName}.webp`,
    comparisonScreenshot: `/api/screenshots/${comparisonFileName}.webp`,
    diffImage: `/api/screenshots/${baselineFileName}-diff.webp`,
    failing: failed,
    loading: false,
  };

  await addDeviceScreenshots(
    db,
    sitePath,
    parsedUrl.pathname,
    screenshots,
    device
  );
  await updateScreenshotLoading(
    db,
    sitePath,
    parsedUrl.pathname,
    device,
    false
  );
}

function runComparison(req, res, cluster, db) {
  const { pages: screenshots, generateBaselines } = req.body;

  res.send('running')

  screenshots.forEach((screenshot) => {
    compareScreenshots(screenshot, generateBaselines, cluster, db);
  });
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
