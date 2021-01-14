import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";
import { Button, Collapse } from "antd";
import UrlBar from "../components/global/UrlBar";
import Screenshot from "../components/screenshot-tool/Screenshot";

import UrlList from "../components/global/UrlList";
import Devices from "../components/screenshot-tool/Devices";
import CrawlUrlButton from "../components/screenshot-tool/Crawl-url-button";
import AddToUrlListButton from "../components/screenshot-tool/Add-to-url-list-button";
import ScreenshotUrlListButton from "../components/screenshot-tool/Screenshot-url-list-button";
import TakeScreenshotButton from "../components/screenshot-tool/Take-screenshot-button";
import ScreenshotBar from "../components/screenshot-tool/screenshot-bar";
import Sidebar from "../components/global/sidebar";

const { Panel } = Collapse;

/**
 * The screenshot tools page component
 */
class ScreenshotTool extends Component {
  render() {
    return (
      <div className="screenshot-tool">
        <div className="screenshot-tool__left-side">
          <UrlBar {...this.props}>
            <TakeScreenshotButton {...this.props} />
            <ScreenshotUrlListButton {...this.props} />
            <CrawlUrlButton {...this.props} />
            <AddToUrlListButton {...this.props} />
          </UrlBar>

          <ScreenshotBar {...this.props} />
        </div>

        <Sidebar>
          <Panel key={1} header="URL List" id="url-list-dropdown">
            <UrlList {...this.props} />
          </Panel>
          <Panel key={2} header="Devices" id="devices-dropdown">
            <Devices {...this.props} />
          </Panel>
        </Sidebar>
      </div>
    );
  }
}

ScreenshotTool = bindComponentToState(ScreenshotTool);
export default ScreenshotTool;
