import React from "react";
import { Button, Checkbox } from "antd";
import { saveAs } from "file-saver";
import { addPage } from "../../../tools/pages";

const PagesSettings = (props) => {
  const { siteData, setTrimPages } = props;
  const { trimPages, sitePath, url } = siteData;
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

  // creates a new page for each wp-admin page
  const addWpAdminPages = () => {
    const wpAdminPages = [
      "/wp-admin/",
      "/wp-admin/edit.php",
      "/wp-admin/post-new.php",
      "/wp-admin/edit-tags.php?taxonomy=category",
      "/wp-admin/upload.php",
      "/wp-admin/media-new.php",
      "/wp-admin/edit.php?post_type=page",
      "/wp-admin/post-new.php?post_type=page",
      "/wp-admin/post-new.php?post_type=page",
      "/wp-admin/themes.php",
      "/wp-admin/customize.php?return=%2Fwp-admin%2Fthemes.php",
      "/wp-admin/nav-menus.php",
      "/wp-admin/widgets.php",
      "/wp-admin/plugins.php",
      "/wp-admin/users.php",
      "/wp-admin/user-new.php",
      "/wp-admin/profile.php",
      "/wp-admin/tools.php",
      "/wp-admin/options-general.php",
      "/wp-admin/options-writing.php",
      "/wp-admin/options-reading.php",
      "/wp-admin/options-media.php",
      "/wp-admin/options-permalink.php",
      "/wp-admin/options-privacy.php",
    ];

    wpAdminPages.forEach((page) => {
      addPage(url, page, sitePath, props.addPage);
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
      <Button
        className="pages-settings__add-wp-admin-pages"
        onClick={addWpAdminPages}
      >
        Add WP Admin pages
      </Button>
      <Button onClick={saveSettings}>Save</Button>
    </div>
  );
};

export default PagesSettings;
