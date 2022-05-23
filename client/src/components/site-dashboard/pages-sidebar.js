import React, { Component } from "react";
import { withRouter } from "react-router";
import PagesList from "./pages-list";
import { Button } from "antd";
import { runPageComparison } from "../../tools/comparison-tools";

class PagesSidebar extends Component {
  async componentDidMount() {
    await this.getStatus();
  }

  /**
   * Gets status of site and updates color of icon depending on result
   *
   * @returns {Promise<void>}
   */
  async getStatus() {
    const params = { url: this.props.siteData.url };

    const fetchUrl = new URL(`${window.location.origin}/api/get-site-status`);
    const siteData = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res.text();
      }
    });

    this.props.setSiteStatus(siteData.siteStatus);
  }

  /**
   * Deletes the site locally and on the db
   *
   * @returns {Promise<void>}
   */
  deleteSite = async () => {
    const params = { sitePath: this.props.siteData.sitePath };
    const fetchUrl = new URL(`${window.location.origin}/api/delete-site`);

    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status === 200) {
        this.props.history.push("/sites");
      } else {
        console.error(res.text());
      }
    });
  };

  runComparison = () => {
    const { pages } = this.props.siteData;
    console.log(pages);

    for (const page in pages) {
      runPageComparison(
        this.props.siteData,
        page,
        this.props.addScreenshots,
        this.props.setIsScreenshotFailing
      );
    }
  };

  generateBaselines = () => {
    const { pages } = this.props.siteData;
    console.log(pages);

    for (const page in pages) {
      runPageComparison(
        this.props.siteData,
        page,
        this.props.addScreenshots,
        this.props.setIsScreenshotFailing,
        true
      );
    }
  };

  calculateNumInQueue(pages) {
    return Object.keys(pages).reduce((sum, site) => {
      const screenshots = pages[site].screenshots;

      Object.keys(screenshots).forEach((device) => {
        const screenshot = screenshots[device];
        if (screenshot.loading) {
          sum += 1;
        }
      }, 0);

      return sum;
    }, 0);
  }

  render() {
    const { siteName, url, siteStatus, pages } = this.props.siteData;

    const numInQueue = this.calculateNumInQueue(pages);

    return (
      <div className="pages-sidebar">
        <div
          className={`pages-sidebar__site-status ${
            siteStatus === "" || !siteStatus
              ? ""
              : siteStatus === "OK"
              ? "pages-sidebar__site-status--ok"
              : "pages-sidebar__site-status--not-ok"
          }`}
        />
        <a href={url} target="_blank" rel="noreferrer">
          <h1 className="pages-sidebar__site-name">{siteName}</h1>
        </a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="pages-sidebar__delete-site" onClick={this.deleteSite}>
          Delete site
        </a>
        <div className="pages-sidebar__buttons">
          <Button onClick={this.runComparison}>Run comparison</Button>
          <Button onClick={this.generateBaselines}>Generate baselines</Button>
        </div>
        <span className="pages-sidebar__comparison-text">
          Comparisons in queue: {numInQueue}
        </span>
        <PagesList {...this.props} />
      </div>
    );
  }
}

export default withRouter(PagesSidebar);
