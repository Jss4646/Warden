import React, { Component } from "react";
import Sidebar from "../global/sidebar";
import { Collapse } from "antd";
import AboutSite from "./about-site";

const { Panel } = Collapse;

class OptionsSidebar extends Component {
  render() {
    return (
      <Sidebar>
        <Panel key={1} header="About site" id="about-site">
          <AboutSite {...this.props} />
        </Panel>
      </Sidebar>
    );
  }
}

export default OptionsSidebar;
