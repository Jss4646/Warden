import React from "react";
import { Button, InputNumber } from "antd";

const ScreenshotSettings = (props) => {
  const { siteData, setFailingPercentage } = props;
  const { failingPercentage, sitePath } = siteData;

  const saveSettings = () => {
    const body = {
      sitePath,
      failingPercentage,
    };

    fetch("/api/set-site-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className="screenshot-settings">
      <div className="screenshot-settings__failing-threshold">
        <label>Failing Threshold: </label>
        <InputNumber
          className="screenshot-settings__failing-threshold-input"
          min={0}
          max={100}
          defaultValue={failingPercentage}
          value={failingPercentage}
          addonAfter="%"
          onChange={(value) => setFailingPercentage(value)}
        />
      </div>
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

export default ScreenshotSettings;
