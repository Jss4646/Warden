import React, { Component } from "react";
import bindComponentToState from "../tools/bindComponentToState";

class Home extends Component {
  render() {
    return <h1>This is the home page</h1>;
  }
}

Home = bindComponentToState(Home);
export default Home;
