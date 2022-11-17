import React from "react";
import { Button, Checkbox } from "antd";

const PagesSettings = (props) => {
  const { siteData, setTrimPages } = props;
  const { trimPages, sitePath } = siteData;
  const uploadUrlsRef = React.createRef();

  const saveSettings = () => {
    const body = {
      trimPages,
      sitePath,
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

  const loadUrls = () => {
    uploadUrlsRef.current.click();
  };

  const uploadUrls = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file === undefined) return;

    if (file.type.match("txt.*")) {
      return false;
    }

    reader.onload = () => {
      let urls = reader.result.split("\n");
      fetch("/api/import-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls }),
      }).catch(console.error);

      reader.readAsText(file);
      event.target.value = "";
    };
  };

  return (
    <div className="pages-settings">
      <div className="pages-settings__trim-pages">
        <Checkbox
          onChange={() => setTrimPages(!trimPages)}
          checked={trimPages}
          defaultChecked={true}
        >
          Trim pages
        </Checkbox>
      </div>
      <Button
        className="pages-settings__import-pages"
        onClick={loadUrls}
        disabled
      >
        Import pages
      </Button>
      <input
        type="file"
        accept=".txt"
        id="load-url-file"
        style={{ display: "none" }}
        ref={uploadUrlsRef}
        onInput={uploadUrls}
      />
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

export default PagesSettings;
