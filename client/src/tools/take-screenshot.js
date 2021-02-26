import devices from "../data/devices.json";
import { v1 as uuidv1 } from "uuid";
import * as placeholderImage from "../data/image.jpeg";

/* eslint-disable */
const takeScreenshot = async (url, props) => {
  const { addScreenshot, addScreenshotImage, addActivityLogLine } = props;
  const { selectedDevices } = props.appState;

  for (const deviceKey of selectedDevices) {
    const { width, height, userAgent, scale, name } = devices[deviceKey];

    const screenshotId = uuidv1();

    const parsedUrl = new URL(url);

    const screenshotData = {
      deviceName: name,
      image: "",
      id: screenshotId,
      host: parsedUrl.host,
      pathname: parsedUrl.pathname,
    };

    addScreenshot(screenshotData);

    const params = {
      access_key: process.env.REACT_APP_ACCESS_KEY,
      url: parsedUrl,
      fresh: true,
      full_page: true,
      scroll_page: true,
      format: "jpeg",
      quality: "80",
      user_agent: userAgent,
      scale_factor: scale,
      width,
      height,
    };

    /** Use for actual api call **/
    // fetchScreenshot(params, addActivityLogLine).then((screenshotImage) => {
    //   console.log(screenshotImage);
    //   addScreenshotImage(screenshotData, screenshotImage);
    // });

    fetch(placeholderImage.default)
      .then((res) => res.arrayBuffer())
      .then((image) => {
        const imageBlob = new Blob([image], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(imageBlob);
        addScreenshotImage(screenshotData, imageUrl);
      });
  }
};

const fetchScreenshot = async (params, addActivityLogLine) => {
  console.log("Taking screenshot");
  const fetchUrl = new URL("https://api.apiflash.com/v1/urltoimage");

  Object.keys(params).forEach((key) =>
    fetchUrl.searchParams.append(key, params[key])
  );

  return await fetch(fetchUrl.toString())
    .then(async (res) => {
      if (res.ok) {
        return res.arrayBuffer();
      } else {
        console.log(res);
        throw new Error(`Screenshot request not ok: ${await res.text()}`);
      }
    })
    .then(async (image) => {
      console.log("Creating image");
      const imageBlob = new Blob([image], { type: "image/jpeg" });

      return URL.createObjectURL(imageBlob);
    })
    .catch((err) => {
      addActivityLogLine(
        <>
          Couldn't fetch screenshot: <code>{err.toString()}</code>
        </>
      );
    });
};

export default takeScreenshot;
