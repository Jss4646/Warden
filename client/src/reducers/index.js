import { combineReducers } from "redux";

import currentUser from "./currentUser";
import appState from "./appState";

const rootReducer = combineReducers({
  currentUser,
  appState,
});

export default rootReducer;
