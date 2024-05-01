"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let worldSeed;
let tileTypes = {}; // Object to store whether each tile is land or water

let tileColors = {};

// Global variables to store whether a tile is water or land
let isWater;
let isLand;

function p3_preload() {
  
}

function p3_setup() {
  
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 16;
}

function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  
  // Update the color of the clicked tile to its original color
  // if (tileColors[key]) {
  //   fill(tileColors[key]);
  // }
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  
  let tileHash = XXH.h32("tile:" + [i, j], worldSeed) % 100;
  let isWater = tileHash < 99; // 99% chance of water tile
  let isLand = !isWater; // Land tile if not water
  
  // Store the type of each tile
  tileTypes[[i, j]] = { isWater, isLand };
  
  // Store the color of each tile
  if (isLand) {
    tileColors[[i, j]] = color(0, 0, 0); // Black for land
  } else if (isWater) {
    let isAdjacentToLand3 = isAdjacentLand(i, j, 3);
    let isAdjacentToLand2 = isAdjacentLand(i, j, 2);
    let isAdjacentToLand1 = isAdjacentLand(i, j, 1);

    if (isAdjacentToLand1) {
      tileColors[[i, j]] = color(255, 0, 0); // Red for tiles within distance 1
    } else if (isAdjacentToLand2) {
      tileColors[[i, j]] = color(255, 255, 0); // Yellow for tiles within distance 2
    } else if (isAdjacentToLand3) {
      tileColors[[i, j]] = color(0, 255, 0); // Green for tiles within distance 3
    } else {
      tileColors[[i, j]] = color(0, 112, 192); // Blue for other water tiles
    }
  }


  let z = clicks[[i, j]] | 0;
  if (z % 2 == 1) {
    fill(tileColors[[i, j]])
  }
  
  // Draw all tiles initially as white
  //fill(255);
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}

function isAdjacentLand(i, j, distance) {
  // Check adjacent tiles within the specified distance
  for (let di = -distance; di <= distance; di++) {
    for (let dj = -distance; dj <= distance; dj++) {
      // Skip the current tile
      if (di === 0 && dj === 0) continue;
      // Check if the neighboring tile is a land tile
      let ni = i + di;
      let nj = j + dj;
      if (tileTypes[[ni, nj]] && tileTypes[[ni, nj]].isLand) return true;
    }
  }
  return false;
}
