import React, { useState } from "react";
import { Button } from "antd";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Misc = (props) => {
  const [statusMessage, setStatusMessage] = useState("");

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

          fileCreationPromises.push(
            new Promise(async (resolve, reject) => {
              const screenshot = await fetch(screenshotData).catch((err) =>
                reject(err)
              );
              const screenshotBlob = await screenshot
                .blob()
                .catch((err) => reject(err));

              zip.file(screenshotData, screenshotBlob);
              resolve();
            })
          );
        }
      }
    }

    await Promise.all(fileCreationPromises).catch(console.error);
    const zipBlob = await zip.generateAsync({ type: "blob" });

    setStatusMessage("Download complete");
    setTimeout(() => setStatusMessage(""), 2500);

    saveAs(zipBlob, `${siteName} Comparison Export.zip`);
  };

  return (
    <div className="misc">
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
