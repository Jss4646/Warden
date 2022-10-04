import React, { Component, useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import ScreenshotContainer from "./screenshot-container";

/**
 * Bar showing the baseline, comparison and difference screenshots
 */
const DashboardScreenshotsBar = (props) => {
  const scrollState = useState(0);

  const {
    baselineScreenshot,
    comparisonScreenshot,
    diffImage,
    failing,
    loading,
  } = props.screenshots;

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

  return (
    <div className="dashboard-screenshot-bar">
      <h3 className="dashboard-screenshot-bar__title">{props.deviceName}</h3>
      <div className={`dashboard-screenshot-bar__screenshots ${failingClass}`}>
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
};

export default DashboardScreenshotsBar;
