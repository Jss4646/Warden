const { Cluster } = require("puppeteer-cluster");

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
      executablePath: process.env.chromeLocation || undefined,
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
  let { url, cookieData, resolution, userAgent } = screenshotData;
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
    .goto(url.toString())
    .catch((err) => sendError("Couldn't navigate to page", err, res));

  console.log(`Screenshotting Website: ${url}`);

  const screenshot = await page
    .screenshot({ fullPage: true })
    .catch((err) => sendError("Couldn't take screenshot", err, res));
  console.log(`Screenshot taken: ${url}\n`);
  await page.close();
  res.send(screenshot);
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
  console.log("body", req.body);
  cluster.queue({ screenshotData: req.body, res });
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
};
