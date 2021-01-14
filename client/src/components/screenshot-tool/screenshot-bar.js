import React, { Component } from "react";
import { Menu } from "antd";
import Screenshot from "./Screenshot";
import Tabs from "./tabs";

const { SubMenu } = Menu;

class ScreenshotBar extends Component {
  state = {
    openTab: undefined,
  };

  changeTab = (item) => {
    const newTabIndex = parseInt(item.key);
    const newState = { ...this.state };
    newState.openTab = newTabIndex;
    this.setState(newState);
  };

  render() {
    this.screenshotIndex = 0;
    const { screenshots } = this.props.appState;
    console.log(screenshots);

    return (
      <div className="screenshot-bar">
        <Menu
          className="screenshot-bar__menu"
          mode="inline"
          onSelect={this.changeTab}
        >
          {Object.keys(screenshots).map((site) => {
            return (
              <SubMenu key={site} title={site}>
                {Object.keys(screenshots[site]).map((page) => {
                  this.screenshotIndex++;
                  return (
                    <Menu.Item key={this.screenshotIndex - 1}>{page}</Menu.Item>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>

        <div className="screenshot-bar__screenshots">
          <Tabs index={this.state.openTab}>
            {Object.keys(screenshots).map((site) => {
              return Object.keys(screenshots[site]).map((page) => {
                return (
                  <div className="screenshot-bar__screenshots" key={page}>
                    {screenshots[site][page].map((screenshot, index) => (
                      <Screenshot
                        key={index}
                        deviceName={screenshot.deviceName}
                        image={screenshot.image}
                        {...this.props}
                      />
                    ))}
                  </div>
                );
              });
            })}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ScreenshotBar;
