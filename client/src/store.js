import { createStore } from "redux";
import rootReducer from "./reducers";

const tempUser = {
  username: "Jack",
  email: "jacksandeman@hotmail.co.uk",
  urlLists: [
    [
      "https://google.com",
      "https://pragmatic.agency",
      "https://angrycreative.uk",
      "https://example.com",
    ],
    [
      "https://google.com",
      "https://pragmatic.agency",
      "https://angrycreative.uk",
      "https://example.com",
    ],
  ],
  favoriteDevices: [
    "iphone-11",
    "iphone-11-max",
    "samsung-10e",
    "pixel-3",
    "iphone-12",
  ],
};

const appState = {
  currentUrl: "https://pragmatic.agency",
  isCurrentUrlValid: true,
  urls: [],
  isLoadingUrls: false,
  selectedDevices: ["iphone-5/se"],
  screenshots: {
    "example.com": {
      "/": [
        {
          deviceName: "iPhone 5/SE",
          image:
            "blob:http://localhost:3000/6a58d95b-8012-4f5d-a529-9c0ac3712e20",
          id: "392e9690-56a1-11eb-8fcb-733de26f9659",
          host: "pragmatic.agency",
          pathname: "/",
        },
      ],
    },
  },
};

const defaultState = {
  currentUser: tempUser,
  appState,
};

const store = createStore(
  rootReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
