const { WebSocketServer } = require("ws");
const logger = require("./logger");

const port = process.env.WEBSOCKET_PORT || 8080;
logger.log("info", `Starting websocket server on port ${port}`);
const wss = new WebSocketServer({ port });

/**
 * Initialises the websocket server
 */
function initWebSocket() {
  wss.on("connection", (ws) => {
    logger.log("debug", "New client connected with id");
    ws.send(JSON.stringify({ action: "CONNECTION", data: "connected" }));

    logger.log("debug", `Currently have ${wss.clients.size} clients`);
  });
}

/**
 * Sends a message to all connected clients
 *
 * @param action {String} - The action to perform
 * @param data - The data to send
 * @param sitePath - The site that the data affects
 */
function broadcastData(action, data, sitePath) {
  wss.clients.forEach((id, client) =>
    client.send(JSON.stringify({ action, data, sitePath }))
  );
}

module.exports = {
  broadcastData,
  initWebSocket,
};
