import React from "react";
import NavigationItem from "./navigation-item";

/**
 * The navigation bar filled will a list of main pages
 */
const Navigation = () => {
  return (
    <ul className="navigation">
      <NavigationItem currentPage={true} pageName="home" />
      <NavigationItem currentPage={false} pageName="screenshot-tool" />
      <NavigationItem currentPage={false} pageName="automated-tests" />
      <NavigationItem currentPage={false} pageName="seo-tools" />
    </ul>
  );
};

export default Navigation;
