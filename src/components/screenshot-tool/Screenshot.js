import React, { Component } from "react";
import { Button, Card } from "antd";

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

class Screenshot extends Component {
  render() {
    return (
      <Card
        title={this.props.device}
        extra={<Button type="link">view</Button>}
        size="small"
        bordered={false}
        cover={<img alt="example" src={this.props.image} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
        style={{ width: "500px" }}
      />
    );
  }
}

export default Screenshot;
