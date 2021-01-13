import React, { Component } from "react";
import { Button } from "antd";

class AddToUrlListButton extends Component {
  /**
   * Adds a url to the url list
   */
  addUrlToUrlList = () => {
    const { appState, addUrlToUrlList } = this.props;
    const { currentUrl, urls, isCurrentUrlValid } = appState;

    const parsedUrl = isCurrentUrlValid ? new URL(currentUrl).href : false;

    if (isCurrentUrlValid && !urls.includes(parsedUrl))
      addUrlToUrlList(parsedUrl);
  };

  render() {
    return (
      <Button onClick={this.addUrlToUrlList} id="add-url-button">
        Add to URL List
      </Button>
    );
  }
}

export default AddToUrlListButton;
