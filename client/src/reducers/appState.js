import devices from "../data/devices.json";

export default function appState(state = [], action) {
  let newState = { ...state };
  let { screenshots } = newState;
  const { screenshot: screenshotRef } = action;

  const host = action?.host;
  const path = action?.path;

  const renderedScreenshot = getScreenshot(screenshots, action.id, action.url);
  const queuedScreenshot = action.screenshot;

  switch (action.type) {
    case "RESET_APP_STATE":
      newState = {
        currentUrl: "",
        isCurrentUrlValid: true,
        urls: [],
        isLoadingUrls: false,
        selectedDevices: ["iphone-5/se"],
        activityLogLines: [],
        screenshotQueue: [],
        screenshots: {},
      };
      return newState;

    case "UPDATE_CURRENT_URL":
      newState.currentUrl = action.newUrl;
      return newState;

    case "UPDATE_IS_CURRENT_URL_VALID":
      newState.isCurrentUrlValid = action.isValid;
      return newState;

    case "ADD_URL_TO_URL_LIST":
      newState.urls.push(action.url);
      return newState;

    case "REMOVE_URL_FROM_URL_LIST":
      newState.urls.splice(action.urlIndex, 1);
      return newState;

    case "CLEAR_URLS":
      newState.urls = [];
      return newState;

    case "IMPORT_URLS":
      newState.urls = action.newUrls;
      return newState;

    case "UPDATE_IS_LOADING_URLS":
      newState.isLoadingUrls = action.isCrawling;
      return newState;

    case "SET_SELECTED_DEVICES":
      newState.selectedDevices = action.selectedDevices;
      return newState;

    case "SELECT_ALL_DEVICES":
      newState.selectedDevices = Object.keys(devices);
      return newState;

    case "DESELECT_ALL_DEVICES":
      newState.selectedDevices = [];
      return newState;

    case "ADD_SCREENSHOT":
      const screenshotHost = screenshotRef.url.host;
      const screenshotPath = screenshotRef.url.pathname;

      if (screenshots[screenshotHost]) {
        if (screenshots[screenshotHost][screenshotPath]) {
          screenshots[screenshotHost][screenshotPath].push(screenshotRef);
        } else {
          screenshots[screenshotHost][screenshotPath] = [screenshotRef];
        }
      } else {
        screenshots[screenshotHost] = {};
        screenshots[screenshotHost][screenshotPath] = [screenshotRef];
      }

      return newState;

    case "ADD_SCREENSHOT_IMAGE":
      screenshotRef.image = action.screenshotImage;
      return newState;

    case "SET_SCREENSHOTS":
      newState.screenshots = action.screenshots;
      return newState;

    case "SET_SCREENSHOT_STATE":
      renderedScreenshot.state = action.state;
      if (action.state !== "running") {
        renderedScreenshot.endTime = new Date().getTime();
      }
      return newState;

    case "REMOVE_SCREENSHOT":
      screenshots[host][path].splice(action.index, 1);
      if (screenshots[host][path].length === 0) delete screenshots[host][path];
      if (Object.keys(screenshots[host]).length === 0) delete screenshots[host];

      return newState;

    case "REMOVE_SCREENSHOTS":
      if (host && path) {
        delete screenshots[host][path];
        if (Object.keys(screenshots[host]).length === 0)
          delete screenshots[host];
      } else if (host) {
        delete screenshots[host];
      } else if (!host && !path) {
        newState.screenshots = {};
      }

      return newState;

    case "ADD_SCREENSHOT_TO_QUEUE":
      newState.screenshotQueue.push(queuedScreenshot);
      return newState;

    case "CLEAR_SCREENSHOT_QUEUE":
      newState.screenshotQueue = [];
      return newState;

    case "ADD_ACTIVITY_LOG_LINE":
      // TODO Move date outside bad practice to get it here
      const date = new Date();
      const hours = date.getHours();
      const mins = date.getMinutes();
      const seconds = date.getSeconds();

      const environments = {
        "screenshot-tool": "Screenshot tool",
        "automated-tests": "Automated tests",
        "seo-tools": "SEO tools",
      };

      const { textContent, environment } = action;
      const newLineObject = {
        textContent,
        time: `${hours}:${mins}:${seconds}`,
        environment: environments[environment],
      };
      newState.activityLogLines.push(newLineObject);
      return newState;

    default:
      return state;
  }
}

function getScreenshot(screenshots, id, url) {
  //TODO this is bad, redo this whole file
  if (screenshots && id && url) {
    const pageScreenshots = screenshots[url.host][url.pathname];
    for (const screenshot of pageScreenshots) {
      if (screenshot.id === id) {
        return screenshot;
      }
    }
  }
}
