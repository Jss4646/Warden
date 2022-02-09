const { query } = require("mongodb/lib/core/wireprotocol");
const { crawlSitemap } = require("./crawl-url");

function addSite(client, req, res) {
  const siteData = req.body;
  console.log(siteData);

  client.connect((err) => {
    if (err) throw err;
    const db = client.db("warden");

    db.collection("sites").insertOne(siteData, (err) => {
      if (err) throw err;
      client.close();
    });

    console.log("done");
  });

  res.send("complete");
}

function getSite(client, req, res) {
  client.connect(async (err) => {
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

function getAllSites(client, req, res) {
  client.connect(async (err) => {
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

function deleteSitePage(client, req, res) {
  client.connect(async (err) => {
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

async function fillSitePages(client, req, res) {
  console.log(req.body.url);
  const results = await crawlSitemap(req.body.url, res);

  if (!results) {
    res.send("No pages found");
    return;
  }

  client.connect(async (err) => {
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

async function deleteAllSitePages(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");
    const site = await db
      .collection("sites")
      .findOne({ sitePath: req.body.sitePath });

    db.collection("sites").updateOne(
      { sitePath: req.body.sitePath },
      { $set: { pages: { "/": { ...site.pages["/"] } } } }
    );
  });
}

async function addDeviceScreenshots(
  client,
  sitePath,
  urlPath,
  screenshotUrls,
  device
) {
  await new Promise((resolve) => {
    console.log("Started adding", device);
    client.connect(async (err) => {
      if (err) throw err;
      const db = client.db("warden");

      const query = {};

      query[`pages.${urlPath}.screenshots.${device}`] = screenshotUrls;

      db.collection("sites").updateOne({ sitePath }, { $set: query });
      console.log("Finished adding");
      resolve();
    });
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
