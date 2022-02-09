import React, { Component } from "react";
import { Spin } from "antd";

const createScreenshotContainer = (src) => {
  return src ? (
    <div className="dashboard-screenshot-bar__screenshots-img">
      <img src={src} alt="Screenshot" />
    </div>
  ) : (
    <Spin />
  );
};

class DashboardScreenshotsBar extends Component {
  render() {
    const { baselineScreenshot, comparisonScreenshot, diffImage } =
      this.props.screenshots;

    const baselineImg = createScreenshotContainer(baselineScreenshot);
    const changedImg = createScreenshotContainer(comparisonScreenshot);
    const diffImg = createScreenshotContainer(diffImage);

    return (
      <div className="dashboard-screenshot-bar">
        <h2>{this.props.deviceName}</h2>
        <div className="dashboard-screenshot-bar__screenshots">
          <div className="dashboard-screenshot-bar__screenshot">
            <h3>Baseline</h3>
            {baselineImg}
          </div>
          <div className="dashboard-screenshot-bar__screenshot">
            <h3>Changed</h3>
            {changedImg}
          </div>
          <div className="dashboard-screenshot-bar__screenshot">
            <h3>Diff</h3>
            {diffImg}
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardScreenshotsBar;
