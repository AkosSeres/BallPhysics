import Mode from '../modeInterface';

/**
 * @type {Mode}
 */
export const RectangleBodyMode: Mode = {
  name: 'Rectangle body (experimental)',
  description: '',
  drawFunc: function (editorApp, dt) {
    let ctx = editorApp.cnv.getContext('2d');

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
        0.18,
        0.1
      );
    }
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};
