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

    default:
      return state;
  }
}
