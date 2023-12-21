import React, { useState } from "react";
import { Button, InputNumber } from "antd";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Misc = (props) => {
  const [statusMessage, setStatusMessage] = useState("");

  /**
   * Downloads all the screenshots as a zip file
   *
   * @returns {Promise<void>}
   */
  const downloadImages = async () => {
    const { pages, siteName } = props.siteData;

    setStatusMessage("Downloading images...");

    const zip = new JSZip();
    const fileCreationPromises = [];

    for (const page of Object.values(pages)) {
      for (const screenshotDatas of Object.values(page.screenshots)) {
        for (const screenshotData of Object.values(screenshotDatas)) {
          if (typeof screenshotData !== "string") {
            continue;
          }

          fileCreationPromises.push(addToZipPromise(screenshotData, zip));
        }
      }
    }

    await Promise.all(fileCreationPromises).catch(console.error);
    const zipBlob = await zip.generateAsync({ type: "blob" });

    setStatusMessage("Download complete");
    setTimeout(() => setStatusMessage(""), 2500);

    saveAs(zipBlob, `${siteName} Comparison Export.zip`);
  };

  /**
   * Promises to add a file to the zip file
   *
   * @param screenshotPath
   * @param {JSZip} zip
   * @returns {Promise<void>}
   */
  function addToZipPromise(screenshotPath, zip) {
    return new Promise(async (resolve, reject) => {
      const screenshot = await fetch(screenshotPath).catch((err) =>
        reject(err)
      );
      const screenshotBlob = await screenshot
        .blob()
        .catch((err) => reject(err));

      zip.file(screenshotPath, screenshotBlob);
      resolve();
    });
  }

  return (
    <div className="misc">
      <InputNumber addonAfter="days" precision={0} defaultValue={7} />
      <Button
        className="misc__download-button"
        type="primary"
        onClick={downloadImages}
      >
        Download Images
      </Button>
      <span className="misc__download-button-status">{statusMessage}</span>
    </div>
  );
};

export default Misc;
