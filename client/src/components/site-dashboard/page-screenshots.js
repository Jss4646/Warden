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
    runPageComparison(this.props.siteData, [this.props.siteData.currentPage]);
  };

  generateBaselines = () => {
    runPageComparison(
      this.props.siteData,
      [this.props.siteData.currentPage],
      true
    );
  };

  generateScreenshotBars(page, hidePassing) {
    if (!page) {
      return "";
    }

    const date = Date.now();

    const screenshotBars = Object.keys(page).map((device) => {
      const screenshots = page[device];

      if (screenshots.failing && !screenshots.loading) {
        this.numOfFailing += 1;
      }

      if (screenshots.loading) {
        this.numOfFailing += 1;
      }

      if ((screenshots.failing && !screenshots.loading) || !hidePassing) {
        return (
          <DashboardScreenshotsBar
            screenshots={screenshots}
            deviceName={device}
            date={date}
            key={device}
          />
        );
      }

      return "";
    });

    return screenshotBars.filter((bar) => bar !== "");
  }

  removePage = () => {
    const params = {
      pageId: this.props.siteData.pages[this.props.siteData.currentPage]._id,
      sitePath: this.props.siteData.sitePath,
    };
    fetch(`${window.location.origin}/api/delete-site-page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).catch((err) => console.error(err));

    this.props.removePage(this.props.siteData.currentPage);
  };

  render() {
    this.numOfFailing = 0;
    const { currentPage, pages } = this.props.siteData;
    const screenshots = pages[currentPage]?.screenshots;

    if (currentPage === "failing") {
      const failingScreenshots = Object.keys(pages)
        .sort()
        .map((site) => {
          const screenshots = pages[site].screenshots;
          const screenshotBars = this.generateScreenshotBars(screenshots, true);
          if (Object.keys(screenshotBars).length > 0) {
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

    let removePageButton;
    if (currentPage !== "/") {
      removePageButton = (
        <Button onClick={this.removePage} danger>
          Remove Page
        </Button>
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
            {removePageButton}
          </div>
          {this.generateScreenshotBars(screenshots)}
        </div>
      );
    }

    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
}

export default PageScreenshots;
