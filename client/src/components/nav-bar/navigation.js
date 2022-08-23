import React from "react";
import NavigationItem from "./navigation-item";
import { CameraOutlined, ToolOutlined } from "@ant-design/icons";

/**
 * The navigation bar filled will a list of main pages
 */
const Navigation = () => {
  return (
    <ul className="navigation">
      <NavigationItem text="Sites" link="/" logo={<ToolOutlined />} />
      <NavigationItem
        link="/screenshot-tool"
        logo={<CameraOutlined />}
        text="Screenshot Tool"
      />
    </ul>
  );
};

export default Navigation;
