import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";
import { Button, Collapse, Input } from "antd";
import UrlBar from "../components/global/UrlBar";
import Screenshot from "../components/screenshot-tool/Screenshot";

import * as placeholderImage from "../placeholder-image.png";
import UrlList from "../components/global/UrlList";
import Devices from "../components/screenshot-tool/Devices";

const { Panel } = Collapse;

class ScreenshotTool extends Component {
  render() {
    return (
      <div className="screenshot-tool">
        <div className="screenshot-tool__left-side">
          <UrlBar {...this.props}>
            <Button type="primary">Take Screenshot</Button>
            <Button>Crawl URL</Button>
            <Button>Load URLs</Button>
            <Button>Add URL</Button>
          </UrlBar>

          {exampleContent(this)}
        </div>

        <div className="screenshot-tool__sidebar">
          <Collapse
            defaultActiveKey={["1", "2"]}
            className="screenshot-tool__sidebar-accordion"
          >
            <Panel key={1} header="URL List">
              <UrlList />
            </Panel>

            <Panel key={2} header="Devices">
              <Devices />
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

const exampleContent = (_this) => {
  return (
    <Collapse
      defaultActiveKey={["1"]}
      className="screenshot-tool__website-accordion"
    >
      <Panel
        key={1}
        header="example.com"
        className="screenshot-tool__website-panel"
        extra={<Input size="small" placeholder="Search" />}
      >
        <Collapse bordered={false} className="screenshot-tool__page-accordion">
          <Panel
            key={1}
            header="/"
            className="screenshot-tool_page-panel"
            extra={<Input size="small" placeholder="Search" />}
          >
            <Screenshot
              image={placeholderImage.default}
              device="1080p Desktop"
              {..._this.props}
            />
            <Screenshot
              image={placeholderImage.default}
              device="1080p Desktop"
              {..._this.props}
            />
            <Screenshot
              image={placeholderImage.default}
              device="1080p Desktop"
              {..._this.props}
            />
          </Panel>
        </Collapse>
      </Panel>
    </Collapse>
  );
};

ScreenshotTool = bindComponentToState(ScreenshotTool);
export default ScreenshotTool;
