//Some of the function names have been changed. All the code might not work

import {
  STAGE_1
} from "./Maps/Map_1.js";
import {
  Canvas,
  Rectangle,
  Vector2i,
  setMovable,
  updateLastPostion,
  loadImage,
  generateTileArray,
  drawThisTile,
  getRandomColor,
} from "./src/Canvas.js";
import {
  checkAndResolveCollision,
  parseCollisionRectangles,
} from "./src/collision.js";
import { add_events, KeyPressed } from "./src/input.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
let mapCanvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT, "Canvas", "mapCanvas");
mapCanvas.canvas.style = "background-color: lightgrey;";
let collisionCanvas = new Canvas(
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  "Canvas",
  "collisionCanvas"
);
add_events(collisionCanvas.canvas);

//Player Character
let rect1 = new Rectangle(new Vector2i(10, 10), new Vector2i(23, 23));
let playerMovementSpeed = new Vector2i(3, 3);
setMovable(rect1);

//Load Tile Map Image
//Make sure that the image is actually loaded before you use it.
//We can check if the image is loaded by using :
//imageVariableName.onload = function (e) { // Do what u want to do after image loads/is Ready for use }
let tileMapSheet = loadImage("./res/tilemap.png");
let istileMapSheetLoaded = false;
tileMapSheet.onload = function (e) {
  istileMapSheetLoaded = true;
  drawMap();
};
const TILESIZEINSOURCEIMAGE = 16;
let imageTileArray = generateTileArray(18, 27, TILESIZEINSOURCEIMAGE);

//load and paint map
const MAPTILESIZE = 25;
let mapArray = STAGE_1.TILES;
let mapCoordinateArray = generateTileArray(
  mapArray.length / STAGE_1.MAXCOL,
  STAGE_1.MAXCOL,
  MAPTILESIZE
);

let drawMap = function () {
  for (let i = 0; i < mapArray.length; i++) {
    if (STAGE_1.CollisionArray[i] === 0) {
    } else {
      drawThisTile(
        mapCanvas.ctx,
        tileMapSheet,
        // imageTileArray[mapArray[i]-1],
        imageTileArray[STAGE_1.CollisionArray[i]],
        TILESIZEINSOURCEIMAGE,
        mapCoordinateArray[i],
        MAPTILESIZE
      );
    }
  }
};

//Update cordinates
let update = function (playerMovementSpeed) {
  //Update lastPostion of rectangles before assigning new positions
  updateLastPostion(rect1);

  //Rectangle 1 or player Rectangle
  if (KeyPressed.A) {
    rect1.vec.x -= playerMovementSpeed.x;
  }
  if (KeyPressed.D) {
    rect1.vec.x += playerMovementSpeed.x;
  }
  if (KeyPressed.W) {
    rect1.vec.y -= playerMovementSpeed.y;
  }
  if (KeyPressed.S) {
    rect1.vec.y += playerMovementSpeed.y;
  }
};

//Collision Tile Array Dimensions
const COLROW = 24;
const COLCOLU = 32;
const TILENUMBER = 408;

let collisionRectArray = parseCollisionRectangles(
  STAGE_1.CollisionArray,
  MAPTILESIZE,
  COLCOLU,
  COLROW,
  TILENUMBER
);

collisionRectArray.forEach((rect) => {
  rect.color = getRandomColor();
  rect.draw(mapCanvas.ctx);
});

//Check Collision
let collisionCheck = function () {};

//Check Collision And Resolve
let collisionCheckAndResolution = function () {
  collisionRectArray.forEach((element) => {
    checkAndResolveCollision(rect1, element);
  });
};

//DrawFunction
let draw = function () {
  rect1.draw(collisionCanvas.ctx, 'blue');
  rect1.drawSprite(
    collisionCanvas.ctx,
    tileMapSheet,
    new Vector2i(384, 0),
    16,
    16
  );
};

//GameLoop Start
const FPS = 64; //Max FPS
let rendering = true;
let frameCounter = 0; 
let totalTime = 0; //Time Reset every second
let lastTime = 0; //Time at which the last frame was rendered
let currentFrameRate = 0;

drawAtXFps(FPS);

function drawAtXFps(FPS) {

  //FPS calculations
  let timestart = Date.now();
  let fps = timestart - lastTime;
  totalTime += fps;
  frameCounter++;
  if(totalTime >= 1000){
    currentFrameRate = frameCounter;
    frameCounter = 0;
    totalTime = 0;
  }

  lastTime = timestart;

  //Clear Screen Each Frame
  collisionCanvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  //Update and Draw
  update(playerMovementSpeed);
  collisionCheck();
  collisionCheckAndResolution();
  draw();

  //Draw Fps
  collisionCanvas.ctx.fillStyle = "Red";
  collisionCanvas.ctx.font = "20px Arial";
  collisionCanvas.ctx.fillText(currentFrameRate, CANVAS_WIDTH - 50, 25);

  //Frame Control
  let timeend = Date.now();
  let sleepTime = (1000 - timeend + timestart) / FPS;

  if (sleepTime < 0) sleepTime = 0;

  if (rendering === true) {
    setTimeout(() => {
      drawAtXFps(FPS);
    }, sleepTime);
  }
}
