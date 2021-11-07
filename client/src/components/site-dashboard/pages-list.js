import React, { Component } from "react";
import { Button, Input } from "antd";
import Page from "./page";

const { Search } = Input;

class PagesList extends Component {
  state = { addPagePath: "" };

  setAddPagePath = (event) => {
    const newState = { ...this.state };
    newState.addPagePath = event.target.value;
    this.setState(newState);
  };

  addPage = async () => {
    const url = new URL(this.props.siteData.siteUrl);
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
    const { sitePath, siteUrl } = this.props.siteData;
    console.log(sitePath);
    const params = { sitePath: sitePath, url: siteUrl };
    const fetchUrl = new URL(`${window.location.origin}/api/fill-site-pages`);

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
        <Button className="pages-list__crawl-site" onClick={this.crawlSite}>
          Crawl site
        </Button>
        <Search placeholder="search for page" />
        <div className="pages-list__pages">
          {Object.keys(pages).map((path) => {
            const page = pages[path];
            return <Page {...this.props} page={page} path={path} key={path} />;
          })}
        </div>
      </div>
    );
  }
}

export default PagesList;
