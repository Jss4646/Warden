import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

/**
 * A navigation list element
 *
 * @param logo
 * @param {String} text
 * @param {String} link
 */
const NavigationItem = ({ logo, text, link }) => {
  return (
    <li className="navigation__item">
      <NavLink
        className="navigation__link"
        to={link}
        activeClassName={"navigation__link--current-page"}
        exact
      >
        {logo}
        {text}
      </NavLink>
    </li>
  );
};

NavigationItem.propTypes = {
  logo: PropTypes.object,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default NavigationItem;
