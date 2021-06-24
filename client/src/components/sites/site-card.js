import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";

/**
 *
 */
const SiteCard = ({
  siteName,
  siteLink,
  pages,
  siteStatus,
  lastRan,
  frequency,
}) => {
  return (
    <div className="site-card">
      <div className="site-card__header">
        <h2 className="site-card__name">{siteName}</h2>
        <a
          className="site-card__site-link"
          href={siteLink}
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
          <h3>Passing</h3>
          <h3>{siteStatus.passing}</h3>
        </div>
        <div className="site-card__status site-card__status--difference">
          <h3>Difference</h3>
          <h3>{siteStatus.difference}</h3>
        </div>
        <div className="site-card__status site-card__status--failing">
          <h3>Failing</h3>
          <h3>{siteStatus.failing}</h3>
        </div>
      </div>
      <div className="site-card__buttons">
        <Button>Run comparison</Button>
        <Button type="primary">Go to dashboard</Button>
      </div>
    </div>
  );
};

SiteCard.propTypes = {
  siteName: PropTypes.string,
  siteLink: PropTypes.string,
  pages: PropTypes.number,
  siteStatus: PropTypes.objectOf(PropTypes.string),
  lastRan: PropTypes.string,
  frequency: PropTypes.string,
};

export default SiteCard;
