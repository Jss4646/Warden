import React from "react";
import {
  CameraOutlined,
  CameraTwoTone,
  HomeOutlined,
  HomeTwoTone,
  SettingOutlined,
  SettingTwoTone,
  ToolOutlined,
  ToolTwoTone,
} from "@ant-design/icons";

const NavigationItem = ({ pageName, currentPage }) => {
  let pageLogo;
  let currentPageClass = currentPage ? "navigation__link--current-page" : "";

  switch (pageName) {
    case "home":
      pageLogo = currentPage ? <HomeTwoTone /> : <HomeOutlined />;
      return navigationElement(pageLogo, "Homepage", currentPageClass, "/");

    case "screenshot-tool":
      pageLogo = currentPage ? <CameraTwoTone /> : <CameraOutlined />;

      return navigationElement(
        pageLogo,
        "Screenshot Tool",
        currentPageClass,
        "/screenshot-tool"
      );

    case "automated-tests":
      pageLogo = currentPage ? <SettingTwoTone /> : <SettingOutlined />;

      return navigationElement(
        pageLogo,
        "Automated Tests",
        currentPageClass,
        "/automated-tests"
      );

    case "seo-tools":
      pageLogo = currentPage ? <ToolTwoTone /> : <ToolOutlined />;

      return navigationElement(
        pageLogo,
        "SEO Tools",
        currentPageClass,
        "/seo-tools"
      );

    default:
      return undefined;
  }
};

const navigationElement = (logo, text, currentPageClass, link) => {
  return (
    <li className="navigation__item">
      <a className={`navigation__link ${currentPageClass}`} href={link}>
        {logo}
        {text}
      </a>
    </li>
  );
};

export default NavigationItem;
