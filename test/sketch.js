const Physics = BallPhysics.Physics;
const Ball = BallPhysics.Ball;
const Vec2 = BallPhysics.Vec2;
const Spring = BallPhysics.Spring;
const Stick = BallPhysics.Stick;
const SoftBall = BallPhysics.SoftBall;

let physics;
let cnv;
window.defaultSize;
window.k = 0.5;
window.fc = 0.2;
window.springConstant = 2000;
let gui;
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
function setup() {
  cnv = createCanvas(window.innerWidth, window.innerHeight).canvas;
  // cnv = document.getElementById('defaulCanvas0');

  window.defaultSize = (width + height) / 80;

  gui = createGui('Properties');
  sliderRange(0.0015 * (width + height), (width + height) / 15, 1);
  gui.addGlobals('defaultSize');
  sliderRange(0.01, 1, 0.01);
  gui.addGlobals('k');
  sliderRange(0, 3.5, 0.05);
  gui.addGlobals('fc');
  sliderRange(0, 1000000, 1000);
  gui.addGlobals('springConstant');
  gui.addGlobals('time');
  gui.addGlobals('lockRotation');

  gui.prototype.addButton('Next mode', function() {
    mode++; mode %= modes.length - 1;
  });
  gui.prototype.addButton('Close', function() {
    document.getElementsByClassName('qs_main')[0].style.visibility = 'hidden';
  });
  gui.prototype.setDraggable(false);

  document.getElementsByClassName('qs_main')[0].style.width = width + 'px';
  document.getElementsByClassName('qs_main')[0].style.height = height + 'px';
  document.getElementsByClassName('qs_main')[0].style.top = '0px';
  document.getElementsByClassName('qs_main')[0].style.left = '0px';
  document.getElementsByClassName('qs_main')[0].style.visibility = 'hidden';
  document.getElementsByClassName('qs_main')[0].style.overflow = 'auto';

  physics = new Physics();
  physics.setBounds(0, 0, width, height);
  physics.setGravity(new Vec2(0, 1000));
  physics.setAirFriction(0.9);

  cnv.ontouchstart = startTouch;
  cnv.ontouchend = endTouch;
  cnv.onmousedown = startMouse;
  cnv.onmouseup = endMouse;
  document.onkeydown = keyGotDown;
  document.onkeyup = keyGotUp;

  noLoop();
  requestAnimationFrame(drawFunction);
}

/**
 * Function that is called when the window gest resized
 */
window.onresize = function() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  physics.setBounds(0, 0, width, height);
  document.getElementsByClassName('qs_main')[0].style.width = width + 'px';
  document.getElementsByClassName('qs_main')[0].style.height = height + 'px';
};

/**
 * p5.js draw function
 */
function draw() {}

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

  mouseX = touches[0] ? touches[0].x : (isFinite(mouseX) ? mouseX : mx);
  mouseY = touches[0] ? touches[0].y : (isFinite(mouseY) ? mouseY : my);
  if (mouseX && isFinite(mouseX)) mx = mouseX;
  if (mouseY && isFinite(mouseY)) my = mouseY;

  // TODO: ditch p5.js
  let ctx = cnv.getContext('2d');

  // paint the background
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.fillText('BallPhysics', 10, 10);

  stroke(0);
  noFill();

  if (mode === 0 || mode === 6) {
    ellipse(mouseX, mouseY, defaultSize * 2, defaultSize * 2);
  }

  text(physics.balls.length, 300, 200);
  text((1 / elapsedTime).toFixed().toString(), 300, 210);

  if (lastX != 0 && lastY != 0) {
    if (mode === 1) {
      rect(mouseX, mouseY, lastX - mouseX, lastY - mouseY);
    } else if (mode === 0 || mode === 3 || mode === 4 || mode === 6) {
      line(mouseX, mouseY, lastX, lastY);
    }
  }

  if (mode === 5 && choosed && !choosed.pinPoint) {
    choosed.move(mouseX - choosed.pos.x, mouseY - choosed.pos.y);
    choosed.vel.x = (mouseX - pmouseX) / (elapsedTime * timeMultiplier);
    choosed.vel.y = (mouseY - pmouseY) / (elapsedTime * timeMultiplier);
    choosed.ang = 0;
  }

  if (mode == 2 &&
    document.getElementsByClassName('qs_main')[0].
      style.visibility == 'hidden' && (mouseX >= 30 || mouseY >= 30)) {
    ellipse(mouseX, mouseY, defaultSize * 2, defaultSize * 2);
    if (mouseIsPressed || touches[0]) {
      physics.addFixedBall(mouseX, mouseY, defaultSize);
    }
  }

  physics.draw();

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

  lastFrameTime = performance.now();
  requestAnimationFrame(drawFunction);
}

