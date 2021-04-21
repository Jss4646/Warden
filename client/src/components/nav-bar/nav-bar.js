import React, { Component } from "react";
import Logo from "../global/logo";
import Navigation from "./navigation";
import NavLoginModal from "./nav-login-modal";
import { Button, Input } from "antd";
import bindComponentToState from "../../tools/bindComponentToState";
import { Link } from "react-router-dom";

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
        <Link to="register">
          <Button
            text="Register"
            className="nav-bar__register-button"
            disabled={true}
          >
            Register
          </Button>
        </Link>
        <Input.Search
          placeholder="Screenshots, URL Lists, Test Results"
          enterButton="Search"
          className="nav-bar__search-bar"
          disabled={true}
        />
      </div>
    );
  }
}

NavBar = bindComponentToState(NavBar);

export default NavBar;
