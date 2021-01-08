import React, { Component } from "react";
import { Button, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { bool } from "prop-types";

class UrlList extends Component {
  loadUrlsRef = React.createRef();

  deleteUrl = (event) => {
    const listElement = event.target.closest(".url-list__item");
    const parentChildren = Array.from(listElement.parentNode.children);
    const index = parentChildren.indexOf(listElement);
    this.props.removeUrlFromUrlList(index);
  };

  uploadUrls = () => {
    this.loadUrlsRef.current.click();
  };

  loadUrls = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();

    if (file === undefined) return;

    if (file.type.match("txt.*")) {
      return false;
    }

    reader.onload = () => {
      let urls = reader.result.split("\n");
      this.props.importUrls(urls);
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  downloadUrls = () => {
    const { urls } = this.props.appState;
    const urlsText = urls.join("\n");
    const blob = new Blob([urlsText], { type: "text/plain;charset=utf-8" });
    const urlBlob = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = urlBlob;
    downloadLink.setAttribute("download", "urls.txt");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  render() {
    const { urls, isLoadingUrls } = this.props.appState;

    return (
      <div className="url-list">
        <List
          className="url-list__urls"
          size="small"
          dataSource={urls}
          loading={isLoadingUrls}
          id="url-list"
          renderItem={(item) => (
            <List.Item className="url-list__item">
              <Button size="small" type="text" onClick={this.deleteUrl}>
                <CloseOutlined />
              </Button>
              <span className="url-list__text">{item}</span>
            </List.Item>
          )}
        />
        <div className="url-list__buttons">
          <Button onClick={() => this.props.clearUrls()} id="clear-urls-button">
            Clear URLs
          </Button>

          <Button id="load-urls-button" onClick={this.uploadUrls}>
            Load URLs
          </Button>
          <input
            type="file"
            accept=".txt"
            id="load-url-file"
            style={{ display: "none" }}
            ref={this.loadUrlsRef}
            onInput={this.loadUrls}
          />
          <Button id="download-urls-button" onClick={this.downloadUrls}>
            Download URLs
          </Button>
        </div>
      </div>
    );
  }
}

export default UrlList;
