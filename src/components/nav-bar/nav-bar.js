import React, { Component } from "react";
import Logo from "../logo";
import Navigation from "./navigation";
import NavLoginModal from "./nav-login-modal";
import Button from "../button";
import NavSearchBar from "./nav-search-bar";
import bindComponentToState from "../../tools/bindComponentToState";

/**
 * The navigation bar used for the QA Tools site
 */
class NavBar extends Component {
  updateUsername = () => {
    this.props.updateUsername("Josh");
  };

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
          onClickFunction={this.updateUsername}
        />
        <NavSearchBar />
      </div>
    );
  }
}

NavBar = bindComponentToState(NavBar);

export default NavBar;
