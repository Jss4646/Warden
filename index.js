const { crawlSitemapEndpoint } = require("./tools/crawl-url");
const {
  initialiseCluster,
  generateScreenshot,
  runComparison,
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
  updateBaselineUrl,
  updateComparisonUrl,
  abortRunningScreenshots,
  deletePages,
  setSiteDevices,
  setSiteSettings,
  getNumOfLoadingScreenshotsEndpoint,
  importUrls,
  deleteAllSitePagesEndpoint,
} = require("./tools/database-calls");
const { getSiteStatus } = require("./tools/status-checker");

const express = require("express");
const bodyParser = require("body-parser");
const Sentry = require("@sentry/node");
const { initWebSocket } = require("./tools/websocket-server");
require("./tools/logger");
const logger = require("./tools/logger");

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb://127.0.0.1:27017");

const app = express();
const port = process.env.PORT || 5000;

Sentry.init({
  dsn: "https://c2b2b9486fa243399f474ae3be986686@sentry.synotio.se/166",
});

initWebSocket();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(Sentry.Handlers.requestHandler());

let db;

/**
 * Endpoints that need the puppeteer cluster go in here
 */
(async () => {
  await client.connect((err) => {
    if (err) throw err;
  });
  const dbName = process.env.DB_NAME || "warden";
  logger.log("info", `Connecting to database ${dbName}`);
  db = await client.db(dbName);

  abortRunningScreenshots(db).catch((err) => logger.error(err));

  const cluster = await initialiseCluster();
  app.post("/api/cancel-all-screenshots", async (req, res) => {
    logger.log("info", "Canceling all screenshots");
    res.send("Shutting down and restarting server");
    process.exit(0);
  });

  app.post("/api/take-screenshot", (req, res) =>
    generateScreenshot(req, res, cluster)
  );

  app.post("/api/run-comparison", (req, res) =>
    runComparison(req, res, cluster, db)
  );

  app.post("/api/add-site", (req, res) => addSite(db, req, res));
  app.post("/api/get-site", (req, res) => getSite(db, req, res));
  app.get("/api/get-all-sites", (req, res) => getAllSites(db, req, res));
  app.post("/api/delete-site", (req, res) => deleteSite(db, req, res));
  app.post("/api/add-site-page", (req, res) => addSitePage(db, req, res));
  app.post("/api/delete-site-page", (req, res) => deleteSitePage(db, req, res));
  app.post("/api/fill-site-pages", (req, res) => fillSitePages(db, req, res));
  app.post("/api/delete-all-site-pages", (req, res) =>
    deleteAllSitePagesEndpoint(db, req, res)
  );
  app.post("/api/update-baseline-url", (req, res) =>
    updateBaselineUrl(db, req, res)
  );
  app.post("/api/update-comparison-url", (req, res) =>
    updateComparisonUrl(db, req, res)
  );
  app.post("/api/delete-pages", (req, res) => deletePages(db, req, res));
  app.post("/api/set-site-devices", (req, res) => setSiteDevices(db, req, res));
  app.post("/api/set-site-settings", (req, res) =>
    setSiteSettings(db, req, res)
  );
  app.get("/api/get-num-of-loading-screenshots", (req, res) =>
    getNumOfLoadingScreenshotsEndpoint(db, req, res)
  );
  app.post("/api/import-urls", (req, res) => importUrls(db, req, res));
})();

app.post("/api/crawl-url", crawlSitemapEndpoint);
app.post("/api/get-site-status", (req, res) => getSiteStatus(req, res));

if (process.env.USER !== "apache") {
  logger.log("info", "Running in development mode");
  app.use("/screenshots", express.static("screenshots"));
}

app.listen(port, () => logger.info(`Listening on port ${port}`));
