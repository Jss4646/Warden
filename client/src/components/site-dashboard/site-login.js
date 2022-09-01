import React, { useEffect } from "react";
import { Input } from "antd";

const SiteLogin = (props) => {
  useEffect(() => {
    setSiteUsername(
      localStorage.getItem(`${props.siteData.sitePath}-siteUsername`)
    );
    setSitePassword(
      localStorage.getItem(`${props.siteData.sitePath}-sitePassword`)
    );
  }, []);

  const setSiteUsername = (event) => {
    const value = event.target ? event.target.value : event;

    localStorage.setItem(`${props.siteData.sitePath}-siteUsername`, value);
    props.setSiteUsername(value);
  };

  const setSitePassword = (event) => {
    const value = event.target ? event.target.value : event;

    localStorage.setItem(`${props.siteData.sitePath}-sitePassword`, value);
    props.setSitePassword(value);
  };

  return (
    <div className="site-login">
      <span>Username:</span>
      <Input
        placeholder="username"
        defaultValue={props.siteData.siteUsername}
        value={props.siteData.siteUsername}
        onChange={setSiteUsername}
      />
      <span>Password:</span>
      <Input
        placeholder="password"
        defaultValue={props.siteData.sitePassword}
        value={props.siteData.sitePassword}
        onChange={setSitePassword}
      />
    </div>
  );
};

export default SiteLogin;
