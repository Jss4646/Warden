const Sitemapper = require("sitemapper");
const sitemapper = new Sitemapper();
const fetch = require("node-fetch");

async function crawlSitemap(url, res) {
  const urlOrigin = new URL(url).origin;
  const sitemapUrl = `${urlOrigin}/sitemap.xml`;
  const isLiveUrl = await fetch(sitemapUrl)
    .then((res) => res.ok)
    .catch(() => false);

  if (!isLiveUrl) {
    const error = "Sitemap doesn't exist";
    console.log(error);
    res.status(500);
    return error;
  }

  console.log(`Getting sitemap for ${urlOrigin}`);
  const sitemap = new Sitemapper({ url: sitemapUrl });

  const urls = await sitemap
    .fetch(`${urlOrigin}/sitemap.xml`)
    .then((urls) => urls)
    .catch((error) => console.log(error));

  console.log("Finished crawling");
  console.log(urls);
  return urls;
}

async function crawlSitemapEndpoint(req, res) {
  res.send(await crawlSitemap(req.body.url, res));
}

module.exports = {
  crawlSitemapEndpoint,
};
