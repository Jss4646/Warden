import React, { Component } from "react";
import { Button, Input } from "antd";
import validateURL from "../../tools/url";
import { withRouter } from "react-router";

class AddSite extends Component {
  constructor(props) {
    super(props);
    this.state = { siteName: "", siteUrl: "", errorMessage: "" };

    this.updateSiteName = this.updateSiteName.bind(this);
    this.updateSiteUrl = this.updateSiteUrl.bind(this);
    this.submitSite = this.submitSite.bind(this);
  }

  updateSiteName(event) {
    const newState = { ...this.state };
    newState.siteName = event.target.value;
    this.setState(newState);
  }

  updateSiteUrl(event) {
    const newState = { ...this.state };
    newState.siteUrl = event.target.value;
    this.setState(newState);
  }

  updateErrorMessage(errorMessage) {
    const newState = { ...this.state };
    newState.errorMessage = errorMessage;
    this.setState(newState);
  }

  async submitSite(event) {
    event.preventDefault();

    if (!validateURL(this.state.siteUrl)) {
      this.updateErrorMessage("Url is not valid");
      return;
    }

    const params = {
      siteName: this.state.siteName,
      siteUrl: this.state.siteUrl,
    };

    const fetchUrl = new URL(`${window.location.origin}/api/add-site`);
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    this.props.history.push(`/sites/${params.siteName}`);
  }

  render() {
    return (
      <>
        <Button type="primary">Add site</Button>
        <div className="add-site-modal">
          <form>
            <div className="add-site-modal__site-name">
              <label>Site name:</label>
              <Input onChange={this.updateSiteName} />
            </div>
            <div className="add-site-modal__site-url">
              <label>Site url:</label>
              <Input onChange={this.updateSiteUrl} />
            </div>
            <Button onClick={this.submitSite}>Submit site</Button>
            <span className="add-site-modal__error-message">
              {this.state.errorMessage}
            </span>
          </form>
        </div>
      </>
    );
  }
}

export default withRouter(AddSite);
