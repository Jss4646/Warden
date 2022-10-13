import React, { useCallback, useEffect } from "react";
import { Input } from "antd";

const SiteLogin = (props) => {
  const { siteData, setSitePassword, setSiteUsername } = props;
  const { sitePath } = siteData;

  /**
   * Sets the password in local storage and state
   */
  const setUsername = useCallback(
    (value) => {
      localStorage.setItem(`${sitePath}-siteUsername`, value);
      setSiteUsername(value);
    },
    [sitePath, setSiteUsername]
  );

  /**
   * Sets the username in local storage and state
   */
  const setPassword = useCallback(
    (value) => {
      localStorage.setItem(`${sitePath}-sitePassword`, value);
      setSitePassword(value);
    },
    [sitePath, setSitePassword]
  );

  /**
   * Sets the username and password from local storage into state on first render
   */
  useEffect(() => {
    setUsername(
      localStorage.getItem(`${props.siteData.sitePath}-siteUsername`) ?? ""
    );
    setPassword(
      localStorage.getItem(`${props.siteData.sitePath}-sitePassword`) ?? ""
    );
  }, [setUsername, setPassword, props.siteData.sitePath]);

  const siteUsername = siteData.siteUsername ? siteData.siteUsername : "";
  const sitePassword = siteData.sitePassword ? siteData.sitePassword : "";

  return (
    <div className="site-login">
      <span>Username:</span>
      <Input
        placeholder="username"
        defaultValue={siteUsername}
        value={siteUsername}
        onChange={(event) => setUsername(event.target.value)}
      />
      <span>Password:</span>
      <Input
        placeholder="password"
        defaultValue={sitePassword}
        value={sitePassword}
        onChange={(event) => setPassword(event.target.value)}
      />
    </div>
  );
};

export default SiteLogin;
