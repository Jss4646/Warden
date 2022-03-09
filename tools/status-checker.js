const fetch = require("node-fetch");

/**
 * Gets the status of a site
 *
 * Example body
 * {
 *     url {String},
 * }
 *
 * @param req {Request}
 * @param res {Response}
 * @returns {Promise<void>}
 */
async function getSiteStatus(req, res) {
  const siteResponse = await fetch(req.body.url)
    .then((res) => {
      return res.statusText;
    })
    .catch(() => {
      return "NOT FOUND";
    });

  res.send({ siteStatus: siteResponse });
}

module.exports = {
  getSiteStatus,
};
