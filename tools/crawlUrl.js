const Sitemapper = require("sitemapper");
const sitemapper = new Sitemapper();

export default function crawlSitemap(url) {
  let urlOrigin = new URL(url).origin;
  console.log(`Getting sitemap for ${urlOrigin}`);
  const urls = sitemapper
    .fetch(`${urlOrigin}/sitemap.xml`)
    .then((url) => console.log(url))
    .catch((error) => console.log(error));

  return urls;
}
