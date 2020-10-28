let mouse_position = {
    x : 0,
    y : 0
};

let right_down = false;
let left_down = false;

export let KeyPressed = {
  A : false,
  S : false,
  D : false,
  W : false,
  space : false,
  shift : false,
  Q : false,
  E : false,
  F : false,
  clrt : false,
  alt : false
}

export function add_events(element) {

  element.addEventListener('contextmenu', event => event.preventDefault());

  element.addEventListener("mousemove", (event) => {
    mouse_position.x = event.clientX;
    mouse_position.y = event.clientY;
  });

  element.addEventListener('mousedown', (event)=>{
    if(event.button === 0){
      right_down = true;
    }else if(event.button === 2){
      left_down = true;
    }
  });

  element.addEventListener('mouseup', (event)=>{
    if(event.button === 0){
      right_down = false;
    }else if(event.button === 2){
      left_down = false;
    }
  });

  //Keyboard Buttons and their corresponding represntation in number
  //S 83 D 68 space 32 W 87 shift 16 q 81 E 69 F 70 clrt 17 Alt 18

  element.addEventListener('keydown', (event)=>{
    //console.log(event);
    if(event.keyCode === 65){
      KeyPressed.A = true;
    }
    if(event.keyCode === 83){
      KeyPressed.S = true;
    }
    if(event.keyCode === 68){
      KeyPressed.D = true;
    }
    if(event.keyCode === 32){
      KeyPressed.space = true;
    }
    if(event.keyCode === 87){
      KeyPressed.W = true;
    }
    if(event.keyCode === 16){
      KeyPressed.shift = true;
    }
    if(event.keyCode === 81){
      KeyPressed.Q = true;
    }
    if(event.keyCode === 69){
      KeyPressed.E = true;
    }
    if(event.keyCode === 70){
      KeyPressed.F = true;
    }
    if(event.keyCode === 17){
      KeyPressed.clrt = true;
    }
    if(event.keyCode === 18){
      KeyPressed.alt = true;
    }
  })

  element.addEventListener('keyup', (event)=>{
    if(event.keyCode === 65){
      KeyPressed.A = false;
    }
    if(event.keyCode === 83){
      KeyPressed.S = false;
    }
    if(event.keyCode === 68){
      KeyPressed.D = false;
    }
    if(event.keyCode === 32){
      KeyPressed.space = false;
    }
    if(event.keyCode === 87){
      KeyPressed.W = false;
    }
    if(event.keyCode === 16){
      KeyPressed.shift = false;
    }
    if(event.keyCode === 81){
      KeyPressed.Q = false;
    }
    if(event.keyCode === 69){
      KeyPressed.E = false;
    }
    if(event.keyCode === 70){
      KeyPressed.F = false;
    }
    if(event.keyCode === 17){
      KeyPressed.clrt = false;
    }
    if(event.keyCode === 18){
      KeyPressed.alt = false;
    }
  })
}

export function getMousePostion(){
    return mouse_position;
}

export function isRightClicked(){
  return right_down;
}

export function isLeftClicked(){
  return left_down;
}