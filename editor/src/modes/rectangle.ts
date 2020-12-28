import Mode from '../modeInterface';

/**
 * @type {Mode}
 */
export const RectangleMode = {
  name: 'Rectangle wall',
  description: '',
  drawFunc: function (editorApp, dt) {
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      const ctx = editorApp.cnv.getContext('2d');
      ctx.strokeStyle = 'black';
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc: function (editorApp) { },
  endInteractionFunc: function (editorApp) {
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      editorApp.physics.addRectWall(
        editorApp.lastX / 2 + editorApp.mouseX / 2,
        editorApp.lastY / 2 + editorApp.mouseY / 2,
        2 * Math.abs(editorApp.lastX / 2 - editorApp.mouseX / 2),
        2 * Math.abs(editorApp.lastY / 2 - editorApp.mouseY / 2)
      );
    }
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};