function startInteraction(x, y) {
  mouseX = x;
  mouseY = y;
  if (document.getElementsByClassName('qs_main')[0].
    style.visibility != 'hidden' || (mouseX <= 30 && mouseY <= 30)) return;
  if (mode === 3 || mode === 4 || mode === 5) {
    choosed = physics.getObjectAtCoordinates(mouseX, mouseY);
    if (choosed == false) {
      choosed = {
        x: mouseX,
        y: mouseY,
        pinPoint: true,
      };
    }
  }
  lastX = mouseX;
  lastY = mouseY;
  return false;
}

function endInteraction(x, y) {
  mouseX = x;
  mouseY = y;

  if (mouseX <= 30 && mouseY <= 30) {
    if (document.getElementsByClassName('qs_main')[0].
      style.visibility != 'visible') {
      document.getElementsByClassName('qs_main')[0].
        style.visibility = 'visible';
    } else {
      document.getElementsByClassName('qs_main')[0].
        style.visibility = 'hidden';
    }
    lastX = 0;
    lastY = 0;
    choosed = false;
    return false;
  }

  if (document.getElementsByClassName('qs_main')[0].
    style.visibility != 'hidden' || (mouseX <= 30 && mouseY <= 30)) {
    lastX = 0;
    lastY = 0;
    choosed = false;
    return false;
  }

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
      if (newChoosed == undefined) {
        newChoosed = {
          x: mouseX,
          y: mouseY,
          pinPoint: true,
        };
      }

      if (choosed == newChoosed) break mode3;
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
  return false;
}

function keyGotDown(event) {
  keyCode = event.key;
  console.log(keyCode);
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
 * My keyboard event function
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

function startTouch(event) {
  startInteraction(event.changedTouches[0].clientX,
    event.changedTouches[0].clientY);
  return false;
}

function endTouch(event) {
  endInteraction(event.changedTouches[0].clientX,
    event.changedTouches[0].clientY);
  return false;
}

function startMouse(event) {
  startInteraction(event.clientX,
    event.clientY);
  return false;
}

function endMouse(event) {
  endInteraction(event.clientX,
    event.clientY);
  return false;
}

Physics.prototype.draw = function() {
  fill('green');
  stroke('black');
  for (let i = 0; i < physics.balls.length; i++) {
    ellipse(
      physics.balls[i].pos.x,
      physics.balls[i].pos.y,
      physics.balls[i].r * 2);
    push();
    translate(physics.balls[i].pos.x, physics.balls[i].pos.y);
    rotate(-PI / 2);
    rotate(-physics.balls[i].rotation);
    line(0, 0, 0, physics.balls[i].r);
    pop();
  }

  physics.bodies.forEach((element) => {
    beginShape();
    element.points.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
    ellipse(element.pos.x, element.pos.y, 3, 3);
  });

  noStroke();
  fill('#ff000055');
  physics.walls.forEach((element) => {
    beginShape();
    element.points.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
  });

  physics.fixedBalls.forEach((b) => {
    ellipse(b.x, b.y, b.r * 2);
  });
  push();
  strokeWeight(2);
  stroke('#ADD8E6');
  fill('#ADD8E6');
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
        line(last.x, last.y, x1 + i / num * c.x + v.x,
          y1 + i / num * c.y + v.y);
        last = new Vec2(x1 + i / num * c.x + v.x, y1 + i / num * c.y + v.y);
        v.mult(-1);
      }
    } else {
      line(element.objects[0].pos.x,
        element.objects[0].pos.y,
        element.pinned ? element.pinned.x : element.objects[1].pos.x,
        element.pinned ? element.pinned.y : element.objects[1].pos.y);
    }
    element.objects.forEach((o) => {
      ellipse(o.pos.x, o.pos.y, 5);
    });
    if (element.pinned) ellipse(element.pinned.x, element.pinned.y, 6);
  });
  pop();

  stroke('black');
  fill('white');
  text('Mode: ' + modes[mode], 10, 25);
  text(Math.round(mouseX).toString() + ' '
    + Math.round(mouseY).toString(), 10, 40);
  text(Math.round(lastX).toString() + ' '
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
