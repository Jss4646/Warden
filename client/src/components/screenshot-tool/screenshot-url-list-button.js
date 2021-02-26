import React, { Component } from "react";
import { Button } from "antd";
import takeScreenshot from "../../tools/take-screenshot";

class ScreenshotUrlListButton extends Component {
  screenshotUrlList = () => {
    const { urls, selectedDevices } = this.props.appState;
    // TODO add popup telling why canceled
    if (urls.length === 0) return;
    if (selectedDevices.length === 0) return;

    this._logScreenshots();

    for (const url of urls) {
        console.log(url)
        takeScreenshot(url, this.props);
    }
  };

  _logScreenshots() {
    const { urls, selectedDevices } = this.props.appState;

    const textContent = (
      <>
        Taking screenshots of:
        <code>
          {urls.map((url, index) => (
            <div key={index}>{url}</div>
          ))}
        </code>
        with devices:
        <code>
          {selectedDevices.map((device, index) => (
            <div key={index}>{device}</div>
          ))}
        </code>
      </>
    );
    this.props.addActivityLogLine(textContent, "screenshot-tool");
  }

  render() {
    return (
      <Button onClick={this.screenshotUrlList} id="screenshot-url-list-button">
        Screenshot URL List
      </Button>
    );
  }
}

export default ScreenshotUrlListButton;
