/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

let pmouseX = 0;
let pmouseY = 0;

const element = document.createElement('div');

export const MoveMode: Mode = {
  name: 'Move',
  description: '',
  element,
  drawFunc: function (editorApp, dt) {
    if (editorApp.choosed && !editorApp.choosed.pinPoint) {
      editorApp.choosed.move(
        editorApp.mouseX - editorApp.choosed.pos.x,
        editorApp.mouseY - editorApp.choosed.pos.y);
      if (dt === 0) {
        editorApp.choosed.vel.x = 0;
        editorApp.choosed.vel.y = 0;
      } else {
        editorApp.choosed.vel.x = (editorApp.mouseX - pmouseX) / dt;
        editorApp.choosed.vel.y = (editorApp.mouseY - pmouseY) / dt;
      }
      editorApp.choosed.ang = 0;
    }

    pmouseX = editorApp.mouseX;
    pmouseY = editorApp.mouseY;
  },
  startInteractionFunc: function (editorApp) { },
  endInteractionFunc: function (editorApp) { },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};

[
  Creator.createModeTitle(MoveMode.name),
].forEach(element.appendChild.bind(element));