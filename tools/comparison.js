const { imgDiff } = require("img-diff-js");

/**
 * Creates a diff image from two given images
 *
 * @param baselineFileName {String} - The baseline filename
 * @param comparisonFileName {String} - The comparison filename
 * @returns {Promise<number>} - the number of pixels of difference
 */
async function createDiffImage(baselineFileName, comparisonFileName) {
  const diffData = await imgDiff({
    actualFilename: `${__dirname}/../screenshots/${baselineFileName}.png`,
    expectedFilename: `${__dirname}/../screenshots/${comparisonFileName}.png`,
    diffFilename: `${__dirname}/../screenshots/${baselineFileName}-diff.png`,
  });

  return diffData.diffCount;
}
module.exports = {
  createDiffImage,
};
