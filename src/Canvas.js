export class Canvas {
  constructor(width, height, elementId, id) {
    Canvas.numberOfCanvas++;
    this.width = width;
    this.height = height;

    //Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.tabIndex = 1;
    this.canvas.style = "border:1px solid #000000; cursor: none";
    document.getElementById(elementId).appendChild(this.canvas);

    if (typeof id === "string") {
      this.canvas.id = id;
      this.id = id;
    }

    this.ctx = this.canvas.getContext("2d");
  }

  setID(id) {
    this.id = id;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

/**
 * Get a Random Color in Hex
 */
export function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Load and return Image
 * @param {string} src
 */
export function loadImage(src) {
  let image = new Image();
  image.src = src;
  return image;
}

export function drawSprite(context, image, rect_ImageSource, rect_drawImage) {
  if (image) {
    context.drawImage(
      image,
      rect_ImageSource.vec.x,
      rect_ImageSource.vec.y,
      rect_ImageSource.width,
      rect_ImageSource.height, //src coords
      rect_drawImage.vec.x,
      rect_drawImage.vec.y,
      rect_drawImage.width,
      rect_drawImage.height //dst coords
    );
  }
}

//--- Vector

/**
 * Create a Vector of two integer
 * All things vector are calculated to the origin.
 */
export class Vector2i {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getMagnitudeSquare() {
    return this.x * this.x + this.y * this.y;
  }

  /**Turn a non-zero vector into a vector of unit length*/
  normalize() {
    let length = this.getMagnitude();

    if (length > 0) {
      this.x = this.x / length;
      this.y = this.y / length;
    }
  }

  getSlope() {
    return this.y / this.x;
  }

  getDirection(inDegrees) {
    if (inDegrees) {
      return (Math.atan(this.y / this.x) * 180) / Math.PI;
    }
    return Math.atan(this.y / this.x);
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
  }

  /**Multiply a scalar value with this vector.
   * The parameter to pass is a scalar value not a vector. */
  multiplyScalar(value) {
    this.x *= value;
    this.y *= value;
  }

  getMultiplicationScalarVector(value) {
    return new Vector2i(this.x * value, this.y * value);
  }

  /**Add another vector to this vector */
  addVector(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  getAdditionVector(vector) {
    return new Vector2i(this.x + vector.x, this.y + vector.y);
  }

  /**Subtract given vector from this vector */
  subtractVector(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  getSubtractionVector(vector) {
    return new Vector2i(this.x - vector.x, this.y - vector.y);
  }

  /**Add scaled vector to this vector */
  addScaledVector(vector, scale) {
    this.x += vector.x * scale;
    this.y += vector.y * scale;
  }

  /**Component Product : Similar to adding and subtracting. Has no direct geometric significance. */
  componentProduct(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  }

  getComponentProductVector(vector) {
    return new Vector2i(this.x * vector.x, this.y * vector.y);
  }

  /**Scalar Product of given vector with this vector. */
  getScalarProduct(vector) {                    
    return this.x*vector.x + this.y*vector.y;
  }
  //The scalar value returned => 
  //a.b = |a||b|cos(theta) =>
  //theta represents the angle between the two given vectors
   
}

/**
 * Add Velocity Vector and LastPosition Vector to the objects that can be moved.
 * @param {Rectanle || Point} object 
 * @param {number} initVecolicty 
 */
export function setMovable(object, initVecolicty){
  object.isMovable = true;
  object.velocity = new Vector2i(0, 0);
  object.lastPosition = new Vector2i(object.vec.x, object.vec.y);
}

export function updateLastPostion(object){
  if(object.isMovable){
    object.lastPosition.x = object.vec.x;
    object.lastPosition.y = object.vec.y;
  }
}

//--- Points

/**
 * Create A point of two integer positions x and y.
 * Has a draw function
 */
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(context, color, size) {
    context.fillStyle = color;

    if (size > 1) {
      context.beginPath();
      context.arc(this.x, this.y, size, 0, 2 * Math.PI);
      context.fill();
    } else {
      context.fillRect(this.x, this.y, 1, 1);
    }
  }
}

/**
 *
 * @param {context} context
 * @param {Array} points
 * @param {string} color
 * @param {Number} thickness
 */
Point.joinPointArray = function (context, points, color, thickness) {
  if (typeof color === "string") {
    context.strokeStyle = color;
  }

  if (typeof thickness === "number" && thickness > 1) {
    context.lineWidth = thickness;
  }

  if (Array.isArray(points)) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();
  }
};

//--- Lines
export class Line {
  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
  }

  draw(context, color, thickness) {
    if (typeof color === "string") {
      context.strokeStyle = color;
    }

    if (typeof thickness === "number") {
      context.lineWidth = thickness;
    }

    context.beginPath();
    context.moveTo(this.point1.x, this.point1.y);
    context.lineTo(this.point2.x, this.point2.y);
    context.stroke();
  }

  getSlope() {
    return (this.point1.y - this.point2.y) / (this.point1.x - this.point2.x);
  }

  getLength() {
    return Math.sqrt(
      Math.pow(this.point1.x - this.point2.x, 2) +
        Math.pow(this.point1.y - this.point2.y, 2)
    );
  }

  getAngleWithXAxis(inDegrees) {
    if (inDegrees) {
      return (Math.atan(this.getSlope()) * 180) / Math.PI;
    } else {
      return Math.atan(this.getSlope());
    }
  }
}

Line.getIntersectionPoint = function (line1, line2) {
  const x1 = line1.point1.x;
  const y1 = line1.point1.y;
  const x2 = line1.point2.x;
  const y2 = line1.point2.y;
  const x3 = line2.point1.x;
  const y3 = line2.point1.y;
  const x4 = line2.point2.x;
  const y4 = line2.point2.y;

  //Line line intersection on wiki : https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  let intersectionPoint = new Point(0, 0);

  //Cant divide by zero, denominator can be negative value;
  if (denominator !== 0) {
    intersectionPoint.x =
      ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      denominator;
    intersectionPoint.y =
      ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      denominator;
    return intersectionPoint;
  } else return false;
};

Line.getAngleBetweenLines = function (line1, line2, inDegrees) {
  let m1 = line1.getSlope();
  let m2 = line2.getSlope();

  if (inDegrees) {
    return (Math.atan((m1 - m2) / (1 + m1 * m2)) * 180) / Math.PI;
  }
  return Math.atan((m1 - m2) / (1 + m1 * m2));
};

//--- Rectangle
export class Rectangle {
  constructor(vec1, vec2) {
    this.vec = vec1;
    this.width = vec2.x;
    this.height = vec2.y;
    this.vec_center = new Vector2i(
      (vec1.x + vec2.x + vec1.x) / 2,
      (vec1.y + vec2.y + vec1.y) / 2
    );
    this.color = "black";
  }

  draw(context, color) {
    if (typeof color === "string") {
      context.fillStyle = color;
    } else {
      context.fillStyle = this.color;
    }

    context.fillRect(this.vec.x, this.vec.y, this.width, this.height);
  }

  drawSprite(context, image, vec_startLocation, img_width, img_height) {
    if (image) {
      context.drawImage(
        image,
        vec_startLocation.x,
        vec_startLocation.y,
        img_width,
        img_height, //src coords
        this.vec.x,
        this.vec.y,
        this.width,
        this.height //dst coords
      );
    }
  }

  rotateSpriteAndDraw(
    context,
    image,
    angle,
    vec_startLocation,
    img_width,
    img_height
  ) {
    if (image) {
      context.save();
      context.translate(
        this.vec.x + this.width / 2,
        this.vec.y + this.height / 2
      );
      context.rotate(angle); //* Math.PI / 180);
      //We dont need to have the x and y  position of the image as we have already
      //translated to that location and draw the image directly.
      context.drawImage(
        image,
        vec_startLocation.x,
        vec_startLocation.y,
        img_width,
        img_height,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      context.restore();
    }
  }
}
