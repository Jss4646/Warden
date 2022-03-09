import React, { Component } from "react";
import { Button, Empty, Input, Spin } from "antd";
import Page from "./page";

const { Search } = Input;

class PagesList extends Component {
  state = { addPagePath: "", loadingPages: false };

  /**
   *
   * @param event {string}
   */
  setAddPagePath = (event) => {
    const newState = { ...this.state };
    newState.addPagePath = event.target.value;
    this.setState(newState);
  };

  toggleLoadingPages() {
    const newState = { ...this.state };
    newState.loadingPages = !newState.loadingPages;
    this.setState(newState);
  }

  addPageClientSide = async (url) => {
    url = new URL(url);
    this.props.addPage(url.pathname, {
      url,
      passingNum: "0/0",
      screenshots: {},
    });
  };

  addPage = async () => {
    const url = new URL(this.props.siteData.url);
    url.pathname = this.state.addPagePath;
    const newPage = { url, passingNum: "0/0", screenshots: {} };

    this.props.addPage(url.pathname, newPage);

    const params = {
      sitePath: this.props.siteData.sitePath,
      newPage,
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
    })
      .then((res) => res.json())
      .then((urls) => {
        urls.forEach((url) => {
          this.addPageClientSide(url);
        });
      });
    this.toggleLoadingPages();
  };

  removeAllPages = async () => {
    this.props.removeAllPages();
    const { sitePath } = this.props.siteData;
    const params = { sitePath: sitePath };
    const fetchUrl = new URL(
      `${window.location.origin}/api/delete-all-site-pages`
    );

    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  };

  render() {
    const { pages } = this.props.siteData;
    let pagesElement;
    if (this.state.loadingPages) {
      pagesElement = <Spin />;
    } else if (Object.keys(pages).length > 0) {
      pagesElement = Object.keys(pages).map((path) => {
        const page = pages[path];
        return <Page {...this.props} page={page} path={path} key={path} />;
      });
    } else {
      pagesElement = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <div className="pages-list">
        <div className="pages-list__failing-tab">
          <span className="pages-list__failing-text">Failing: </span>
          <span>0</span>
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
        <Search placeholder="search for page" />
        <div className="pages-list__pages">{pagesElement}</div>
      </div>
    );
  }
}

export default PagesList;
