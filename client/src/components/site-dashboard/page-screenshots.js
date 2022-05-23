import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";
import { runPageComparison } from "../../tools/comparison-tools";

class PageScreenshots extends Component {
  numOfFailing = 0;
  numInQueue = 0;

  componentDidMount() {
    this.props.setNumOfFailing(this.numOfFailing);
    this.props.setNumInQueue(this.numInQueue);
  }

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

  generateScreenshotBars(page, hidePassing) {
    return Object.keys(page).map((device) => {
      const screenshots = page[device];

      if (screenshots.failing) {
        this.numOfFailing += 1;
      }

      if (screenshots.loading) {
        this.numOfFailing += 1;
      }

      if (screenshots.failing || !hidePassing) {
        return (
          <DashboardScreenshotsBar
            screenshots={screenshots}
            deviceName={device}
            key={device}
          />
        );
      }

      return "";
    });
  }

  render() {
    this.numOfFailing = 0;
    const { currentPage, pages } = this.props.siteData;
    const screenshots = pages[currentPage]?.screenshots;

    const failingScreenshots = Object.keys(pages)
      .sort()
      .map((site) => {
        const screenshots = pages[site].screenshots;
        const screenshotBars = this.generateScreenshotBars(screenshots, true);
        if (screenshotBars.length > 0) {
          return (
            <div key={site}>
              <h2>{site}</h2>
              {screenshotBars}
            </div>
          );
        } else {
          return "";
        }
      });

    if (currentPage === "failing") {
      return (
        <div className="page-screenshots">
          <div className="page-screenshots__buttons-bar">
            <h1 className="dashboard-screenshot-bar__current-page-title">
              Failing Screenshots
            </h1>
          </div>
          {failingScreenshots}
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
