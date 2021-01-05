/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

let k = 0.2;
let fc = 0.5;
const element = document.createElement('div');

const RectangleBodyMode: Mode = {
  name: 'Rectangle body',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = <CanvasRenderingContext2D>editorApp.cnv.getContext('2d');

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      ctx.strokeStyle = 'black';
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const w = Math.abs(editorApp.mouseX - editorApp.lastX);
      const h = Math.abs(editorApp.mouseY - editorApp.lastY);
      if (w / h > 50 || h / w > 50 || h === 0 || w === 0) return;
      editorApp.physics.addRectBody(
        editorApp.lastX / 2 + editorApp.mouseX / 2,
        editorApp.lastY / 2 + editorApp.mouseY / 2,
        2 * Math.abs(editorApp.lastX / 2 - editorApp.mouseX / 2),
        2 * Math.abs(editorApp.lastY / 2 - editorApp.mouseY / 2),
        fc, k,
      );
    }
  },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createModeTitle(RectangleBodyMode.name),
  Creator.createSlider('Bounciness', 0, 0.6, k, (event) => {
    k = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.02),
  Creator.createSlider('Coefficient of friction', 0, 2, fc, (event) => {
    fc = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.1),
].forEach(element.appendChild.bind(element));

export default RectangleBodyMode;