import devices from "../data/devices.json";

export default function appState(state = [], action) {
  let newState = { ...state };

  switch (action.type) {
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

    default:
      return state;
  }
}
