/*
Copy the example to index.js to run.

This example shows collision and collsion resolution.
*/


import {
    Canvas,
    Rectangle,
    Vector2i,
    setMovable,
    updateLastPostion,
  } from "./src/Canvas.js";
  import { aabb, checkAndResolveCollision } from "./src/collision.js";
  import { add_events, KeyPressed } from "./src/input.js";
  
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  let canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT, "Canvas");
  
  add_events(canvas.canvas);
  
  //Two Rectangle
  let rect1 = new Rectangle(new Vector2i(10, 10), new Vector2i(30, 50));
  let rect2 = new Rectangle(new Vector2i(100, 100), new Vector2i(70, 50));
  let rect3 = new Rectangle(new Vector2i(300, 400), new Vector2i(30, 40));
  let rect4 = new Rectangle(new Vector2i(300, 200), new Vector2i(30, 70));
  let rect5 = new Rectangle(new Vector2i(340, 200), new Vector2i(30, 70));
  
  let playerMovementSpeed = new Vector2i(3, 3);
  
  setMovable(rect1);
  setMovable(rect2);
  setMovable(rect5);
  
  let moveRight = true;
  let moveDown = true;
  
  //Update cordinates
  let update = function (playerMovementSpeed) {
  
    //Update lastPostion of rectangles before assigning new positions
    updateLastPostion(rect1);
    updateLastPostion(rect2);
  
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
  
    //Rectange 2
    if (rect2.vec.x < CANVAS_WIDTH && moveRight) {
      rect2.vec.x += 3;
    }else{
      moveRight = false;
      rect2.vec.x -= 13;
      if(rect2.vec.x < 0) moveRight = true;
    }
  
    //Rectangle 5
    if(rect5.vec.y < 450 && moveDown){
      rect5.vec.y += 3;
    }else{
      moveDown = false;
      rect5.vec.y -= 5;
      if(rect5.vec.y < 150) moveDown = true;
    }
  };
  
  //Only check if the object is colliding but not resolve the collision
  let collisionCheck = function () {
  
    let isCollision = aabb(rect1, rect4);
    let isCollision2 = aabb(rect1, rect5);
    
    rect1.color = "magenta";
  
    if (isCollision) {
      rect1.color = "red";
    }
  
    if(isCollision2){
      rect1.color = "orange";  
    }
    
  };
  
  //DrawFunction
  let draw = function () {
    rect1.draw(canvas.ctx);
    rect2.draw(canvas.ctx);
    rect3.draw(canvas.ctx);
    rect4.draw(canvas.ctx);
    rect5.draw(canvas.ctx);
  };
  
  //GameLoop Start
  const FPS = 60;
  let rendering = true;
  drawAtXFps(FPS);
  
  function drawAtXFps(FPS) {
    let timestart = Date.now();
  
    canvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
    // collisionCheck();
    update(playerMovementSpeed);
    collisionCheck();
    checkAndResolveCollision(rect1, rect2);
    checkAndResolveCollision(rect1, rect3);
    draw();
  
    let timeend = Date.now();
    let sleepTime = (1000 - timeend + timestart) / FPS;
  
    if (rendering === true) {
      setTimeout(() => {
        drawAtXFps(FPS);
      }, sleepTime);
    }
  }