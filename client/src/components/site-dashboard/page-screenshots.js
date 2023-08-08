import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";
import { runPageComparison } from "../../tools/comparison-tools";
import devices from "../../data/devices.json";

/** The middle section of the dashboard showing the pages and their screenshots */
class PageScreenshots extends Component {
  /**
   * Gets screenshots of both comparison and baseline urls along with the diff image for all devices
   * on the page then adding the images to state client side
   *
   * @returns {Promise<void>}
   */
  runComparison = () => {
    runPageComparison(this.props.siteData, [this.props.siteData.currentPage]);
  };

  /**
   * Generates the baseline and comparison screenshots for the current page
   */
  generateBaselines = () => {
    runPageComparison(
      this.props.siteData,
      [this.props.siteData.currentPage],
      true
    );
  };

  /**
   * Generates the screenshot bars for the current page or failing screenshots
   * @param {Object} page
   * @param {string} path
   * @param {Boolean} hidePassing
   * @returns {string|[DashboardScreenshotsBar]}
   */
  generateScreenshotBars(page, path, hidePassing) {
    if (!page) {
      return "";
    }

    const screenshotBars = Object.keys(page)
      .sort()
      .map((device) => {
        const deviceName = devices[device]?.name;
        const screenshots = page[device];

        if ((screenshots.failing && !screenshots.loading) || !hidePassing) {
          const urls = {
            baseline: this.props.siteData.url,
            comparison: this.props.siteData.comparisonUrl,
          };

          return (
            <DashboardScreenshotsBar
              urls={urls}
              screenshots={screenshots}
              deviceName={deviceName}
              page={path}
              key={device}
            />
          );
        }

        return "";
      });

    return screenshotBars.filter((bar) => bar !== "");
  }

  /**
   * Removes the current page from the UI and db
   */
  removePage = () => {
    const { pages, currentPage, sitePath } = this.props.siteData;

    const params = {
      pagePath: pages[currentPage].pagePath,
      sitePath,
    };
    fetch(`${window.location.origin}/api/delete-site-page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).catch((err) => console.error(err));

    this.props.removePage(currentPage);
  };

  render() {
    const { currentPage, pages } = this.props.siteData;
    const screenshots = pages[currentPage]?.screenshots;

    if (currentPage === "failing") {
      const failingScreenshots = this.generateFailingScreenshots(pages);

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

    let removePageButton = this.createRemovePageButton(currentPage);

    if (currentPage) {
      return (
        <div className="page-screenshots">
          <div className="page-screenshots__buttons-bar">
            <h1 className="dashboard-screenshot-bar__current-page-title">
              {currentPage}
            </h1>
            <Button onClick={this.runComparison}>Run comparison</Button>
            <Button onClick={this.generateBaselines}>Generate baselines</Button>
            {removePageButton}
          </div>
          {this.generateScreenshotBars(screenshots, currentPage, false)}
        </div>
      );
    }

    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  /**
   * Creates the remove page button if the current page is not the home page
   *
   * @param {String} currentPage - the current page
   * @returns {JSX.Element}
   */
  createRemovePageButton(currentPage) {
    let removePageButton;
    if (currentPage !== "/") {
      removePageButton = (
        <Button onClick={this.removePage} danger>
          Remove Page
        </Button>
      );
    }
    return removePageButton;
  }

  /**
   * Generates the screenshot bars for the failing screenshots
   *
   * @param {Object} pages - the pages object
   * @returns {Array[JSX.Element]}
   */
  generateFailingScreenshots = (pages) => {
    return Object.keys(pages)
      .sort()
      .map((site) => {
        const screenshots = pages[site].screenshots;
        const screenshotBars = this.generateScreenshotBars(
          screenshots,
          site,
          true
        );
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
  };
}

export default PageScreenshots;
