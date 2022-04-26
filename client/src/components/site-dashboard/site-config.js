import React, { Component } from "react";
import { Input } from "antd";

class SiteConfig extends Component {
  render() {
    return (
      <div className="site-config">
        <Input
          placeholder="https://example.com"
          defaultValue={this.props.siteData.url}
        />
        <Input
          placeholder="https://example.com"
          defaultValue={this.props.siteData.comparisonUrl}
        />
      </div>
    );
  }
}

export default SiteConfig;
