import JSZip from "jszip";

/**
 * Downloads a given screenshot
 *
 * @param {Object} screenshot
 */
export function downloadScreenshot(screenshot) {
  let { host, pathname, deviceName, image } = screenshot;
  pathname = pathname !== "/" ? pathname : "";
  downloadFile(`${host}${pathname}-${deviceName}-screenshot.jpeg`, image);
}

/**
 * Downloads a zip file of screenshots to the users computer
 *
 * @param {Object[]}screenshots
 */
export async function downloadScreenshots(screenshots) {
  const zip = createScreenshotsZip(screenshots);

  await zip.generateAsync({ type: "blob" }).then((content) => {
    downloadFile("screenshots.zip", URL.createObjectURL(content));
  });
}

/**
 * ====================
 *  Internal functions
 * ====================
 */

/**
 * creates a zip file containing screenshots
 *
 * @param screenshots
 * @returns {Promise<this>}
 */
async function createScreenshotsZip(screenshots) {
  const zip = new JSZip();

  for (const screenshot of screenshots) {
    const { host, pathname, deviceName, image } = screenshot;
    const imageBlob = await fetch(image)
      .then((res) => res.arrayBuffer())
      .then((image) => {
        const imageBlob = new Blob([image], { type: "image/jpeg" });
        return URL.createObjectURL(imageBlob);
      });
    zip.file(`${host}${pathname}-${deviceName}-screenshot.jpeg`, imageBlob, {
      base64: true,
    });
  }

  return zip;
}

/**
 * Downloads a file to the users computer
 *
 * @param {string} fileName
 * @param {string} content
 */
function downloadFile(fileName, content) {
  const a = document.createElement("a");
  a.href = content;
  a.download = fileName;
  a.style = "display: none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
