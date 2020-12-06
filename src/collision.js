import { Vector2i, getColumn, getRow, Rectangle } from "./Canvas.js";

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

/**
 * Generates array of rectangles what would be used to check collision from the array that has cells represented
 * by a number.
 * This will reduce the number of collision cells that need to be checked individually and from larger rectanges
 * combining these cells.
 * 
 * @param {array} collisionTilesArray Collision Tile
 * @param {number} MAPTILESIZE Size each tile is to be drawn
 * @param {number} COLCOLU Max tile in each column
 * @param {number} COLROW max number of rows
 * @param {number} TILENUMBER number representing collision cell in the array
 */
export let parseCollisionRectangles = function (
  collisionTilesArray,
  MAPTILESIZE,
  COLCOLU,
  COLROW,
  TILENUMBER
) {
  let colArr = [...collisionTilesArray];
  let colRectArr = [];

  for (let i = 0; i < colArr.length; i++) {
    if (colArr[i] === TILENUMBER) {
      let cellNumber = i + 1;
      let x = (getColumn(cellNumber, COLCOLU) - 1) * MAPTILESIZE;
      let y = (getRow(cellNumber, COLCOLU) - 1) * MAPTILESIZE;
      let rect = new Rectangle(
        new Vector2i(x, y),
        new Vector2i(MAPTILESIZE, MAPTILESIZE)
      );
      colArr[i] = 0;

      let count = 0;
      let maxCount = COLCOLU - getColumn(cellNumber + 1, COLCOLU);

      //Get max width for this rectangle
      while (count <= maxCount) {
        let currentCellNumber = cellNumber + 1 + count;
        if (colArr[currentCellNumber - 1] === TILENUMBER) {
          count++;
          colArr[currentCellNumber - 1] = 0;
        } else {
          break;
        }
      }
      rect.width = (count + 1) * MAPTILESIZE;

      //Get max height for this rectangle
      let rowCount = 1;
      //As we have already checked for the row of current cell we check for the next row from here on.
      let maxRowCount = COLROW - getRow(cellNumber + COLCOLU, COLCOLU) + 1;
      //countRowTill represents all the cells below our first fromed rectangle to see if there is another row that can be added
      //to our existing rectangle
      let maxColumnNumberCount = 1 + count;
      while (rowCount <= maxRowCount) {
        let currentRowStartCellNumber = cellNumber + COLCOLU * rowCount;
        let colCount = 0;
        while (colCount < maxColumnNumberCount) {
          if (colArr[currentRowStartCellNumber - 1 + colCount] === TILENUMBER) {
            colCount++;
          } else {
            break;
          }
        }
        if (colCount === maxColumnNumberCount) {
          replaceArrFromTo(
            colArr,
            0,
            currentRowStartCellNumber - 1,
            maxColumnNumberCount + currentRowStartCellNumber - 1
          );
          rowCount++;
        } else {
          break;
        }
      }

      rect.height = rowCount * MAPTILESIZE;

      colRectArr.push(rect);
    }
  }
  return colRectArr;
};

let replaceArrFromTo = function (arr, changeTo, startIndex, endIndex) {
  for (let i = startIndex; i < endIndex; i++) {
    arr[i];
    arr[i] = changeTo;
  }
};
