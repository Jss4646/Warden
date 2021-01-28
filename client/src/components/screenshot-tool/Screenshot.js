import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, Menu, Spin } from "antd";
import * as placeholderImage from "../../data/image.jpeg";

import {
  DeleteOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from "@ant-design/icons";

/**
 * Displays a card containing the screenshot image
 *
 * @param {String} deviceName
 * @param {String} image
 */
class Screenshot extends Component {
  removeScreenshot = () => {
    this.props.removeScreenshot(
      this.props.screenshot.host,
      this.props.screenshot.pathname,
      this.props.index
    );
  };

  render() {
    const { deviceName, image } = this.props.screenshot;

    return (
      <Card
        title={deviceName}
        extra={<Button type="link">view</Button>}
        size="small"
        bordered={false}
        cover={
          <>
            <div className="screenshot__image-container">
              <Spin
                spinning={image === ""}
                wrapperClassName="screenshot__loading"
              >
                <img
                  onError={(event) =>
                    (event.target.src = placeholderImage.default)
                  }
                  className="screenshot__image"
                  alt="example"
                  src={image}
                />
              </Spin>
            </div>
            {menu}
          </>
        }
        actions={[
          <DeleteOutlined
            className="screenshot__delete"
            key="delete"
            onClick={this.removeScreenshot}
          />,
          <SaveOutlined className="screenshot__save" key="save" />,
          <EllipsisOutlined className="screenshot__settings" key="settings" />,
        ]}
        className="screenshot"
      />
    );
  }
}

Screenshot.propTypes = {
  screenshot: PropTypes.object,
  index: PropTypes.number,
};

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
