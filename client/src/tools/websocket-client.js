const socketUrl = process.env?.NODE_ENV === "development" ? `ws://${window.location.hostname}:8080` : `ws://${window.location.hostname}:80/ws`;
console.log(socketUrl)
const socket = new WebSocket(socketUrl);

export function wsInit(setAllScreenshots) {
  socket.addEventListener("message", (event) => {
    const response = JSON.parse(event.data);
    console.log("Received message", response.action);
    switch (response.action) {
      case "CONNECTION":
        console.log(response.data);
        return;

      case "UPDATE_SCREENSHOTS":
        console.log(response.data);
        setAllScreenshots(response.data);
        return;

      default:
        return;
    }
  });
}
