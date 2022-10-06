import React from "react";
import { NavLink } from "react-router-dom";

/**
 * The QA Tools logo
 *
 */
const Logo = () => {
  return (
    <NavLink to={"/"}>
      <h1 className="logo">
        <span>W</span>ARDEN
      </h1>
    </NavLink>
  );
};

export default Logo;
