import devices from "../data/devices.json";

export default function appState(state = [], action) {
  let newState = { ...state };
  let { screenshots } = newState;
  const { screenshot } = action;

  switch (action.type) {
    case "RESET_APP_STATE":
      newState = {
        currentUrl: "",
        isCurrentUrlValid: true,
        urls: [],
        isLoadingUrls: false,
        selectedDevices: [],
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
      const { host, pathname } = screenshot;

      if (screenshots[host]) {
        if (screenshots[host][pathname]) {
          screenshots[host][pathname].push(screenshot);
        } else {
          screenshots[host][pathname] = [screenshot];
        }
      } else {
        screenshots[host] = {};
        screenshots[host][pathname] = [screenshot];
      }

      return newState;

    case "ADD_SCREENSHOT_IMAGE":
      screenshot.image = action.screenshotImage;
      return newState;

    case "SET_SCREENSHOTS":
      newState.screenshots = action.screenshots;
      return newState;

    case "REMOVE_SCREENSHOT":
      screenshots[action.host][action.path].splice(action.index, 1);
      if (screenshots[action.host][action.path].length === 0)
        delete screenshots[action.host][action.path];
      if (Object.keys(screenshots[action.host]).length === 0)
        delete screenshots[action.host];

      return newState;

    case "REMOVE_SCREENSHOTS":
      if (action.host && action.path) {
        delete screenshots[action.host][action.path];
        if (Object.keys(screenshots[action.host]).length === 0)
          delete screenshots[action.host];
      } else if (action.host) {
        delete screenshots[action.host];
      } else if (!action.host && !action.path) {
        newState.screenshots = {};
      }

      return newState;

    default:
      return state;
  }
}
