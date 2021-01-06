/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Spring } from '../../../src/physics';
import * as Creator from '../elementCreator';

let lockRotation = false;
let springConstant = 10000;
const element = document.createElement('div');

const SpringCreatorMode: Mode = {
  name: 'Spring creator',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = <CanvasRenderingContext2D>editorApp.cnv.getContext('2d');

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      let newChoosed = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
      let stick;
      const Thing = Spring;
      if (!newChoosed) {
        newChoosed = {
          x: editorApp.mouseX,
          y: editorApp.mouseY,
          pinPoint: true,
        };
      }

      if (
        editorApp.choosed === newChoosed
        || (editorApp.choosed === undefined && newChoosed === undefined)
      ) {
        return;
      } if (editorApp.choosed instanceof Object && newChoosed instanceof Object
        && 'pinPoint' in editorApp.choosed && 'pinPoint' in newChoosed) return;
      if (editorApp.choosed instanceof Object && newChoosed instanceof Object
        && 'pinPoint' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.y - newChoosed.pos.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(newChoosed);
        stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
      } else if (newChoosed instanceof Object && editorApp.choosed instanceof Object
         && 'pos' in editorApp.choosed && 'pinPoint' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(editorApp.choosed);
        stick.pinHere(newChoosed.x, newChoosed.y);
      } else if (editorApp.choosed instanceof Object && newChoosed instanceof Object
        && 'pos' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.pos.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(editorApp.choosed);
        stick.attachObject(newChoosed);
      }
      if (typeof stick === 'undefined') return;
      editorApp.physics.addSpring(stick);
      if (lockRotation) {
        stick.lockRotation();
      }
    }
  },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createCheckbox('Rotation lock', lockRotation, (newBool) => {
    lockRotation = newBool;
  }),
  Creator.createSlider('Spring stiffness', 2000, 100000, springConstant, (newConst) => {
    springConstant = newConst;
  }, 200),
].forEach(element.appendChild.bind(element));

export default SpringCreatorMode;
