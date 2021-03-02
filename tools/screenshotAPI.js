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
  console.log("Taking screenshot");
  let { url, deviceName, cookieData, resolution } = screenshotData;
  await page.setViewport(resolution).catch((err) => {
    console.error(err);
    res.status(500);
    res.send("Couldn't set viewport");
  });

  console.log(`Screenshotting Website: ${url}`);
  console.log(`Device: ${deviceName}`);

  if (cookieData) await page.setCookie(...cookieData);
  await page.goto(url.toString());

  const screenshot = await page.screenshot({ fullPage: true });
  console.log("Screenshot taken");
  await page.close();
  res.send(screenshot);
}

async function generateScreenshot(req, res, cluster) {
  console.log("body", req.body);
  const { url, resolution } = req.body;
  const screenshotData = { url, deviceName: "Test device", resolution };

  cluster.queue({ screenshotData, res });
}

module.exports = {
  initialiseCluster,
  generateScreenshot,
};
