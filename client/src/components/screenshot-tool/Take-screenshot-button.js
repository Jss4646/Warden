import React, { Component } from "react";
import { Button } from "antd";
import takeScreenshot from "../../tools/take-screenshot";

class TakeScreenshotButton extends Component {
  screenshotUrl = async () => {
    const { currentUrl, isCurrentUrlValid } = this.props.appState;

    if (isCurrentUrlValid) {
      takeScreenshot(currentUrl, this.props);
    }
  };

  render() {
    return (
      <Button
        onClick={this.screenshotUrl}
        type="primary"
        id="take-screenshot-button"
      >
        Take Screenshot
      </Button>
    );
  }
}

export default TakeScreenshotButton;
