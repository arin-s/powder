CANVAS_WIDTH = 100;
CANVAS_HEIGHT = 100;
let mainCanvas = document.getElementById("canvas");
mainCanvas.height = CANVAS_HEIGHT;
mainCanvas.width = CANVAS_WIDTH;
let canvasPos = mainCanvas.getBoundingClientRect();
var ctx = mainCanvas.getContext("2d");
ctx.font = "20px Arial";
requestAnimationFrame(draw);

let lastTime = 0;
let fps = 1000 / 60;
let leftBtn = false;
let mouseX, mouseY;

let powder = new Array(CANVAS_HEIGHT * CANVAS_WIDTH).fill(0);

function draw(time) {
  //Clear the screen and calculate FPS
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "black";
  let fps = String(1000 / (time - lastTime)).slice(0, 4);
  ctx.fillText("FPS: " + fps, 0, 20);
  //Get current frame and do simulation
  let frame = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  //draw pixels to frame
  for (let i = 0; i < CANVAS_HEIGHT * CANVAS_WIDTH; i++) {
    if (powder[i] === 1) {
      frame.data[4 * i] = 0;
      frame.data[4 * i + 1] = 0;
      frame.data[4 * i + 2] = 0;
    }
  }
  //do mouse input
  simulate();
  //Put frame
  ctx.putImageData(frame, 0, 0);
  //Prepare next frame
  lastTime = time;
  requestAnimationFrame(draw);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let sides = [-1, 1];
function simulate() {
  for (let i = CANVAS_HEIGHT * CANVAS_WIDTH - 1; i >= 0; i--) {
    if (powder[i] === 0)
      continue;
    //if space below is empty, fall
    if (powder[i + CANVAS_HEIGHT] === 0) {
      powder[i] = 0;
      powder[i + CANVAS_HEIGHT] = 1;
    } else {
      sides.sort(() => {return Math.random()*2-1});
      for (side of sides) {
        if (powder[i + CANVAS_HEIGHT + side] === 0) {
          powder[i] = 0;
          powder[i + CANVAS_HEIGHT + side] = 1;
          break;
        }
      }
    }
  }
  if (leftBtn) {
    powder[mouseY * CANVAS_HEIGHT + mouseX] = 1;
  }
}
let widthFactor = Number(getComputedStyle(mainCanvas).width.replace(/\D+/,""))/mainCanvas.width;
let heightFactor = Number(getComputedStyle(mainCanvas).height.replace(/\D+/,""))/mainCanvas.height;
lastDown = false;
mainCanvas.addEventListener("mousedown", () => { leftBtn = true; });
mainCanvas.addEventListener("mouseup", () => { leftBtn = false; });
mainCanvas.addEventListener("pointermove", (e) => {
  let mouseEvents = e.getCoalescedEvents();
  for (let event of mouseEvents) {
    mouseX = Math.round((event.pageX - mainCanvas.offsetLeft)/widthFactor);
    mouseY = Math.round((event.pageY - mainCanvas.offsetTop)/heightFactor);
    if (leftBtn) {
      powder[mouseY * CANVAS_HEIGHT + mouseX] = 1;
    }
  }
});