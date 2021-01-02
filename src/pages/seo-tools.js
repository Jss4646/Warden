import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";

class SeoTools extends Component {
  render() {
    return <div>This is the seo tool page</div>;
  }
}

SeoTools = bindComponentToState(SeoTools);
export default SeoTools;
