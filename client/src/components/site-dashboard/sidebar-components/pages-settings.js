import React from "react";
import { Button, Checkbox, Input } from "antd";
import { saveAs } from "file-saver";
import { addPage, removePage } from "../../../tools/pages";
import wpAdminPages from "../../../data/wp-admin-pages.json";

const PagesSettings = (props) => {
  const { siteData, setTrimPages, setWpAdminPath } = props;
  const { trimPages, sitePath, url, wpAdminPath } = siteData;
  const uploadUrlsRef = React.createRef();

  const saveSettings = () => {
    const body = {
      trimPages,
      sitePath,
      wpAdminPath,
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

  /**
   * Creates all wp-admin pages from the UI and db
   */
  const addWpAdminPages = () => {
    wpAdminPages.forEach((wpAdminPage) => {
      const defaultPaths = ["wp-admin", ""];

      if (!defaultPaths.includes(wpAdminPage) && wpAdminPath) {
        console.log(wpAdminPath);
        const splitPage = wpAdminPage.split("/");
        splitPage[1] = wpAdminPath;
        wpAdminPage = splitPage.join("/");
      }

      addPage(url, wpAdminPage, sitePath, props.addPage);
    });
  };

  /**
   * Removes all wp-admin pages from the UI and db
   */
  const removeWpAdminPages = () => {
    Object.values(siteData.pages).forEach((page) => {
      let checkPath =
        !wpAdminPath || wpAdminPath === "" ? "wp-admin" : wpAdminPath;

      console.log(checkPath);
      if (!page.pagePath.includes(checkPath)) {
        return;
      }

      removePage(page.pagePath, sitePath, props.removePage);
    });
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
      <div className="pages-settings__wp-admin-path">
        <span>WP Admin Path:</span>
        <Input
          placeholder="wp-admin"
          defaultValue="wp-admin"
          value={wpAdminPath}
          onChange={(event) => setWpAdminPath(event.target.value)}
        />
      </div>
      <div className="pages-settings__wp-admin-buttons">
        <Button
          className="pages-settings__add-wp-admin-pages"
          onClick={addWpAdminPages}
        >
          Add WP Admin pages
        </Button>
        <Button
          className="pages-settings__remove-wp-admin-pages"
          onClick={removeWpAdminPages}
        >
          Remove WP Admin pages
        </Button>
      </div>
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

export default PagesSettings;
