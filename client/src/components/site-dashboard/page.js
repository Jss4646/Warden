import React, { Component } from "react";
import { Dropdown, Menu } from "antd";

const menu = (pagePath, handleMenuClick) => (
  <Menu onClick={(item) => handleMenuClick(item, pagePath)}>
    <Item key={0}>Delete page</Item>
    <Item key={1}>Run comparison</Item>
    <Item key={2}>Generate new baseline</Item>
  </Menu>
);

const { Item } = Menu;

class Page extends Component {
  removePage = async (pagePath) => {
    this.props.removePage(pagePath);

    const params = { sitePath: this.props.siteData.sitePath, pagePath };
    const fetchUrl = new URL(`${window.location.origin}/api/delete-site-page`);
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  };

  handleMenuClick = (item, pagePath) => {
    switch (item.key) {
      case "0":
        this.removePage(pagePath);
        return;
      default:
        return;
    }
  };

  render() {
    const { path, page, siteData } = this.props;
    const { currentPage } = siteData;

    return (
      <div
        className={`pages-list__page ${
          currentPage === path ? "pages-list__page--underlined" : ""
        }`}
        onClick={() => this.props.setCurrentPage(path)}
      >
        <span className="pages-list__page-url">{path}</span>
        <span className="pages-list__page-passing-count">
          {page.passingNum}
        </span>
        <Dropdown
          className="pages-list__page-menu-dropdown"
          overlay={menu(path, this.handleMenuClick)}
          trigger={["click"]}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="pages-list__page-menu-button">...</a>
        </Dropdown>
      </div>
    );
  }
}

export default Page;
