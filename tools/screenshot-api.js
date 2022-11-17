const { Cluster } = require("puppeteer-cluster");
const {
  addDeviceScreenshots,
  updateScreenshotLoading,
  getSitePages,
} = require("./database-calls");
const { imgDiff } = require("img-diff-js");
const sharp = require("sharp");
const fs = require("fs");
const logger = require("./logger");
const { broadcastData } = require("./websocket-server");
const { ObjectId } = require("mongodb");

/**
 *
 *
 * @param req
 * @param res
 * @param cluster
 * @param db
 * @param abortController
 * @returns {Promise<void>}
 */
async function runComparison(req, res, cluster, db, abortController) {
  const { pages: screenshots, siteRequestData, generateBaselines } = req.body;

  const { devices, sitePath } = siteRequestData;
  await removeRedundantScreenshots(db, sitePath, devices);
  await setScreenshotsLoading(screenshots, sitePath, db);

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );

  for (let [index, screenshot] of screenshots.entries()) {
    logger.log("debug", "Comparing screenshots: ", screenshot);
    screenshot = { ...screenshot, ...siteRequestData };

    compareScreenshots(
      screenshot,
      generateBaselines,
      cluster,
      db,
      abortController
    ).catch((err) => logger.log("error", `${err}`));

    if ((index + 1) % 1000 === 0) {
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  res.send("running");
}

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
      IgnoreHTTPSErrors: true,
      args: [
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
        `${process.env.singleProcess || null}`,
      ],
    },
  });

  await cluster.task(takeScreenshot).catch((err) => logger.log(err));
  return cluster;
}

/**
 * @typedef {Object} screenshotData
 * @property {string} url - The url of the page to be screenshotted
 * @property {String} cookieData - Cookies to be passed to the browser before loading the page
 * @property {{width: number, height: number}} resolution - The resolution of the browser
 * @property {String} userAgent - The user agent to be passed to the browser before loading the page
 * @property {Number} scale - The scale of the browser page
 * @property {Boolean} touch - Whether the browser should be in touch mode
 * @property {String} filePath - The path to save the screenshot to
 * @property {{username: String, password: String}} siteLogin - The username and password to be passed to the browser before loading the page
 * @property {String} path - path to folder to save screenshot to
 * @property {String} injectedJS - JS to be injected into the page before taking the screenshot
 * @property {Boolean} scrollPage - Whether to scroll the page before taking the screenshot
 */

/**
 * Sets up a headless browser to take a screenshot of a given website
 *
 * @param page - Puppeteer cluster page
 * @param {screenshotData} data - screenshot data
 * @returns {Promise<void>}
 */
async function takeScreenshot({
  page,
  data: {
    url,
    cookieData,
    resolution,
    userAgent,
    scale,
    touch,
    filePath,
    siteLogin,
    path,
    injectedJS,
    scrollPage,
    pageTimeout,
  },
}) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const screenshotIdentifier = `${url}:${resolution.width}x${resolution.height}`;
  logger.log("info", `${screenshotIdentifier}: Taking screenshot at ${url}`);
  logger.log(
    "debug",
    `${screenshotIdentifier}: Setting resolution to ${resolution.width}x${resolution.height}`
  );
  await page
    .setViewport({
      ...resolution,
      hasTouch: touch,
      deviceScaleFactor: scale,
    })
    .catch((err) => logger.log("error", screenshotIdentifier, err));

  if (siteLogin.username !== "" && siteLogin.password !== "") {
    logger.log("debug", "Setting site login to: ", siteLogin);
    await page.authenticate(siteLogin);
  }

  logger.log({
    level: "debug",
    message: `${screenshotIdentifier}: Setting user agent to ${userAgent}`,
  });
  await page
    .setUserAgent(userAgent.toString())
    .catch((err) => logger.log("error", screenshotIdentifier, err));

  if (cookieData) {
    const parsedCookieData = JSON.parse(cookieData);
    logger.log(
      "debug",
      `${screenshotIdentifier}: Setting cookies to: `,
      parsedCookieData
    );
    await page
      .setCookie(...parsedCookieData)
      .catch((err) => logger.log("error", screenshotIdentifier, err));
  }

  logger.log("debug", `${screenshotIdentifier}: Loading page at ${url}`);
  await page
    .goto(url, { timeout: 60000, waitUntil: "networkidle0" })
    .catch((err) => logger.log("error", screenshotIdentifier, err));

  if (injectedJS) {
    logger.log("debug", `${screenshotIdentifier}: Injecting JS`);
    await page
      .evaluate(injectedJS)
      .catch((err) => logger.log("error", screenshotIdentifier, err));
  }

  if (scrollPage) {
    logger.log("debug", `${screenshotIdentifier}: Scrolling page`);
    await page.evaluate(async () => {
      for (let i = 0; i < document.body.scrollHeight; i = i + 100) {
        window.scrollTo(0, i);
        await new Promise((res) => setTimeout(res, 20));
      }

      window.scrollTo(0, 0);
    });
  }

  if (pageTimeout) {
    logger.log(
      "debug",
      `${screenshotIdentifier}: Waiting for page timeout for ${pageTimeout}ms`
    );
    await page.waitForTimeout(pageTimeout);
  }

  await page.waitForNetworkIdle();

  logger.log(
    "debug",
    `${screenshotIdentifier}: Taking screenshot with filepath ${filePath}`
  );
  const screenshot = await page
    .screenshot({
      fullPage: true,
      path: filePath,
    })
    .catch((err) => {
      logger.log("error", screenshotIdentifier, err);
      return false;
    });

  if (!screenshot) {
    logger.log("error", `${screenshotIdentifier}: No screenshot taken`);
    return;
  }

  logger.log("debug", `${screenshotIdentifier}: Converting screenshot to webp`);
  convertToWebp(screenshot, filePath, screenshotIdentifier).catch((err) =>
    logger.log("error", screenshotIdentifier, err)
  );

  await page.close();
  logger.log(
    "info",
    `${screenshotIdentifier}: Finished taking and converting screenshot at ${url}`
  );
  return screenshot;
}

