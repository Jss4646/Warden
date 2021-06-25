import React, { Component } from "react";
import { withRouter } from "react-router";

class SiteDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { siteName: "", siteUrl: "" };
  }

  async componentDidMount() {
    const params = { siteName: this.props.match.params.siteName };

    const fetchUrl = new URL(`${window.location.origin}/api/get-site`);
    console.log("Getting site");
    const siteData = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        this.props.history.push("/sites");
        return res.text();
      }
    });

    console.log("got site", siteData);
    if (typeof siteData === "object") {
      this.setState(siteData);
    }
  }

  render() {
    return (
      <div>
        <span>{this.state.siteName}</span>
        <span>{this.state.siteUrl}</span>
      </div>
    );
  }
}

export default withRouter(SiteDashboard);
