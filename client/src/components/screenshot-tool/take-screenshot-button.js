import React, { Component } from "react";
import { Button } from "antd";
import takeScreenshot from "../../tools/take-screenshot";

class TakeScreenshotButton extends Component {
  screenshotUrl = async () => {
    const {
      currentUrl,
      isCurrentUrlValid,
      selectedDevices,
    } = this.props.appState;
    // TODO add popup telling why canceled
    if (!isCurrentUrlValid) return;
    if (selectedDevices.length === 0) return;

    this._logScreenshot();
    await takeScreenshot(currentUrl, this.props);
  };

  _logScreenshot() {
    const { currentUrl, selectedDevices } = this.props.appState;

    const textContent = (
      <>
        <p>
          Taking screenshot of <code>{currentUrl}</code> with devices:
        </p>
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
