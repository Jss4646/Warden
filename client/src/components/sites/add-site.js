import React, { Component } from "react";
import { Button, Input } from "antd";
import validateURL from "../../tools/url";
import { withRouter } from "react-router";

class AddSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName: "",
      url: "",
      comparisonUrl: "",
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
    newState.url = event.target.value;
    this.setState(newState);
  }

  updateComparisonUrl = (event) => {
    const newState = { ...this.state };
    newState.comparisonUrl = event.target.value;
    this.setState(newState);
  };

  updateErrorMessage(errorMessage) {
    const newState = { ...this.state };
    newState.errorMessage = errorMessage;
    this.setState(newState);
  }

  /**
   * Adds a new site to the db and navigates to it
   *
   * @param event {Event}
   * @returns {Promise<void>}
   */
  async submitSite(event) {
    event.preventDefault();

    if (!validateURL(this.state.url)) {
      this.updateErrorMessage("Url is not valid");
      setTimeout(() => {
        this.updateErrorMessage("");
      }, 3000);
      return;
    }

    let sitePath = this.state.siteName.toLowerCase().replaceAll(" ", "-");

    const url = new URL(this.state.url).href;
    const comparisonUrl = new URL(this.state.comparisonUrl).href;

    const params = {
      siteName: this.state.siteName,
      url,
      comparisonUrl,
      sitePath,
      failingPercentage: 5,
      devices: ["1080p", "iphone-x/xs"],
    };

    const fetchUrl = `${window.location.origin}/api/add-site`;
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    this.props.history.push(`/sites/${params.sitePath}`);
  }

  /**
   * Toggles to model open and closed
   */
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
            updateComparisonUrl={this.updateComparisonUrl}
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
  updateComparisonUrl,
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
      <div className="add-site-modal__comparison-url">
        <label>Comparison url:</label>
        <Input onChange={updateComparisonUrl} />
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
