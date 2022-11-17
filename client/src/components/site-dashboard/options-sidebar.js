import React, { Component } from "react";
import { Collapse } from "antd";
import SiteUrls from "./sidebar-components/site-urls";
import Cookies from "./sidebar-components/cookies";
import SiteLogin from "./sidebar-components/site-login";
import Devices from "./sidebar-components/devices";
import ScreenshotSettings from "./sidebar-components/screenshot-settings";
import Misc from "./sidebar-components/misc";
import PagesSettings from "./sidebar-components/pages-settings";

const { Panel } = Collapse;

/**
 * Right-hand sidebar showing options for the page / site
 */
class OptionsSidebar extends Component {
  render() {
    return (
      <Collapse defaultActiveKey={["0"]} className="sidebar__accordion">
        <Panel key={0} header="Site urls" id="site-urls">
          <SiteUrls {...this.props} />
        </Panel>
        <Panel key={1} header="Cookies">
          <Cookies {...this.props} />
        </Panel>
        <Panel key={2} header={"Devices"}>
          <Devices {...this.props} />
        </Panel>
        <Panel key={3} header="Screenshot Settings">
          <ScreenshotSettings {...this.props} />
        </Panel>
        <Panel key={4} header="Pages Settings">
          <PagesSettings {...this.props} />
        </Panel>
        <Panel key={5} header={"Site login"}>
          <SiteLogin {...this.props} />
        </Panel>
        <Panel key={6} header={"Misc"}>
          <Misc {...this.props} />
        </Panel>
      </Collapse>
    );
  }
}

export default OptionsSidebar;
