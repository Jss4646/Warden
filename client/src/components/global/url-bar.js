import React, { Component } from "react";
import { Input, Progress } from "antd";
import validateURL from "../../tools/url";

/**
 * The url bar component
 */
class UrlBar extends Component {
  /**
   * Updates isCurrentUrl valid and the currentUrl every time a character is
   * updated in the url bar
   *
   * @param event
   */
  updateUrl = (event) => {
    const url = event.target.value;

    const isCurrentUrlValid = validateURL(url);
    this.props.updateIsCurrentUrlValid(isCurrentUrlValid);
    this.props.updateCurrentUrl(url);
  };

  /**
   * Gets the percentage of finished screenshots in the queue
   *
   * @returns {number}
   */
  getProgressPercentage = () => {
    const { screenshotQueue } = this.props.appState;

    const runningScreenshots = screenshotQueue.reduce((sum, screenshot) => {
      if (screenshot.state !== "running") {
        return sum + 1;
      }
      return sum;
    }, 0);

    return (runningScreenshots / screenshotQueue.length) * 100;
  };

  render() {
    const { currentUrl, isCurrentUrlValid } = this.props.appState;
    const redInputBarClass =
      isCurrentUrlValid || currentUrl.length === 0
        ? ""
        : "url-bar__input--invalid-url";

    return (
      <div data-cy="url-bar" className="url-bar">
        <h1 className="url-bar__title">URL</h1>
        <Input
          className={`url-bar__input ${redInputBarClass}`}
          size="middle"
          placeholder="https://example.com"
          onChange={this.updateUrl}
          value={currentUrl}
          id="url-bar-input"
        />
        <div className="url-bar__buttons">{this.props.children}</div>
        <Progress
          showInfo={false}
          className="url-bar__progress"
          strokeColor="#1890FF"
          percent={this.getProgressPercentage()}
        />
      </div>
    );
  }
}

export default UrlBar;
