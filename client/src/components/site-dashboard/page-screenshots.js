import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";
import { default as devicesData } from "../../data/devices.json";
import pixelmatch from "pixelmatch";

class PageScreenshots extends Component {
  runComparison = async () => {
    const { devices, url, comparisonUrl } = this.props.siteData;
    for (const device of devices) {
      const { height, width, userAgent } = devicesData[device];
      const screenshotQueue = [];

      const baselineFilename = this._createFilename(url);
      const comparisonFilename = this._createFilename(comparisonUrl);

      screenshotQueue.push(
        this._generateScreenshot(
          url,
          baselineFilename,
          { width, height },
          userAgent
        ),
        this._generateScreenshot(
          comparisonUrl,
          comparisonFilename,
          { width, height },
          userAgent
        )
      );

      this.props.addScreenshots(new URL(url).pathname, device, {});

      const diffImageUrl = await this._createDiffImage(screenshotQueue);

      this.props.addScreenshots(new URL(url).pathname, device, {
        baseline: `${window.location.origin}/api/screenshots/${baselineFilename}.png`,
        changed: `${window.location.origin}/api/screenshots/${comparisonFilename}.png`,
        diff: diffImageUrl,
      });
    }
  };

  async _createDiffImage(screenshotQueue) {
    const screenshotResponses = await Promise.all(screenshotQueue);
    const screenshotBuffers = screenshotResponses.map(async (screenshot) => {
      const screenshotBlob = await screenshot.blob();
      return await createImageBitmap(screenshotBlob);
    });

    let [baselineScreenshot, changedScreenshot] = await Promise.all(
      screenshotBuffers
    );
    const { width: baselineWidth, height: baselineHeight } = baselineScreenshot;

    const baselineImageData = this._createImageData(
      baselineScreenshot,
      baselineWidth,
      baselineHeight
    );
    const changedImageData = this._createImageData(
      changedScreenshot,
      baselineWidth,
      baselineHeight
    );

    const diffCanvas = document.createElement("canvas");
    diffCanvas.width = baselineWidth;
    diffCanvas.height = baselineHeight;
    const diffContext = diffCanvas.getContext("2d");
    const diff = diffContext.createImageData(baselineWidth, baselineHeight);

    console.log(baselineScreenshot, changedScreenshot, diff.data);
    const pixelDiff = pixelmatch(
      changedImageData.data,
      baselineImageData.data,
      diff.data,
      baselineWidth,
      baselineHeight,
      { threshold: 0.1 }
    );

    console.log(
      "Difference: ",
      (pixelDiff / (baselineWidth * baselineHeight)) * 100
    );

    diffContext.putImageData(diff, 0, 0);
    const dataUrl = diffCanvas.toDataURL();
    return dataUrl;
  }

  _generateScreenshot(url, fileName, resolution, userAgent) {
    const params = {
      url,
      resolution,
      userAgent,
      fileName,
    };

    return fetch(`${window.location.origin}/api/take-screenshot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      // TODO cancel button
      // signal: abortSignal,
    });
  }

  _createFilename(url) {
    const date = new Date();
    url = new URL(url);

    let path = url.pathname === "/" ? "" : `${url.pathname}-`;
    path = path.replaceAll("/", "-");

    const fileNameDate = `${date.getMilliseconds()}-${date.getSeconds()}-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
    return `${url.host}-${path}${fileNameDate}`;
  }

  _createImageData(screenshot, width, height) {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = width;
    canvasElement.height = height;
    const context = canvasElement.getContext("2d");
    context.drawImage(screenshot, 0, 0);
    return context.getImageData(0, 0, width, height);
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
