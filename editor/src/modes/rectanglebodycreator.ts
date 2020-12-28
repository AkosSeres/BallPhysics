/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';
import {RectangleMode} from './rectangle';

let k = 0.2;
let fc = 0.5;
const element = document.createElement('div');

export const RectangleBodyMode: Mode = {
  name: 'Rectangle body (experimental)',
  description: '',
  element,
  drawFunc: function (editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d');

    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      ctx.strokeStyle = 'black';
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc: function (editorApp) { },
  endInteractionFunc: function (editorApp) {
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      editorApp.physics.addRectBody(
        editorApp.lastX / 2 + editorApp.mouseX / 2,
        editorApp.lastY / 2 + editorApp.mouseY / 2,
        2 * Math.abs(editorApp.lastX / 2 - editorApp.mouseX / 2),
        2 * Math.abs(editorApp.lastY / 2 - editorApp.mouseY / 2),
        fc, k);
    }
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};

[
  Creator.createModeTitle(RectangleBodyMode.name),
  Creator.createSlider('Bounciness', 0.07, 0.3, k, (event) => {
    k = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.02),
  Creator.createSlider('Coefficient of friction', 0, 0.6, fc, (event) => {
    fc = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.1),
].forEach(element.appendChild.bind(element));
