/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import palette from '../../../src/util/colorpalette';
import Mode from '../interfaces.ts/modeInterface';

const element = document.createElement('div');

const RectangleMode: Mode = {
  name: 'Rectangle wall',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      // Return if the wall is too small
      if (Math.abs(editorApp.lastX - editorApp.mouseX) < 5
        && Math.abs(editorApp.lastY - editorApp.mouseY) < 5) return;

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