/**
 * The endpoint to generate and compare two screenshots
 *
 * @param screenshotData {Object}
 * @param generateBaselines {boolean}
 * @param cluster {Cluster}
 * @param db {Db}
 * @param abortController {AbortController}
 * @returns {Promise<void>}
 */
async function compareScreenshots(
  screenshotData,
  generateBaselines,
  cluster,
  db,
  abortController
) {
  const {
    baselineUrl,
    baselineFileName,
    comparisonUrl,
    comparisonFileName,
    cookieData,
    resolution,
    userAgent,
    scale,
    touch,
    sitePath,
    device,
    siteLogin,
    failingThreshold,
    injectedJS,
    id,
    scrollPage,
    pageTimeout,
  } = screenshotData;

  const screenshotIdentifier = `${baselineUrl}:${device}`;

  logger.log("info", `${screenshotIdentifier}: Starting new comparison`);
  logger.log(
    "info",
    `${screenshotIdentifier}: Comparing ${baselineUrl} to ${comparisonUrl}`
  );

  let page = screenshotData.page.replaceAll("/", "-");
  if (page !== "-") {
    page = page.slice(1, page.length - 1);
  }

  const path = `${__dirname}/../screenshots/${sitePath}/${page}`;
  const comparisonFilePath = `${path}/${comparisonFileName}.png`;
  const baselineFilePath = `${path}/${baselineFileName}.png`;

  const defaultData = {
    cookieData,
    resolution,
    userAgent,
    scale,
    touch,
    siteLogin,
    path,
    injectedJS,
    scrollPage,
    pageTimeout,
  };

  const screenshotDatas = {
    comparison: {
      ...defaultData,
      url: comparisonUrl,
      filePath: comparisonFilePath,
    },
    baseline: {
      ...defaultData,
      url: baselineUrl,
      filePath: baselineFilePath,
    },
  };
  await generateScreenshots(
    screenshotIdentifier,
    cluster,
    screenshotDatas,
    generateBaselines
  );

  const diffFilePath = `${path}/${baselineFileName}-diff.png`;
  const filePaths = {
    baseline: baselineFilePath,
    comparison: comparisonFilePath,
  };
  const failed = await generateDiffImg(
    diffFilePath,
    filePaths,
    failingThreshold,
    screenshotIdentifier
  );

  const screenshots = {
    baselineScreenshot: `/screenshots/${sitePath}/${page}/${baselineFileName}.webp`,
    comparisonScreenshot: `/screenshots/${sitePath}/${page}/${comparisonFileName}.webp`,
    diffImage: `/screenshots/${sitePath}/${page}/${baselineFileName}-diff.webp`,
    failing: failed,
    loading: false,
  };

  logger.log(
    "debug",
    `${screenshotIdentifier}: Adding screenshots to database`
  );
  await addDeviceScreenshots(db, id, screenshots, device);

  logger.log(
    "debug",
    `${screenshotIdentifier}: Updating screenshot loading to false`
  );
  await updateScreenshotLoading(db, id, device, false);

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );

  logger.log(
    "info",
    `${screenshotIdentifier}: Finished comparing ${baselineFileName} to ${comparisonFileName}`
  );
}

/**
 * Generates the screenshots for the comparison
 *
 * @param {String} screenshotIdentifier - The identifier for the screenshot used in logging
 * @param {Cluster} cluster
 * @param {{baseline: screenshotData, comparison: screenshotData}} screenshotData - The data for the comparison
 * @param {Boolean} generateBaselines - Whether to generate the baseline screenshots
 * @returns {Promise<void>}
 */
