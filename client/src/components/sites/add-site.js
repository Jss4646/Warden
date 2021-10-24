import React, { Component } from "react";
import { Button, Input } from "antd";
import validateURL from "../../tools/url";
import { withRouter } from "react-router";

class AddSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName: "",
      siteUrl: "",
      errorMessage: "",
      modalShown: false,
    };

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

    let sitePath = this.state.siteName.toLowerCase().replaceAll(" ", "-");

    const params = {
      siteName: this.state.siteName,
      siteUrl: this.state.siteUrl,
      sitePath,
      pages: {},
    };

    const fetchUrl = new URL(`${window.location.origin}/api/add-site`);
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    this.props.history.push(`/sites/${params.sitePath}`);
  }

  toggleModal = () => {
    const newState = { ...this.state };
    newState.modalShown = !newState.modalShown;
    this.setState(newState);
  };

  render() {
    return (
      <div className="add-site">
        <Button type="primary" onClick={this.toggleModal}>
          {this.state.modalShown ? "Close modal" : "Add site"}
        </Button>
        {this.state.modalShown ? (
          <AddSiteModal
            updateSiteName={this.updateSiteName}
            updateSiteUrl={this.updateSiteUrl}
            submitSite={this.submitSite}
            errorMessage={this.state.errorMessage}
          />
        ) : null}
      </div>
    );
  }
}

const AddSiteModal = ({
  updateSiteName,
  updateSiteUrl,
  submitSite,
  errorMessage,
}) => (
  <div className="add-site-modal">
    <form>
      <div className="add-site-modal__site-name">
        <label>Site name:</label>
        <Input onChange={updateSiteName} />
      </div>
      <div className="add-site-modal__site-url">
        <label>Site url:</label>
        <Input onChange={updateSiteUrl} />
      </div>
      <div className="add-site-modal__bottom-row">
        <Button className="add-site-modal__submit" onClick={submitSite}>
          Submit site
        </Button>
        <p className="add-site-modal__error-message">{errorMessage}</p>
      </div>
    </form>
  </div>
);

export default withRouter(AddSite);
