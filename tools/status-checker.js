const fetch = require("node-fetch");

async function getSiteStatus(req, res) {
  const siteResponse = await fetch(req.body.siteUrl).then((res) => {
    return res.statusText;
  });

  res.send({ siteStatus: siteResponse });
}

module.exports = {
  getSiteStatus,
};
