import React, { Component } from "react";
import { Button, Dropdown, Input, Menu } from "antd";

const { Search } = Input;
const { Item } = Menu;

const menu = (
  <Menu>
    <Item key={0}>Delete page</Item>
    <Item key={1}>Run comparison</Item>
    <Item key={2}>Generate new baseline</Item>
  </Menu>
);

class PagesList extends Component {
  state = { addPagePath: "" };

  setAddPagePath = (event) => {
    const newState = { ...this.state };
    newState.addPagePath = event.target.value;
    this.setState(newState);
  };

  addPage = async () => {
    const url = new URL(this.props.siteData.siteUrl);
    url.pathname = this.state.addPagePath;
    const newPage = { url, passingNum: "0/0" };

    this.props.addPage(url.pathname, newPage);

    const params = {
      sitePath: this.props.siteData.sitePath,
      newPage,
      pagePath: url.pathname,
    };

    const fetchUrl = new URL(`${window.location.origin}/api/add-site-page`);
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  };

  removePage = async () => {};

  render() {
    const { pages } = this.props.siteData;
    return (
      <div className="pages-list">
        <div className="pages-list__failing-tab">
          <span className="pages-list__failing-text">Failing: </span>
          <span>0</span>
        </div>
        <div className="pages-list__add-page">
          <Button
            className="pages-list__add-page-button"
            onClick={this.addPage}
          >
            Add page
          </Button>
          <Input
            className="pages-list__add-page-input"
            placeholder="/example"
            value={this.state.addPagePath}
            onChange={this.setAddPagePath}
          />
        </div>
        <Search placeholder="search for page" />
        <div className="pages-list__pages">
          {Object.keys(pages).map((path) => {
            const page = pages[path];
            return (
              <div className="pages-list__page" key={path}>
                <span className="pages-list__page-url">{path}</span>
                <span className="pages-list__page-passing-count">
                  {page.passingNum}
                </span>
                <Dropdown
                  className="pages-list__page-menu-dropdown"
                  overlay={menu}
                  trigger={["click"]}
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="pages-list__page-menu-button">...</a>
                </Dropdown>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default PagesList;
