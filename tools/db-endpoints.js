const { query } = require("mongodb/lib/core/wireprotocol");

function addSite(client, req, res) {
  const siteData = req.body;
  console.log(siteData);

  client.connect((err) => {
    if (err) throw err;
    const db = client.db("warden");

    db.collection("sites").insertOne(siteData, (err) => {
      if (err) throw err;
      client.close();
    });

    console.log("done");
  });

  res.send("complete");
}

function getSite(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const result = await db
      .collection("sites")
      .findOne({ sitePath: req.body.sitePath });

    if (result) {
      res.send(result);
    } else {
      res.status(500);
      res.send("Site not found");
    }
  });
}

function getAllSites(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const results = await db.collection("sites").find().toArray();

    if (results) {
      res.send(results);
    } else {
      res.status(500);
      res.send("No sites found");
    }
  });
}

function deleteSite(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    await db
      .collection("sites")
      .deleteOne({ sitePath: req.body.sitePath })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });

    res.send("Site deleted");
  });
}

function addSitePage(client, req, res) {
  client.connect(async (err) => {
    if (err) throw err;
    const db = client.db("warden");

    const query = {};
    query[`pages.${req.body.pagePath}`] = req.body.newPage;

    await db
      .collection("sites")
      .updateOne({ sitePath: req.body.sitePath }, { $set: query });

    res.send("Page added");
  });
}

module.exports = {
  addSite,
  getSite,
  getAllSites,
  deleteSite,
  addSitePage,
};
