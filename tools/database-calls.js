const { crawlSitemap } = require("./crawl-url");
const { broadcastData } = require("./websocket-server");
const { ObjectId } = require("mongodb");
const logger = require("./logger");

/**
 * Endpoint to add a site to the database
 *
 * Example body
 * {
 *       siteName {String},
 *       url {String},
 *       comparisonUrl {String},
 *       sitePath {String},
 *       devices {Array<String>},
 *       failingPercentage {Number},
 *  }
 *
 *  pages format covered more under the addPage endpoint
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function addSite(db, req, res) {
  const { siteName, url, comparisonUrl, sitePath, devices, failingPercentage } =
    req.body;

  const site = {
    siteName,
    url,
    comparisonUrl,
    sitePath,
    devices,
    failingPercentage,
  };

  const page = {
    sitePath,
    pagePath: "/",
    url,
    screenshots: {},
    failing: false,
  };

  const { insertedId } = await db.collection("pages").insertOne(page);
  await db.collection("sites").insertOne(site);

  res.send(insertedId);
}

async function getSitePages(sitePath, db) {
  let pages = await db.collection("pages").find({ sitePath }).toArray();

  pages = pages.reduce((acc, page) => {
    acc[page.pagePath] = page;
    return acc;
  }, {});

  return pages;
}

/**
 * Endpoint to retrieve site data from db
 *
 * Example body
 * {
 *     url {String},
 * }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function getSite(db, req, res) {
  const site = await db
    .collection("sites")
    .findOne({ sitePath: req.body.sitePath });

  if (!site) {
    res.status(500);
    res.send("Site not found");
    return;
  }

  site.pages = await getSitePages(site.sitePath, db);
  res.send(site);
}

/**
 * Retrieves all sites from db
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function getAllSites(db, req, res) {
  logger.log("info", "Getting all sites");
  const results = await db.collection("sites").find().toArray();

  logger.log("debug", `Found ${results.length} sites`);

  for (const site of results) {
    site.pages = await getSitePages(site.sitePath, db);
  }

  if (!results) {
    res.status(500);
    res.send("No sites found");
  }

  res.send(results);
  logger.log("info", "Sent all sites");
}

/**
 * Deletes a site from the db
 *
 * Example body
 * {
 *     sitePath {String}
 * }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function deleteSite(db, req, res) {
  await db
    .collection("sites")
    .deleteOne({ sitePath: req.body.sitePath })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });

  res.send("Site deleted");
}

/**
 * Adds a page to a site in the db
 *
 * {
 *       sitePath {String},
 *       pagePath: {String},
 *       url {String},
 *       screenshots {Object} - should be an empty object as this is filled by program
 *       failing {Boolean}
 *  }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function addSitePage(db, req, res) {
  const { sitePath, pagePath, url, screenshots, failing } = req.body;

  const page = {
    sitePath,
    pagePath,
    url,
    screenshots,
    failing,
  };

  const { insertedId } = await db.collection("pages").insertOne(page);
  res.send(insertedId);
}

/**
 * deletes a page from a site in the db
 *
 * {
 *    pageId {String},
 * }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function deleteSitePage(db, req, res) {
  const { pageId } = req.body;
  await db.collection("pages").deleteOne({ _id: ObjectId(pageId) });
  res.send("Page deleted");
}

/**
 * Crawls the sitemap of a site and add the result to the sites pages list
 *
 * {
 *     sitePath {String},
 *     url {String},
 * }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function fillSitePages(db, req, res) {
  const results = await crawlSitemap(req.body.url, res);

  if (!results) {
    res.send("No pages found");
    return;
  }

  const urls = results.sites;
  urls.sort();

  urls.forEach((url) => {
    url = new URL(url);
    const page = {
      sitePath: req.body.sitePath,
      pagePath: url.pathname,
      url: url.href,
      screenshots: {},
      failing: false,
    };
    db.collection("pages").insertOne(page);
  });

  broadcastData(
    "UPDATE_SCREENSHOTS",
    getSitePages(req.body.sitePath, db),
    req.body.sitePath
  );

  res.send(urls);
}

/**
 * Deletes all pages from a site in the db
 *
 * Example body
 * {
 *     sitePath {String},
 * }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function deleteAllSitePages(db, req, res) {
  await db
    .collection("pages")
    .deleteMany({ sitePath: req.body.sitePath, pagePath: { $ne: "/" } });

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(req.body.sitePath, db),
    req.body.sitePath
  );
  res.send("Deleted pages");
}

/**
 * Slightly different as this is called in a different screenshot endpoint to add a screenshot to the db
 *
 * @param db {Db}
 * @param pageId {String}
 * @param screenshotUrls {Object}
 * @param screenshotUrls.baselineScreenshot {string}
 * @param screenshotUrls.comparisonScreenshot {string}
 * @param screenshotUrls.diffImage {string}
 * @param device {String}
 */
