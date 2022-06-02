import React, { Component } from "react";
import { Collapse } from "antd";
import AboutSite from "./about-site";
import SiteUrls from "./site-urls";
import Cookies from "./cookies";

const { Panel } = Collapse;

/**
 * Right-hand sidebar showing options for the page / site
 */
class OptionsSidebar extends Component {
  render() {
    return (
      <Collapse defaultActiveKey={["0", "1", "2"]} className="sidebar__accordion">
        <Panel key={0} header="About site" id="about-site">
          <AboutSite {...this.props} />
        </Panel>
        <Panel key={1} header="Site urls" id="site-urls">
          <SiteUrls {...this.props} />
        </Panel>
          <Panel key={2} header="Cookies">
              <Cookies {...this.props} />
          </Panel>
      </Collapse>
    );
  }
}

export default OptionsSidebar;
