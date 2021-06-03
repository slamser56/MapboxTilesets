const download = require("download");
const tilebelt = require("@mapbox/tilebelt");

const getAllChildren = (tile, maxZoom) => {
  if (tile[2] >= maxZoom) return [tile];
  var allChildren = [];
  theChildren(tile);
  return allChildren;

  function theChildren(tile) {
    var children = tilebelt.getChildren(tile);
    allChildren = allChildren.concat(children);
    if (children[0][2] === maxZoom) return;
    children.forEach(theChildren);
  }
};

const chunkArray = (array, chunk) => {
  const newArray = [];
  for (let i = 0; i < array.length; i += chunk) {
    newArray.push(array.slice(i, i + chunk));
  }
  return newArray;
};

const downloadTiles = async (loadTiles, accessToken) => {
  for (let index = 0; index < loadTiles.length - 1; index++) {
    const [x, y, z] = loadTiles[index];
    try {
      await download(
        `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${z}/${x}/${y}.mvt?access_token=${accessToken}`,
        `./tiles/${z}/${x}`,
        { filename: `${y}.mvt` }
      );
      console.log(`Tile: ${z}/${x}/${y} downloaded`);
    } catch (error) {
      console.error("Download failed", error);
    }
  }
};

module.exports = { downloadTiles, chunkArray, getAllChildren };
