const BallPhysics = require('../../src/physics');

const Physics = BallPhysics;
const Ball = BallPhysics.Ball;
const Vec2 = BallPhysics.Vec2;
const Spring = BallPhysics.Spring;
const Stick = BallPhysics.Stick;

const startPauseControlsFunction = require('./startPauseControls');

let physics;
let cnv;
let mouseX = 0;
let mouseY = 0;
// eslint-disable-next-line no-unused-vars
let mouseDown = 0;
window.defaultSize;
window.k = 0.5;
window.fc = 2;
window.springConstant = 2000;
window.scaling = 1;
window.viewOffsetX = 0;
window.viewOffsetY = 0;
let mode = 0;
let lastX = 0;
let lastY = 0;
let timeMultiplier = 1;
let lastFrameTime;
window.lockRotation = false;
window.time = true;
let choosed = false;
let mx = 0;
my = 0;
const preciseMode = false;

const modes = [
  require('./modes/ballcreator.js'),
  require('./modes/rectangle.js'),
  require('./modes/walldrawer.js'),
  require('./modes/stickcreator.js'),
  require('./modes/springcreator.js'),
  require('./modes/movemode.js'),
  require('./modes/elasticballcreator.js'),
  require('./modes/softsquarecreator.js'),
  require('./modes/deletemode.js'),
  require('./modes/rectanglebodycreator.js'),
];

let left = false;
let right = false;

/**
 * Called when the page loaded
 */
window.onload = () => {
  cnv = document.getElementById('defaulCanvas0');

  physics = new Physics();
  physics.setBounds(0, 0, cnv.width, cnv.height);
  physics.setGravity(new Vec2(0, 1000));
  physics.setAirFriction(0.9);

  cnv.addEventListener('touchstart', startTouch, false);
  cnv.addEventListener('touchend', endTouch, false);
  cnv.addEventListener('touchmove', moveTouch, false);
  cnv.addEventListener('mousedown', startMouse, false);
  cnv.addEventListener('mouseup', endMouse, false);
  cnv.addEventListener('mousemove', handleMouseMovement, false);
  document.addEventListener('keydown', keyGotDown, false);
  document.addEventListener('keyup', keyGotUp, false);
  window.addEventListener('resize', resizeCanvas, false);
  cnv.addEventListener(
      'mousedown',
      function() {
        mouseDown = 1;
      },
      false
  );
  cnv.addEventListener(
      'mouseup',
      function() {
        mouseDown = 0;
      },
      false
  );

  resizeCanvas();
  window.defaultSize = (cnv.width + cnv.height) / 80;

  startPauseControlsFunction(new Translator());

  requestAnimationFrame(drawFunction);
};

/**
 * Function that is called when the window gest resized
 */
function resizeCanvas() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
  physics.setBounds(0, 0, cnv.width, cnv.height);
}

/**
 * My draw function
 */
