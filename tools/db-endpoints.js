function addSite(client, req, res) {
  const siteData = req.body;
  console.log(siteData);

  client.connect((err) => {
    if (err) throw err;
    const db = client.db("wraith");

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
    const db = client.db("wraith");

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
    const db = client.db("wraith");

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
    const db = client.db("wraith");

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

module.exports = {
  addSite,
  getSite,
  getAllSites,
  deleteSite,
};
