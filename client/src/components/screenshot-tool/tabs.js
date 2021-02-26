import React, { Component } from "react";
import PropTypes from "prop-types";

class Tabs extends Component {
  render() {
    const props = this.props;

    if (Array.isArray(props.children) && props.index !== undefined && props.index < props.children.flat().length) {
      return props.children.flat()[this.props.index];
    } else {
      return <div />;
    }
  }
}

Tabs.propTypes = {
  index: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.array),
};

export default Tabs;
