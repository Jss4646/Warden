import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { withRouter } from "react-router";

/**
 *
 */
class SiteCard extends Component {
  goToDashboard = () => {
    this.props.history.push(`/sites/${this.props.sitePath}`);
  };

  render() {
    const { siteName, url, lastRan, frequency, siteStatus } = this.props;

    const loadingClass = siteStatus.loading ? "site-card--loading" : "";

    return (
      <div className={`site-card ${loadingClass}`}>
        <div className="site-card__header">
          <h2 className="site-card__name">{siteName}</h2>
          <a
            className="site-card__site-link"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Visit site
          </a>
        </div>
        <div className="site-card__info">
          <span className="site-card__info-last-ran">Last ran: {lastRan}</span>
          <span className="site-card__info-frequency">
            Frequency: {frequency}
          </span>
        </div>
        <div className="site-card__site-status">
          <div className="site-card__status site-card__status--passing">
            <h3>Pages</h3>
            <h3>{siteStatus.numOfPages}</h3>
          </div>
          {/*<div className="site-card__status site-card__status--loading">*/}
          {/*  <h3>loading</h3>*/}
          {/*  <h3>{siteStatus.loading}</h3>*/}
          {/*</div>*/}
          {/*<div className="site-card__status site-card__status--failing">*/}
          {/*  <h3>Failing</h3>*/}
          {/*  <h3>{siteStatus.failing}</h3>*/}
          {/*</div>*/}
        </div>
        <div className="site-card__buttons">
          <Button>Run comparison</Button>
          <Button type="primary" onClick={this.goToDashboard}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}

SiteCard.propTypes = {
  siteName: PropTypes.string,
  url: PropTypes.string,
  siteStatus: PropTypes.object,
  lastRan: PropTypes.string,
  frequency: PropTypes.string,
};

export default withRouter(SiteCard);
