import Mode from '../modeInterface';
import BallPhysics from '../../../src/physics';

/**
 * @type {Mode}
 */
export const StickCreatorMode = {
  name: 'Stick creator',
  description: '',
  drawFunc: function (editorApp, dt) {
    let ctx = editorApp.cnv.getContext('2d');

    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc: function (editorApp) { },
  endInteractionFunc: function (editorApp) {
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      mode3: {
        let newChoosed = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
        let stick;
        const Thing = BallPhysics.Stick;
        if (!newChoosed) {
          newChoosed = {
            x: editorApp.mouseX,
            y: editorApp.mouseY,
            pinPoint: true,
          };
        }

        if (
          editorApp.choosed == newChoosed ||
          (editorApp.choosed == undefined && newChoosed == undefined)
        ) {
          break mode3;
        } else if (editorApp.choosed.pinPoint && newChoosed.pinPoint) break mode3;
        else if (editorApp.choosed.pinPoint) {
          stick = new Thing(
            Math.sqrt(
              Math.pow(editorApp.choosed.x - newChoosed.pos.x, 2) +
              Math.pow(editorApp.choosed.y - newChoosed.pos.y, 2)
            )
          );
          stick.attachObject(newChoosed);
          stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
        } else if (newChoosed.pinPoint) {
          stick = new Thing(
            Math.sqrt(
              Math.pow(editorApp.choosed.pos.x - newChoosed.x, 2) +
              Math.pow(editorApp.choosed.pos.y - newChoosed.y, 2)
            )
          );
          stick.attachObject(editorApp.choosed);
          stick.pinHere(newChoosed.x, newChoosed.y);
        } else {
          stick = new Thing(
            Math.sqrt(
              Math.pow(editorApp.choosed.pos.x - newChoosed.pos.x, 2) +
              Math.pow(editorApp.choosed.pos.y - newChoosed.pos.y, 2)
            ),
            editorApp.springConstant
          );
          stick.attachObject(editorApp.choosed);
          stick.attachObject(newChoosed);
        }
        editorApp.physics.addSpring(stick);
        if (editorApp.lockRotation) {
          stick.lockRotation();
        }
      }
    }
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};
