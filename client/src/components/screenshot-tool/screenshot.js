import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, Spin } from "antd";
import * as placeholderImage from "../../data/image.jpeg";

import {
  DeleteOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ScreenshotMenu from "./screenshot-menu";
import { downloadScreenshot } from "../../tools/screenshot-downloads";

/**
 * Displays a card containing the screenshot image
 *
 * @param {String} deviceName
 * @param {String} image
 */
class Screenshot extends Component {
  state = {
    showMenu: false,
  };

  removeScreenshot = () => {
    this.props.removeScreenshot(
      this.props.screenshot.host,
      this.props.screenshot.pathname,
      this.props.index
    );
  };

  render() {
    const { deviceName, image } = this.props.screenshot;
    const { showMenu } = this.state;

    const menuComponent = (
      <ScreenshotMenu
        {...this.props}
        removeScreenshot={this.removeScreenshot}
      />
    );
    const menu = showMenu ? menuComponent : "";

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
                  className={`screenshot__image ${
                    showMenu ? "screenshot__image--blur" : ""
                  }`}
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
          <SaveOutlined
            className="screenshot__save"
            key="save"
            onClick={() => {
              downloadScreenshot(this.props.screenshot);
            }}
          />,
          <EllipsisOutlined
            className="screenshot__settings"
            key="settings"
            onClick={() => {
              this.setState({ showMenu: !this.state.showMenu });
            }}
          />,
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

export default Screenshot;
