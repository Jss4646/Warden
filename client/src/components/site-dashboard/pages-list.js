import React, { Component } from "react";
import { Button, Dropdown, Input, Menu } from "antd";

const { Search } = Input;
const { Item } = Menu;

const menu = (
  <Menu>
    <Item>Delete page</Item>
    <Item>Run comparison</Item>
    <Item>Generate new baseline</Item>
  </Menu>
);

class PagesList extends Component {
  render() {
    return (
      <div className="pages-list">
        <div className="pages-list__failing-tab">
          <span className="pages-list__failing-text">Failing: </span>
          <span>0</span>
        </div>
        <div className="pages-list__add-page">
          <Button>Add page</Button>
          <Input placeholder="/example" />
        </div>
        <Search placeholder="search for page" />
        <div className="pages-list__pages">
          <div className="pages-list__page">
            <span>/</span>
            <span>9/10</span>
            <Dropdown overlay={menu} trigger={["click"]}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>...</a>
            </Dropdown>
          </div>
          <div className="pages-list__page">
            <span>/</span>
            <span>9/10</span>
            <Dropdown overlay={menu} trigger={["click"]}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>...</a>
            </Dropdown>
          </div>
          <div className="pages-list__page">
            <span>/</span>
            <span>9/10</span>
            <Dropdown overlay={menu} trigger={["click"]}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>...</a>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

export default PagesList;
