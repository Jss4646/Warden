const { crawlSitemapEndpoint } = require("./tools/crawl-url");
const {
  initialiseCluster,
  generateScreenshot,
  compareScreenshots,
} = require("./tools/screenshot-api");

const {
  addSite,
  getSite,
  getAllSites,
  deleteSite,
  addSitePage,
  deleteSitePage,
  fillSitePages,
  deleteAllSitePages,
} = require("./tools/db-endpoints");
const { getSiteStatus } = require("./tools/status-checker");

const express = require("express");
const bodyParser = require("body-parser");
const Sentry = require("@sentry/node");

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb://localhost:27017");

const app = express();
const port = process.env.PORT || 5000;

Sentry.init({
  dsn: "https://c2b2b9486fa243399f474ae3be986686@sentry.synotio.se/166",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Sentry.Handlers.requestHandler());
app.use("/api/screenshots", express.static("screenshots"));

/**
 * Endpoints that need the puppeteer cluster go in here
 */
(async () => {
  const cluster = await initialiseCluster();
  app.post("/api/take-screenshot", (req, res) =>
    generateScreenshot(req, res, cluster)
  );
  app.post("/api/run-comparison", (req, res) =>
    compareScreenshots(req, res, cluster, db)
  );

  await client.connect((err) => {
    if (err) throw err;
  });
  const db = await client.db("warden");

  app.post("/api/add-site", (req, res) => addSite(db, req, res));
  app.post("/api/get-site", (req, res) => getSite(db, req, res));
  app.get("/api/get-all-sites", (req, res) => getAllSites(db, req, res));
  app.post("/api/delete-site", (req, res) => deleteSite(db, req, res));
  app.post("/api/add-site-page", (req, res) => addSitePage(db, req, res));
  app.post("/api/delete-site-page", (req, res) => deleteSitePage(db, req, res));
  app.post("/api/fill-site-pages", (req, res) => fillSitePages(db, req, res));
  app.post("/api/delete-all-site-pages", (req, res) =>
    deleteAllSitePages(db, req, res)
  );
})();

app.post("/api/crawl-url", crawlSitemapEndpoint);
app.post("/api/get-site-status", (req, res) => getSiteStatus(req, res));

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
