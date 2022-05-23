const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

function initWebSocket() {
  wss.on("connection", (ws) => {
    console.log("connected")
    ws.send(JSON.stringify({ action: "CONNECTION", data: "connected" }));
  });
}

function broadcastData(action, data) {
  wss.clients.forEach((id, client) =>
    client.send(JSON.stringify({ action, data }))
  );
}

module.exports = {
  broadcastData,
  initWebSocket,
};
