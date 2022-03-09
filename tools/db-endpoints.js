const { crawlSitemap } = require("./crawl-url");

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
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
async function addSite(client, req, res) {
  const siteData = req.body;
  console.log(siteData);

  await client.connect((err) => {
    if (err) throw err;
    const db = client.db("warden");

    db.collection("sites").insertOne(siteData, (err) => {
      if (err) throw err;
      client.close();
    });

    console.log("done");
    res.send("complete");
  });
}

/**
 * Endpoint to retrieve site data from db
 *
 * Example body
 * {
 *     url {String},
 * }
 *
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
async function getSite(client, req, res) {
  await client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const result = await db
      .collection("sites")
      .findOne({ sitePath: req.body.sitePath });

    if (result) {
      res.send(result);
    } else {
      res.status(500);
      res.send("Site not found");
    }
  });
}

/**
 * Retrieves all sites from db
 *
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
async function getAllSites(client, req, res) {
  await client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const results = await db.collection("sites").find().toArray();

    if (results) {
      res.send(results);
    } else {
      res.status(500);
      res.send("No sites found");
    }
  });
}

/**
 * Deletes a site from the db
 *
 * Example body
 * {
 *     sitePath {String}
 * }
 *
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
function deleteSite(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    await db
      .collection("sites")
      .deleteOne({ sitePath: req.body.sitePath })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });

    res.send("Site deleted");
  });
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
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
function addSitePage(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const query = {};
    query[`pages.${req.body.pagePath}`] = req.body.newPage;

    await db
      .collection("sites")
      .updateOne({ sitePath: req.body.sitePath }, { $set: query });

    res.send("Page added");
  });
}

/**
 * deletes a page from a site in the db
 *
 * {
 *     sitePath {String},
 *     pagePath {String}
 * }
 *
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
async function deleteSitePage(client, req, res) {
  await client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

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
  });
}

/**
 * Crawls the sitemap of a site and add the result to the sites pages list
 *
 * {
 *     sitePath {String},
 *     url {String},
 * }
 *
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
async function fillSitePages(client, req, res) {
  const results = await crawlSitemap(req.body.url, res);

  if (!results) {
    res.send("No pages found");
    return;
  }

  await client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const urls = results.sites;
    urls.sort();

    urls.forEach((url) => {
      url = new URL(url);
      const query = {};

      query[`pages.${url.pathname}`] = {
        url,
        passingNum: "0/0",
        screenshots: {},
      };

      db.collection("sites").updateOne(
        { sitePath: req.body.sitePath },
        { $set: query }
      );
    });

    res.send(urls);
  });
}

/**
 * Deletes all pages from a site in the db
 *
 * Example body
 * {
 *     sitePath {String},
 * }
 *
 * @param client {MongoClient}
 * @param req {Request}
 * @param res {Response}
 */
async function deleteAllSitePages(client, req, res) {
  await client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");
    const site = await db
      .collection("sites")
      .findOne({ sitePath: req.body.sitePath });

    db.collection("sites").updateOne(
      { sitePath: req.body.sitePath },
      { $set: { pages: { "/": { ...site.pages["/"] } } } }
    );

    res.send("Deleted pages");
  });
}

/**
 * Slightly different as this is called in a different screenshot endpoint to add a screenshot to the db
 *
 * @param client {MongoClient}
 * @param sitePath {String}
 * @param urlPath {String}
 * @param screenshotUrls {Array.<String>}
 * @param device {String}
 */
async function addDeviceScreenshots(
  client,
  sitePath,
  urlPath,
  screenshotUrls,
  device
) {
  console.log("Started adding", device);
  return await client.connect((err) => {
    if (err) throw err;
    const db = client.db("warden");

    const query = {};

    query[`pages.${urlPath}.screenshots.${device}`] = screenshotUrls;

    db.collection("sites").updateOne({ sitePath }, { $set: query });
    console.log("Finished adding");
  });
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
};
