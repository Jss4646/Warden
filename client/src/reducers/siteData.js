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

    case "SET_PAGES":
      stateCopy.pages = action.pages;
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
      // console.log(stateCopy.pages);
      stateCopy.pages[action.page].screenshots[action.device] =
        action.screenshots;
      return stateCopy;

    case "SET_ALL_SCREENSHOTS":
      stateCopy.pages = action.pages;
      return stateCopy;

    case "SET_BASELINE_URL":
      stateCopy.url = action.url;
      return stateCopy;

    case "SET_COMPARISON_URL":
      stateCopy.comparisonUrl = action.url;
      return stateCopy;

    case "SET_NUM_OF_FAILING":
      stateCopy.numOfFailing = action.numOfFailing;
      return stateCopy;

    case "SET_NUM_IN_QUEUE":
      stateCopy.numInQueue = action.numInQueue;
      return stateCopy;

    case "SET_COOKIES":
      stateCopy.cookies = action.cookies;
      return stateCopy;

    default:
      return state;
  }
}

export default siteData;
