import { Canvas, Rectangle, Vector2i, loadImage, Point } from "./src/Canvas.js";
import { aabb, CollisionSideEnum } from "./src/collision.js";
import {
  add_events,
  getMousePostion,
  isRightClicked,
  KeyPressed,
} from "./src/input.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
let canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT, "Canvas");

add_events(canvas.canvas);

//PlayerObject
let player = {
  boundingbox : null,
  mass : null,
  velocity : null
}

//Two Rectangle
let rect1 = new Rectangle(new Vector2i(10, 10), new Vector2i(30, 50));
let rect2 = new Rectangle(new Vector2i(100, 100), new Vector2i(70, 50));

//force Calculation
let forceResolution = function (){
}

//Update cordinates
let update = function () {
  if (KeyPressed.A) {
    console.log("a");
    rect1.vec.x -= 3;
  }
  if (KeyPressed.D) {
    rect1.vec.x += 3;
  }
  if (KeyPressed.W) {
    rect1.vec.y -= 3;
  }
  if (KeyPressed.S) {
    rect1.vec.y += 3;
  }
};

let collisionCheck = function () {

  let side = aabb(rect1, rect2);

  if (side) {
    rect1.color = "green";
    if(side == CollisionSideEnum.right){
      
    }
  }
  else{
    rect1.color = "red";
  }
};

//DrawFunction
let draw = function () {
  rect1.draw(canvas.ctx);
  rect2.draw(canvas.ctx);
};

//GameLoop Start
const FPS = 45;
let counter = 0;
let rendering = true;
drawAtXFps(FPS);

function drawAtXFps(FPS) {
  let timestart = Date.now();

  canvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  update();
  collisionCheck();
  draw();

  let timeend = Date.now();
  let sleepTime = (1000 - timeend + timestart) / FPS;

  if (rendering === true) {
    setTimeout(() => {
      drawAtXFps(FPS);
    }, sleepTime);
  }
}
