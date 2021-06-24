import React, { Component } from "react";
import SiteCard from "../components/sites/site-card";

class Sites extends Component {
  render() {
    return (
      <div className="sites">
        <div className="sites__cards">
          <SiteCard
            lastRan="01/01/2001"
            pages={56}
            siteLink="https://google.com"
            siteName="Google"
            siteStatus={{ passing: 10, difference: 10, failing: 10 }}
            frequency="daily"
          />
          <SiteCard
            lastRan="01/01/2001"
            pages={56}
            siteLink="https://google.com"
            siteName="Google"
            siteStatus={{ passing: 10, difference: 10, failing: 10 }}
            frequency="daily"
          />
          <SiteCard
            lastRan="01/01/2001"
            pages={56}
            siteLink="https://google.com"
            siteName="Google"
            siteStatus={{ passing: 10, difference: 10, failing: 10 }}
            frequency="daily"
          />
          <SiteCard
            lastRan="01/01/2001"
            pages={56}
            siteLink="https://google.com"
            siteName="Google"
            siteStatus={{ passing: 10, difference: 10, failing: 10 }}
            frequency="daily"
          />
        </div>
      </div>
    );
  }
}

export default Sites;
