const fs = require("fs");
const pixelmatch = require("pixelmatch");
const PNG = require("pngjs").PNG;

async function createDiffImage(baselineBuffer, comparisonBuffer, fileName) {
  const baselineImage = await PNG.sync.read(baselineBuffer);
  const comparisonImage = await PNG.sync.read(comparisonBuffer);
  const height = Math.max(baselineImage.height, comparisonImage.height);

  const diff = new PNG({ width: baselineImage.width, height });

  const pixelDiff = pixelmatch(
    comparisonImage.data,
    baselineImage.data,
    diff.data,
    baselineImage.width,
    height,
    { threshold: 0.1 }
  );

  console.log(
    "Difference: ",
    (pixelDiff / (baselineImage.width * height)) * 100
  );

  fs.writeFileSync(
    `${__dirname}/../screenshots/${fileName}-diff.png`,
    PNG.sync.write(diff)
  );
  return diff;
}

module.exports = {
  createDiffImage,
};
