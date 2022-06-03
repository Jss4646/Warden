import React, { Component } from "react";
import { Spin } from "antd";

/**
 * Creates a loading icon if url isn't present and displays the image if it is
 *
 * @param src {String} - image url
 * @param loading {boolean}
 * @returns {JSX.Element}
 */
const createScreenshotContainer = (src, loading) => {
  if (loading) {
    return <Spin />;
  }

  return (
    <div className="dashboard-screenshot-bar__screenshots-img">
      <img src={src} alt="Screenshot" />
    </div>
  );
};

/**
 * Bar showing the baseline, comparison and difference screenshots
 */
class DashboardScreenshotsBar extends Component {
  render() {
    const {
      baselineScreenshot,
      comparisonScreenshot,
      diffImage,
      failing,
      loading,
    } = this.props.screenshots;

    const baselineImg = createScreenshotContainer(baselineScreenshot, loading);
    const changedImg = createScreenshotContainer(comparisonScreenshot, loading);
    const diffImg = createScreenshotContainer(diffImage, loading);

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
