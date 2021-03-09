import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";
import { Collapse } from "antd";
import UrlBar from "../components/global/url-bar";

import UrlList from "../components/global/url-list";
import Devices from "../components/screenshot-tool/devices";
import CrawlUrlButton from "../components/screenshot-tool/crawl-url-button";
import AddToUrlListButton from "../components/screenshot-tool/add-to-url-list-button";
import ScreenshotUrlListButton from "../components/screenshot-tool/screenshot-url-list-button";
import TakeScreenshotButton from "../components/screenshot-tool/take-screenshot-button";
import ScreenshotBar from "../components/screenshot-tool/screenshot-bar";
import Sidebar from "../components/global/sidebar";
import ActivityLog from "../components/global/activity-log";
import ScreenshotQueue from "../components/screenshot-tool/screenshot-queue";

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
          <Panel key={1} header="URL list" id="url-list-dropdown">
            <UrlList {...this.props} />
          </Panel>
          <Panel key={2} header="Devices" id="devices-dropdown">
            <Devices {...this.props} />
          </Panel>
          <Panel key={3} header="Screenshot queue" id="screenshot-queue">
            <ScreenshotQueue {...this.props} />
          </Panel>
          <Panel key={4} header="Activity log" id="activity-log">
            <ActivityLog {...this.props} />
          </Panel>
        </Sidebar>
      </div>
    );
  }
}

ScreenshotTool = bindComponentToState(ScreenshotTool);
export default ScreenshotTool;
