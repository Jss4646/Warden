import React, { Component } from "react";
import { Button, Empty, Menu } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Screenshot from "./screenshot";
import Tabs from "./tabs";

const { SubMenu } = Menu;

class ScreenshotBar extends Component {
  state = {
    openTab: undefined,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.appState.currentUrl === this.props.appState.currentUrl;
  }

  /**
   * Changes which tab is open when selected in the sidebar
   *
   * @param item
   */
  changeTab = (item) => {
    const newTabIndex = parseInt(item.key);
    const newState = { ...this.state };
    newState.openTab = newTabIndex;
    this.setState(newState);
  };

  deleteHost = (host) => {
    this.props.removeScreenshots(host);
  };

  deletePath = (host, path) => {
    this.props.removeScreenshots(host, path);
  };

  renderMenu = () => {
    const { screenshots } = this.props.appState;
    return Object.keys(screenshots).map((site) => {
      return (
        <SubMenu
          className="screenshot-bar__submenu"
          icon={
            <CloseOutlined
              className="screenshot-bar__delete"
              onClick={() => this.deleteHost(site)}
            />
          }
          key={site}
          title={site}
        >
          {Object.keys(screenshots[site]).map((page) => {
            this.screenshotIndex++;
            return (
              <Menu.Item
                key={this.screenshotIndex - 1}
                icon={
                  <CloseOutlined
                    className="screenshot-bar__delete"
                    onClick={() => this.deletePath(site, page)}
                  />
                }
              >
                {page}
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    });
  };

  renderScreenshots = () => {
    const { screenshots } = this.props.appState;
    const screenshotTabs = Object.keys(screenshots).map((site) => {
      return Object.keys(screenshots[site]).map((page) => {
        return (
          <div className="screenshot-bar__screenshots" key={page}>
            {screenshots[site][page].map((screenshot, index) => (
              <Screenshot
                key={index}
                screenshot={screenshot}
                index={index}
                {...this.props}
              />
            ))}
          </div>
        );
      });
    });
    return screenshotTabs;
  };

  render() {
    this.screenshotIndex = 0;
    const { screenshots } = this.props.appState;

    if (Object.keys(screenshots).length > 0) {
      return (
        <div className="screenshot-bar-wrapper">
          <div className="screenshot-bar">
            <Menu
              className="screenshot-bar__menu"
              mode="inline"
              onSelect={this.changeTab}
            >
              {this.renderMenu()}
            </Menu>

            <div className="screenshot-bar__screenshots">
              <Tabs index={this.state.openTab}>{this.renderScreenshots()}</Tabs>
            </div>
          </div>
          <div className="screenshot-bar__buttons">
            <Button
              type="primary"
              onClick={() => {
                this.props.removeScreenshots();
              }}
            >
              Remove all screenshots
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="screenshot-bar-wrapper">
          <div className="screenshot-bar">
            <Menu
              className="screenshot-bar__menu"
              mode="inline"
              onSelect={this.changeTab}
            />
            <Empty
              className="screenshot-bar__empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
          <div className="screenshot-bar__buttons">
            <Button type="primary" disabled={true}>
              Remove all screenshots
            </Button>
          </div>
        </div>
      );
    }
  }
}

export default ScreenshotBar;
