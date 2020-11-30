import { TILES_STAGE_1, STAGE_1_NUMBEROFCOLUMNS } from "./Maps/Map_1.js";
import {
  Canvas,
  Rectangle,
  Vector2i,
  setMovable,
  updateLastPostion,
  loadImage,
  generateTileArray,
  drawThisTile,
} from "./src/Canvas.js";
import { checkAndResolveCollision } from "./src/collision.js";
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
let rect1 = new Rectangle(new Vector2i(10, 10), new Vector2i(30, 30));
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
let mapArray = TILES_STAGE_1.split("-");
let mapCoordinateArray = generateTileArray(
  mapArray.length / STAGE_1_NUMBEROFCOLUMNS,
  STAGE_1_NUMBEROFCOLUMNS,
  MAPTILESIZE
);

let drawMap = function () {
  for (let i = 0; i < mapArray.length; i++) {
    drawThisTile(
      mapCanvas.ctx,
      tileMapSheet,
      imageTileArray[mapArray[i]],
      TILESIZEINSOURCEIMAGE,
      mapCoordinateArray[i],
      MAPTILESIZE
    );
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

//Collision Array
let collisionObjectsArray = [];
let wallArray = [];

wallArray.push(new Rectangle(new Vector2i(0, 0), new Vector2i(75, 5)));
wallArray.push(new Rectangle(new Vector2i(0, 70), new Vector2i(75, 5)));
wallArray.push(new Rectangle(new Vector2i(0, 0), new Vector2i(5, 75)));
wallArray.push(new Rectangle(new Vector2i(70, 0), new Vector2i(5, 75)));

//Test --------
wallArray.forEach((rect) => {
  rect.draw(mapCanvas.ctx, "red");
});

//Check Collision
let collisionCheck = function () {};

//Check Collision And Resolve
let collisionCheckAndResolution = function () {
  wallArray.forEach(element => {
    checkAndResolveCollision(rect1, element);
  });
};

//DrawFunction
let draw = function () {
  rect1.drawSprite(
    collisionCanvas.ctx,
    tileMapSheet,
    new Vector2i(384, 0),
    16,
    16
  );
};

//GameLoop Start
const FPS = 60; //Max FPS
let rendering = true;
drawAtXFps(FPS);

function drawAtXFps(FPS) {
  let timestart = Date.now();

  //Clear Screen Each Frame
  collisionCanvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  //Update and Draw
  update(playerMovementSpeed);
  collisionCheck();
  collisionCheckAndResolution();
  draw();

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
