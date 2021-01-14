import React, { Component } from "react";
import { Collapse } from "antd";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <Collapse defaultActiveKey={["2"]} className="sidebar__accordion">
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}

export default Sidebar;