function drawFunction() {
  if (!isFinite(lastFrameTime)) lastFrameTime = performance.now();
  let elapsedTime = performance.now() - lastFrameTime;
  if (!isFinite(elapsedTime)) {
    elapsedTime = 0;
  }
  elapsedTime /= 1000;

  mouseX = isFinite(mouseX) ? mouseX : mx;
  mouseY = isFinite(mouseY) ? mouseY : my;
  if (mouseX && isFinite(mouseX)) mx = mouseX;
  if (mouseY && isFinite(mouseY)) my = mouseY;

  // TODO: ditch p5.js
  const ctx = cnv.getContext('2d');

  // paint the background
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // Draw the logo up there and some coordinates
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.fillText('BallPhysics', 10, 10);
  ctx.fillText('Mode: ' + modes[mode].name, 10, 25);
  ctx.fillText(
      Math.round(mouseX).toString() + ' ' + Math.round(mouseY).toString(),
      10,
      40
  );
  ctx.fillText(
      Math.round(lastX).toString() + ' ' + Math.round(lastY).toString(),
      10,
      55
  );

  modes[mode].drawFunc(
      ctx,
      mouseX,
      mouseY,
      lastX,
      lastY,
      defaultSize * window.scaling,
      mouseDown,
      physics,
      choosed,
      elapsedTime * timeMultiplier,
      {scaling: window.scaling, viewOffsetX: window.viewOffsetX, viewOffsetY: window.viewOffsetY}
  );

  // the size indicator for creating balls
  ctx.strokeStyle = 'black';

  physicsDraw(cnv);

  if (!time) return;

  if (physics.balls[0]) {
    if (right) physics.balls[0].ang -= Math.PI * 100 * elapsedTime;
    if (left) physics.balls[0].ang += Math.PI * 100 * elapsedTime;
  }

  elapsedTime *= timeMultiplier;
  physics.update(elapsedTime / 5, preciseMode);
  physics.update(elapsedTime / 5, preciseMode);
  physics.update(elapsedTime / 5, preciseMode);
  physics.update(elapsedTime / 5, preciseMode);
  physics.update(elapsedTime / 5, preciseMode);

  pmouseX = mouseX;
  pmouseY = mouseY;

  lastFrameTime = performance.now();
  requestAnimationFrame(drawFunction);
}

/**
 * Gets called on the start of an interaction with the canvas
 * @param {number} x The x position of the mouse of the finger on the canvas
 * @param {number} y The y position of the mouse of the finger on the canvas
 */
function startInteraction(x, y) {
  mouseX = x;
  mouseY = y;
  choosed = physics.getObjectAtCoordinates(mouseX / window.scaling - window.viewOffsetX / window.scaling, mouseY / window.scaling - window.viewOffsetY / window.scaling);
  if (!choosed) {
    choosed = {
      x: mouseX / window.scaling - window.viewOffsetX / window.scaling,
      y: mouseY / window.scaling - window.viewOffsetY / window.scaling,
      pinPoint: true,
    };
  }
  lastX = mouseX;
  lastY = mouseY;

  modes[mode].startInteractionFunc(physics,
      x / window.scaling - window.viewOffsetX / window.scaling,
      y / window.scaling - window.viewOffsetY / window.scaling,
      mouseX / window.scaling - window.viewOffsetX / window.scaling,
      mouseY / window.scaling - window.viewOffsetY / window.scaling,
      choosed);
}

/**
 * Gets called on the end of an interaction with the canvas
 * @param {number} x The x position of the mouse of the finger on the canvas
 * @param {number} y The y position of the mouse of the finger on the canvas
 */
function endInteraction(x, y) {
  mouseX = x;
  mouseY = y;

  modes[mode].endInteractionFunc(
      physics,
      x / window.scaling - window.viewOffsetX / window.scaling,
      y / window.scaling - window.viewOffsetY / window.scaling,
      mouseX / window.scaling - window.viewOffsetX / window.scaling,
      mouseY / window.scaling - window.viewOffsetY / window.scaling,
      lastX / window.scaling - window.viewOffsetX / window.scaling,
      lastY / window.scaling - window.viewOffsetY / window.scaling,
      choosed,
      fc,
      k
  );

  if (lastX === 0 && lastY === 0) return;

  lastX = 0;
  lastY = 0;
  choosed = false;
}

/**
 * My keyboard event function for pressing down a key
 * @param {KeyboardEvent} event The event containing data
 */
function keyGotDown(event) {
  keyCode = event.key;
  if (keyCode === 'ArrowUp') {
    mode += 1;
    mode %= modes.length;
  }
  if (keyCode === 'ArrowDown') {
    mode -= 1;
    mode = mode === -1 ? modes.length - 1 : mode;
  }
  if (keyCode === 's') {
    spawnNewtonsCradle(cnv.width / 2, cnv.height / 2, 0.5, physics);
  }
  if (keyCode === 'a') {
    window.scaling += 0.01;
  }
  if (keyCode === 'd') {
    window.scaling -= 0.01;
  }
  if (keyCode === 'j') {
    window.viewOffsetX -= 10;
  }
  if (keyCode === 'l') {
    window.viewOffsetX += 10;
  }
  if (keyCode === 'k') {
    window.viewOffsetY -= 10;
  }
  if (keyCode === 'i') {
    window.viewOffsetY += 10;
  }
  if (keyCode === 'ArrowRight') {
    right = true;
  }
  if (keyCode === 'ArrowLeft') {
    left = true;
  }
}

