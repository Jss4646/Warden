import React, { Component } from "react";
import { Button } from "antd";

class CrawlUrlButton extends Component {
  crawlUrl = async () => {
    const {
      appState,
      importUrls,
      updateIsLoadingUrls,
      addActivityLogLine,
    } = this.props;
    const { isCurrentUrlValid, currentUrl } = appState;

    if (!isCurrentUrlValid) return;

    this._logCrawDetails("Starting crawl of");
    updateIsLoadingUrls(true);

    const res = await fetch(`${window.location.origin}/api/crawl-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: currentUrl }),
    }).catch((err) => {
      addActivityLogLine(
        <>
          Crawling url failed <code>${err}</code>
        </>
      );
    });

    if (res.ok) {
      const body = await res.json();
      const url = new URL(body.url);

      body.sites.unshift(`${url.origin}/`);
      importUrls(body.sites);

      this._logCrawDetails("Finished crawl of");
    } else {
      const error = await res.text();
      addActivityLogLine(error);
    }

    updateIsLoadingUrls(false);
  };

  _logCrawDetails(text) {
    const { currentUrl } = this.props.appState;

    const textContent = (
      <p>
        {text} <code>{currentUrl}</code>
      </p>
    );
    this.props.addActivityLogLine(textContent, "screenshot-tool");
  }

  render() {
    return (
      <Button onClick={this.crawlUrl} id="crawl-url-button">
        Crawl URL
      </Button>
    );
  }
}

export default CrawlUrlButton;
