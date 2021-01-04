function currentUser(state = [], action) {
  switch (action.type) {
    case "UPDATE_USERNAME":
      const stateCopy = { ...state };
      stateCopy.username = action.username;
      return stateCopy;

    default:
      return state;
  }
}

export default currentUser;
