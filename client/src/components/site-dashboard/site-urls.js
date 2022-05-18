import React, { Component } from "react";
import { Button, Input } from "antd";

class SiteUrls extends Component {
  state = { statusText: "" };

  updateStatusText(newText) {
    const stateCopy = { ...this.state };
    stateCopy.statusText = newText;
    this.setState(stateCopy);
  }

  updateUrls = async () => {
    const { sitePath, url, comparisonUrl } = this.props.siteData;

    this.updateStatusText("Saving urls...");

    await fetch("/api/update-baseline-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sitePath,
        url,
      }),
    });

    await fetch("/api/update-comparison-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sitePath,
        url: comparisonUrl,
      }),
    });

    this.updateStatusText("Saved!");

    setTimeout(() => {
      this.updateStatusText("");
    }, 2000);
  };

  updateBaselineUrl = (event) => {
    this.props.setBaselineUrl(event.target.value);
  };

  updateComparisonUrl = (event) => {
    this.props.setComparisonUrl(event.target.value);
  };

  render() {
    return (
      <div className="site-urls">
        <span>Baseline URL:</span>
        <Input
          placeholder="https://example.com"
          defaultValue={this.props.siteData.url}
          value={this.props.siteData.url}
          onChange={this.updateBaselineUrl}
        />
        <span>Comparison Url:</span>
        <Input
          placeholder="https://example.com"
          defaultValue={this.props.siteData.comparisonUrl}
          value={this.props.siteData.comparisonUrl}
          onChange={this.updateComparisonUrl}
        />

        <div className="site-urls__save-container">
          <Button className="site-urls__save-button" onClick={this.updateUrls}>
            Save
          </Button>
          <span className="site-urls__status-text">
            {this.state.statusText}
          </span>
        </div>
      </div>
    );
  }
}

export default SiteUrls;
