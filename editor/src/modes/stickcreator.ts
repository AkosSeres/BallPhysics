/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import BallPhysics, {AnyPhysicsObject} from '../../../src/physics';
import Editor from '../editor';
import * as Creator from '../elementCreator';

let lockRotation = false;

const element = document.createElement('div');

export const StickCreatorMode: Mode = {
  name: 'Stick creator',
  description: '',
  element,
  drawFunc: function (editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d');

    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc: function (editorApp: Editor) { },
  endInteractionFunc: function (editorApp: Editor) {
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
        } else if ("pinPoint" in <AnyPhysicsObject>editorApp?.choosed && "pinPoint" in newChoosed) break mode3;
        else if ("pinPoint" in <AnyPhysicsObject>editorApp?.choosed) {
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
            ));
          stick.attachObject(editorApp.choosed);
          stick.attachObject(newChoosed);
        }
        editorApp.physics.addSpring(stick);
        if (lockRotation) {
          stick.lockRotation();
        }
      }
    }
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};

[
  Creator.createModeTitle(StickCreatorMode.name),
  Creator.createCheckbox('Rotation locked', lockRotation, (event) => {
    lockRotation = (<HTMLInputElement>event.target).checked;
  }),
].forEach(element.appendChild.bind(element));