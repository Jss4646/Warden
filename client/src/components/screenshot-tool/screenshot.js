import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, Spin } from "antd";
import cancelSVG from "../../data/undraw_cancel_u1it.svg";
import brokenSVG from "../../data/undraw_injured_9757.svg";

import {
  DeleteOutlined,
  // EllipsisOutlined,
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
    this.props.screenshot.abortController.abort();
    this.props.removeScreenshot(
      this.props.screenshot.url.host,
      this.props.screenshot.url.pathname,
      this.props.index
    );
  };

  render() {
    const { deviceName, image, state } = this.props.screenshot;
    const { showMenu } = this.state;

    const menuComponent = (
      <ScreenshotMenu
        {...this.props}
        removeScreenshot={this.removeScreenshot}
      />
    );
    const menu = showMenu ? menuComponent : "";

    let cover;
    switch (state) {
      case "done":
        cover = (
          <img
            data-cy="screenshot-image"
            className={`screenshot__image ${
              showMenu ? "screenshot__image--blur" : ""
            }`}
            alt="example"
            src={image}
          />
        );
        break;

      case "running":
        cover = <div />;
        break;

      case "canceled":
        cover = (
          <div className="screenshot__cover-info">
            <img src={cancelSVG} alt="Man next to big X" />
            <h2 className="screenshot__cover-info-text">Canceled</h2>
          </div>
        );
        break;

      default:
        cover = (
          <div className="screenshot__cover-info">
            <img src={brokenSVG} alt="Man with broken leg" />
            <h2 className="screenshot__cover-info-text">
              Something went wrong
            </h2>
          </div>
        );
        break;
    }

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
                spinning={state === "running"}
                wrapperClassName="screenshot__loading"
              >
                {cover}
              </Spin>
            </div>
            {menu}
          </>
        }
        actions={[
          <DeleteOutlined
            className="screenshot__delete"
            key="delete"
            data-cy="screenshot-delete-button"
            onClick={this.removeScreenshot}
          />,
          <SaveOutlined
            className="screenshot__save"
            key="save"
            data-cy="screenshot-save-button"
            onClick={() => {
              downloadScreenshot(this.props.screenshot);
            }}
          />,
          // <EllipsisOutlined
          //   disabled={true}
          //   className="screenshot__settings"
          //   key="settings"
          //   data-cy="screenshot-menu-button"
          //   onClick={() => {
          //     this.setState({ showMenu: !this.state.showMenu });
          //   }}
          // />,
        ]}
        className="screenshot"
        data-cy="screenshot"
      />
    );
  }
}

Screenshot.propTypes = {
  screenshot: PropTypes.object,
  index: PropTypes.number,
};

export default Screenshot;
