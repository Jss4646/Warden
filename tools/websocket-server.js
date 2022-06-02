const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

function initWebSocket() {
  wss.on("connection", (ws) => {
    console.log("connected")
    ws.send(JSON.stringify({ action: "CONNECTION", data: "connected" }));
  });
}

function broadcastData(action, data, sitePath) {
  wss.clients.forEach((id, client) =>
    client.send(JSON.stringify({ action, data, sitePath }))
  );
}

module.exports = {
  broadcastData,
  initWebSocket,
};
