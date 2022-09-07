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
const { ObjectId } = require("mongodb");

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

  await cluster.task(await takeScreenshot).catch((err) => logger.log(err));
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
  },
}) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

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
  convertToWebp(screenshot, filePath, screenshotIdentifier);

  await page.close();
  logger.log(
    "info",
    `${screenshotIdentifier}: Finished taking and converting screenshot at ${url}`
  );
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
    id,
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
  };

  logger.log(
    "debug",
    `${screenshotIdentifier}: Loading comparison screenshot at ${comparisonUrl}`
  );
  const comparisonScreenshotPromise = cluster
    .execute({
      url: comparisonUrl,
      filePath: comparisonFilePath,
      ...defaultData,
    })
    .catch((err) => logger.log("error", screenshotIdentifier, err));

  const baselineScreenshotExists = fs.existsSync(baselineFilePath);
  if (!baselineScreenshotExists) {
    generateBaselines = true;
  }

  if (generateBaselines) {
    logger.log(
      "debug",
      `${screenshotIdentifier}: Loading baseline screenshot at ${baselineUrl}`
    );
    const baselineScreenshotPromise = cluster
      .execute({
        url: baselineUrl,
        filePath: baselineFilePath,
        ...defaultData,
      })
      .catch((err) => logger.log("error", screenshotIdentifier, err));

    await Promise.all([baselineScreenshotPromise, comparisonScreenshotPromise]);
  } else {
    await comparisonScreenshotPromise.catch((err) =>
      logger.log("error", screenshotIdentifier, err)
    );
  }

  const diffFilename = `${path}/${baselineFileName}-diff.png`;

  logger.log("debug", `${screenshotIdentifier}: Running comparison`);
  const diffData = await imgDiff({
    actualFilename: baselineFilePath,
    expectedFilename: comparisonFilePath,
    diffFilename,
  }).catch((err) => logger.log("error", screenshotIdentifier, err));

  logger.log("debug", `${screenshotIdentifier}: Reading diff image`);
  const diffFile = await fs.readFileSync(diffFilename);

  logger.log("debug", `${screenshotIdentifier}: converting diff image to webp`);
  convertToWebp(diffFile, diffFilename, screenshotIdentifier);

  const { width, height, diffCount } = diffData;
  const percentageDiff = (diffCount / (width * height)) * 100;
  logger.log("debug", `${percentageDiff}% pixels different`);
  const failingThreshold = await getFailingThreshold(db, sitePath);
  const failed = percentageDiff > failingThreshold;
  logger.log(
    "debug",
    `${screenshotIdentifier}: ${
      failed ? "Failed" : "Passed"
    } at threshold of ${failingThreshold}%`
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

  logger.log("debug", `${screenshotIdentifier}: Updating screenshot loading`);
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

async function setScreenshotsLoading(screenshots, db) {
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

  const sitePath = screenshots[0].sitePath;
  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );
}

//remove screenshots that do not contain the device
async function removeScreenshots(db, sitePath, devices) {
  const pages = await db.collection("pages").find({ sitePath }).toArray();

  if (!pages) {
    return;
  }

  for (const page of Object.values(pages)) {
    for (const device of Object.keys(page.screenshots)) {
      if (!devices.includes(page.screenshots[device].device)) {
        delete page.screenshots[device];
      }
    }
  }

  await db.collection("pages").deleteMany({ sitePath });
  await db.collection("pages").insertMany(pages);
}
async function runComparison(req, res, cluster, db, abortController) {
  const { pages: screenshots, siteRequestData, generateBaselines } = req.body;

  const { devices, sitePath } = siteRequestData;
  await removeScreenshots(db, sitePath, devices);
  await setScreenshotsLoading(screenshots, db);

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
    ).catch((err) => logger.log("error", err));

    if ((index + 1) % 1000 === 0) {
      await new Promise((res) => setTimeout(res, 500));
    }
  }

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
