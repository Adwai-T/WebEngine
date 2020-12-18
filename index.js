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

let animSheet = loadImage("./res/animSheet.png");
let animSheetTileSize = 16;
let animSheetImageOriginCoordinates = Tiles.generateTileArray(
  8,
  6,
  animSheetTileSize
);

const MAPTILESIZE = 25;

//player
let player = {
  rect: new Rectangle(new Vector2i(549, 51), new Vector2i(24, 24)),
  spriteAnimation: {
    idle: [1],
    right: [2, 3, 4, 5],
    left: [20, 21, 22, 23],
    jumpRight: [14, 15, 16, 17],
    jumpLeft: [26, 27, 28, 29],
    duck: [6],
  },
  movementSpeed: {
    x: 2,
    y: 2,
  },
  mass: 60,
  force: 0,
  acceleration: 0,
  velocity: 0,
};

player.animState = {
  currentState: player.spriteAnimation.idle,
  currentAnimIndex: 0,
  cycleAnim: function (animatePerFrames, currentFrameNumber) {
    if (currentFrameNumber % animatePerFrames === 0) {
      if (this.currentAnimIndex < this.currentState.length - 1) {
        this.currentAnimIndex++;
      } else {
        this.currentAnimIndex = 0;
      }
    }
  },
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
  
  player.animState.currentState = player.spriteAnimation.idle;

  if (KeyPressed.D) {
    player.animState.currentState = player.spriteAnimation.right;
    player.rect.vec.x += player.movementSpeed.x;
  }
  if (KeyPressed.A) {
    player.animState.currentState = player.spriteAnimation.left;
    player.rect.vec.x -= player.movementSpeed.x;
  }
  if (KeyPressed.W) {
    player.rect.vec.y -= player.movementSpeed.y;
  }
  if (KeyPressed.S) {
    player.animState.currentState = player.spriteAnimation.duck;
    player.rect.vec.y += player.movementSpeed.y;
  }
  if(KeyPressed.D && KeyPressed.W){
    player.animState.currentState = player.spriteAnimation.jumpRight;
  }
  if(KeyPressed.A && KeyPressed.W){
    player.animState.currentState = player.spriteAnimation.jumpLeft;
  }

};

//Draw Updated Objects
function draw() {

  //Sometimes player.animState.currentState becomes "undefined" and so we have a check
  if(player.animState.currentState[player.animState.currentAnimIndex]){    
    player.rect.drawSprite(
      collisionCanvas.ctx,
      animSheet,
      animSheetImageOriginCoordinates[player.animState.currentState[player.animState.currentAnimIndex]],
      animSheetTileSize,
      animSheetTileSize
    );
  }
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
  player.animState.cycleAnim(4, frameCounter);
  draw();

  //Draw Fps
  collisionCanvas.ctx.fillStyle = "White";
  collisionCanvas.ctx.font = "15px Arial";
  collisionCanvas.ctx.fillText(currentFrameRate, CANVAS_WIDTH - 50, 50);

  window.requestAnimationFrame(drawAtXFps);
}

window.requestAnimationFrame(drawAtXFps);
