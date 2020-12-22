const Mode = require('../mode.js');
const BallPhysics = require('../../../src/physics');

const BallCreatorMode = new Mode(
  'Ball creator',
  '',
  function(
    ctx,
    mouseX,
    mouseY,
    lastX,
    lastY,
    defaultSize,
    mouseDown,
    physics,
    choosed,
    dt
  ) {
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, defaultSize, 0, 2 * Math.PI);
    ctx.stroke();

    if (lastX != 0 && lastY != 0) {
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(lastX, lastY);
      ctx.stroke();
    }
  },
  function(physics, x, y, mouseX, mouseY) { },
  function(physics, x, y, mouseX, mouseY, lastX, lastY) {
    if (lastX != 0 && lastY != 0) {
      const newBall = new BallPhysics.Ball(
        new BallPhysics.Vec2(lastX, lastY),
        new BallPhysics.Vec2(lastX - mouseX, lastY - mouseY),
        defaultSize,
        k,
        0,
        fc
      );
      if (
        isFinite(newBall.pos.x) &&
        isFinite(newBall.pos.y) &&
        isFinite(newBall.vel.x) &&
        isFinite(newBall.vel.y)
      ) {
        physics.addBall(newBall);
      } else {
        newBall.vel.x = 0;
        newBall.vel.y = 0;
        physics.addBall(newBall);
      }
    }
  },
  function() { },
  function() { }
);

module.exports = BallCreatorMode;
