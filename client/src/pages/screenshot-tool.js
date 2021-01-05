import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";
import { Button, Collapse, Input } from "antd";
import UrlBar from "../components/global/UrlBar";
import Screenshot from "../components/screenshot-tool/Screenshot";

import * as placeholderImage from "../placeholder-image.png";
import UrlList from "../components/global/UrlList";
import Devices from "../components/screenshot-tool/Devices";

const { Panel } = Collapse;

/**
 * The screenshot tools page component
 */
class ScreenshotTool extends Component {
  constructor(props) {
    super(props);

    /**
     * Adds a url to the url list
     */
    this.addUrlToUrlList = () => {
      const { appState, addUrlToUrlList } = this.props;
      const { currentUrl, urls, isCurrentUrlValid } = appState;

      const parsedUrl = isCurrentUrlValid ? new URL(currentUrl).href : false;

      if (isCurrentUrlValid && !urls.includes(parsedUrl))
        addUrlToUrlList(parsedUrl);
    };

    this.crawlUrl = async () => {
      const { appState, importUrls, updateIsLoadingUrls } = this.props;
      const { isCurrentUrlValid, currentUrl } = appState;
      if (isCurrentUrlValid) {
        updateIsLoadingUrls(true);
        const res = await fetch(
          `${process.env.REACT_APP_PROXY}/api/crawl-url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: currentUrl }),
          }
        );
        const body = await res.json();
        const url = new URL(body.url);
        body.sites.unshift(`${url.origin}/`);
        importUrls(body.sites);
        updateIsLoadingUrls(false);
      }
    };
  }

  render() {
    return (
      <div className="screenshot-tool">
        <div className="screenshot-tool__left-side">
          <UrlBar {...this.props}>
            <Button type="primary">Take Screenshot</Button>
            <Button>Screenshot URL List</Button>
            <Button onClick={this.crawlUrl}>Crawl URL</Button>
            <Button onClick={this.addUrlToUrlList}>Add URL</Button>
          </UrlBar>

          <div className="screenshot-tool__accordion-container">
            {exampleContent(this)}
          </div>
        </div>

        <div className="screenshot-tool__sidebar">
          <Collapse
            defaultActiveKey={["1", "2"]}
            className="screenshot-tool__sidebar-accordion"
          >
            <Panel key={1} header="URL List">
              <UrlList {...this.props} />
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
