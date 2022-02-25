const fs = require("fs");
const pixelmatch = require("pixelmatch");
const sharp = require("sharp");

async function createDiffImage(baselineBuffer, comparisonBuffer, fileName) {
  let baselineImage = sharp(baselineBuffer);
  let comparisonImage = sharp(comparisonBuffer);

  let baselineData = await baselineImage.metadata();
  let comparisonData = await comparisonImage.metadata();

  const height = Math.max(baselineData.height, comparisonData.height);

  const resizedComparisonBuffer = await comparisonImage
    .resize({
      width: baselineData.width,
      height,
      fit: "contain",
    })
    // .png({ compressionLevel: 0 })
    .toBuffer({ resolveWithObject: true });

  const resizedBaselineBuffer = await baselineImage
    .resize({
      width: baselineData.width,
      height,
      fit: "contain",
    })
    // .png({ compressionLevel: 0 })
    .toBuffer({ resolveWithObject: true });

  const diff = await sharp({
    create: {
      width: baselineData.width,
      height,
      channels: 4,
      background: "white",
    },
  })
    // .png({ compressionLevel: 0 })
    .toBuffer({ resolveWithObject: true });

  const pixelDiff = pixelmatch(
    resizedBaselineBuffer,
    resizedComparisonBuffer,
    diff,
    baselineData.width,
    height,
    { threshold: 0.1 }
  );

  console.log(
    "Difference: ",
    (pixelDiff / (baselineData.width * height)) * 100
  );

  fs.writeFileSync(`${__dirname}/../screenshots/${fileName}-diff.png`, diff);
  return diff;
}

module.exports = {
  createDiffImage,
};
