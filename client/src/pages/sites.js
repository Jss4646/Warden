import React, { Component } from "react";
import SiteCard from "../components/sites/site-card";
import bindComponentToState from "../tools/bindComponentToState";
import AddSite from "../components/sites/add-site";

class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = { sites: [] };
  }

  async componentDidMount() {
    const fetchUrl = new URL(`${window.location.origin}/api/get-all-sites`);
    console.log("Getting site");
    const siteData = await fetch(fetchUrl).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res.text();
      }
    });
    console.log(`site data: ${siteData}`);
    this.setState({ sites: siteData });
  }

  render() {
    const sites = this.state?.sites;

    return (
      <div className="sites">
        <div className="sites__options">
          <AddSite />
        </div>
        <div className="sites__cards">
          {sites?.map((site, index) => {
            const lastRan = site.lastRan ? site.lastRan : "Never";
            const siteStatus = {
              passing: site.passing ? site.passing : "--",
              difference: site.difference ? site.difference : "--",
              failing: site.failing ? site.failing : "--",
            };
            const frequency = site.frequency ? site.frequency : "Not set";

            return (
              <SiteCard
                lastRan={lastRan}
                url={site.url}
                siteName={site.siteName}
                sitePath={site.sitePath}
                siteStatus={siteStatus}
                frequency={frequency}
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
