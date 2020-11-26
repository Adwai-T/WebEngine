import { Vector2i } from "./Canvas.js";

export function aabb(rect1, rect2) {
  if (
    rect1.vec.x < rect2.vec.x + rect2.width &&
    rect1.vec.x + rect1.width > rect2.vec.x &&
    rect1.vec.y < rect2.vec.y + rect2.height &&
    rect1.vec.y + rect1.height > rect2.vec.y
  ) {
    // collision detected!

    let collisionSide = true;

    if (rect1.vec.x < rect2.vec.x + rect2.width) {
      collisionSide = 2;
    }

    if (rect1.vec.x + rect1.width > rect2.vec.x) {
      collisionSide = 1;
    }

    return collisionSide;
  } else {
    return false;
  }
}

/**
 * Check collision of rect1 with rect2. Important : rect1 will be resolved, rect2 remains uneffected.
 * @param {Rectangle} rect1
 * @param {Rectangle} rect2
 */
export function checkAndResolveCollision(rect1, rect2) {
  if (!aabb(rect1, rect2)) return;

  if (rect2.isMovable) {

    //rect1 collides with the top of rect2
    if (
      rect1.vec.y + rect1.height >= rect2.vec.y &&
      rect1.lastPosition.y + rect1.height <= rect2.lastPosition.y
    ) {
      rect1.vec.y = rect2.vec.y - rect1.height - 1;
    }
    //rect1 collides with the bottom of rect2
    else if (
      rect1.vec.y <= rect2.vec.y + rect2.height &&
      rect1.lastPosition.y >= rect2.lastPosition.y + rect2.height
    ) {
      rect1.vec.y = rect2.vec.y + rect2.height + 1;
    }
    //rect1 collides with the left of rect2
    else if (
      rect1.vec.x + rect1.width >= rect2.vec.x &&
      rect1.lastPosition.x + rect1.width <= rect2.lastPosition.x
    ) {
      rect1.vec.x = rect2.vec.x - rect1.width - 1;
    }
    //rect1 collides witht the right of rect2
    else if (
      rect1.vec.x < rect2.vec.x + rect2.width &&
      rect1.lastPosition.x >= rect2.lastPosition.x + rect2.width
    ) {
      rect1.vec.x = rect2.vec.x + rect2.width + 1;
    }
  }
  //when rect2 is static and does not have a veclocity of its own
  else {
    //rect1 collides with the top of rect2
    if (
      rect1.vec.y + rect1.height >= rect2.vec.y &&
      rect1.lastPosition.y + rect1.height <= rect2.vec.y
    ) {
      rect1.vec.y = rect2.vec.y - rect1.height - 1;
    }
    //rect1 collides with the bottom of rect2
    else if (
      rect1.vec.y <= rect2.vec.y + rect2.height &&
      rect1.lastPosition.y >= rect2.vec.y + rect2.height
    ) {
      rect1.vec.y = rect2.vec.y + rect2.height + 1;
    }
    //rect1 collides with the left of rect2
    else if (
      rect1.vec.x + rect1.width >= rect2.vec.x &&
      rect1.lastPosition.x + rect1.width <= rect2.vec.x
    ) {
      rect1.vec.x = rect2.vec.x - rect1.width - 1;
    }
    //rect1 collides witht the right of rect2
    else if (
      rect1.vec.x < rect2.vec.x + rect2.width &&
      rect1.lastPosition.x >= rect2.vec.x + rect2.width
    ) {
      rect1.vec.x = rect2.vec.x + rect2.width + 1;
    }
  }
}
