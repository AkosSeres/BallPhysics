const Mode = require('../mode.js');

const RectangleBodyMode = new Mode(
    'Rectangle body (experimental)',
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
    function(physics, x, y, mouseX, mouseY, lastX, lastY, choosed, fc, k) {
      if (lastX != 0 && lastY != 0) {
        physics.addRectBody(
            lastX / 2 + mouseX / 2,
            lastY / 2 + mouseY / 2,
            2 * Math.abs(lastX / 2 - mouseX / 2),
            2 * Math.abs(lastY / 2 - mouseY / 2),
            0.18,
            0.1
        );
      }
    },
    function() {},
    function() {}
);

module.exports = RectangleBodyMode;
