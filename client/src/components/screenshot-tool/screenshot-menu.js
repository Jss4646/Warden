import React, { Component } from "react";
import { Button, Menu } from "antd";
import { downloadScreenshot } from "../../tools/screenshot-downloads";

class ScreenshotMenu extends Component {
  render() {
    return (
      <Menu className="screenshot__menu">
        <Menu.Item>
          <Button
            data-cy="screenshot-menu-delete"
            type="text"
            onClick={this.props.removeScreenshot}
          >
            Delete screenshot
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="text">Save to my collection</Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            type="text"
            onClick={() => {
              downloadScreenshot(this.props.screenshot);
            }}
          >
            Save to computer
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="text">Show details</Button>
        </Menu.Item>
      </Menu>
    );
  }
}

export default ScreenshotMenu;
