import React, { useEffect } from "react";
import { Button, Checkbox, InputNumber } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { JSHINT } from "jshint";

const ScreenshotSettings = (props) => {
  const {
    siteData,
    setFailingPercentage,
    setInjectedJS,
    setValidJS,
    setScrollPage,
    setPageTimeout,
  } = props;
  const {
    failingPercentage,
    sitePath,
    injectedJS,
    validJS,
    scrollPage,
    pageTimeout,
  } = siteData;

  /**
   * Sets whether the injected JS is valid or not
   *
   * @param {String} value - The injected JS
   * @param {Function} setValidJS - The function to set whether the injected JS is valid or not
   */
  const validateJS = (value, setValidJS) => {
    if (!value) {
      setValidJS(true);
      return;
    }

    JSHINT(value, { esversion: 11 }, {});
    const data = JSHINT.data();

    if (data.errors) {
      setValidJS(false);
      return;
    }

    setValidJS(true);
  };

  /**
   * Updates the injected JS in the state
   *
   * @param {String} value - The new value
   */
  const updateInjectedJS = (value) => {
    setInjectedJS(value);
    validateJS(value, setValidJS);
  };

  /**
   * Save the settings to the database
   */
  const saveSettings = () => {
    const body = {
      sitePath,
      failingPercentage,
      scrollPage,
      injectedJS,
      pageTimeout,
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

  /**
   * Gets the injected JS from local storage if it exists
   */
  useEffect(() => {
    validateJS(injectedJS, setValidJS);
  }, [setValidJS, injectedJS]);

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
      <div
        className={`screenshot-settings__injected-js${
          !validJS ? " screenshot-settings__injected-js--invalid-js" : ""
        }`}
      >
        <label>Injected JS: </label>
        <CodeMirror
          value={injectedJS}
          height="200px"
          extensions={[javascript()]}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            syntaxHighlighting: true,
          }}
          onChange={(value) => updateInjectedJS(value)}
        />
      </div>
      <div className="screenshot-settings__page-timeout">
        <label>Timeout before screenshot: </label>
        <InputNumber
          className="screenshot-settings__page-timeout-input"
          min={0}
          max={5000}
          defaultValue={pageTimeout}
          value={pageTimeout}
          addonAfter="ms"
          onChange={(value) => setPageTimeout(value)}
        />
      </div>
      <div className="screenshot-settings__scroll-page">
        <Checkbox
          onChange={() => setScrollPage(!scrollPage)}
          checked={scrollPage}
        >
          Scroll page
        </Checkbox>
      </div>
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

export default ScreenshotSettings;
