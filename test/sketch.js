const Physics = BallPhysics.Physics;
const Ball = BallPhysics.Ball;
const Vec2 = BallPhysics.Vec2;
const Spring = BallPhysics.Spring;
const Stick = BallPhysics.Stick;
const SoftBall = BallPhysics.SoftBall;

let physics;
let cnv;
let mouseX = 0;
let mouseY = 0;
let pmouseX = 0;
let pmouseY = 0;
// eslint-disable-next-line no-unused-vars
let mouseDown = 0;
window.defaultSize;
window.k = 0.5;
window.fc = 2;
window.springConstant = 2000;
let mode = 0;
let lastX = 0;
let lastY = 0;
let timeMultiplier = 1;
let lastFrameTime;
window.lockRotation = false;
window.time = true;
let choosed = false;
let mx = 0; my = 0;
let preciseMode = false;
let modes = [
  'ball creator',
  'rectangle',
  'wall drawer',
  'stick creator',
  'spring creator',
  'move',
  'elastic ball creator (very laggy)',
];

let left = false;
let right = false;

/**
 * Function used by p5.js and is runned before start drawing
 */
window.onload = function() {
  cnv = document.getElementById('defaulCanvas0');

  physics = new Physics();
  physics.setBounds(0, 0, cnv.width, cnv.height);
  physics.setGravity(new Vec2(0, 1000));
  physics.setAirFriction(0.9);

  cnv.ontouchstart = startTouch;
  cnv.ontouchend = endTouch;
  cnv.onmousedown = startMouse;
  cnv.onmouseup = endMouse;
  cnv.onmousemove = handleMouseMovement;
  document.onkeydown = keyGotDown;
  document.onkeyup = keyGotUp;
  window.onresize = resizeCanvas;
  document.body.onmousedown = function() {
    mouseDown++;
  };
  document.body.onmouseup = function() {
    mouseDown--;
  };

  resizeCanvas();
  window.defaultSize = (cnv.width + cnv.height) / 80;

  requestAnimationFrame(drawFunction);
};

/**
 * Function that is called when the window gest resized
 */
function resizeCanvas() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
  physics.setBounds(0, 0, cnv.width, cnv.height);
};

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

  mouseX = (isFinite(mouseX) ? mouseX : mx);
  mouseY = (isFinite(mouseY) ? mouseY : my);
  if (mouseX && isFinite(mouseX)) mx = mouseX;
  if (mouseY && isFinite(mouseY)) my = mouseY;

  // TODO: ditch p5.js
  let ctx = cnv.getContext('2d');

  // paint the background
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // draw the logo up there
  ctx.fillStyle = 'white';
  ctx.fillText('BallPhysics', 10, 10);

  // the size indicator for creating balls
  ctx.strokeStyle = 'black';
  if (mode === 0 || mode === 6) {
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, defaultSize, 0, 2 * Math.PI);
    ctx.stroke();
  }

  if (lastX != 0 && lastY != 0) {
    if (mode === 1) {
      ctx.strokeRect(mouseX, mouseY, lastX - mouseX, lastY - mouseY);
    } else if (mode === 0 || mode === 3 || mode === 4 || mode === 6) {
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(lastX, lastY);
      ctx.stroke();
    }
  }

  if (mode === 5 && choosed && !choosed.pinPoint) {
    choosed.move(mouseX - choosed.pos.x, mouseY - choosed.pos.y);
    choosed.vel.x = (mouseX - pmouseX) / (elapsedTime * timeMultiplier);
    choosed.vel.y = (mouseY - pmouseY) / (elapsedTime * timeMultiplier);
    choosed.ang = 0;
  }

  if (mode == 2) {
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, defaultSize, 0, 2 * Math.PI);
    ctx.stroke();
    if (mouseDown) {
      physics.addFixedBall(mouseX, mouseY, defaultSize);
    }
  }

  physics.draw(cnv);

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
  if (mode === 3 || mode === 4 || mode === 5) {
    choosed = physics.getObjectAtCoordinates(mouseX, mouseY);
    if (!choosed) {
      choosed = {
        x: mouseX,
        y: mouseY,
        pinPoint: true,
      };
    }
  }
  lastX = mouseX;
  lastY = mouseY;
}

/**
 * Gets called on the end of an interaction with the canvas
 * @param {number} x The x position of the mouse of the finger on the canvas
 * @param {number} y The y position of the mouse of the finger on the canvas
 */
