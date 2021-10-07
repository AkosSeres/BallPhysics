/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import palette from '../../../src/util/colorpalette';
import Mode from '../interfaces/modeInterface';

const element = document.createElement('div');

const RectangleMode: Mode = {
  name: 'Rectangle wall',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
      const w = Math.abs(editorApp.mouseX - editorApp.lastX);
      const h = Math.abs(editorApp.mouseY - editorApp.lastY);
      // Draw in red if the rectangle is too small
      if ((w / h) > 50 || (h / w) > 50 || h < 15 || w < 15) {
        ctx.strokeStyle = 'red';
      } else {
        ctx.strokeStyle = 'black';
      }
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const w = Math.abs(editorApp.mouseX - editorApp.lastX);
      const h = Math.abs(editorApp.mouseY - editorApp.lastY);
      // Do not create if the rectange is too small
      if ((w / h) > 50 || (h / w) > 50 || h < 15 || w < 15) return;

      editorApp.physics.addRectWall(
        editorApp.lastX / 2 + editorApp.mouseX / 2,
        editorApp.lastY / 2 + editorApp.mouseY / 2,
        2 * Math.abs(editorApp.lastX / 2 - editorApp.mouseX / 2),
        2 * Math.abs(editorApp.lastY / 2 - editorApp.mouseY / 2),
      );
      const editor = editorApp;
      editor.physics.bodies[editor.physics.bodies.length - 1].style = palette.Beige;
    }
  },
};

export default RectangleMode;
