// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// Globals
const Y_SCALE_FACTOR = 0.3;

let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let seed1, seed2;
let sunPosition;
let cacti = [];


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {

  
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  //noiseSeed(millis());
  seed1 = millis();
  seed2 = millis() + 10000;

  // Generate random number of cacti between 5 to 10
  let numCacti = floor(random(5, 11));
  for (let i = 0; i < numCacti; i++) {
    let x = random(width);
    let y = random(height * (2/3), height);
    let baseWidth = random(30, 60);
    let baseHeight = random(60, 120);
    cacti.push({ x, y, baseWidth, baseHeight });
  }

}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // Update sun position based on time
  let offsetX = cos(frameCount * 0.01) * (width * 0.4); // Adjust speed with the multiplier
  sunPosition = createVector(width * 0.5 + offsetX, height * 0.3); // Adjust the initial x position to start from the center


  // Create a gradient background
  setGradient(0, 0, width, height, color('#FFFF00'), color('#DD0000'));
  
  // Draw the sun
  fill(255); // White color for the sun
  ellipse(sunPosition.x, sunPosition.y, 50, 50); // Sun position and size
  

  // Draw the distant mountain layer
  fill('#A0522D'); // Softened brown color
  drawMountainLayer(height * (1 - 2/3), Y_SCALE_FACTOR, seed2);

  // Draw the closer mountain layer
  fill('#8B4513'); // Softened brown color
  drawMountainLayer(height / 2, Y_SCALE_FACTOR, seed1);

  // Draw the floor layer
  fill('#e3c24d'); // Floor color
  rect(0, height * (2/3), width, height); // Draw the floor covering the bottom 1/3 of the screen

  for (let cactus of cacti) {
    drawCactus(cactus.x, cactus.y, cactus.baseWidth, cactus.baseHeight);
  }
}

// Function to draw a mountain layer
function drawMountainLayer(baseY, scale, seed) {
  noiseSeed(seed); // Set noise seed
  
  noStroke(); // No stroke for the fill
  
  beginShape();
  vertex(0, baseY); // Start vertex at the left edge
  
  for (let x = 0; x < width; x += 10) {
    let noiseValue = noise(x * 0.005);
    let yNoiseRange = height * scale;
    let y = map(noiseValue, 0, 1, baseY - yNoiseRange, baseY + yNoiseRange);
    vertex(x, y);
  }
  
  vertex(width, baseY); // End vertex at the right edge
  vertex(width, height); // Bottom-right vertex
  vertex(0, height); // Bottom-left vertex
  endShape(CLOSE); // Close the shape for filling
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  
  for (let i = y; i <= y + h; i++) {
    // Calculate distance to the sun for each pixel row
    let distanceToSun = dist(width / 2, i, sunPosition.x, sunPosition.y);
    
    // Interpolate color based on distance to the sun
    let inter = map(distanceToSun, 0, width/2, 0, 1);
    let c = lerpColor(c1, c2, inter);
    
    stroke(c);
    line(x, i, x + w, i);
  }
}

function drawCactus(x, y, baseWidth, baseHeight) {

  let sideWidth1 = baseWidth * 0.4;
  let sideHeight = baseHeight * 0.8;

  // Draw base rectangle
  fill('#2E8B57'); // Green color for cactus
  rect(x, y - baseHeight, baseWidth, baseHeight);

  // Draw side rectangles
  fill('#2E8B57');
  //rect(x - baseWidth / 2 - sideWidth1 / 2, y - sideHeight, sideWidth1, sideHeight);
  rect( x - baseWidth, y - baseHeight/2, sideHeight, sideWidth1);
  //rect(x + baseWidth / 2 - sideWidth2 / 2, y - sideHeight, sideWidth2, sideHeight);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}