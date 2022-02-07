async function createImageBuffer(image) {
  const screenshotBlob = await image.blob();
  return await createImageBitmap(screenshotBlob);
}

async function createDiffImage(baselineScreenshot, comparisonScreenshot) {
  const baselineBufferPromise = createImageBuffer(baselineScreenshot);
  const comparisonBufferPromise = createImageBuffer(comparisonScreenshot);

  let [baselineBuffer, comparisonBuffer] = await Promise.all([
    baselineBufferPromise,
    comparisonBufferPromise,
  ]);

  const { width: baselineWidth, height: baselineHeight } = baselineBuffer;

  const baselineImageData = this._createImageData(
    baselineBuffer,
    baselineWidth,
    baselineHeight
  );
  const changedImageData = this._createImageData(
    comparisonBuffer,
    baselineWidth,
    baselineHeight
  );

  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = baselineWidth;
  diffCanvas.height = baselineHeight;
  const diffContext = diffCanvas.getContext("2d");
  const diff = diffContext.createImageData(baselineWidth, baselineHeight);

  console.log(baselineBuffer, comparisonBuffer, diff.data);
  const pixelDiff = pixelmatch(
    changedImageData.data,
    baselineImageData.data,
    diff.data,
    baselineWidth,
    baselineHeight,
    { threshold: 0.1 }
  );

  console.log(
    "Difference: ",
    (pixelDiff / (baselineWidth * baselineHeight)) * 100
  );

  diffContext.putImageData(diff, 0, 0);
  const dataUrl = diffCanvas.toDataURL();
  return dataUrl;
}

module.exports = {
  createDiffImage,
};
