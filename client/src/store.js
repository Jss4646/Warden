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
};

const defaultState = {
  currentUser: tempUser,
  appState,
};

const store = createStore(rootReducer, defaultState);
export default store;
