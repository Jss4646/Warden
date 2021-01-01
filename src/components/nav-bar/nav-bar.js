import React, { Component } from "react";
import Logo from "../logo";
import Navigation from "./navigation";
import NavLoginModal from "./nav-login-modal";

class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <Logo />
        <Navigation />
        <NavLoginModal />
      </div>
    );
  }
}

export default NavBar;
