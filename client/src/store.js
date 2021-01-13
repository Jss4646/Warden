import { createStore } from "redux";
import rootReducer from "./reducers";
import * as placeholderImage from "./data/placeholder-image.png";

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
  selectedDevices: [],
  screenshots: {
    "example.com": {
      "/": [{ deviceName: "example device", image: placeholderImage.default }],
    },
  },
};

const defaultState = {
  currentUser: tempUser,
  appState,
};

const store = createStore(rootReducer, defaultState);
export default store;
