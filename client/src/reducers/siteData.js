function siteData(state = [], action) {
  const stateCopy = { ...state };

  switch (action.type) {
    case "CLEAR_SITE_DATA":
      return {
        siteName: "",
        url: "",
        comparisonUrl: "",
        siteStatus: "",
        pages: {},
        currentPage: "",
      };

    case "LOAD_SITE_DATA":
      return action.siteData;

    case "SET_SITE_STATUS":
      stateCopy.siteStatus = action.siteStatus;
      return stateCopy;

    case "ADD_PAGE":
      stateCopy.pages[action.pagePath] = action.page;
      return stateCopy;

    case "REMOVE_PAGE":
      delete stateCopy.pages[action.pagePath];
      return stateCopy;

    case "REMOVE_ALL_PAGES":
      stateCopy.pages = { "/": stateCopy.pages["/"] };
      return stateCopy;

    case "SET_CURRENT_PAGE":
      stateCopy.currentPage = action.pagePath;
      return stateCopy;

    case "ADD_SCREENSHOTS":
      stateCopy.pages[action.page].screenshots[action.device] =
        action.screenshots;
      return stateCopy;

    case "SET_IS_SCREENSHOT_FAILING":
      if (!stateCopy.failingScreenshots[action.page]) {
        stateCopy.failingScreenshots[action.page] = [];
      }

      const failingScreenshotExists = stateCopy.failingScreenshots[
        action.page
      ].find((device) => device === action.device);

      if (!failingScreenshotExists && action.failed) {
        stateCopy.failingScreenshots[action.page].push(action.device);
      } else if (failingScreenshotExists && !action.failed) {
        stateCopy.failingScreenshots[action.page].filter(
          (device) => device !== action.device
        );
      }

      stateCopy.pages[action.page].screenshots[action.device].failing =
        action.failed;

      return stateCopy;

    default:
      return state;
  }
}

export default siteData;
