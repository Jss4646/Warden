import React, { Component } from "react";
import TextInput from "../text-input";
import Button from "../button";

/**
 * The search bar for the QA Tools site
 */
class NavSearchBar extends Component {
  searchBarRef = React.createRef();

  render() {
    return (
      <form className="search-bar">
        <TextInput
          inputRef={this.searchBarRef}
          placeHolderText="input search text"
        />
        <Button buttonStyle="primary" text="Search" />
      </form>
    );
  }
}

export default NavSearchBar;
