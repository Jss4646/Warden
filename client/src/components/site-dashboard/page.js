import React from "react";

/**
 * Page displaying screenshots from each device
 */
const Page = (props) => {
  const { page, path, currentPage, setCurrentPage } = props;

  const screenshots = page.screenshots;

  const passing = calculatePassing(screenshots);
  const totalScreenshots = calculateTotalScreenshots(screenshots);

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
};

/**
 * Calculate the number of passing screenshots
 *
 * @param {Object} screenshots - screenshot object
 * @returns {number} - number of passing screenshots
 */
const calculatePassing = (screenshots) => {
  return Object.keys(screenshots).reduce((sum, key) => {
    const screenshot = screenshots[key];

    if (screenshot.loading) {
      return 0;
    }
    return sum + !screenshots[key].failing;
  }, 0);
};

/**
 * Calculate the total number of screenshots
 *
 * @param {Object} screenshots - screenshot object
 * @returns {number} - total number of screenshots
 */
const calculateTotalScreenshots = (screenshots) => {
  return Object.keys(screenshots).filter(
    (device) => !screenshots[device].loading
  ).length;
};

export default Page;
