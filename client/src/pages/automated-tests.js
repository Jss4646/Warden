import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";

class AutomatedTests extends Component {
  render() {
    return <div>This is the testing tool page</div>;
  }
}

AutomatedTests = bindComponentToState(AutomatedTests);
export default AutomatedTests;
