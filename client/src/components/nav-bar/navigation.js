import React from "react";
import NavigationItem from "./navigation-item";
import { CameraOutlined, ToolOutlined } from "@ant-design/icons";

/**
 * The navigation bar filled will a list of main pages
 */
const Navigation = () => {
  return (
    <ul className="navigation">
      <NavigationItem
        link="/"
        logo={<CameraOutlined />}
        text="Screenshot Tool"
      />
      <NavigationItem text="Sites" link="/sites" logo={<ToolOutlined />} />
    </ul>
  );
};

export default Navigation;
