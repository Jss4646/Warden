import React, { Component } from "react";
import { Empty, Menu } from "antd";
import Screenshot from "./Screenshot";
import Tabs from "./tabs";

const { SubMenu } = Menu;

class ScreenshotBar extends Component {
  state = {
    openTab: undefined,
  };

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

  renderMenu = () => {
    const { screenshots } = this.props.appState;
    return Object.keys(screenshots).map((site) => {
      return (
        <SubMenu key={site} title={site}>
          {Object.keys(screenshots[site]).map((page) => {
            this.screenshotIndex++;
            return <Menu.Item key={this.screenshotIndex - 1}>{page}</Menu.Item>;
          })}
        </SubMenu>
      );
    });
  };

  renderScreenshots = () => {
    const { screenshots } = this.props.appState;
    return Object.keys(screenshots).map((site) => {
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
  };

  render() {
    this.screenshotIndex = 0;
    const { screenshots } = this.props.appState;

    if (Object.keys(screenshots).length > 0) {
      return (
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
      );
    } else {
      return (
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
      );
    }
  }
}

export default ScreenshotBar;
