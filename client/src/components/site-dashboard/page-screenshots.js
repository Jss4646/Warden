import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";
import { default as devicesData } from "../../data/devices.json";

class PageScreenshots extends Component {
  runComparison = async () => {
    const { devices, url, comparisonUrl, sitePath } = this.props.siteData;
    console.log(devices);
    for (const device of devices) {
      const { height, width, userAgent } = devicesData[device];
      const screenshotData = { resolution: { height, width }, userAgent };

      const baselineFilename = this._createFilename(url, device);
      const comparisonFilename = this._createFilename(comparisonUrl, device);

      const baselineScreenshotData = {
        ...screenshotData,
        url,
        fileName: baselineFilename,
      };
      const comparisonScreenshotData = {
        ...screenshotData,
        url: comparisonUrl,
        fileName: comparisonFilename,
      };

      this.props.addScreenshots(new URL(url).pathname, device, {});

      await this._generateScreenshots(
        baselineScreenshotData,
        comparisonScreenshotData,
        sitePath,
        device
      );

      this.props.addScreenshots(new URL(url).pathname, device, {
        baseline: `${window.location.origin}/api/screenshots/${baselineFilename}.png`,
        changed: `${window.location.origin}/api/screenshots/${comparisonFilename}.png`,
        diff: `${window.location.origin}/api/screenshots/${baselineFilename}-diff.png`,
      });
    }
  };

  _generateScreenshots(
    baselineScreenshotData,
    comparisonScreenshotData,
    sitePath,
    device
  ) {
    return fetch(`${window.location.origin}/api/run-comparison`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baselineScreenshotData,
        comparisonScreenshotData,
        sitePath,
        device,
      }),
      // TODO cancel button
      // signal: abortSignal,
    });
  }

  _createFilename(url, device) {
    const date = new Date();
    url = new URL(url);

    let path = url.pathname === "/" ? "" : `${url.pathname}-`;
    path = path.replaceAll("/", "-");

    let deviceSanitised = device.replaceAll("/", "-");

    const fileNameDate = `${date.getMilliseconds()}-${date.getSeconds()}-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}-${deviceSanitised}`;
    return `${url.host}-${path}${fileNameDate}`;
  }

  render() {
    const { currentPage, pages } = this.props.siteData;
    const screenshots = pages[currentPage]?.screenshots;

    if (currentPage) {
      return (
        <div className="page-screenshots">
          <div className="page-screenshots__buttons-bar">
            <h1 className="dashboard-screenshot-bar__current-page-title">
              {this.props.siteData.currentPage}
            </h1>
            <Button onClick={this.runComparison}>Run comparison</Button>
            <Button>Generate baselines</Button>
          </div>
          {Object.keys(screenshots).map((device) => {
            const comparisonScreenshots = screenshots[device];
            return (
              <DashboardScreenshotsBar
                screenshots={comparisonScreenshots}
                deviceName={device}
              />
            );
          })}
        </div>
      );
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  }
}

export default PageScreenshots;
