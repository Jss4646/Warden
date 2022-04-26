import devices from "../data/devices.json";
import { v1 as uuidv1 } from "uuid";

const takeScreenshot = async (url, props) => {
  const {
    addScreenshot,
    addScreenshotToQueue,
    addScreenshotImage,
    addActivityLogLine,
    setScreenshotState,
  } = props;
  const { selectedDevices } = props.appState;

  for (const deviceKey of selectedDevices) {
    const { width, height, userAgent, name } = devices[deviceKey];

    const screenshotId = uuidv1();
    const parsedUrl = new URL(url);
    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    const date = new Date();
    let path = parsedUrl.pathname === "/" ? "" : `${parsedUrl.pathname}-`;
    path = path.replaceAll("/", "-");
    const fileName = `${
      parsedUrl.host
    }-${path}${date.getMilliseconds()}-${date.getSeconds()}-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
    console.log(fileName);

    const screenshotData = {
      deviceName: name,
      image: "",
      id: screenshotId,
      url: parsedUrl,
      startTime: date.getTime(),
      endTime: 0,
      state: "running",
      abortController,
    };

    const params = {
      url: parsedUrl,
      fileName,
      userAgent: userAgent,
      resolution: { width, height },
      id: screenshotId,
    };

    /** Use for actual api call **/
    fetchScreenshot(params, abortSignal)
      .then((screenshotImage) => {
        addScreenshotImage(screenshotData, screenshotImage);
        setScreenshotState(screenshotData.id, parsedUrl, "done");
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          addActivityLogLine(<>Screenshot {screenshotData.id} canceled</>);
          setScreenshotState(screenshotData.id, parsedUrl, "canceled");
        } else {
          addActivityLogLine(
            <>
              Couldn't fetch screenshot: <code>{err.toString()}</code>
            </>
          );
          setScreenshotState(screenshotData.id, parsedUrl, "broken");
        }
        console.error(err);
      });

    addScreenshot(screenshotData);
    addScreenshotToQueue(screenshotData);
  }
};

const fetchScreenshot = async (params, abortSignal) => {
  const fetchUrl = new URL(`${window.location.origin}/api/take-screenshot`);

  return await fetch(fetchUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    signal: abortSignal,
  })
    .then(async (res) => {
      if (res.ok) {
        return res.arrayBuffer();
      } else {
        throw new Error(`Screenshot request not ok: ${await res.text()}`);
      }
    })
    .then(async (image) => {
      const imageBlob = new Blob([image], { type: "image/jpeg" });

      return URL.createObjectURL(imageBlob);
    })
    .catch((err) => {
      throw err;
    });
};

export default takeScreenshot;
