/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Stick } from '../../../src/physics';
import elementCreator from '../elementCreator';
import '../components/checkbox';

let lockRotation = false;

const element = document.createElement('div');

const StickCreatorMode: Mode = {
  name: 'Stick creator',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;

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
      /** @type {Body | boolean | PinPoint} */
      let newChoosed = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
      let stick;
      const Thing = Stick;
      if (typeof newChoosed === 'boolean') {
        newChoosed = {
          x: editorApp.mouseX,
          y: editorApp.mouseY,
          pinPoint: true,
        };
      }

      if (typeof editorApp.choosed === 'boolean'
        || editorApp.choosed === newChoosed
        || (editorApp.choosed === undefined && newChoosed === undefined)
      ) {
        return;
      } if ('pinPoint' in editorApp.choosed && 'pinPoint' in newChoosed) return;
      if ('pinPoint' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.y - newChoosed.pos.y) ** 2),
          ),
        );
        stick.attachObject(newChoosed);
        stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
      } else if ('pinPoint' in newChoosed && 'pos' in editorApp.choosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.y) ** 2),
          ),
        );
        stick.attachObject(editorApp.choosed);
        stick.pinHere(newChoosed.x, newChoosed.y);
      } else if ('pos' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.pos.y) ** 2),
          ),
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
  <check-box checked={lockRotation} onChange={(newBool: boolean) => { lockRotation = newBool; }}>
    Lock rotation
  </check-box>,
].forEach(element.appendChild.bind(element));

export default StickCreatorMode;
