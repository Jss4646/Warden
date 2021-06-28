import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "../actions/actionCreators";

function bindComponentToState(component) {
  return connect(mapStateToProps, mapDispatchToProps)(component);
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    appState: state.appState,
    siteData: state.siteData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default bindComponentToState;
