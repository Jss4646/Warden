import React from "react";
import { Button, Checkbox } from "antd";
import { saveAs } from "file-saver";

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
    console.log("reading file");
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file === undefined) {
      console.log("no file selected");
      return;
    }

    if (file.type.match("txt.*")) {
      console.log("file isn't text");
      return false;
    }

    reader.readAsText(file);

    reader.onload = () => {
      console.log("uploading file");
      const urls = reader.result.split(/\r?\n/);
      fetch("/api/import-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls, sitePath }),
      }).catch(console.error);

      event.target.value = "";
    };
  };

  const exportPages = () => {
    const urls = Object.values(siteData.pages).map((page) => `${page.url}\n`);
    const blob = new Blob(urls, { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${siteData.sitePath}-urls.txt`);
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
      <div className="pages-settings__import-export">
        <Button className="pages-settings__import-pages" onClick={loadUrls}>
          Import pages
        </Button>
        <Button className="pages-settings__export-pages" onClick={exportPages}>
          Export pages
        </Button>
      </div>
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
