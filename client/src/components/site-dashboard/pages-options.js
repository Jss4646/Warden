import React, { Component } from "react";
import { Button, Input } from "antd";
import PagesList from "./pages-list";

/**
 * Options that change the page list
 */
class PagesOptions extends Component {
  state = { addPagePath: "", loadingPages: false };

  /**
   * Updates user inputted new page path
   *
   * @param event {Event}
   */
  setAddPagePath = (event) => {
    const newState = { ...this.state };
    newState.addPagePath = event.target.value;
    this.setState(newState);
  };

  /**
   * Toggles loading state
   */
  toggleLoadingPages() {
    const newState = { ...this.state };
    newState.loadingPages = !newState.loadingPages;
    this.setState(newState);
  }

  /**
   * Adds a page to the db via the API
   *
   * @returns {Promise<void>}
   */
  addPage = () => {
    const url = new URL(this.props.siteData.url);
    url.pathname = this.state.addPagePath;
    const newPage = {
      url: url.toString(),
      screenshots: {},
      failing: false,
    };

    this.props.addPage(url.pathname, newPage);

    const params = {
      sitePath: this.props.siteData.sitePath,
      ...newPage,
      pagePath: url.pathname,
    };

    const fetchUrl = new URL(`${window.location.origin}/api/add-site-page`);
    fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).catch(console.error);
  };

  /**
   * TODO Move to another file
   * Crawls the site via the api then adds the pages to the client
   *
   * @returns {Promise<void>}
   */
  crawlSite = async () => {
    this.toggleLoadingPages();
    const { sitePath, url, trimPages } = this.props.siteData;
    const params = { sitePath, url, trimPages };
    const fetchUrl = new URL(`${window.location.origin}/api/fill-site-pages`);

    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    this.toggleLoadingPages();
  };

  /**
   * Removes all pages from the client and db
   *
   * @returns {Promise<void>}
   */
  removeAllPages = async () => {
    const { sitePath } = this.props.siteData;
    const params = { sitePath: sitePath };
    const fetchUrl = new URL(
      `${window.location.origin}/api/delete-all-site-pages`
    );

    this.props.setCurrentPage("");

    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  };

  /**
   * Calculates the number of failing pages
   *
   * @param {Object} pages - The pages object to calculate the number of failing
   * @returns {number} - The number of failing pages
   */
  calculateFailing(pages) {
    return Object.keys(pages).reduce((sum, site) => {
      const screenshots = pages[site].screenshots;

      Object.keys(screenshots).forEach((device) => {
        const screenshot = screenshots[device];
        if (screenshot.failing) {
          sum += 1;
        }
      }, 0);

      return sum;
    }, 0);
  }

  render() {
    const { currentPage, pages } = this.props.siteData;

    const failingTabActiveClass =
      currentPage === "failing" ? "pages-list__failing-tab--selected" : "";

    return (
      <div className="pages-list">
        <div
          className={`pages-list__failing-tab ${failingTabActiveClass}`}
          onClick={() => this.props.setCurrentPage("failing")}
        >
          <span className="pages-list__failing-text">Failing: </span>
          <span>{this.calculateFailing(this.props.siteData.pages)}</span>
        </div>
        <div className="pages-list__add-page">
          <Button
            className="pages-list__add-page-button"
            onClick={this.addPage}
          >
            Add page
          </Button>
          <Input
            className="pages-list__add-page-input"
            placeholder="/example"
            value={this.state.addPagePath}
            onChange={this.setAddPagePath}
          />
        </div>
        <div className="pages-list__buttons">
          <Button className="pages-list__crawl-site" onClick={this.crawlSite}>
            Crawl site
          </Button>
          <Button onClick={this.removeAllPages}>Remove all pages</Button>
        </div>
        <div className="pages-list__pages">
          <PagesList
            pages={pages}
            loadingPages={this.state.loadingPages}
            currentPage={currentPage}
            setCurrentPage={this.props.setCurrentPage}
          />
        </div>
      </div>
    );
  }
}

export default PagesOptions;
