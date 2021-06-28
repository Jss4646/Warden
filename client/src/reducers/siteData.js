function siteData(state = [], action) {
  switch (action.type) {
    case "CLEAR_SITE_DATA":
      return { siteName: "", siteUrl: "" };

    case "LOAD_SITE_DATA":
      return action.siteData;

    default:
      return state;
  }
}

export default siteData;
