const Sitemapper = require("sitemapper");
const fetch = require("node-fetch");

/**
 *
 * @param url {String} - The URL to crawl
 * @param res {Response} - The response object
 * @returns {Promise<string|SitemapperResponse>}
 */
async function crawlSitemap(url, res) {
  const urlOrigin = new URL(url).origin;
  const sitemapUrl = `${urlOrigin}/sitemap.xml`;
  const isLiveUrl = await fetch(sitemapUrl)
    .then((res) => res.ok)
    .catch(() => false);

  if (!isLiveUrl) {
    console.log("Sitemap doesn't exist");
    res.status(500);
    return "Sitemap doesn't exist";
  }

  console.log(`Getting sitemap for ${urlOrigin}`);
  const sitemap = new Sitemapper({ url: sitemapUrl });

  const urls = await sitemap
    .fetch(`${urlOrigin}/sitemap.xml`)
    .then((urls) => urls)
    .catch((error) => console.log(error));

  console.log("Finished crawling");
  return urls;
}

/**
 * The crawl sitemap endpoint
 *
 * body example
 * {
 *     url {String},
 * }
 *
 * @param req {Request}
 * @param res {Response}
 * @returns {Promise<void>}
 */
async function crawlSitemapEndpoint(req, res) {
  const { url } = req.body;
  res.send(await crawlSitemap(url, res));
}

module.exports = {
  crawlSitemapEndpoint,
  crawlSitemap,
};
