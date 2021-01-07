import React, { Component } from "react";
import { Button, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";

class UrlList extends Component {
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
              <Button
                size="small"
                type="text"
                onClick={(event) => {
                  const listElement = event.target.closest(".url-list__item");
                  const parentChildren = Array.from(
                    listElement.parentNode.children
                  );
                  const index = parentChildren.indexOf(listElement);
                  this.props.removeUrlFromUrlList(index);
                }}
              >
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
          <Button id="load-urls-button">Load URLs</Button>
        </div>
      </div>
    );
  }
}

export default UrlList;
