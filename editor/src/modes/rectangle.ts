/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

const element = document.createElement('div');

const RectangleMode: Mode = {
  name: 'Rectangle wall',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const ctx = <CanvasRenderingContext2D>editorApp.cnv.getContext('2d');
      ctx.strokeStyle = 'black';
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      editorApp.physics.addRectWall(
        editorApp.lastX / 2 + editorApp.mouseX / 2,
        editorApp.lastY / 2 + editorApp.mouseY / 2,
        2 * Math.abs(editorApp.lastX / 2 - editorApp.mouseX / 2),
        2 * Math.abs(editorApp.lastY / 2 - editorApp.mouseY / 2),
      );
    }
  },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createModeTitle(RectangleMode.name),
].forEach(element.appendChild.bind(element));

export default RectangleMode;
