const Mode = require('../mode.js');

const MoveMode = new Mode(
    'Delete',
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
    ) {},
    function(physics, x, y, mouseX, mouseY, choosed) {
      if (choosed) physics.removeObjFromSystem(choosed);
    },
    function(physics, x, y, mouseX, mouseY, lastX, lastY) {},
    function() {},
    function() {}
);

module.exports = MoveMode;
