const Mode = require('../mode.js');

let pmouseX = 0;
let pmouseY = 0;

const convertSpace = (x, y, offsets) => {
  return {
    x: x / offsets.scaling - offsets.viewOffsetX / offsets.scaling,
    y: y / offsets.scaling - offsets.viewOffsetY / offsets.scaling,
  };
};

const MoveMode = new Mode(
    'Move',
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
      const converted = convertSpace(mouseX, mouseY, offsets);
      const pconverted = convertSpace(pmouseX, pmouseY, offsets);
      if (choosed && !choosed.pinPoint) {
        choosed.move(converted.x - choosed.pos.x, converted.y - choosed.pos.y);
        if (dt === 0) {
          choosed.vel.x = 0;
          choosed.vel.y = 0;
        } else {
          choosed.vel.x = (converted.x - pconverted.x) / dt;
          choosed.vel.y = (converted.y - pconverted.y) / dt;
        }
        choosed.ang = 0;
      }

      pmouseX = mouseX;
      pmouseY = mouseY;
    },
    function(physics, x, y, mouseX, mouseY) { },
    function(physics, x, y, mouseX, mouseY, lastX, lastY) { },
    function() { },
    function() { }
);

module.exports = MoveMode;
