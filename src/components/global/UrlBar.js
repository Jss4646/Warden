import React, { Component } from "react";
import { Input, Progress } from "antd";

class UrlBar extends Component {
  render() {
    return (
      <div className="url-bar">
        <h1>URL</h1>
        <Input placeholder="https://example.com" />
        {this.props.children}
        <Progress showInfo={false} />
      </div>
    );
  }
}

export default UrlBar;
