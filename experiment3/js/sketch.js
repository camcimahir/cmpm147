/* exported preload, setup, draw, placeTile */

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// Globals
let canvasContainer;
let currentGrid = [];
let numRows, numCols;
let seed = 0;
let tilesetImage;
const lookup = [
  [0, 0], // 0000:
  [0, 0], // 0001:
  [0, 0], // 0010:
  [0, 0], // 0011:
  [0, 0], // 0100:
  [0, 0], // 1000: bottom left corner
  [0, 0], // 0101: top left corner
  [6, 10], // 0110: (sol) east of the box and west of the grid
  [0, 0], // 1001:
  [0, 0], // 1010: bottom right
  [0, 0], // 0111: top right
  [4, 10], // 1011: (sag) west of the box and east of the grid
  [0, 0], // 1100:
  [5, 9], // 1101: (ust) North, East, and West neighbors
  [5, 11], // 1110: (asagi) South, East, and West neighbors
  [0, 0], // 1111: (disarisi) North, South, East, and West neighbors
];
let clickCounter = 0;
let grassTileIndex;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function generateGrid(numCols, numRows) {
  let grid = [];
  
  // Fill the grid with background code '_'
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  let room1Bounds = generateRoom(grid, numCols, numRows, 'left');
  let room2Bounds = generateRoom(grid, numCols, numRows, 'right');

  // Generate corridor between the centers of the rooms
  let center1 = findRoomCenter(room1Bounds.startX, room1Bounds.endX, room1Bounds.startY, room1Bounds.endY);
  let center2 = findRoomCenter(room2Bounds.startX, room2Bounds.endX, room2Bounds.startY, room2Bounds.endY);

  generateCorridor(grid, center1, center2);

  // Place commas in each room
  grid[room1Bounds.commaY][room1Bounds.commaX] = ",";
  grid[room2Bounds.commaY][room2Bounds.commaX] = ",";

  return grid;
}


function generateRoom(grid, numCols, numRows, position) {
  let startX, endX, startY, endY;

  if (position === 'left') {
    startX = Math.floor(random(numCols / 5, (2 * numCols) / 5 - 1));
    endX = Math.floor(random(startX + 3, (3 * numCols) / 5)); 
  } else {
    startX = Math.floor(random((3 * numCols) / 5, (4 * numCols) / 5 - 1));
    endX = Math.floor(random(startX + 3, (4 * numCols) / 5));
  }

  startY = Math.floor(random(numRows / 5, (4 * numRows) / 5 - 1)); 
  endY = Math.floor(random(startY + 3, (4 * numRows) / 5)); 

  // Fill the room with '.'
  for (let i = startY; i < endY; i++) {
    for (let j = startX; j < endX; j++) {
      grid[i][j] = ".";
    }
  }

  // Generate one random comma ',' inside the room
  let randomX = Math.floor(random(startX, endX));
  let randomY = Math.floor(random(startY, endY));
  grid[randomY][randomX] = ",";

  return { startX, endX, startY, endY, commaX: randomX, commaY: randomY };
}


function generateCorridor(grid, start, end) {
  let [startX, startY] = start;
  let [endX, endY] = end;

  while (startX !== endX || startY !== endY) {
    if (startX !== endX) {
      if (startX < endX) {
        startX++;
      } else {
        startX--;
      }
    } else {
      if (startY < endY) {
        startY++;
      } else {
        startY--;
      }
    }

    grid[startY][startX] = ".";
  }
}

function findRoomCenter(startX, endX, startY, endY) {
  let centerX = Math.floor((startX + endX) / 2);
  let centerY = Math.floor((startY + endY) / 2);

  return [centerX, centerY];
}


function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let tileCode = grid[i][j];

      // Check for edges
      if (i === 0 || i === grid.length - 1 || j === 0 || j === grid[i].length - 1) {
        placeTile(i, j, 0, grassTileIndex);  // Set edges to 0, 0
      } else if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, 0, 10);
      } else if (tileCode === "_") {
        drawContext(grid, i, j, "_", 0, grassTileIndex);
      } else if (tileCode === ",") {
        placeTile(i, j, 4, 30);
      } else {
        console.warn("Unknown tile code:", tileCode);
      }
    }
  }
}


function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] == target;
  } else {
    return false;
  }
}

function gridCode(grid, i, j, target) {
  let northBit = i > 0 && gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let southBit = i < grid.length - 1 && gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let eastBit = j < grid[i].length - 1 && gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let westBit = j > 0 && gridCheck(grid, i, j - 1, target) ? 1 : 0;

  // Form the 4-bit code
  let code = (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);

  return code;
}

function drawContext(grid, i, j, target, dti, dtj) {
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, dti + tiOffset, dtj + tjOffset);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function resizeScreen() {
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function setup() {

  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  numCols = 35; 
  numRows = 35;

  // Generate the grid
  currentGrid = generateGrid(numCols, numRows);

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  //drawGrid(currentGrid);
}


function draw() {
  drawGrid(currentGrid);
}



function mousePressed() {
  // Increment click counter
  clickCounter++;

  // Update grassTileIndex based on the click counter
  grassTileIndex = (3 * clickCounter) % 9; 

  console.log(grassTileIndex)
  // If click counter reaches 7, reset it to 0
  if (clickCounter === 4) {
    clickCounter = 0;
  }

  // Regenerate the grid with the new theme
  currentGrid = generateGrid(numCols, numRows);

  // Redraw the grid with the new theme
  drawGrid(currentGrid);
}
