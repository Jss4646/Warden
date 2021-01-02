import React from "react";
import NavigationItem from "./navigation-item";
import {
  CameraOutlined,
  HomeOutlined,
  SettingOutlined,
  ToolOutlined,
} from "@ant-design/icons";

/**
 * The navigation bar filled will a list of main pages
 */
const Navigation = () => {
  return (
    <ul className="navigation">
      <NavigationItem link="/" logo={<HomeOutlined />} text="home" />
      <NavigationItem
        link="screenshot-tool"
        logo={<CameraOutlined />}
        text="Screenshot Tool"
      />
      <NavigationItem
        link="automated-tests"
        logo={<SettingOutlined />}
        text="Automated Tests"
      />
      <NavigationItem
        link="seo-tools"
        logo={<ToolOutlined />}
        text="SEO Tools"
      />
    </ul>
  );
};

export default Navigation;
