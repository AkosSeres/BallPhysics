/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import BallPhysics from '../../../src/physics';
import * as Creator from '../elementCreator';

let lockRotation = false;
let springConstant = 5000;
const element = document.createElement('div');

export const SpringCreatorMode: Mode = {
  name: 'Spring creator',
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
  startInteractionFunc: function (editorApp) { },
  endInteractionFunc: function (editorApp) {
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      mode3: {
        let newChoosed = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
        let stick;
        const Thing = BallPhysics.Spring;
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
            ),
            springConstant
          );
          stick.attachObject(newChoosed);
          stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
        } else if (newChoosed.pinPoint) {
          stick = new Thing(
            Math.sqrt(
              Math.pow(editorApp.choosed.pos.x - newChoosed.x, 2) +
              Math.pow(editorApp.choosed.pos.y - newChoosed.y, 2)
            ),
            springConstant
          );
          stick.attachObject(editorApp.choosed);
          stick.pinHere(newChoosed.x, newChoosed.y);
        } else {
          stick = new Thing(
            Math.sqrt(
              Math.pow(editorApp.choosed.pos.x - newChoosed.pos.x, 2) +
              Math.pow(editorApp.choosed.pos.y - newChoosed.pos.y, 2)
            ),
            springConstant
          );
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
  Creator.createModeTitle(SpringCreatorMode.name),
  Creator.createCheckbox('Rotation locked', lockRotation, (event) => {
    lockRotation = (<HTMLInputElement>event.target).checked;
  }),
  Creator.createSlider('Spring stiffness', 1000, 50000, springConstant, (event) => {
    springConstant = (<HTMLInputElement>event.target).valueAsNumber;
  }, 50),
].forEach(element.appendChild.bind(element));