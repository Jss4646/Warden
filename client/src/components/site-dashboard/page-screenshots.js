import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";
import { default as devicesData } from "../../data/devices.json";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs/browser";

class PageScreenshots extends Component {
  runComparison = async () => {
    const { devices, url, comparisonUrl } = this.props.siteData;
    console.log(devices);
    for (const device of devices) {
      const { height, width, userAgent } = devicesData[device];
      const imageUrls = {};

      const screenshotQueue = [];

      for (let i = 0; i < 2; i++) {
        const date = new Date();
        let paramUrl = i === 0 ? url : comparisonUrl;
        paramUrl = new URL(paramUrl);

        let path = paramUrl.pathname === "/" ? "" : `${paramUrl.pathname}-`;
        path = path.replaceAll("/", "-");

        const fileName = `${
          paramUrl.host
        }-${path}${date.getMilliseconds()}-${date.getSeconds()}-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;

        if (i === 0) {
          imageUrls.baseline = fileName;
        } else {
          imageUrls.comparison = fileName;
        }

        const params = {
          url: paramUrl,
          resolution: { width, height },
          userAgent,
          fileName,
        };

        screenshotQueue.push(
          fetch(`${window.location.origin}/api/take-screenshot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
            // TODO cancel button
            // signal: abortSignal,
          })
        );
      }

      this.props.addScreenshots(new URL(url).pathname, device, {});

      const screenshotResponses = await Promise.all(screenshotQueue);
      const screenshotBuffers = screenshotResponses.map(async (screenshot) => {
        const screenshotBlob = await screenshot.blob();
        const screenshotArray = await screenshotBlob.arrayBuffer();

        return new Uint8ClampedArray(screenshotArray);
      });
      let [baselineScreenshot, changedScreenshot] = await Promise.all(
        screenshotBuffers
      );

      const fullHeight = baselineScreenshot.length / width / 4;

      // const diffCanvas = document.createElement("canvas");
      // const diffContext = diffCanvas.getContext("2d");
      // const imageData = new ImageData(baselineScreenshot, width);
      // const diff = diffContext.createImageData(imageData);
      const diffImgArray = new Uint8Array(baselineScreenshot.length);
      const diff = new PNG(width, fullHeight);

      console.log(baselineScreenshot, changedScreenshot, diffImgArray);
      const pixelDiff = pixelmatch(
        baselineScreenshot,
        baselineScreenshot,
        diff,
        width,
        fullHeight,
        { threshold: 0.1 }
      );

      // const diffCanvas = document.createElement("canvas");
      // const diffContext = diffCanvas.getContext("2d");
      // diffCanvas.width = width;
      // diffCanvas.height = fullHeight;
      // const imageData = new ImageData(diffImgArray, width);
      // diffContext.putImageData(imageData, 0, 0);

      // diffContext.putImageData(diff, 0, 0);
      // const dataUrl = diffCanvas.toDataURL();

      this.props.addScreenshots(new URL(url).pathname, device, {
        baseline: `${window.location.origin}/api/screenshots/${imageUrls.baseline}.png`,
        changed: `${window.location.origin}/api/screenshots/${imageUrls.comparison}.png`,
        diff: diff,
      });
    }
  };

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
