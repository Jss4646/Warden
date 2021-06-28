import React, { Component } from "react";

class PagesSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { siteName, siteUrl } = this.props.siteData;

    return (
      <div className="pages-sidebar">
        <div className="pages-sidebar__site-status" />
        <a href={siteUrl} target="_blank" rel="noreferrer">
          <h1 className="pages-sidebar__site-name">{siteName}</h1>
        </a>
        <a className="pages-sidebar__delete-site">Delete site</a>
      </div>
    );
  }
}

export default PagesSidebar;
