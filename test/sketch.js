const Ball = Physics.Ball;
const Vec2 = Physics.Vec2;
const Spring = Physics.Spring;
const Stick = Physics.Stick;

let physics;
window.defaultSize = 25;
window.k = 0.5;
window.fc = 0.2;
window.springConstant = 2000;
let gui;
let mode = 0;
let lastX = 0;
let lastY = 0;
let drawThickness = 30;
let timeMultiplier = 1;
window.lockRotation = false;
window.time = true;
let choosed = false;
let modes = [
  'ball creator',
  'recrangle',
  'wall drawer',
  'stick creator',
  'spring creator',
];

let left = false;
let right = false;

/**
 * Function used by p5.js and is runned before start drawing
 */
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  gui = createGui('Properties');
  sliderRange(3, 100, 1);
  gui.addGlobals('defaultSize');
  sliderRange(0.01, 1, 0.01);
  gui.addGlobals('k');
  sliderRange(0, 3.5, 0.05);
  gui.addGlobals('fc');
  sliderRange(0, 1000000, 1000);
  gui.addGlobals('springConstant');
  gui.addGlobals('time');
  gui.addGlobals('lockRotation');

  physics = new Physics();
  physics.setBounds(0, 0, width, height);
  physics.setGravity(new Vec2(0, 1000));
}

/**
 * p5.js built in function and is called when the window gest resized
 */
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  physics.setBounds(0, 0, width, height);
}

/**
 * p5.js draw function
 */
function draw() {
  background(51);

  let elapsedTime = 1 / frameRate();
  if (isNaN(elapsedTime)) {
    elapsedTime = 0;
  }

  stroke(0);
  noFill();
  if (mode === 0) {
    ellipse(mouseX, mouseY, defaultSize * 2, defaultSize * 2);
  }

  if (lastX != 0 && lastY != 0) {
    if (mode === 1) {
      rect(mouseX, mouseY, lastX - mouseX, lastY - mouseY);
    } else if (mode === 0 || mode === 3 || mode === 4) {
      line(mouseX, mouseY, lastX, lastY);
    }
  }

  let guiBound = gui.prototype._panel.getBoundingClientRect();
  if (mode == 2 &&
    !((mouseX > guiBound.left && mouseX < guiBound.right) &&
      (mouseY > guiBound.top && mouseY < guiBound.bottom))) {
    ellipse(mouseX, mouseY, drawThickness * 2, drawThickness * 2);
    if (mouseIsPressed) {
      physics.addFixedBall(mouseX, mouseY, drawThickness);
    }
  }

  physics.draw();

  if (!time) return;

  if (physics.balls[0]) {
    if (right) physics.balls[0].ang -= Math.PI * 100 * elapsedTime;
    if (left) physics.balls[0].ang += Math.PI * 100 * elapsedTime;
  }

  elapsedTime *= timeMultiplier;
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
}

/**
 * p5.js function and it's called when the user pressed a mouse button
 */
function mousePressed() {
  let guiBound = gui.prototype._panel.getBoundingClientRect();
  if ((mouseX > guiBound.left && mouseX < guiBound.right) &&
    (mouseY > guiBound.top && mouseY < guiBound.bottom)) {
    return;
  }
  if (mode === 3 || mode === 4) {
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
}

/**
 * p5.js function and it's called when the user releases a mouse button
 */
function mouseReleased() {
  let guiBound = gui.prototype._panel.getBoundingClientRect();
  if ((mouseX > guiBound.left && mouseX < guiBound.right) &&
    (mouseY > guiBound.top && mouseY < guiBound.bottom)) {
    lastX = 0;
    lastY = 0;
    return;
  }

  if (lastX != 0 && lastY != 0 && mode === 0) {
    let newBall = new Ball(new Vec2(lastX, lastY),
      new Vec2((lastX - mouseX), (lastY - mouseY)), defaultSize, k, 0, fc);
    physics.addBall(newBall);
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
      if (newChoosed == false) {
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
}

/**
 * p5.js keyboard event function
 */
function keyPressed() {
  if (keyCode === UP_ARROW) {
    mode += 1;
    mode %= modes.length;
  }
  if (keyCode === DOWN_ARROW) {
    mode -= 1;
    mode = mode === -1 ? modes.length - 1 : mode;
  }
  if (keyCode === 83) {
    spawnNewtonsCradle(width / 2, height / 2, 0.5, physics);
  }
  // Right arrow
  if (keyCode === 39) {
    right = true;
  }
  // Left arrow
  if (keyCode === 37) {
    left = true;
  }
}

/**
 * p5.js keyboard event function
 */
function keyReleased() {
  // Right arrow
  if (keyCode === 39) {
    right = false;
  }
  // Left arrow
  if (keyCode === 37) {
    left = false;
  }
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
  text('Mode: ' + modes[mode], 10, 10);
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

const arrayOfUsedp5Functions = [
  setup,
  windowResized,
  draw,
  mousePressed,
  mouseReleased,
  keyPressed,
  keyReleased,
];
delete arrayOfUsedp5Functions;
