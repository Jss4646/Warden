import React, { Component } from "react";
import { Button, Card, Menu } from "antd";

import {
  DeleteOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from "@ant-design/icons";

class Screenshot extends Component {
  render() {
    return (
      <Card
        title={this.props.device}
        extra={<Button type="link">view</Button>}
        size="small"
        bordered={false}
        cover={
          <>
            <img
              className="screenshot__image"
              alt="example"
              src={this.props.image}
            />
            {menu}
          </>
        }
        actions={[
          <DeleteOutlined key="setting" />,
          <SaveOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
        className="screenshot"
      />
    );
  }
}

const menu = (
  <Menu className="screenshot__menu">
    <Menu.Item>
      <Button type="link">Delete screenshot</Button>
    </Menu.Item>
    <Menu.Item>
      <Button type="text">Save to my collection</Button>
    </Menu.Item>
    <Menu.Item>
      <Button type="text">Save to computer</Button>
    </Menu.Item>
    <Menu.Item>
      <Button type="text">Show details</Button>
    </Menu.Item>
  </Menu>
);

export default Screenshot;