function endInteraction(x, y) {
  mouseX = x;
  mouseY = y;

  if (lastX != 0 && lastY != 0 && (mode === 0 || mode === 6)) {
    let newBall = new Ball(new Vec2(lastX, lastY),
      new Vec2((lastX - mouseX), (lastY - mouseY)), defaultSize, k, 0, fc);
    if (isFinite(newBall.pos.x) && isFinite(newBall.pos.y) &&
      isFinite(newBall.vel.x) && isFinite(newBall.vel.y)) {
      if (mode === 0) physics.addBall(newBall);
      else if (mode === 6) {
        let sb = new SoftBall(newBall.pos, defaultSize, 1000000, fc, 20);
        sb.points.forEach((p) => {
          p.vel = newBall.vel.copy;
        });
        physics.addSoftBall(sb);
      }
    } else {
      newBall.vel.x = 0;
      newBall.vel.y = 0;
      physics.addBall(newBall);
    }
  }
  if (mode === 1) {
    physics.addRectWall(
      lastX / 2 + mouseX / 2,
      lastY / 2 + mouseY / 2,
      2 * Math.abs(lastX / 2 - mouseX / 2),
      2 * Math.abs(lastY / 2 - mouseY / 2));
  }

  if (mode === 3 || mode === 4) {
    mode3: {
      let newChoosed = physics.getObjectAtCoordinates(mouseX, mouseY);
      let stick;
      const Thing = mode === 3 ? Stick : Spring;
      if (!newChoosed) {
        newChoosed = {
          x: mouseX,
          y: mouseY,
          pinPoint: true,
        };
      }

      if (choosed == newChoosed ||
        (choosed == undefined && newChoosed == undefined)) break mode3;
      else if (choosed.pinPoint && newChoosed.pinPoint) break mode3;
      else if (choosed.pinPoint) {
        stick = new Thing(Math.sqrt(Math.pow(choosed.x - newChoosed.pos.x, 2) +
          Math.pow(choosed.y - newChoosed.pos.y, 2)), springConstant);
        stick.attachObject(newChoosed);
        stick.pinHere(choosed.x, choosed.y);
      } else if (newChoosed.pinPoint) {
        stick = new Thing(Math.sqrt(Math.pow(choosed.pos.x - newChoosed.x, 2) +
          Math.pow(choosed.pos.y - newChoosed.y, 2)), springConstant);
        stick.attachObject(choosed);
        stick.pinHere(newChoosed.x, newChoosed.y);
      } else {
        stick = new Thing(
          Math.sqrt(Math.pow(choosed.pos.x - newChoosed.pos.x, 2) +
            Math.pow(choosed.pos.y - newChoosed.pos.y, 2)), springConstant);
        stick.attachObject(choosed);
        stick.attachObject(newChoosed);
      }
      physics.addSpring(stick);
      if (lockRotation) {
        stick.lockRotation();
      }
    }
  }

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
    spawnNewtonsCradle(width / 2, height / 2, 0.5, physics);
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
  startInteraction(event.changedTouches[0].clientX,
    event.changedTouches[0].clientY);
  return false;
}

/**
 * My touch event function
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function endTouch(event) {
  endInteraction(event.changedTouches[0].clientX,
    event.changedTouches[0].clientY);
  return false;
}

/**
 * My mouse event function that handles pressing down a mouse key
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function startMouse(event) {
  startInteraction(event.clientX,
    event.clientY);
  return false;
}

/**
 * My mouse event function that handles releasing a mouse key
 * @param {TouchEvent} event The event containing data
 * @return {boolean} Returns false for preventing default browser behavior
 */
function endMouse(event) {
  endInteraction(event.clientX,
    event.clientY);
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

Physics.prototype.draw = function(cnv) {
  let ctx = cnv.getContext('2d');

  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'black';
  for (let i = 0; i < physics.balls.length; i++) {
    ctx.beginPath();
    ctx.arc(physics.balls[i].pos.x,
      physics.balls[i].pos.y,
      physics.balls[i].r,
      0, 2 * Math.PI);
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
    ctx.moveTo(element.points[element.points.length - 1].x,
      element.points[element.points.length - 1].y);
    element.points.forEach((p) => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(element.pos.x, element.pos.y, 1.5);
    ctx.stroke();
  });

  ctx.fillStyle = 'white';
  physics.walls.forEach((element) => {
    ctx.beginPath();
    ctx.moveTo(element.points[element.points.length - 1].x,
      element.points[element.points.length - 1].y);
    element.points.forEach((p) => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.fill();
  });

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
      let c = v.copy;
      v.rotate(Math.PI / 2);
      v.setMag(5);
      let last = new Vec2(x1, y1);
      let num = Math.floor(element.length / 10);
      for (let i = 1; i <= num; i++) {
        if (i === num) v = new Vec2(0, 0);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x1 + i / num * c.x + v.x,
          y1 + i / num * c.y + v.y);
        ctx.stroke();
        last = new Vec2(x1 + i / num * c.x + v.x, y1 + i / num * c.y + v.y);
        v.mult(-1);
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(element.objects[0].pos.x,
        element.objects[0].pos.y);
      ctx.lineTo(element.pinned ? element.pinned.x : element.objects[1].pos.x,
        element.pinned ? element.pinned.y : element.objects[1].pos.y);
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

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.fillText('Mode: ' + modes[mode], 10, 25);
  ctx.fillText(Math.round(mouseX).toString() + ' '
    + Math.round(mouseY).toString(), 10, 40);
  ctx.fillText(Math.round(lastX).toString() + ' '
    + Math.round(lastY).toString(), 10, 55);
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
  let balls = [];
  let defaultR = 25;
  let defaultStick = 250;
  let ballNumber = 8;
  balls.push(new Ball(new Vec2(x, y),
    new Vec2(0, 0), scale * defaultR, 1, 0, 0));
  let count = 1;
  for (let i = 0; i < ballNumber - 1; i++) {
    balls.push(new Ball(new Vec2(x + count * scale * defaultR * 1.01 * 2, y),
      new Vec2(0, 0), scale * 25, 1, 0, 0));
    count *= -1;
    if (count > 0) count += 1;
    if (i === ballNumber - 2) {
      balls[balls.length - 1].vel.x = -Math.sign(count) * scale * defaultR * 8;
    }
  }
  balls.forEach((ball) => {
    phy.addBall(ball);
    let stick = new Stick(defaultStick);
    stick.attachObject(ball);
    stick.pinHere(ball.pos.x, ball.pos.y - defaultStick);
    phy.addSpring(stick);
    stick.lockRotation();
  });
}
