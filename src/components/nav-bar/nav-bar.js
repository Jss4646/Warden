import React, { Component } from "react";
import Logo from "../logo";
import Navigation from "./navigation";
import NavLoginModal from "./nav-login-modal";
import Button from "../button";
import NavSearchBar from "./nav-search-bar";

/**
 * The navigation bar used for the QA Tools site
 */
class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <Logo />
        <Navigation />
        <NavLoginModal />
        <Button
          buttonStyle="default"
          link="/register"
          text="Register"
          className="nav-bar__register-button"
        />
        <NavSearchBar />
      </div>
    );
  }
}

export default NavBar;
