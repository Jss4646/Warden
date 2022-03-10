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
      this.props.addScreenshots
    );
  };

  generateBaselines = () => {
    runPageComparison(
      this.props.siteData,
      this.props.siteData.currentPage,
      this.props.addScreenshots,
      true
    );
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
            <Button onClick={this.generateBaselines}>Generate baselines</Button>
          </div>
          {Object.keys(screenshots)
            .sort()
            .map((device) => {
              const comparisonScreenshots = screenshots[device];
              return (
                <DashboardScreenshotsBar
                  screenshots={comparisonScreenshots}
                  deviceName={device}
                  key={device}
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
