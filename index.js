import {
  Canvas,
  Rectangle,
  Vector2i,
  loadImage,
  Line,
  Point,
} from "./src/Canvas.js";
import {
  add_events,
  getMousePostion,
  isLeftClicked,
  isRightClicked,
  KeyPressed,
} from "./src/input.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
let canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT, "Canvas");

add_events(canvas.canvas);

let image = loadImage("../res/Spritesheet/characters.png");
let rendering = true;

// x="164"	y="88"	width="49"	height="43"
let player_sprite = new Rectangle(new Vector2i(120, 220), new Vector2i(49, 43));
let mousePoint;
let player_speed = 3;

let player_movement = function () {
  mousePoint = getMousePostion();

  //Movement of player character
  if (
    KeyPressed.D &&
    player_sprite.vec.x < CANVAS_WIDTH - player_sprite.width
  ) {
    player_sprite.vec.x += player_speed;
  } else if (KeyPressed.A && player_sprite.vec.x > 0) {
    player_sprite.vec.x -= player_speed;
  }

  if (KeyPressed.W && player_sprite.vec.y > 0) {
    player_sprite.vec.y -= player_speed;
  } else if (
    KeyPressed.S &&
    player_sprite.vec.y < CANVAS_HEIGHT - player_sprite.width
  ) {
    player_sprite.vec.y += player_speed;
  }

  //Update Player Rectangle Center
  player_sprite.vec_center.x =
    (player_sprite.vec.x + player_sprite.width + player_sprite.vec.x) / 2;
  player_sprite.vec_center.y =
    (player_sprite.vec.y + player_sprite.height + player_sprite.vec.y) / 2;

  //directions of player
  let dx = mousePoint.x - player_sprite.vec.x,
    dy = mousePoint.y - player_sprite.vec.y;
  let direction = Math.atan2(dy, dx);

  return direction;
};

function drawMousePointer() {
  let mousePointer = new Point(mousePoint.x, mousePoint.y);
  mousePointer.draw(canvas.ctx, "red", 2);
}

class Bullet {
  constructor(point, direction) {
    this.direction = direction;
    this.point = point;
  }
}

const bulletSpeed = 8;
const bullet_persec = 4.5;
let bulletArray = [];

function shootBullet(direction) {
  if (isRightClicked()) {
    let bullet = new Bullet(
      new Point(player_sprite.vec_center.x, player_sprite.vec_center.y),
      direction
    );
    bulletArray.push(bullet);
  }
}

function manageAndDrawBullets() {
  let newBulletArray = [];
  bulletArray.forEach((bullet) => {
    if (
      bullet.point.x > CANVAS_WIDTH ||
      bullet.point.x < 0 ||
      bullet.point.y > CANVAS_HEIGHT ||
      bullet.point.y < 0
    ) {
      //Dont Add these Bullets as they are offscreen
    } else {
      bullet.point.x += bulletSpeed * Math.cos(bullet.direction);
      bullet.point.y += bulletSpeed * Math.sin(bullet.direction);
      bullet.point.draw(canvas.ctx, "green", 2);
      newBulletArray.push(bullet);
    }
  });
  bulletArray = newBulletArray;
}

//GameLoop Start
const FPS = 45;
let counter = 0;
drawAtXFps(FPS);

function drawAtXFps(FPS) {
  let timestart = Date.now();

  canvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //Player
  let direction = player_movement();
  //Bullets
  counter++;
  if (FPS / bullet_persec <= counter) {
    shootBullet(direction);
    counter = 0;
  }
  manageAndDrawBullets();

  //Drawing on screen
  drawMousePointer();
  player_sprite.rotateSpriteAndDraw(
    canvas.ctx,
    image,
    direction,
    new Vector2i(164, 88),
    49,
    43
  );

  let timeend = Date.now();
  let sleepTime = (1000 - timeend + timestart) / FPS;

  if (rendering === true) {
    setTimeout(() => {
      drawAtXFps(FPS);
    }, sleepTime);
  }
}
