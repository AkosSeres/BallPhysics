const Mode = require('../mode.js');
const BallPhysics = require('../../../src/physics');

const StickCreatorMode = new Mode(
    'Stick creator',
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
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(lastX, lastY);
        ctx.stroke();
      }
    },
    function(physics, x, y, mouseX, mouseY, choosed) {},
    function(physics, x, y, mouseX, mouseY, lastX, lastY, choosed) {
      if (lastX != 0 && lastY != 0) {
        mode3: {
          let newChoosed = physics.getObjectAtCoordinates(mouseX, mouseY);
          let stick;
          const Thing = BallPhysics.Stick;
          if (!newChoosed) {
            newChoosed = {
              x: mouseX,
              y: mouseY,
              pinPoint: true,
            };
          }

          if (
            choosed == newChoosed ||
          (choosed == undefined && newChoosed == undefined)
          ) {
            break mode3;
          } else if (choosed.pinPoint && newChoosed.pinPoint) break mode3;
          else if (choosed.pinPoint) {
            stick = new Thing(
                Math.sqrt(
                    Math.pow(choosed.x - newChoosed.pos.x, 2) +
                Math.pow(choosed.y - newChoosed.pos.y, 2)
                ),
                springConstant
            );
            stick.attachObject(newChoosed);
            stick.pinHere(choosed.x, choosed.y);
          } else if (newChoosed.pinPoint) {
            stick = new Thing(
                Math.sqrt(
                    Math.pow(choosed.pos.x - newChoosed.x, 2) +
                Math.pow(choosed.pos.y - newChoosed.y, 2)
                ),
                springConstant
            );
            stick.attachObject(choosed);
            stick.pinHere(newChoosed.x, newChoosed.y);
          } else {
            stick = new Thing(
                Math.sqrt(
                    Math.pow(choosed.pos.x - newChoosed.pos.x, 2) +
                Math.pow(choosed.pos.y - newChoosed.pos.y, 2)
                ),
                springConstant
            );
            stick.attachObject(choosed);
            stick.attachObject(newChoosed);
          }
          physics.addSpring(stick);
          if (lockRotation) {
            stick.lockRotation();
          }
        }
      }
    },
    function() {},
    function() {}
);

module.exports = StickCreatorMode;
