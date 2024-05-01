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
  

}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let tileHash = XXH.h32("tile:" + [i, j], worldSeed) % 100;
  
  let isWater = tileHash < 99; // 99% chance of water tile
  let isLand = !isWater; // Land tile if not water
  let isLand0;
  let isBridge;

  // Check if the tile is water
  if (isWater) {
    // Check if there's a land tile adjacent to this water tile
    if (isAdjacentLand(i, j)) {
      isLand0 = true;
      isWater = false;
    }
  }

  // Store the tile type information
  tileTypes[[i, j]] = { isWater, isLand, isLand0, isBridge };
  
  let z = clicks[[i, j]] | 0;
  if (z % 2 == 1) {
    isBridge = true
  }
  
  if (isWater) {
    if (isBridge) {
      fill(0); // Black for bridge
    } else {
      fill(0, 112, 192); // Blue for water
    }
  } else if (isLand) {
    fill(0, 0, 0); // Black for land
  } else if (isLand0) {
    // Scale the tileHash value to a range between 0 and 1
    let rand = tileHash / 100; // Assuming tileHash is in the range [0, 100]

    if (rand < 0.7) {
      fill(72, 170, 63); // Green for grass (70% of the time)
    } else {
      fill(0, 112, 192); // Blue for water (30% of the time)
    }
  }
  

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }

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

function isAdjacentLand(i, j) {
  // Check adjacent tiles
  for (let di = -2; di <= 2; di++) {
    for (let dj = -2; dj <= 2; dj++) {
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
