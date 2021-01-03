import React, { Component } from "react";
import { Input, Progress } from "antd";

class UrlBar extends Component {
  constructor(props) {
    super(props);

    this.updateUrl = (event) => {
      const url = event.target.value;

      this.props.updateIsCurrentUrlValid(this.validateURL(url));
      this.props.updateCurrentUrl(url);
    };

    this.updateUrl = this.updateUrl.bind(this);
  }

  /**
   * validates a URL using regex
   *
   * @param url
   * @returns {boolean}
   */
  validateURL(url) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);
  }

  render() {
    const { currentUrl, isCurrentUrlValid } = this.props.appState;
    const redInputBarClass =
      isCurrentUrlValid || currentUrl.length === 0
        ? ""
        : "url-bar__input--invalid-url";

    return (
      <div className="url-bar">
        <h1 className="url-bar__title">URL</h1>
        <Input
          className={`url-bar__input ${redInputBarClass}`}
          size="middle"
          placeholder="https://example.com"
          onChange={this.updateUrl}
          value={currentUrl}
        />
        <div className="url-bar__buttons">{this.props.children}</div>
        <Progress showInfo={false} className="url-bar__progress" />
      </div>
    );
  }
}

export default UrlBar;
