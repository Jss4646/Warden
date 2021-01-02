import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

/**
 * An <a> element styled to look like a button
 *
 * @param {String} [link]
 * @param {String} [className]
 * @param {String} text
 * @param {"default" | "primary"} [buttonStyle]
 * @param {function} [onClickFunction]
 */
const Button = ({
  link = "#",
  className,
  text,
  buttonStyle = "default",
  onClickFunction,
}) => {
  switch (buttonStyle) {
    case "default":
      return (
        <NavLink
          to={link}
          className={`button button--default ${className}`}
          onClick={onClickFunction}
        >
          {text}
        </NavLink>
      );

    case "primary":
      return (
        <NavLink
          to={link}
          className={`button button--primary ${className}`}
          onClick={onClickFunction}
        >
          {text}
        </NavLink>
      );

    default:
      return undefined;
  }
};

Button.propTypes = {
  link: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  buttonStyle: PropTypes.oneOf(["default", "primary"]),
  onClickFunction: PropTypes.func,
};

export default Button;
