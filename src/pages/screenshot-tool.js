import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";

class ScreenshotTool extends Component {
  render() {
    return <div>This is the screenshot tool page</div>;
  }
}

ScreenshotTool = bindComponentToState(ScreenshotTool);
export default ScreenshotTool;