/**
 * My keyboard event function for releasing a key
 * @param {KeyboardEvent} event The event containing data
 */
function keyGotUp(event) {
  keyCode = event.key;
  // Right arrow
  if (keyCode === 'ArrowRight') {
    right = false;
  }
  // Left arrow
  if (keyCode === 'ArrowLeft') {
    left = false;
  }
}

/**
 * My touch event function
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function startTouch(event) {
  event.preventDefault();
  if (cnv.width - event.changedTouches[0].clientX < cnv.width / 100) {
    mode += 1;
    mode %= modes.length;
    return;
  }
  if (event.changedTouches[0].clientX < cnv.width / 100) {
    mode -= 1;
    mode = mode === -1 ? modes.length - 1 : mode;
    return;
  }
  startInteraction(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
  );
  return false;
}

/**
 * My touch event function
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function endTouch(event) {
  event.preventDefault();
  endInteraction(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
  );
  return false;
}

/**
 * My touch event function
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function moveTouch(event) {
  event.preventDefault();
  mouseX = event.changedTouches[0].clientX;
  mouseY = event.changedTouches[0].clientY;
  return false;
}

/**
 * My mouse event function that handles pressing down a mouse key
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function startMouse(event) {
  startInteraction(event.clientX, event.clientY);
  return false;
}

/**
 * My mouse event function that handles releasing a mouse key
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function endMouse(event) {
  endInteraction(event.clientX, event.clientY);
  return false;
}

/**
 * My mouse event function that handles mouse movement
 * @param {TouchEvent} event The event containing data
 */
