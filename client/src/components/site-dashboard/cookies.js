import React, {Component} from 'react';

class Cookies extends Component {
    constructor(props) {
        super(props);
        this.setCookies = this.setCookies.bind(this)
    }

    /**
     * Updates state for cookies
     *
     * @param {Event} event
     */
    setCookies(event) {
        this.props.setCookies(event.target.value);
    }

    /**
     * Validates that the inputted cookies are JSON
     *
     * @param {string} cookies
     * @returns {boolean}
     */
    validateInput(cookies) {
        try {
            JSON.parse(cookies)
        } catch (e) {
            return false;
        }

        return true;
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

        if (this.validateInput(cookies)) {
            return "cookies--valid"
        } else {
            return "cookies--not-valid"
        }
    }


    render() {
        const placeholder = "[{\r\n\t'cookieData': 'data'\r\n}]"
        const classes = ["cookies"]

        const cookies = this.props.siteData.cookies;
        const cookiesValidClass = this.generateCookieClass(cookies)
        if (cookiesValidClass) {
            classes.push(cookiesValidClass)
        }

        return (
            <textarea
                className={classes.join(' ')}
                placeholder={placeholder}
                value={this.props.siteData.cookies}
                onChange={this.setCookies}
            />
        );
    }
}

export default Cookies;