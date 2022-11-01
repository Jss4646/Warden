import React, { Component } from "react";
import SiteCard from "../components/sites/site-card";
import bindComponentToState from "../tools/bindComponentToState";
import AddSite from "../components/sites/add-site";
import ClearQueue from "../components/sites/clear-queue";

class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = { sites: [], loading: true };
  }

  async getSiteData(fetchUrl, json) {
    return await fetch(fetchUrl).then((res) => {
      if (res.status === 200) {
        if (json) {
          return res.json();
        }

        return res.text();
      } else {
        console.error(res.text());
        return false;
      }
    });
  }

  async componentDidMount() {
    const siteDataFetchUrl = `${window.location.origin}/api/get-all-sites`;
    const loadingFetchUrl = `${window.location.origin}/api/get-num-of-loading-screenshots`;
    console.log("Getting site");

    let siteData;

    for (let i = 0; i < 10; i++) {
      siteData = await this.getSiteData(siteDataFetchUrl, true);
      if (siteData) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const numOfLoadingScreenshots = await this.getSiteData(loadingFetchUrl);

    console.log("site data:", siteData);

    this.setState({
      ...this.state,
      sites: siteData,
      numOfLoadingScreenshots,
      loading: false,
    });
  }

  render() {
    const { sites, numOfLoadingScreenshots } = this.state;

    if (this.state.loading) {
      return <div>Loading</div>;
    }

    if (!sites) {
      return <div>Server is down :( please message jack</div>;
    }

    return (
      <div className="sites">
        <div className="sites__options">
          <AddSite />
          <span className="sites__loading-screenshots">
            Loading screenshots: {numOfLoadingScreenshots}
          </span>
          <ClearQueue />
        </div>
        <div className="sites__cards">
          {sites?.map((site, index) => {
            const lastRan = site.lastRan ? site.lastRan : "Never";

            const siteStatus = {
              passing: site.passing,
              loading: site.loading,
              failing: site.failing,
            };

            return (
              <SiteCard
                lastRan={lastRan}
                url={site.url}
                siteName={site.siteName}
                sitePath={site.sitePath}
                siteStatus={siteStatus}
                key={index}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

Sites = bindComponentToState(Sites);
export default Sites;
