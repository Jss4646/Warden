import React, { Component } from "react";
import { Spin } from "antd";

/**
 * Creates a loading icon if url isn't present and displays the image if it is
 *
 * @param src {String} - image url
 * @returns {JSX.Element}
 */
const createScreenshotContainer = (src) => {
  return src ? (
    <div className="dashboard-screenshot-bar__screenshots-img">
      <img src={src} alt="Screenshot" />
    </div>
  ) : (
    <Spin />
  );
};

/**
 * Bar showing the baseline, comparison and difference screenshots
 */
class DashboardScreenshotsBar extends Component {
  render() {
    const { baselineScreenshot, comparisonScreenshot, diffImage, failing } =
      this.props.screenshots;

    const baselineImg = createScreenshotContainer(baselineScreenshot);
    const changedImg = createScreenshotContainer(comparisonScreenshot);
    const diffImg = createScreenshotContainer(diffImage);

    let failingClass = failing
      ? "dashboard-screenshot-bar__screenshots--failing"
      : "";

    return (
      <div className="dashboard-screenshot-bar">
        <h3 className="dashboard-screenshot-bar__title">
          {this.props.deviceName}
        </h3>
        <div
          className={`dashboard-screenshot-bar__screenshots ${failingClass}`}
        >
          <div className="dashboard-screenshot-bar__screenshot">
          <a href={'#'}>
            <h3>Baseline</h3>
          </a>
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
