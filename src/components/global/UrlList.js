import React, { Component } from "react";
import { Button, List } from "antd";
import { CloseOutlined } from "@ant-design/icons";

class UrlList extends Component {
  render() {
    return (
      <div className="url-list">
        <List
          className="url-list__urls"
          size="small"
          dataSource={placeholderData}
          renderItem={(item) => (
            <List.Item className="url-list__item">
              <span className="url-list__text">{item}</span>
              <Button size="small" type="text">
                <CloseOutlined />
              </Button>
            </List.Item>
          )}
        />
        <div className="url-list__buttons">
          <Button>Clear URLs</Button>
          <Button>Load URLs</Button>
        </div>
      </div>
    );
  }
}

const placeholderData = [...Array(20).keys()].map(() => "https://example.com");

export default UrlList;
