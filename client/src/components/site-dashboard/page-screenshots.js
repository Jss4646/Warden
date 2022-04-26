import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";
import { runPageComparison } from "../../tools/comparison-tools";

class PageScreenshots extends Component {
  /**
   * Gets screenshots of both comparison and baseline urls along with the diff image for all devices
   * on the page then adding the images to state client side
   *
   * @returns {Promise<void>}
   */
  runComparison = () => {
    runPageComparison(
      this.props.siteData,
      this.props.siteData.currentPage,
      this.props.addScreenshots,
      this.props.setIsScreenshotFailing
    );
  };

  generateBaselines = () => {
    runPageComparison(
      this.props.siteData,
      this.props.siteData.currentPage,
      this.props.addScreenshots,
      this.props.setIsScreenshotFailing,
      true
    );
  };

  generateScreenshotBars(screenshots, devices) {
    return Object.keys(screenshots)
      .sort()
      .map((device) => {
        if (devices) {
          if (!devices.includes(device)) return "";
        }

        const comparisonScreenshots = screenshots[device];
        return (
          <DashboardScreenshotsBar
            screenshots={comparisonScreenshots}
            deviceName={device}
            key={device}
          />
        );
      });
  }

  render() {
    const { currentPage, pages, failingScreenshots } = this.props.siteData;
    const screenshots = pages[currentPage]?.screenshots;

    if (currentPage === "failing") {
      return (
        <div className="page-screenshots">
          <div className="page-screenshots__buttons-bar">
            <h1 className="dashboard-screenshot-bar__current-page-title">
              Failing Screenshots
            </h1>
          </div>
          {Object.keys(failingScreenshots)
            .sort()
            .map((site) => {
              const screenshots = pages[site].screenshots;
              const screenshotBar = this.generateScreenshotBars(
                screenshots,
                failingScreenshots[site]
              );

              screenshotBar.unshift(<h2>{site}</h2>);
              return screenshotBar;
            })}
        </div>
      );
    }

    if (currentPage) {
      return (
        <div className="page-screenshots">
          <div className="page-screenshots__buttons-bar">
            <h1 className="dashboard-screenshot-bar__current-page-title">
              {this.props.siteData.currentPage}
            </h1>
            <Button onClick={this.runComparison}>Run comparison</Button>
            <Button onClick={this.generateBaselines}>Generate baselines</Button>
          </div>
          {this.generateScreenshotBars(screenshots)}
        </div>
      );
    }

    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
}

export default PageScreenshots;