async function addDeviceScreenshots(db, pageId, screenshotUrls, device) {
  await db
    .collection("pages")
    .updateOne(
      { _id: ObjectId(pageId) },
      {
        $set: {
          [`screenshots.${device}`]: screenshotUrls,
        },
      }
    )
    .catch((err) => {
      logger.log("error", err);
    });
}

/**
 * Updates the loading state of a screenshot in the db
 *
 * @param db {Db}
 * @param id {String} - the id of the page in the db
 * @param device {String} - the device the screenshot is for
 * @param loading {Boolean} - the loading state of the screenshot
 * @returns {Promise<void>}
 */
async function updateScreenshotLoading(db, id, device, loading) {
  if (loading) {
    await db
      .collection("pages")
      .updateOne({ _id: ObjectId(id) }, { $set: { failing: false } });
  }

  await db
    .collection("pages")
    .updateOne(
      { _id: ObjectId(id) },
      { $set: { [`screenshots.${device}.loading`]: loading } }
    );
}

/**
 * Gets the failing threshold for a site
 *
 * @param db {Db}
 * @param sitePath {String}
 * @returns {Promise<number|*>}
 */
async function getFailingThreshold(db, sitePath) {
  const site = await db.collection("sites").findOne({ sitePath });
  return site.failingPercentage;
}

/**
 * Updates the baseline url of a site
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 * @returns {Promise<void>}
 */
async function updateBaselineUrl(db, req, res) {
  const { url, sitePath } = req.body;

  await db.collection("sites").updateOne({ sitePath }, { $set: { url } });
  res.send(true);
}

/**
 * Updates the comparison url of a site
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 * @returns {Promise<void>}
 */
async function updateComparisonUrl(db, req, res) {
  const { url, sitePath } = req.body;

  await db
    .collection("sites")
    .updateOne({ sitePath }, { $set: { comparisonUrl: url } });
  res.send(true);
}

/**
 * Aborts all running screenshots
 *
 * @param db {Db}
 * @returns {Promise<void>}
 */
async function abortRunningScreenshots(db) {
  logger.log("info", "Aborting all running screenshots");
  const pages = await db.collection("pages").find().toArray();

  for (let page of pages) {
    for (let device in page.screenshots) {
      await db
        .collection("pages")
        .updateOne(
          { _id: ObjectId(page._id) },
          { $set: { [`screenshots.${device}.loading`]: false } }
        );
    }
  }

  logger.log("info", "Finished aborting all running screenshots");
}

module.exports = {
  addSite,
  getSite,
  getAllSites,
  deleteSite,
  addSitePage,
  deleteSitePage,
  fillSitePages,
  deleteAllSitePages,
  addDeviceScreenshots,
  getFailingThreshold,
  updateBaselineUrl,
  updateComparisonUrl,
  updateScreenshotLoading,
  abortRunningScreenshots,
  getSitePages,
};
