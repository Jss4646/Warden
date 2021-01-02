import React from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import Icon, {
  CameraOutlined,
  CameraTwoTone,
  HomeOutlined,
  HomeTwoTone,
  SettingOutlined,
  SettingTwoTone,
  ToolOutlined,
  ToolTwoTone,
} from "@ant-design/icons";

/**
 * A navigation list element
 *
 * @param { "home" | "screenshot-tool" | "automated-tests" | "seo-tools" } pageName
 * @param {boolean} [currentPage]
 */
const NavigationItem = ({ pageName, currentPage = false }) => {
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

NavigationItem.propTypes = {
  pageName: PropTypes.oneOf([
    "home",
    "screenshot-tool",
    "automated-tests",
    "seo-tools",
  ]).isRequired,
  currentPage: PropTypes.bool,
};

/**
 * Creates the jsx for a navigation item
 *
 * @param {Icon} logo
 * @param {String} text
 * @param {String} currentPageClass
 * @param {String} link
 * @returns {JSX.Element}
 */
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
