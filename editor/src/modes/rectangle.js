const Mode = require('../mode.js');

const RectangleMode = new Mode(
    'Rectangle wall',
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
      if (lastX != 0 && lastY != 0) {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(mouseX, mouseY, lastX - mouseX, lastY - mouseY);
      }
    },
    function(physics, x, y, mouseX, mouseY) {},
    function(physics, x, y, mouseX, mouseY, lastX, lastY) {
      if (lastX != 0 && lastY != 0) {
        physics.addRectWall(
            lastX / 2 + mouseX / 2,
            lastY / 2 + mouseY / 2,
            2 * Math.abs(lastX / 2 - mouseX / 2),
            2 * Math.abs(lastY / 2 - mouseY / 2)
        );
      }
    },
    function() {},
    function() {}
);

module.exports = RectangleMode;
