import React, { Component } from "react";

/**
 * Page displaying screenshots from each device
 */
class Page extends Component {
  /**
   * Removes a page from the client and db
   *
   * @param pagePath {String}
   * @returns {Promise<void>}
   */
  // TODO setup a way to remove page
  // removePage = async (pagePath) => {
  //   this.props.removePage(pagePath);
  //
  //   const params = { sitePath: this.props.siteData.sitePath, pagePath };
  //   const fetchUrl = new URL(`${window.location.origin}/api/delete-site-page`);
  //   await fetch(fetchUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(params),
  //   });
  // };

  render() {
    const { path, siteData } = this.props;
    const { currentPage, failingScreenshots, devices } = siteData;

    let passingString;

    if (failingScreenshots[path]) {
      const passingNum =  devices.length - failingScreenshots[path].length;
      passingString = `${passingNum}/${devices.length}`;
    } else {
      passingString = `${devices.length}/${devices.length}`;
    }

    return (
      <div
        className={`pages-list__page ${
          currentPage === path ? "pages-list__page--underlined" : ""
        }`}
        onClick={() => this.props.setCurrentPage(path)}
      >
        <span className="pages-list__page-url">{path}</span>
        <span className="pages-list__page-passing-count">{passingString}</span>
      </div>
    );
  }
}

export default Page;
