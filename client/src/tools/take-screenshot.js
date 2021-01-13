import devices from "../data/devices.json";
import { v1 as uuidv1 } from "uuid";
import * as placeholderImage from "../data/image.jpeg";

const takeScreenshot = (url, props) => {
  const { addScreenshot, addScreenshotImage } = props;
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
    // const screenshotImage = await this.fetchScreenshot(params);
    // addScreenshotImage(screenshotImage, screenshotData);

    fetch(placeholderImage.default)
      .then((res) => res.arrayBuffer())
      .then((image) => {
        const imageBlob = new Blob([image], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(imageBlob);
        addScreenshotImage(imageUrl, screenshotData);
      });
  }
};

export default takeScreenshot;
