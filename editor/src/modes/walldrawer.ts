/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

let size = 20;
const element = document.createElement('div');

export const WallDrawerMode: Mode = {
  name: 'Wall drawer',
  description: '',
  element,
  drawFunc: function (editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d');

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      size, 0, 2 * Math.PI);
    ctx.stroke();
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      editorApp.physics.addFixedBall(editorApp.mouseX,
        editorApp.mouseY,
        size);
    }
  },
  startInteractionFunc: function (editorApp) {
  },
  endInteractionFunc: function (editorApp) {
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};

[
  Creator.createModeTitle(WallDrawerMode.name),
  Creator.createSlider('Size', 5, 70, size, (event) => {
    size = (<HTMLInputElement>event.target).valueAsNumber;
  }),
].forEach(element.appendChild.bind(element));