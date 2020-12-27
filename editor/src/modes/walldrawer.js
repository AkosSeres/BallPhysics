const Mode = require('../mode.js');

const WallDrawerMode = new Mode(
  'Wall drawer',
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
    dt,
    offsets
  ) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, defaultSize, 0, 2 * Math.PI);
    ctx.stroke();
    if (lastX != 0 && lastY != 0) {
      physics.addFixedBall(mouseX / offsets.scaling -
        offsets.viewOffsetX / offsets.scaling,
        mouseY / offsets.scaling -
        offsets.viewOffsetY / offsets.scaling, defaultSize / offsets.scaling);
    }
  },
  function(physics, x, y, mouseX, mouseY) {
  },
  function(physics, x, y, mouseX, mouseY, lastX, lastY) {
  },
  function() { },
  function() { }
);

module.exports = WallDrawerMode;
