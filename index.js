const { crawlSitemapEndpoint } = require("./tools/crawlUrl");
const {
  initialiseCluster,
  generateScreenshot,
} = require("./tools/screenshotAPI");

const { addSite, getSite, getAllSites } = require("./tools/dbEndpoints");

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

(async () => {
  const cluster = await initialiseCluster();
  app.post("/api/take-screenshot", (req, res) =>
    generateScreenshot(req, res, cluster)
  );
})();

app.post("/api/crawl-url", crawlSitemapEndpoint);

app.post("/api/add-site", (req, res) => addSite(client, req, res));
app.post("/api/get-site", (req, res) => getSite(client, req, res));
app.get("/api/get-all-sites", (req, res) => getAllSites(client, req, res));

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
