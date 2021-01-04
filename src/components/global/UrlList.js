import React, { Component } from "react";
import { Button, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";

class UrlList extends Component {
  render() {
    const { urls } = this.props.appState;

    return (
      <div className="url-list">
        <List
          className="url-list__urls"
          size="small"
          dataSource={urls}
          renderItem={(item) => (
            <List.Item className="url-list__item">
              <span className="url-list__text">{item}</span>
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
            </List.Item>
          )}
        />
        <div className="url-list__buttons">
          <Button onClick={() => this.props.clearUrls()}>Clear URLs</Button>
          <Button>Load URLs</Button>
        </div>
      </div>
    );
  }
}

export default UrlList;
