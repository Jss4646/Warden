const { abortRunningScreenshots } = require("./database-calls");

function teardown(server, db) {
  console.log("Running teardown");
  abortRunningScreenshots(db).then(() => {
    exit(server);
  });
}

const exit = (server) => {
  server.close((error) => {
    if (error)
      console.error(
        "failed to terminate the express app gracefully, attempting to terminate forcefully...",
        error
      );
    process.exit();
  });
};

module.exports = {
  teardown,
};