function handleMouseMovement(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

const physicsDraw = function(cnv) {
  const ctx = cnv.getContext('2d');
  ctx.save();
  ctx.translate(window.viewOffsetX, window.viewOffsetY);
  ctx.scale(window.scaling, window.scaling);

  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'black';
  for (let i = 0; i < physics.balls.length; i++) {
    ctx.beginPath();
    ctx.arc(
        physics.balls[i].pos.x,
        physics.balls[i].pos.y,
        physics.balls[i].r,
        0,
        2 * Math.PI
    );
    ctx.stroke();
    ctx.fill();

    ctx.save();
    ctx.translate(physics.balls[i].pos.x, physics.balls[i].pos.y);
    ctx.rotate(-Math.PI / 2 - physics.balls[i].rotation);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, physics.balls[i].r);
    ctx.stroke();
    ctx.restore();
  }

  physics.bodies.forEach((element) => {
    ctx.beginPath();
    ctx.moveTo(
        element.points[element.points.length - 1].x,
        element.points[element.points.length - 1].y
    );
    element.points.forEach((p) => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(element.pos.x, element.pos.y, 1.5, 0, Math.PI * 2);
    ctx.stroke();
  });

  const drawWall = (element) => {
    ctx.beginPath();
    ctx.moveTo(
        element.points[element.points.length - 1].x,
        element.points[element.points.length - 1].y
    );
    element.points.forEach((p) => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.fill();
  };
  ctx.fillStyle = 'white';
  physics.walls.forEach(drawWall);
  ctx.fillStyle = 'yellow';
  physics.bounds.forEach(drawWall);

  physics.fixedBalls.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ADD8E6';
  ctx.fillStyle = '#ADD8E6';
  physics.springs.forEach((element) => {
    if (element instanceof Spring && !(element instanceof Stick)) {
      let x1;
      let y1;
      let x2;
      let y2;
      if (element.pinned) {
        x1 = element.pinned.x;
        y1 = element.pinned.y;
        x2 = element.objects[0].pos.x;
        y2 = element.objects[0].pos.y;
      } else {
        x1 = element.objects[0].pos.x;
        y1 = element.objects[0].pos.y;
        x2 = element.objects[1].pos.x;
        y2 = element.objects[1].pos.y;
      }
      let v = new Vec2(x2 - x1, y2 - y1);
      const c = v.copy;
      v.rotate(Math.PI / 2);
      v.setMag(5);
      let last = new Vec2(x1, y1);
      const num = Math.floor(element.length / 10);
      for (let i = 1; i <= num; i++) {
        if (i === num) v = new Vec2(0, 0);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x1 + (i / num) * c.x + v.x, y1 + (i / num) * c.y + v.y);
        ctx.stroke();
        last = new Vec2(x1 + (i / num) * c.x + v.x, y1 + (i / num) * c.y + v.y);
        v.mult(-1);
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(element.objects[0].pos.x, element.objects[0].pos.y);
      ctx.lineTo(
        element.pinned ? element.pinned.x : element.objects[1].pos.x,
        element.pinned ? element.pinned.y : element.objects[1].pos.y
      );
      ctx.stroke();
    }
    element.objects.forEach((o) => {
      ctx.beginPath();
      ctx.arc(o.pos.x, o.pos.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    if (element.pinned) {
      ctx.beginPath();
      ctx.arc(element.pinned.x, element.pinned.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  });
  ctx.restore();

  // Visualizing debug data
  for (segment of physics.debugData) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(segment.a.x, segment.a.y);
    ctx.lineTo(segment.b.x, segment.b.y);
    ctx.stroke();
  }

  ctx.restore();
};

/**
 * Spawns a Newton cradle inside the given world at given size and
 * coordinates
 * @param {number} x The x coordinate of it
 * @param {number} y The y coordinate of it
 * @param {number} scale The size of it
 * @param {Physics} phy The world to put it in
 */
function spawnNewtonsCradle(x, y, scale, phy) {
  const balls = [];
  const defaultR = 25;
  const defaultStick = 250;
  const ballNumber = 8;
  balls.push(
      new Ball(new Vec2(x, y), new Vec2(0, 0), scale * defaultR, 1, 0, 0)
  );
  let count = 1;
  for (let i = 0; i < ballNumber - 1; i++) {
    balls.push(
        new Ball(
            new Vec2(x + count * scale * defaultR * 1.01 * 2, y),
            new Vec2(0, 0),
            scale * 25,
            1,
            0,
            0
        )
    );
    count *= -1;
    if (count > 0) count += 1;
    if (i === ballNumber - 2) {
      balls[balls.length - 1].vel.x = -Math.sign(count) * scale * defaultR * 8;
    }
  }
  balls.forEach((ball) => {
    phy.addBall(ball);
    const stick = new Stick(defaultStick);
    stick.attachObject(ball);
    stick.pinHere(ball.pos.x, ball.pos.y - defaultStick);
    phy.addSpring(stick);
    stick.lockRotation();
  });
}

/**
 * Setter for the variable timeMultipler for passing it to other scopes
 * @param {number} x The new value of timeMultiplier
 */
function setTimeMultiplier(x) {
  if (isFinite(x)) timeMultiplier = x;
}

/**
 * Getter for the variable timeMultiplier for passing it to other scopes
 * @return {number} The value of timeMultiplier
 */
function getTimeMultiplier() {
  return timeMultiplier;
}

/**
 * Setter for the object physics for passing it to other scopes
 * @param {number} phy The new objejet physics
 */
function setPhysics(phy) {
  if (phy instanceof Physics) physics = phy;
}

/**
 * Getter for the physics object for passing it to other scopes
 * @return {number} The object physics
 */
function getPhysics() {
  return physics;
}

/**
 * The translator for passing to other scopes
 */
const Translator = function() {
  this.setTimeMultiplier = setTimeMultiplier;
  this.getTimeMultiplier = getTimeMultiplier;
  this.getPhysics = getPhysics;
  this.setPhysics = setPhysics;
};
