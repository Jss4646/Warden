import React, { Component } from "react";
import DashboardScreenshotsBar from "./dashboard-screenshots-bar";
import { Button, Empty } from "antd";

class PageScreenshots extends Component {
  render() {
    const { currentPage } = this.props.siteData;
    if (currentPage) {
      return (
        <div className="page-screenshots">
          <div className="page-screenshots__buttons-bar">
            <h1 className="dashboard-screenshot-bar__current-page-title">
              {this.props.siteData.currentPage}
            </h1>
            <Button>Run comparison</Button>
            <Button>Generate baselines</Button>
          </div>
          <DashboardScreenshotsBar />
        </div>
      );
    } else {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
  }
}

export default PageScreenshots;
