import { combineReducers } from "redux";

import currentUser from "./currentUser";
import appState from "./appState";
import siteData from "./siteData";

const rootReducer = combineReducers({
  currentUser,
  appState,
  siteData,
});

export default rootReducer;
