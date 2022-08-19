import React, { Component } from "react";
import { Button, Empty, Input, Spin } from "antd";
import Page from "./page";
import { setPages } from "../../actions/siteData";

const { Search } = Input;

class PagesList extends Component {
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
   * Adds a page to the client
   *
   * @param url {string}
   * @returns {Promise<void>}
   */
  addPageClientSide = async (url) => {
    const parsedUrl = new URL(url);
    this.props.addPage(parsedUrl.pathname, {
      url: url.toString(),
      passingNum: "0/0",
      screenshots: {},
    });
  };

  /**
   * TODO Move to separate file
   * Adds a page to the db via the API
   *
   * @returns {Promise<void>}
   */
  addPage = async () => {
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
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  };

  /**
   * TODO Move to another file
   * Crawls the site via the api then adds the pages to the client
   *
   * @returns {Promise<void>}
   */
  crawlSite = async () => {
    this.toggleLoadingPages();
    const { sitePath, url } = this.props.siteData;
    const params = { sitePath: sitePath, url: url };
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

  // TODO merge all loops over pages
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

  /**
   * Gets the pages of a site
   *
   * @returns {JSX.Element|JSX.Element[]}
   */
  getPages() {
    const { pages } = this.props.siteData;

    if (this.state.loadingPages) {
      return <Spin />;
    } else if (Object.keys(pages).length > 0) {
      return Object.keys(pages).map((path) => {
        const page = pages[path];
        return <Page {...this.props} page={page} path={path} key={path} />;
      });
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  }

  trimPages = () => {
    const { pages } = this.props.siteData;
    const newPages = {};
    const foundPaths = [];
    const pagesToDelete = [];

    console.log("hi");
    Object.keys(pages).forEach((path) => {
      const page = pages[path];
      const paths = page.pagePath.split("/").filter((p) => p !== "");
      const pathPrefix = paths.slice(0, paths.length - 1).join("/");

      if (pathPrefix === "") {
        newPages[path] = page;
        return;
      }

      if (!foundPaths.includes(pathPrefix)) {
        newPages[path] = page;
        foundPaths.push(pathPrefix);
        return;
      }

      pagesToDelete.push(page._id);
    });

    this.props.setPages(newPages);
    fetch(`${window.location.origin}/api/delete-pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pages: pagesToDelete,
        sitePath: this.props.siteData.sitePath,
      }),
    }).catch(console.error);
  };

  render() {
    let pagesElement = this.getPages();

    const failingTabActiveClass =
      this.props.siteData.currentPage === "failing"
        ? "pages-list__failing-tab--selected"
        : "";

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
        <Button
          className="pages-list__trim-pages-button"
          onClick={this.trimPages}
        >
          Trim pages
        </Button>
        <div className="pages-list__pages">{pagesElement}</div>
      </div>
    );
  }
}

export default PagesList;
