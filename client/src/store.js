import { createStore } from "redux";
import rootReducer from "./reducers";

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
  url: "",
  comparisonUrl: "",
  siteStatus: "",
  sitePages: {},
  siteUsername: "",
  sitePassword: "",
  currentPage: "",
  wpAdminPath: "",
  failingPercentage: 5,
  failingScreenshots: {},
  devices: ["1080p"],
};

const defaultState = {
  appState,
  siteData,
};

const store = createStore(
  rootReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
