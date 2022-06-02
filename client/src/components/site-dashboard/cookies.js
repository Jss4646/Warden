import React, {Component} from 'react';

class Cookies extends Component {
    constructor(props) {
        super(props);
        this.setCookies = this.setCookies.bind(this)
    }

    setCookies(event) {
        this.props.setCookies(event.target.value);
    }

    validateInput(cookies) {
        try {
            JSON.parse(cookies)
        } catch (e) {
            return false;
        }

        return true;
    }

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