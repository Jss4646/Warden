import React, { Component } from "react";
import { withRouter } from "react-router";
import bindComponentToState from "../tools/bindComponentToState";
import PagesSidebar from "../components/site-dashboard/pages-sidebar";
import PageScreenshots from "../components/site-dashboard/page-screenshots";
import OptionsSidebar from "../components/site-dashboard/options-sidebar";
import { wsInit } from "../tools/websocket-client";

class SiteDashboard extends Component {
  constructor(props) {
    super(props);
    this.props.clearSiteData();
    this.state = { isSiteDataLoaded: false };
  }

  async componentDidMount() {
    wsInit(this.props.setAllScreenshots);
    const params = { sitePath: this.props.match.params.sitePath };

    const fetchUrl = new URL(`${window.location.origin}/api/get-site`);
    console.log("Getting site");
    let siteData = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status !== 200) {
        this.props.history.push("/sites");
        return res.text();
      }

      return res.json();
    });

    console.log("got site", siteData);
    this.props.loadSiteData(siteData);

    this.setState({ isSiteDataLoaded: true });
  }

  render() {
    if (this.state.isSiteDataLoaded) {
      return (
        <div className="site-dashboard">
          <PagesSidebar {...this.props} />
          <PageScreenshots {...this.props} />
          <OptionsSidebar {...this.props} />
        </div>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

SiteDashboard = bindComponentToState(SiteDashboard);
export default withRouter(SiteDashboard);
