import { STAGE } from "./Maps/Map_1.js";
import {
  Canvas,
  Rectangle,
  Vector2i,
  Tiles,
  loadImage,
  setMovable,
  updateLastPostion,
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

//Load Images
let tileMapImage = loadImage("./res/monochrome.png");
let tileMapImageTileSize = 16;
let tileMapImageOriginCoordinate = Tiles.generateTileArray(
  20,
  20,
  tileMapImageTileSize
);

const MAPTILESIZE = 25;

//player
let player = {
  rect: new Rectangle(new Vector2i(549, 51), new Vector2i(16, 25)),
  movementSpeed: {
    x: 5,
    y: 5,
  },
  mass: 60,
  force: 0,
  acceleration: 0,
  velocity: 0,
};

setMovable(player.rect);

//Draw Map
let tileMapCoordinates = Tiles.generateTileArray(
  CANVAS_HEIGHT / MAPTILESIZE,
  CANVAS_WIDTH / MAPTILESIZE,
  MAPTILESIZE
);
const drawMap = function () {
  STAGE.TILES.forEach((value, i) => {
    new Rectangle(
      tileMapCoordinates[i],
      new Vector2i(MAPTILESIZE, MAPTILESIZE)
    ).drawSprite(
      mapCanvas.ctx,
      tileMapImage,
      tileMapImageOriginCoordinate[value - 1],
      tileMapImageTileSize,
      tileMapImageTileSize
    );
  });
};

tileMapImage.onload = (e) => {
  drawMap();
  staticCollisionRectangleArray.forEach((rect) => {
    rect.draw(mapCanvas.ctx, getRandomColor());
  });
};

//Generate Static Collision Rectangles
const staticCollisionRectangleArray = parseCollisionRectangles(
  STAGE.COLLISIONARRAY,
  MAPTILESIZE,
  CANVAS_WIDTH / MAPTILESIZE,
  CANVAS_HEIGHT / MAPTILESIZE,
  STAGE.COLLISIONTILENUMBER
);

//Update Dynamic collision rectangles

//Update Player Positions
let updateInput = function (player) {
  updateLastPostion(player.rect);

  if (KeyPressed.A) {
    player.rect.vec.x -= player.movementSpeed.x;
  }
  if (KeyPressed.D) {
    player.rect.vec.x += player.movementSpeed.x;
  }
  if (KeyPressed.W) {
    player.rect.vec.y -= player.movementSpeed.y;
  }
  if (KeyPressed.S) {
    player.rect.vec.y += player.movementSpeed.y;
  }
};

//Draw Updated Objects
function draw() {
  player.rect.draw(collisionCanvas.ctx, "violet");
}

//Update Collision
let updateCollision = function () {
  staticCollisionRectangleArray.forEach((rect) => {
    checkAndResolveCollision(
      player.rect,
      rect,
      player.isMovable,
      rect.isMovable
    );
  });
};

//GameLoop Start
const FPS = 30; //Max FPS
let rendering = true;
let frameCounter = 0;
let totalTime = 0; //Time Reset every second
let lastTime = 0; //Time at which the last frame was rendered
let currentFrameRate = 0;

function drawAtXFps(FPS) {
  //FPS calculations
  let timestart = Date.now();
  let fps = timestart - lastTime;
  totalTime += fps;
  frameCounter++;
  if (totalTime >= 1000) {
    currentFrameRate = frameCounter;
    frameCounter = 0;
    totalTime = 0;
  }

  lastTime = timestart;

  //Clear Screen Each Frame
  collisionCanvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  //Update and Draw
  updateInput(player);
  updateCollision();
  draw();

  //Draw Fps
  collisionCanvas.ctx.fillStyle = "Red";
  collisionCanvas.ctx.font = "20px Arial";
  collisionCanvas.ctx.fillText(currentFrameRate, CANVAS_WIDTH - 50, 25);

  window.requestAnimationFrame(drawAtXFps);
}

window.requestAnimationFrame(drawAtXFps);
