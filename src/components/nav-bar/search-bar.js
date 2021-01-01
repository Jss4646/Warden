import React, { Component } from "react";
import TextInput from "../text-input";
import Button from "../button";

class SearchBar extends Component {
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

export default SearchBar;
