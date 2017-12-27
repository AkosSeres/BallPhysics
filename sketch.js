var physics;
var defaultSize = 10;
var k = 0.5;
var fc = 0.35;
var gui;
var mode = 0;
var lastX = 0;
var lastY = 0;
var drawThickness = 30;
var modes = [
  "ball creator",
  "recrangle",
  "wall drawer"
];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  gui = createGui("Ball properties");
  sliderRange(3, 100, 1);
  gui.addGlobals("defaultSize");
  sliderRange(0.01, 1, 0.01);
  gui.addGlobals("k");
  sliderRange(0, 30, 0.05);
  gui.addGlobals("fc");

  physics = new Physics();
  physics.setBounds(0, 0, width, height);
  physics.setGravity(createVector(0, 1000));
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  physics.setBounds(0, 0, width, height);
}

function draw() {
  background(51);
  var elapsedTime = 1 / frameRate();

  stroke(0);
  noFill();
  if (mode === 0) {
    ellipse(mouseX, mouseY, defaultSize * 2, defaultSize * 2);
  }

  if (lastX != 0 && lastY != 0) {
    if (mode === 1) {
      rect(mouseX, mouseY, lastX - mouseX, lastY - mouseY);
    } else if (mode === 0) line(mouseX, mouseY, lastX, lastY);
  }

  if (mode == 2) {
    ellipse(mouseX, mouseY, drawThickness * 2, drawThickness * 2);
    if (mouseIsPressed) {
      physics.addFixedBall(mouseX, mouseY, drawThickness);
    }
  }

  physics.draw();

  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
  physics.update(elapsedTime / 5);
}

function mousePressed() {
  var guiBound = gui.prototype._panel.getBoundingClientRect();

  if (mouseX < guiBound.left || mouseX > guiBound.right || mouseY < guiBound.top || mouseY > guiBound.bottom) {
    lastX = mouseX;
    lastY = mouseY;
  }
}

function mouseReleased() {
  if (lastX != 0 && lastY != 0 && mode === 0) physics.addBall(new Ball(createVector(lastX, lastY), createVector((lastX - mouseX), (lastY - mouseY)), defaultSize, k, 0, fc));
  if (mode === 1) {
    physics.addRectWall(lastX / 2 + mouseX / 2, lastY / 2 + mouseY / 2, 2 * Math.abs(lastX / 2 - mouseX / 2), 2 * Math.abs(lastY / 2 - mouseY / 2));
  }

  lastX = 0;
  lastY = 0;
}

function keyPressed() {
  if (keyCode === 32) {
    mode += 1; mode %= 3;
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

  noStroke();
  fill("#ff000055");
  physics.walls.forEach(element => {
    rect(element.x - element.w / 2, element.y - element.h / 2, element.w, element.h);
    beginShape();
    element.points.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
  });

  physics.fixedBalls.forEach(b => {
    ellipse(b.x, b.y, b.r * 2);
  });

  text("Mode: " + modes[mode], 10, 10);
}
