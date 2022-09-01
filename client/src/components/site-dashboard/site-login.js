import React, { useCallback, useEffect } from "react";
import { Input } from "antd";

const SiteLogin = (props) => {
  const { siteData, setSitePassword, setSiteUsername } = props;
  const { sitePath } = siteData;

  const setUsername = useCallback(
    (event) => {
      const value = event.target ? event.target.value : event;

      localStorage.setItem(`${sitePath}-siteUsername`, value);
      setSiteUsername(value);
    },
    [sitePath, setSiteUsername]
  );

  const setPassword = useCallback(
    (event) => {
      const value = event.target ? event.target.value : event;

      localStorage.setItem(`${sitePath}-sitePassword`, value);
      setSitePassword(value);
    },
    [sitePath, setSitePassword]
  );

  useEffect(() => {
    setUsername(
      localStorage.getItem(`${props.siteData.sitePath}-siteUsername`)
    );
    setPassword(
      localStorage.getItem(`${props.siteData.sitePath}-sitePassword`)
    );
  }, [setUsername, setPassword, props.siteData.sitePath]);

  return (
    <div className="site-login">
      <span>Username:</span>
      <Input
        placeholder="username"
        defaultValue={props.siteData.siteUsername}
        value={props.siteData.siteUsername}
        onChange={setUsername}
      />
      <span>Password:</span>
      <Input
        placeholder="password"
        defaultValue={props.siteData.sitePassword}
        value={props.siteData.sitePassword}
        onChange={setPassword}
      />
    </div>
  );
};

export default SiteLogin;
