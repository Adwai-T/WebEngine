export function aabb(rect1, rect2) {
  if (
    rect1.vec.x < rect2.vec.x + rect2.width &&
    rect1.vec.x + rect1.width > rect2.vec.x &&
    rect1.vec.y < rect2.vec.y + rect2.height &&
    rect1.vec.y + rect1.height > rect2.vec.y
  ) {
    // collision detected!

    let collisionSide = true;

    if(rect1.vec.x < rect2.vec.x + rect2.width){
      collisionSide = 2;
    }

    if(rect1.vec.x + rect1.width > rect2.vec.x){
      collisionSide = 1;
    }

    return collisionSide;

  }else{
    return false;
  }
}

export let  CollisionSideEnum = {
  right : 1,
  left : 2,
  top : 3,
  bottom : 4
}

export class Force{
  constructor(displacement, direction){
    this.direction = direction;
    this.displacement = displacement;
  }
}
