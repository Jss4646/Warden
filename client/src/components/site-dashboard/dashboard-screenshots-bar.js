import React, { Component } from "react";
import placeholder from "../../data/angry-placeholder.png";

class DashboardScreenshotsBar extends Component {
  render() {
    return (
      <div className="dashboard-screenshot-bar">
        <h2>1080p Desktop</h2>
        <div className="dashboard-screenshot-bar__screenshots">
          <div className="dashboard-screenshot-bar__screenshot">
            <h3>Baseline</h3>
            <img src={placeholder} />
          </div>
          <div className="dashboard-screenshot-bar__screenshot">
            <h3>Live</h3>
            <img src={placeholder} />
          </div>
          <div className="dashboard-screenshot-bar__screenshot">
            <h3>Diff</h3>
            <img src={placeholder} />
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardScreenshotsBar;
