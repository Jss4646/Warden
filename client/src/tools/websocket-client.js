const socketUrl = process.env?.NODE_ENV === "development" ? `ws://${window.location.hostname}:8080` : `ws://${window.location.hostname}:80/ws`;
console.log(socketUrl)

export function wsInit(setAllScreenshots) {
  let socket;

  function connect() {
    if ( socket instanceof WebSocket ) {
      socket.onerror = null;
      socket.onclose = null;
      socket.onopen = null;
      socket.onmessage = null;
    }
    socket = new WebSocket(socketUrl);

    socket.onclose = () => {
      console.log( 'socket closed. Trying to reconnect...' );
      setTimeout( connect, 1000 );
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Received message", response.action);
      switch (response.action) {
        case "CONNECTION":
          console.log(response.data);
          return;

      case "UPDATE_SCREENSHOTS":
        const path = window.location.pathname.split('/')
        const sitePath = path[path.length - 1];
        if (response.sitePath !== sitePath) {
          return;
        }
        console.log(response.data);
        setAllScreenshots(response.data);
        return;

        default:
          return;
      }
    };

    console.log( socket );
  }

  if ( typeof socket === 'undefined' || socket.readyState === socket.CLOSED ) {
    connect();
  }
}
