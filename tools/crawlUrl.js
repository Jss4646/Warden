const Sitemapper = require("sitemapper");
const sitemapper = new Sitemapper();

function crawlSitemap(url) {
  let urlOrigin = new URL(url).origin;
  console.log(`Getting sitemap for ${urlOrigin}`);
  const urls = sitemapper
    .fetch(`${urlOrigin}/sitemap.xml`)
    .then((url) => url)
    .catch((error) => console.log(error));

  return urls;
}

async function crawlSitemapEndpoint(req, res) {
  res.send(await crawlSitemap(req.body.url));
}

module.exports = {
  crawlSitemapEndpoint,
};
