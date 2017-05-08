var physics = new Physics();
var defaultSize = 10;
var k = 0.5;
var gui;

var lastX = 0;
var lastY = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  gui = createGui("Ball properties");
  sliderRange(3, 100, 1);
  gui.addGlobals("defaultSize");
  sliderRange(0.01, 1, 0.01);
  gui.addGlobals("k");

  physics.setBounds(0, 0, width, height);
  physics.addField(ConservativeField(createVector(0, 10), 100));
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  physics.setBounds(0, 0, width, height);
}

function draw() {
  background(235);
  var elapsedTime = 1 / frameRate();

  stroke(0);
  noFill();
  ellipse(mouseX, mouseY, defaultSize * 2, defaultSize * 2);

  if (lastX != 0 && lastY != 0) {
    line(mouseX, mouseY, lastX, lastY);
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
  if (lastX != 0 && lastY != 0) physics.addBall(new Ball(createVector(lastX, lastY), createVector((lastX - mouseX), (lastY - mouseY)), defaultSize, k));

  lastX = 0;
  lastY = 0;
}

physics.draw = function () {
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
}
