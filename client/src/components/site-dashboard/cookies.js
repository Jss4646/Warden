import React, { Component } from "react";
import { validateCookies } from "../../tools/comparison-tools";

class Cookies extends Component {
  constructor(props) {
    super(props);
    this.setCookies = this.setCookies.bind(this);
    this.props.setCookies(
      localStorage.getItem(`${props.siteData.sitePath}-cookies`)
    );
  }

  /**
   * Updates state for cookies
   *
   * @param {Event} event
   */
  setCookies(event) {
    localStorage.setItem(
      `${this.props.siteData.sitePath}-cookies`,
      event.target.value
    );
    this.props.setCookies(event.target.value);
  }

  /**
   * Generates the class for the textarea to update color
   * depending on if cookies is in a valid format
   *
   * @param {string} cookies
   * @returns {string|undefined}
   */
  generateCookieClass(cookies) {
    if (!cookies) {
      return;
    }

    if (validateCookies(cookies)) {
      return "cookies--valid";
    } else {
      return "cookies--not-valid";
    }
  }

  render() {
    const placeholder = "[{\r\n\t'cookieData': 'data'\r\n}]";
    const classes = ["cookies"];

    const cookies = this.props.siteData.cookies;
    const cookiesValidClass = this.generateCookieClass(cookies);
    if (cookiesValidClass) {
      classes.push(cookiesValidClass);
    }

    return (
      <textarea
        className={classes.join(" ")}
        placeholder={placeholder}
        value={this.props.siteData.cookies}
        onChange={this.setCookies}
      />
    );
  }
}

export default Cookies;
