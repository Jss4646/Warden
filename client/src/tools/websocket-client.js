const socket = new WebSocket("ws://localhost:8080");

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
