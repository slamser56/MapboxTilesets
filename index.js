const tilebelt = require("@mapbox/tilebelt");
const readlineSync = require("readline-sync");
const { getAllChildren, chunkArray, downloadTiles } = require("./helpers");

const maxZoom = Number(readlineSync.question("Max zoom level(<= 22): "));
if (isNaN(maxZoom) || maxZoom < 0 || maxZoom > 22) {
  return console.log("Please input correct max zoom");
}
const minZoom = Number(readlineSync.question("Min zoom level(>= 0): "));
if (isNaN(minZoom) || maxZoom < minZoom  || minZoom > 22) {
  return console.log("Please input correct min zoom");
}
const bboxString = readlineSync.question(
  "bbox [minlon, minlat, maxlon, maxlat]: "
);
const bbox = JSON.parse(bboxString);
if (bbox.length !== 4) {
  return console.log("Please input correct bbox");
}
const accessToken = readlineSync.question("Mapbox access token: ");

let tile = tilebelt.bboxToTile(bbox);

let loadTileValues = [tile];
if (tile[2]) {
  for (let i = tile[2]; i > minZoom; i--) {
    tile = tilebelt.getParent(tile);
    loadTileValues.push(tile);
  }
  const allChildren = getAllChildren(loadTileValues[0], maxZoom);
  loadTileValues = loadTileValues.reverse().concat(allChildren);
} 

const tilesLenght = loadTileValues[0].length;

const arrays = chunkArray(loadTileValues, tilesLenght / tilesLenght > 100 ? 100 : tilesLenght);

Promise.all(arrays.map((array) => downloadTiles(array, accessToken)));
