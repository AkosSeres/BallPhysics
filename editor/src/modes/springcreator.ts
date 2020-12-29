/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import BallPhysics from '../../../src/physics';
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
      const Thing = BallPhysics.Spring;
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
      } if (editorApp.choosed.pinPoint && newChoosed.pinPoint) return;
      if (editorApp.choosed.pinPoint) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.y - newChoosed.pos.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(newChoosed);
        stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
      } else if (newChoosed.pinPoint) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(editorApp.choosed);
        stick.pinHere(newChoosed.x, newChoosed.y);
      } else {
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
  Creator.createModeTitle(SpringCreatorMode.name),
  Creator.createCheckbox('Rotation locked', lockRotation, (event) => {
    lockRotation = (<HTMLInputElement>event.target).checked;
  }),
  Creator.createSlider('Spring stiffness', 2000, 100000, springConstant, (event) => {
    springConstant = (<HTMLInputElement>event.target).valueAsNumber;
  }, 50),
].forEach(element.appendChild.bind(element));

export default SpringCreatorMode;
