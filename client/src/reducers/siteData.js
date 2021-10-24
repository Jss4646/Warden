function siteData(state = [], action) {
  const stateCopy = { ...state };

  switch (action.type) {
    case "CLEAR_SITE_DATA":
      return {
        siteName: "",
        siteUrl: "",
        siteStatus: "",
        sitePages: {},
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

    case "SET_CURRENT_PAGE":
      stateCopy.currentPage = action.pagePath;
      return stateCopy;

    default:
      return state;
  }
}

export default siteData;
