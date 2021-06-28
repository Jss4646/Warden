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
  currentUrl: "",
  isCurrentUrlValid: false,
  urls: [],
  isLoadingUrls: false,
  selectedDevices: ["1080p"],
  activityLogLines: [],
  screenshotQueue: [],
  screenshots: {},
};

const siteData = {
  siteName: "",
  siteUrl: "",
};

const defaultState = {
  currentUser: tempUser,
  appState,
  siteData,
};

const store = createStore(
  rootReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
