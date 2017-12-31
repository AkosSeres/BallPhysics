var physics;
var defaultSize = 25;
var k = 0.5;
var fc = 0.35;
var gui;
var mode = 0;
var lastX = 0;
var lastY = 0;
var drawThickness = 30;
var timeMultiplier = 1;
var time = true;
var choosed = false;
var modes = [
  "ball creator",
  "recrangle",
  "wall drawer",
  "stick creator"
];
var left = false, right = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  gui = createGui("Properties");
  sliderRange(3, 100, 1);
  gui.addGlobals("defaultSize");
  sliderRange(0.01, 1, 0.01);
  gui.addGlobals("k");
  sliderRange(0, 3.5, 0.05);
  gui.addGlobals("fc");
  gui.addGlobals("time");

  physics = new Physics();
  physics.setBounds(0, 0, width, height);
  physics.setGravity(new Vec2(0, 1000));
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  physics.setBounds(0, 0, width, height);
}

function draw() {
  background(51);

  var elapsedTime = 1 / frameRate();
  if (elapsedTime == NaN) {
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
    } else if (mode === 0 || mode === 3) line(mouseX, mouseY, lastX, lastY);
  }

  mode2: if (mode == 2) {
    ellipse(mouseX, mouseY, drawThickness * 2, drawThickness * 2);
    if (mouseIsPressed) {
      var guiBound = gui.prototype._panel.getBoundingClientRect();
      if ((mouseX > guiBound.left && mouseX < guiBound.right) && (mouseY > guiBound.top && mouseY < guiBound.bottom)) break mode2;
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

function mousePressed() {
  var guiBound = gui.prototype._panel.getBoundingClientRect();
  if ((mouseX > guiBound.left && mouseX < guiBound.right) && (mouseY > guiBound.top && mouseY < guiBound.bottom)) {
    return;
  }
  if (mode === 3) {
    choosed = physics.getObjectAtCoordinates(mouseX, mouseY);
    if (choosed == false) choosed = {x: mouseX, y: mouseY, pinPoint: true};
  }
  lastX = mouseX;
  lastY = mouseY;
}

function mouseReleased() {
  var guiBound = gui.prototype._panel.getBoundingClientRect();
  if ((mouseX > guiBound.left && mouseX < guiBound.right) && (mouseY > guiBound.top && mouseY < guiBound.bottom)) {
    lastX = 0;
    lastY = 0;
    return;
  }

  if (lastX != 0 && lastY != 0 && mode === 0) {
    let newBall = new Ball(new Vec2(lastX, lastY), new Vec2((lastX - mouseX), (lastY - mouseY)), defaultSize, k, 0, fc);
    physics.addBall(newBall);
  }
  if (mode === 1) {
    physics.addRectWall(lastX / 2 + mouseX / 2, lastY / 2 + mouseY / 2, 2 * Math.abs(lastX / 2 - mouseX / 2), 2 * Math.abs(lastY / 2 - mouseY / 2));
  }

  mode3: if (mode === 3) {
    let newChoosed = physics.getObjectAtCoordinates(mouseX, mouseY);
    let stick;
    if (newChoosed == false) newChoosed = {x: mouseX, y: mouseY, pinPoint: true};

    if (choosed == newChoosed) break mode3;
    else if (choosed.pinPoint && newChoosed.pinPoint) break mode3;
    else if (choosed.pinPoint) {
      stick = new Stick(Math.sqrt(Math.pow(choosed.x - newChoosed.pos.x, 2) + Math.pow(choosed.y - newChoosed.pos.y, 2)));
      stick.attachObject(newChoosed);
      stick.pinHere(choosed.x, choosed.y);
    } else if (newChoosed.pinPoint) {
      stick = new Stick(Math.sqrt(Math.pow(choosed.pos.x - newChoosed.x, 2) + Math.pow(choosed.pos.y - newChoosed.y, 2)));
      stick.attachObject(choosed);
      stick.pinHere(newChoosed.x, newChoosed.y);
    } else {
      stick = new Stick(Math.sqrt(Math.pow(choosed.pos.x - newChoosed.pos.x, 2) + Math.pow(choosed.pos.y - newChoosed.pos.y, 2)));
      stick.attachObject(choosed);
      stick.attachObject(newChoosed);
    }
    physics.addSpring(stick);
  }

  lastX = 0;
  lastY = 0;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    mode += 1; mode %= modes.length;
  }
  if (keyCode === DOWN_ARROW) {
    mode -= 1; mode = mode === -1 ? modes.length - 1 : mode;
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
  fill("green");
  stroke("black");
  for (var i = 0; i < physics.balls.length; i++) {
    ellipse(physics.balls[i].pos.x, physics.balls[i].pos.y, physics.balls[i].r * 2);
    push();
    translate(physics.balls[i].pos.x, physics.balls[i].pos.y);
    rotate(-PI / 2);
    rotate(-physics.balls[i].rotation);
    line(0, 0, 0, physics.balls[i].r);
    pop();
  }

  physics.bodies.forEach(element => {
    beginShape();
    element.points.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
  });

  noStroke();
  fill("#ff000055");
  physics.walls.forEach(element => {
    beginShape();
    element.points.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
  });

  physics.fixedBalls.forEach(b => {
    ellipse(b.x, b.y, b.r * 2);
  });

  stroke("black");
  physics.springs.forEach(element => {
    line(element.objects[0].pos.x, element.objects[0].pos.y, element.pinned ? element.pinned.x : element.objects[1].pos.x, element.pinned ? element.pinned.y : element.objects[1].pos.y);
  });

  text("Mode: " + modes[mode], 10, 10);
}

function spawnNewtonsCradle(x, y, scale, phy) {
  let balls = [];
  let sticks = [];
  let defaultR = 25;
  let defaultStick = 250;
  let ballNumber = 8;
  balls.push(new Ball(new Vec2(x, y), new Vec2(0, 0), scale * defaultR, 1, 0, 0));
  let count = 1;
  for (let i = 0; i < ballNumber - 1; i++) {
    balls.push(new Ball(new Vec2(x + count * scale * defaultR * 1.01 * 2, y), new Vec2(0, 0), scale * 25, 1, 0, 0));
    count *= -1;
    if (count > 0) count += 1;
    if (i === ballNumber - 2) balls[balls.length - 1].vel.x = -Math.sign(count) * scale * defaultR * 8;
  }
  balls.forEach(ball => {
    phy.addBall(ball);
    let stick = new Stick(defaultStick);
    stick.attachObject(ball);
    stick.pinHere(ball.pos.x, ball.pos.y - defaultStick);
    phy.addSpring(stick);
  });
}
