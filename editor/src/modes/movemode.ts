/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

let pmouseX = 0;
let pmouseY = 0;

const element = document.createElement('div');

const MoveMode: Mode = {
  name: 'Move',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const { choosed } = editorApp;
    if (choosed && !choosed.pinPoint) {
      choosed.move(
        editorApp.mouseX - choosed.pos.x,
        editorApp.mouseY - choosed.pos.y,
      );
      if (dt === 0) {
        choosed.vel.x = 0;
        choosed.vel.y = 0;
      } else {
        choosed.vel.x = (editorApp.mouseX - pmouseX) / dt;
        choosed.vel.y = (editorApp.mouseY - pmouseY) / dt;
      }
      choosed.ang = 0;
    }
    pmouseX = editorApp.mouseX;
    pmouseY = editorApp.mouseY;
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) { },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createModeTitle(MoveMode.name),
].forEach(element.appendChild.bind(element));

export default MoveMode;
