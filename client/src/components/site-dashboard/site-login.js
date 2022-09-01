import React, { useEffect } from "react";
import { Input } from "antd";

const SiteLogin = (props) => {
  useEffect(() => {
    props.setSiteUsername(
      localStorage.getItem(`${props.siteData.sitePath}-siteUsername`)
    );
    props.setSitePassword(
      localStorage.getItem(`${props.siteData.sitePath}-sitePassword`)
    );
  }, [props]);

  const setSiteUsername = (event) => {
    localStorage.setItem(
      `${props.siteData.sitePath}-siteUsername`,
      event.target.value
    );
    props.setSiteUsername(event.target.value);
  };

  const setSitePassword = (event) => {
    localStorage.setItem(
      `${props.siteData.sitePath}-sitePassword`,
      event.target.value
    );
    props.setSitePassword(event.target.value);
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
