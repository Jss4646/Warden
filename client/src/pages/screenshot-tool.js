import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";
import { Button, Col, Collapse, Input, Spin } from "antd";
import UrlBar from "../components/global/UrlBar";
import Screenshot from "../components/screenshot-tool/Screenshot";

import * as placeholderImage from "../data/placeholder-image.png";
import UrlList from "../components/global/UrlList";
import Devices from "../components/screenshot-tool/Devices";
import CrawlUrlButton from "../components/screenshot-tool/Crawl-url-button";
import AddToUrlListButton from "../components/screenshot-tool/Add-to-url-list-button";
import ScreenshotUrlListButton from "../components/screenshot-tool/Screenshot-url-list-button";
import TakeScreenshotButton from "../components/screenshot-tool/Take-screenshot-button";
import { CloseOutlined, CloseSquareOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

/**
 * The screenshot tools page component
 */
class ScreenshotTool extends Component {
  displayScreenshots = () => {
    const { screenshots } = this.props.appState;

    if (screenshots) {
      return (
        <Collapse
          defaultActiveKey={["1"]}
          className="screenshot-tool__website-accordion"
        >
          {Object.keys(screenshots).map((siteName, i) => {
            const site = screenshots[siteName];
            return (
              <Panel
                key={i}
                header={siteName}
                className="screenshot-tool__website-panel"
                extra={
                  <Button size="middle" type="text">
                    <CloseOutlined />
                  </Button>
                }
              >
                <Collapse
                  bordered={false}
                  className={"screenshot-tool__page-accordion"}
                >
                  {Object.keys(site).map((pageName, i) => {
                    const page = site[pageName];

                    return (
                      <Panel
                        key={i}
                        header={pageName}
                        className="screenshot-tool_page-panel"
                        extra={
                          <Button size="middle" type="text">
                            <CloseOutlined />
                          </Button>
                        }
                      >
                        {page.map((screenshot, i) => {
                          return (
                            <Screenshot
                              key={i}
                              deviceName={screenshot.deviceName}
                              image={screenshot.image}
                              {...this.props}
                            />
                          );
                        })}
                      </Panel>
                    );
                  })}
                </Collapse>
              </Panel>
            );
          })}
        </Collapse>
      );
    } else {
      return "";
    }
  };

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

          <div className="screenshot-tool__accordion-container">
            {this.displayScreenshots()}
          </div>
        </div>

        <div className="screenshot-tool__sidebar">
          <Collapse
            defaultActiveKey={["2"]}
            className="screenshot-tool__sidebar-accordion"
          >
            <Panel key={1} header="URL List" id="url-list-dropdown">
              <UrlList {...this.props} />
            </Panel>

            <Panel key={2} header="Devices" id="devices-dropdown">
              <Devices {...this.props} />
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
        <Collapse
          defaultActiveKey={["1"]}
          bordered={false}
          className="screenshot-tool__page-accordion"
        >
          <Panel
            key={1}
            header="/"
            className="screenshot-tool_page-panel"
            extra={<Input size="small" placeholder="Search" />}
          >
            <Screenshot
              image={placeholderImage.default}
              deviceName="1080p Desktop"
              {..._this.props}
            />
            <Screenshot
              image={placeholderImage.default}
              deviceName="1080p Desktop"
              {..._this.props}
            />
            <Screenshot
              image={placeholderImage.default}
              deviceName="1080p Desktop"
              {..._this.props}
            />
          </Panel>
        </Collapse>
      </Panel>
      <Panel
        key={2}
        header="example.com"
        className="screenshot-tool__website-panel"
        extra={<Input size="small" placeholder="Search" />}
      >
        <Collapse
          defaultActiveKey={["1"]}
          bordered={false}
          className="screenshot-tool__page-accordion"
        >
          <Panel
            key={1}
            header="/"
            className="screenshot-tool_page-panel"
            extra={<Input size="small" placeholder="Search" />}
          >
            <Screenshot
              image={placeholderImage.default}
              deviceName="1080p Desktop"
              {..._this.props}
            />
            <Screenshot
              image={placeholderImage.default}
              deviceName="1080p Desktop"
              {..._this.props}
            />
            <Screenshot
              image={placeholderImage.default}
              deviceName="1080p Desktop"
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
