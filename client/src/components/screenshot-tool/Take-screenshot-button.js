import React, { Component } from "react";
import { Button } from "antd";
import takeScreenshot from "../../tools/take-screenshot";

class TakeScreenshotButton extends Component {
  screenshotUrl = async () => {
    const { currentUrl, isCurrentUrlValid } = this.props.appState;

    if (isCurrentUrlValid) {
      takeScreenshot(currentUrl, this.props);
    }
  };

  fetchScreenshot = async (params) => {
    console.log("Taking screenshot");
    const fetchUrl = new URL("https://api.apiflash.com/v1/urltoimage");

    Object.keys(params).forEach((key) =>
      fetchUrl.searchParams.append(key, params[key])
    );

    return fetch(fetchUrl.toString())
      .then((res) => res.arrayBuffer())
      .then(async (image) => {
        console.log("Creating image");
        const imageBlob = new Blob([image], { type: "image/jpeg" });

        return URL.createObjectURL(imageBlob);
      })
      .catch(console.log);
  };

  render() {
    return (
      <Button
        onClick={this.screenshotUrl}
        type="primary"
        id="take-screenshot-button"
      >
        Take Screenshot
      </Button>
    );
  }
}

export default TakeScreenshotButton;
