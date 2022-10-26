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
    trimPages: true,
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

/**
 * Gets all pages for a site
 *
 * @param {String} sitePath - The site path to get pages for
 * @param db
 * @returns {Promise<*>}
 */
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
  const results = [];
  const sites = await db.collection("sites").find().toArray();

  logger.log("debug", `Found ${sites.length} sites`);

  for (const site of sites) {
    const pages = await getSitePages(site.sitePath, db);

    let passing = 0;
    let failing = 0;
    let loading = 0;

    for (const page of Object.values(pages)) {
      page.screenshots = Object.values(page.screenshots);
      for (const screenshot of page.screenshots) {
        if (screenshot.loading) {
          loading++;
          continue;
        }

        if (screenshot.failing) {
          failing++;
          continue;
        }

        if (!screenshot.baselineScreenshot) {
          continue;
        }

        passing++;
      }
    }

    results.push({
      siteName: site.siteName,
      sitePath: site.sitePath,
      passing,
      failing,
      loading,
    });
  }

  if (!sites) {
    res.status(500);
    res.send("No sites found");
  }

  res.send(results.sort((a, b) => (a.siteName > b.siteName ? 1 : -1)));
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
      logger.log("error", err);
      res.status(500);
      res.send(err);
    });

  await db
    .collection("pages")
    .deleteMany({ sitePath: req.body.sitePath })
    .catch((err) => {
      logger.log("error", err);
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
  logger.log("info", "Deleting page: ", req.body.pageId);
  const { pageId } = req.body;
  await db.collection("pages").deleteOne({ _id: ObjectId(pageId) });
  res.send("Page deleted");
  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(req.body.sitePath, db),
    req.body.sitePath
  );
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
  const { sitePath, url, trimPages } = req.body;

  await db.collection("pages").deleteMany({ sitePath, pagePath: { $ne: "/" } });

  await db
    .collection("pages")
    .updateMany({ sitePath, pagePath: "/" }, { $set: { screenshots: {} } });

  const results = await crawlSitemap(url, res);

  if (!results) {
    res.send("No pages found");
    return;
  }

  let urls = results.sites;

  if (trimPages) {
    urls = trimUrls(urls);
  }

  urls.sort();

  urls.forEach((url) => {
    url = new URL(url);
    const page = {
      sitePath: sitePath,
      pagePath: url.pathname,
      url: url.href,
      screenshots: {},
      failing: false,
    };
    db.collection("pages").insertOne(page);
  });

  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(req.body.sitePath, db),
    req.body.sitePath
  );

  res.send(urls);
}

/**
 * Removes all urls that have duplicate penultimate paths leaving one page per duplicate
 *
 * EG
 * /example/1
 * /example/2
 * /example/3
 *
 * Becomes
 * /example/1
 *
 * @param urls {Array[String]} - array of urls
 * @returns {Array[String]} - array of urls with duplicates removed
 */
function trimUrls(urls) {
  const newUrls = [];
  const pathPrefixes = [];

  urls.forEach((url) => {
    if (!isValidUrl(url)) {
      return;
    }

    url = new URL(url);
    const paths = url.pathname.split("/").filter((p) => p !== "");
    const pathPrefix = paths.slice(0, paths.length - 1).join("/");

    if (pathPrefix === "") {
      newUrls.push(url.toString());
      return;
    }

    if (!pathPrefixes.includes(pathPrefix)) {
      pathPrefixes.push(pathPrefix);
      newUrls.push(url.toString());
    }
  });

  return newUrls;
}

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

/**
 * Deletes all pages from an array of page ids
 *
 * Example body
 * {
 *     pages {Array<String>},
 *     sitePath {String},
 * }
 *
 * @param db
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function deletePages(db, req, res) {
  let { pages, sitePath } = req.body;
  const dbCalls = [];

  logger.log("info", "Deleting pages");

  for (const page of pages) {
    dbCalls.push(db.collection("pages").deleteOne({ _id: ObjectId(page) }));
  }

  await Promise.all(dbCalls);

  logger.log("info", "Finished removing pages");
  broadcastData(
    "UPDATE_SCREENSHOTS",
    await getSitePages(sitePath, db),
    sitePath
  );
  res.send("Removed pages");
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

  await db
    .collection("pages")
    .updateMany(
      { sitePath: req.body.sitePath, pagePath: "/" },
      { $set: { screenshots: {} } }
    );

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
 * Updates the baseline url of a site
 *
 * Example body
 * {
 *     sitePath {String},
 *     url {String},
 * }
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
 * example body
 * {
 *     url {String},
 *     sitePath {String},
 * }
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
      if (page.screenshots[device].loading) {
        await db
          .collection("pages")
          .updateOne(
            { _id: ObjectId(page._id) },
            { $set: { [`screenshots.${device}`]: {} } }
          );
      }
    }
  }

  logger.log("info", "Finished aborting all running screenshots");
}

/**
 * Sets the devices for a site in the db
 *
 * example body
 * {
 *     sitePath {String},
 *     devices {Array[String]}
 * }
 *
 * @param db
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function setSiteDevices(db, req, res) {
  const { sitePath, devices } = req.body;

  logger.log("info", "Setting devices", sitePath, devices);
  await db.collection("sites").updateOne({ sitePath }, { $set: { devices } });
  logger.log("info", "Finished setting devices");
  res.send(true);
}

/**
 * Sets the settings for a site in the db
 *
 * Example body
 * {
 *     sitePath {String},
 *     failingPercentage {Number},
 *     trimPages {Boolean},
 * }
 *
 * @param db
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function setSiteSettings(db, req, res) {
  const {
    sitePath,
    failingPercentage,
    trimPages,
    scrollPage,
    injectedJs,
    pageTimeout,
  } = req.body;

  if (!sitePath) {
    res.status(400);
    res.send("No site path provided");
    return;
  }

  logger.log("info", "Saving site settings");
  await db.collection("sites").updateOne(
    { sitePath },
    {
      $set: {
        trimPages,
        scrollPage,
        failingPercentage,
        injectedJs,
        pageTimeout,
      },
    }
  );

  logger.log("info", "Finished saving site settings");
  res.send(true);
}

/**
 * Gets number of loading screenshots
 *
 * @param db
 * @returns {*}
 */
async function getNumOfLoadingScreenshots(db) {
  const screenshots = await db.collection("pages").find().toArray();

  let loadingScreenshots = 0;
  for (let screenshot of Object.values(screenshots)) {
    for (let device in screenshot.screenshots) {
      if (screenshot.screenshots[device].loading) {
        loadingScreenshots++;
      }
    }
  }

  return loadingScreenshots;
}

async function getNumOfLoadingScreenshotsEndpoint(db, req, res) {
  const numOfLoadingScreenshots = await getNumOfLoadingScreenshots(db).catch(
    (err) => res.send(err)
  );
  logger.log("info", "Number of loading screenshots", numOfLoadingScreenshots);
  res.send(numOfLoadingScreenshots.toString());
}

module.exports = {
  addSite,
  getSite,
  getAllSites,
  deletePages,
  deleteSite,
  addSitePage,
  deleteSitePage,
  fillSitePages,
  deleteAllSitePages,
  addDeviceScreenshots,
  updateBaselineUrl,
  updateComparisonUrl,
  updateScreenshotLoading,
  abortRunningScreenshots,
  getSitePages,
  setSiteDevices,
  setSiteSettings,
  getNumOfLoadingScreenshotsEndpoint,
};