async function generateScreenshots(
  screenshotIdentifier,
  cluster,
  screenshotData,
  generateBaselines
) {
  const baselineScreenshotExists = fs.existsSync(
    screenshotData.baseline.filePath
  );
  if (!baselineScreenshotExists) {
    generateBaselines = true;
  }

  logger.log(
    "debug",
    `${screenshotIdentifier}: Loading comparison screenshot at ${screenshotData.comparison.url}`
  );
  const comparisonScreenshotPromise = cluster
    .execute(screenshotData.comparison)
    .catch((err) => logger.log("error", screenshotIdentifier, err));

  if (generateBaselines) {
    logger.log(
      "debug",
      `${screenshotIdentifier}: Loading baseline screenshot at ${screenshotData.baseline.url}`
    );
    const baselineScreenshotPromise = cluster
      .execute(screenshotData.baseline)
      .catch((err) => logger.log("error", screenshotIdentifier, err));

    await Promise.all([baselineScreenshotPromise, comparisonScreenshotPromise]);
  } else {
    await comparisonScreenshotPromise.catch((err) =>
      logger.log("error", screenshotIdentifier, err)
    );
  }
}

/**
 * Generates the diff image between two screenshots outputting whether they failed
 *
 * @param diffFilePath - The path to the diff image
 * @param {{baseline: String, comparison: String}} filePaths - The paths to the baseline and comparison images
 * @param {Number} failingThreshold - The threshold at which the diff image is considered to have failed
 * @param {String} screenshotIdentifier - The identifier of the screenshot for logging
 * @returns {Promise<boolean>} - Whether the diff image failed
 */
async function generateDiffImg(
  diffFilePath,
  filePaths,
  failingThreshold,
  screenshotIdentifier
) {
  const { baseline, comparison } = filePaths;
  logger.log("debug", `${screenshotIdentifier}: Running comparison`);
  const diffData = await imgDiff({
    actualFilename: baseline,
    expectedFilename: comparison,
    diffFilename: diffFilePath,
  }).catch((err) => logger.log("error", screenshotIdentifier, err));

  logger.log("debug", `${screenshotIdentifier}: Reading diff image`);
  const diffFile = await fs.readFileSync(diffFilePath);

  logger.log("debug", `${screenshotIdentifier}: converting diff image to webp`);
  convertToWebp(diffFile, diffFilePath, screenshotIdentifier).catch((err) =>
    logger.log("error", screenshotIdentifier, err)
  );

  const { width, height, diffCount } = diffData;
  const percentageDiff = (diffCount / (width * height)) * 100;
  logger.log("debug", `${percentageDiff}% pixels different`);
  const failed = percentageDiff > failingThreshold;
  logger.log(
    "debug",
    `${screenshotIdentifier}: ${
      failed ? "Failed" : "Passed"
    } at threshold of ${failingThreshold}%`
  );
  return failed;
}

/**
 * Converts an image to webp
 *
 * @param image
 * @param filePath
 * @param screenshotIdentifier
 * @returns {Promise<T>}
 */
function convertToWebp(image, filePath, screenshotIdentifier) {
  return sharp(image)
    .metadata()
    .then(({ height }) => {
      const sharpImage = sharp(image);

      if (height > 16_383) {
        sharpImage.resize({ height: 16_383 });
      }

      sharpImage
        .toFormat("webp", { quality: 50, effort: 6 })
        .toFile(filePath.replace(".png", ".webp"))
        .catch((err) => logger.log("error", screenshotIdentifier, err));
    });
}

/**
 * Sets all screenshots that are being taken to loading
 *
 * @param {screenshotData} screenshots
 * @param {String} sitePath
 * @param db
 * @returns {Promise<void>}
 */
async function setScreenshotsLoading(screenshots, sitePath, db) {
  logger.log("debug", "Setting screenshots to loading");
  await new Promise((res) => {
    for (let screenshot of screenshots) {
      db.collection("pages").updateOne(
        { _id: ObjectId(screenshot.id) },
        { $set: { [`screenshots.${screenshot.device}.loading`]: true } }
      );

      db.collection("pages").updateOne(
        { _id: ObjectId(screenshot.id) },
        { $set: { [`screenshots.${screenshot.device}.failing`]: false } }
      );
    }
    res();
  });

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );
  logger.log("debug", "Finished setting screenshots to loading");
}

/**
 * Removes all screenshots from devices that aren't selected
 *
 * @param db
 * @param {String} sitePath - The path of the site
 * @param {Array[String]} devices - The devices to keep
 * @returns {Promise<void>}
 */
async function removeRedundantScreenshots(db, sitePath, devices) {
  const pages = await db
    .collection("pages")
    .find({ sitePath, screenshots: { $ne: {} } })
    .toArray();

  if (pages.length === 0) {
    return;
  }

  for (const page of Object.values(pages)) {
    for (const device of Object.keys(page.screenshots)) {
      if (!devices.includes(device)) {
        delete page.screenshots[device];
      }
    }
  }

  await db
    .collection("pages")
    .deleteMany({ sitePath, screenshots: { $ne: {} } });
  await db.collection("pages").insertMany(pages);
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
