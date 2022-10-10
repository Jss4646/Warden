import React, { useState } from "react";
import ScreenshotContainer from "./screenshot-container";

/**
 * Bar showing the baseline, comparison and difference screenshots
 */
const DashboardScreenshotsBar = (props) => {
  const scrollState = useState(0);

  const { screenshots, urls } = props;

  const {
    baselineScreenshot,
    comparisonScreenshot,
    diffImage,
    failing,
    loading,
  } = screenshots;

  const baselineImg = (
    <ScreenshotContainer
      src={baselineScreenshot}
      loading={loading}
      scrollState={scrollState}
    />
  );

  const changedImg = (
    <ScreenshotContainer
      src={comparisonScreenshot}
      loading={loading}
      scrollState={scrollState}
    />
  );

  const diffImg = (
    <ScreenshotContainer
      src={diffImage}
      loading={loading}
      scrollState={scrollState}
    />
  );

  let failingClass = failing
    ? "dashboard-screenshot-bar__screenshots--failing"
    : "";

  console.log(urls);
  return (
    <div className="dashboard-screenshot-bar">
      <h3 className="dashboard-screenshot-bar__title">{props.deviceName}</h3>
      <div className={`dashboard-screenshot-bar__screenshots ${failingClass}`}>
        <div className="dashboard-screenshot-bar__screenshot">
          <a href={urls.baseline} target="_blank" rel="noreferrer noopener">
            <h3>Baseline</h3>
          </a>
          {baselineImg}
        </div>
        <div className="dashboard-screenshot-bar__screenshot">
          <a href={urls.comparison} target="_blank" rel="noreferrer noopener">
            <h3>Changed</h3>
          </a>
          {changedImg}
        </div>
        <div className="dashboard-screenshot-bar__screenshot">
          <h3>Diff</h3>
          {diffImg}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreenshotsBar;
