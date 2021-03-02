const { Cluster } = require("puppeteer-cluster");

async function initialiseCluster() {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    retryLimit: 1,
    timeout: 500000,
    puppeteerOptions: {
      executablePath: process.env.chromeLocation || undefined,
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

  await cluster.task(takeScreenshot);
  return cluster;
}

async function takeScreenshot({ page, data: { screenshotData, res } }) {
  let { url, cookieData, resolution, userAgent } = screenshotData;
  console.log(`Setting up page for ${url}`);

  await page
    .setViewport(resolution)
    .catch((err) => sendError("Couldn't set viewport", err, res));

  await page
    .setUserAgent(userAgent.toString())
    .catch((err) => sendError("Couldn't set user agent", err, res));

  if (cookieData)
    await page
      .setCookie(...cookieData)
      .catch((err) => sendError("Couldn't set cookies", err, res));

  await page
    .goto(url.toString())
    .catch((err) => sendError("Couldn't navigate to page", err, res));

  console.log(`Screenshotting Website: ${url}`);

  const screenshot = await page
    .screenshot({ fullPage: true })
    .catch((err) => sendError("Couldn't take screenshot", err, res));
  console.log(`Screenshot taken: ${url}\n`);
  await page.close();
  res.send(screenshot);
}

async function generateScreenshot(req, res, cluster) {
  console.log("body", req.body);
  cluster.queue({ screenshotData: req.body, res });
}

function sendError(errMessage, err, res) {
  console.error(err);
  res.status(500);
  res.send(errMessage);
}

module.exports = {
  initialiseCluster,
  generateScreenshot,
};
