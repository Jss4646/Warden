import React, { Component } from "react";
import PropTypes from "prop-types";

class Tabs extends Component {
  render() {
    const props = this.props;
    if (
      Array.isArray(this.props.children) &&
      props.index !== undefined &&
      props.index < this.props.children.length
    ) {
      return props.children.flat()[this.props.index];
    } else {
      return <div></div>;
    }
  }
}

Tabs.propTypes = {
  index: PropTypes.number,
};

export default Tabs;
