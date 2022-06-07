const { crawlSitemap } = require("./crawl-url");
const { broadcastData } = require("./websocket-server");

/**
 * Endpoint to add a site to the database
 *
 * Example body
 * {
 *       siteName {String},
 *       url {String},
 *       comparisonUrl {String},
 *       sitePath {String},
 *       pages: {
 *         "/": { url {String}, passingNum: "0/0", screenshots: {} },
 *       },
 *       devices: ["1080p", "iphone-x/xs"],
 *  };
 *
 *  pages format covered more under the addPage endpoint
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function addSite(db, req, res) {
  const siteData = req.body;
  console.log(siteData);

  db.collection("sites").insertOne(siteData, (err) => {
    if (err) throw err;
  });

  console.log("done");
  res.send("complete");
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
  const result = await db
    .collection("sites")
    .findOne({ sitePath: req.body.sitePath });

  if (result) {
    res.send(result);
  } else {
    res.status(500);
    res.send("Site not found");
  }
}

/**
 * Retrieves all sites from db
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function getAllSites(db, req, res) {
  const results = await db.collection("sites").find().toArray();

  if (results) {
    res.send(results);
  } else {
    res.status(500);
    res.send("No sites found");
  }
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
 *       newPage: {
 *        url {String},
 *        passingNum {String} EG "0/5", - TODO need to sort how this works
 *        screenshots {Object} - should be an empty object as this is filled by program
 *       },
 *  };
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function addSitePage(db, req, res) {
  const query = {};
  query[`pages.${req.body.pagePath}`] = req.body.newPage;

  await db
    .collection("sites")
    .updateOne({ sitePath: req.body.sitePath }, { $set: query });

  res.send("Page added");
}

/**
 * deletes a page from a site in the db
 *
 * {
 *     sitePath {String},
 *     pagePath {String}
 * }
 *
 * @param db {Db}
 * @param req {Request}
 * @param res {Response}
 */
async function deleteSitePage(db, req, res) {
  const { sitePath, pagePath } = req.body;

  const pageQuery = {};
  pageQuery[`pages.${pagePath}`] = 1;

  db.collection("sites")
    .updateOne({ sitePath }, { $unset: pageQuery })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.send(err);
    });

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
    const query = {};

    query[`pages.${url.pathname}`] = {
      url: url.toString(),
      screenshots: {},
    };

    db.collection("sites").updateOne(
      { sitePath: req.body.sitePath },
      { $set: query }
    );
  });

  const site = await db
    .collection("sites")
    .findOne({ sitePath: req.body.sitePath });

  broadcastData("UPDATE_SCREENSHOTS", site.pages, req.body.sitePath);

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
  const site = await db
    .collection("sites")
    .findOne({ sitePath: req.body.sitePath });

  const blankPages = { "/": { url: site.pages["/"].url, screenshots: {} } };

  await db.collection("sites").updateOne(
    { sitePath: req.body.sitePath },
    {
      $set: { pages: blankPages },
    }
  );

  broadcastData("UPDATE_SCREENSHOTS", blankPages, req.body.sitePath);
  res.send("Deleted pages");
}

/**
 * Slightly different as this is called in a different screenshot endpoint to add a screenshot to the db
 *
 * @param db {Db}
 * @param sitePath {String}
 * @param urlPath {String}
 * @param screenshotUrls {Object}
 * @param screenshotUrls.baselineScreenshot {string}
 * @param screenshotUrls.comparisonScreenshot {string}
 * @param screenshotUrls.diffImage {string}
 * @param device {String}
 */
async function addDeviceScreenshots(
  db,
  sitePath,
  urlPath,
  screenshotUrls,
  device
) {
  console.log("Started adding", device);
  const query = {};

  query[`pages.${urlPath}.screenshots.${device}`] = screenshotUrls;
  await db.collection("sites").updateOne({ sitePath }, { $set: query });
  console.log("Finished adding");
  const site = await db.collection("sites").findOne({ sitePath });

  broadcastData("UPDATE_SCREENSHOTS", site.pages, sitePath);
}

async function updateScreenshotLoading(db, sitePath, urlPath, device, loading) {
  const query = {};
  let site = await db.collection("sites").findOne({ sitePath });
  const screenshots = site.pages[urlPath].screenshots[device];

  if (loading) {
    query[`pages.${urlPath}.screenshots.${device}`] = {
      ...screenshots,
      loading,
      failing: false,
    };
  } else {
    query[`pages.${urlPath}.screenshots.${device}`] = {
      ...screenshots,
      loading,
    };
  }

  await db.collection("sites").updateOne({ sitePath }, { $set: query });

  site = await db.collection("sites").findOne({ sitePath });
  broadcastData("UPDATE_SCREENSHOTS", site.pages, sitePath);
}

async function getFailingThreshold(db, sitePath) {
  const site = await db.collection("sites").findOne({ sitePath });
  return site.failingPercentage;
}

async function updateBaselineUrl(db, req, res) {
  const { url, sitePath } = req.body;

  await db.collection("sites").updateOne({ sitePath }, { $set: { url } });
  res.send(true);
}

async function updateComparisonUrl(db, req, res) {
  const { url, sitePath } = req.body;

  await db
    .collection("sites")
    .updateOne({ sitePath }, { $set: { comparisonUrl: url } });
  res.send(true);
}

async function abortRunningScreenshots(db) {
  const sites = await db.collection("sites").find().toArray();
  for (let site of sites) {
    const pages = site.pages;

    Object.keys(pages).forEach((pageKey) => {
      const screenshots = pages[pageKey].screenshots;
      Object.keys(screenshots).forEach((device) => {
        let screenshot = screenshots[device];

        if (
          !screenshot.baselineScreenshot ||
          !screenshot.comparisonScreenshot
        ) {
          delete screenshots[device];
          return;
        }

        screenshot.loading = false;
      });
    });

    await db
      .collection("sites")
      .updateOne({ sitePath: site.sitePath }, { $set: { pages } });
  }
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
};
