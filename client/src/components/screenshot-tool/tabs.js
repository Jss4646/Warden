import React, { Component } from "react";

class Tabs extends Component {
  render() {
    const props = this.props;
    console.log(this.props.children);
    if (Array.isArray(this.props.children) && props.index !== undefined) {
      return props.children.flat()[this.props.index];
    } else {
      return <div></div>;
    }
  }
}

export default Tabs;
