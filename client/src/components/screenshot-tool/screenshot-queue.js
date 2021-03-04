import React, { Component } from "react";
import {
  ApiOutlined,
  CheckOutlined,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

class ScreenshotQueue extends Component {
  cancelScreenshot = (abortController) => {
    abortController.abort();
  };

  cancelAllScreenshots = () => {
    const { screenshotQueue } = this.props.appState;
    screenshotQueue.forEach((screenshot) => {
      screenshot.abortController.abort();
    });
  };

  render() {
    const { screenshotQueue } = this.props.appState;

    return (
      <div className="screenshot-queue">
        <ol className="screenshot-queue__list">
          {screenshotQueue.map((screenshot, index) => {
            let logo;
            switch (screenshot.state) {
              case "running":
                logo = <LoadingOutlined className="screenshot-queue__icon" />;
                break;

              case "done":
                logo = <CheckOutlined className="screenshot-queue__icon" />;
                break;

              case "broken":
                logo = (
                  <ApiOutlined className="screenshot-queue__icon screenshot-queue__icon--broken" />
                );
                break;

              case "canceled":
                logo = (
                  <CloseCircleFilled className="screenshot-queue__icon screenshot-queue__icon--canceled" />
                );
                break;

              default:
                throw new Error(
                  `${screenshot.state} is not a valid screenshot state`
                );
            }

            const cancelButton =
              screenshot.state === "running" ? (
                <Button
                  type="link"
                  className="screenshot-queue__cancel"
                  onClick={() =>
                    this.cancelScreenshot(screenshot.abortController)
                  }
                >
                  Cancel
                </Button>
              ) : undefined;

            const runTime =
              screenshot.endTime !== 0
                ? (screenshot.endTime - screenshot.startTime) / 1000
                : "---";

            return (
              <li className="screenshot-queue__list-item" key={index}>
                {logo}
                <div className="screenshot-queue__details">
                  <span className="screenshot-queue__url">
                    {screenshot.url.host}
                    {screenshot.url.pathname}
                  </span>
                  <span className="screenshot-queue__device">
                    {screenshot.deviceName}
                  </span>
                </div>
                <span id="screenshot-time-taken">{runTime}s</span>
                <span id="screenshot-status">
                  {screenshot.state.replace(/^\w/, (c) => c.toUpperCase())}
                </span>
                {cancelButton}
              </li>
            );
          })}
        </ol>

        <Button
          className="screenshot-queue__cancel-all"
          onClick={() => this.cancelAllScreenshots()}
        >
          Cancel all
        </Button>
      </div>
    );
  }
}

export default ScreenshotQueue;
