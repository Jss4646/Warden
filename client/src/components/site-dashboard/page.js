import React, { Component } from "react";

/**
 * Page displaying screenshots from each device
 */
class Page extends Component {
  /**
   * Removes a page from the client and db
   *
   * @returns {JSX.Element}
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
    const { page, path, currentPage, setCurrentPage } = this.props;

    const screenshots = page.screenshots;
    const passing = Object.keys(screenshots).reduce((sum, key) => {
      const screenshot = screenshots[key];

      if (screenshot.loading) {
        return 0;
      }
      return sum + !screenshots[key].failing;
    }, 0);
    const totalScreenshots = Object.keys(screenshots).filter(
      (device) => !screenshots[device].loading
    ).length;
    let passingString = `${passing}/${totalScreenshots}`;

    return (
      <div
        className={`pages-list__page ${
          currentPage === path ? "pages-list__page--underlined" : ""
        }`}
        onClick={() => setCurrentPage(path)}
      >
        <span className="pages-list__page-url">{path}</span>
        <span className="pages-list__page-passing-count">{passingString}</span>
      </div>
    );
  }
}

export default Page;
