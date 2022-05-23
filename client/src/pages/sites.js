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
    const fetchUrl = `${window.location.origin}/api/get-all-sites`;
    console.log("Getting site");
    const siteData = await fetch(fetchUrl).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res.text();
      }
    });
    console.log("site data:", siteData);
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

            const totalScreenshots =
              Object.keys(site.pages).length * site.devices.length;

            const numOfFailing = Object.keys(site.pages).reduce(
              (prev_num, page) => {
                const screenshots = site.pages[page].screenshots;
                const numOfFailing = Object.keys(screenshots).reduce(
                  (prev_num, device) => {
                    return prev_num + screenshots[device].failing;
                  },
                  0
                );
                return prev_num + numOfFailing;
              },
              0
            );

            console.log(numOfFailing);

            const siteStatus = {
              passing: totalScreenshots - numOfFailing,
              difference: site.difference ? site.difference : "--",
              failing: numOfFailing,
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
