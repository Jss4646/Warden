export default function appState(state = [], action) {
  let newState = { ...state };

  switch (action.type) {
    case "UPDATE_CURRENT_URL":
      newState.currentUrl = action.newUrl;
      return newState;

    case "UPDATE_IS_CURRENT_URL_VALID":
      newState.isCurrentUrlValid = action.isValid;
      return newState;

    default:
      return state;
  }
}
