/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

let size = 20;
const element = document.createElement('div');

const WallDrawerMode: Mode = {
  name: 'Wall drawer',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = <CanvasRenderingContext2D>editorApp.cnv.getContext('2d');

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      size, 0, 2 * Math.PI);
    ctx.stroke();
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      editorApp.physics.addFixedBall(editorApp.mouseX,
        editorApp.mouseY,
        size);
    }
  },
  startInteractionFunc(editorApp) {
  },
  endInteractionFunc(editorApp) {
  },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createSlider('Size', 5, 70, size, (newSize) => {
    size = newSize;
  }),
].forEach(element.appendChild.bind(element));

export default WallDrawerMode;
