import React, { Component } from "react";
import NavBar from "../components/nav-bar";

class Home extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <h1>This is the home page</h1>
      </div>
    );
  }
}

export default Home;
