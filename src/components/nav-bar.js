import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <ul>
          <li>
            <a href="/testing-tool">Testing Tool</a>
          </li>
          <li>
            <a href="/screenshot-tool">Screenshot Tool</a>
          </li>
          <li>
            <a href="/seo-tool">Seo Tool</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default NavBar;
