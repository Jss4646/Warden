import React, { Component } from "react";
import { Button } from "antd";

class CrawlUrlButton extends Component {
  crawlUrl = async () => {
    const { appState, importUrls, updateIsLoadingUrls } = this.props;
    const { isCurrentUrlValid, currentUrl } = appState;
    if (isCurrentUrlValid) {
      updateIsLoadingUrls(true);
      const res = await fetch(`${process.env.REACT_APP_PROXY}/api/crawl-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentUrl }),
      });
      const body = await res.json();
      const url = new URL(body.url);
      body.sites.unshift(`${url.origin}/`);
      importUrls(body.sites);
      updateIsLoadingUrls(false);
    }
  };

  render() {
    return (
      <Button onClick={this.crawlUrl} id="crawl-url-button">
        Crawl URL
      </Button>
    );
  }
}

export default CrawlUrlButton;
