import React, { Component } from "react";
import { Button } from "antd";
import takeScreenshot from "../../tools/take-screenshot";

class ScreenshotUrlListButton extends Component {
  screenshotUrlList = () => {
    const { urls } = this.props.appState;
    if (urls.length === 0) return;

    for (const url of urls) {
      takeScreenshot(url, this.props);
    }
  };

  render() {
    return (
      <Button onClick={this.screenshotUrlList} id="screenshot-url-list-button">
        Screenshot URL List
      </Button>
    );
  }
}

export default ScreenshotUrlListButton;
