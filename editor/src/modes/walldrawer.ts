import Mode from '../modeInterface';

/**
 * @type {Mode}
 */
export const WallDrawerMode = {
  name: 'Wall drawer',
  description: '',
  drawFunc: function (editorApp, dt) {
    let ctx = editorApp.cnv.getContext('2d');

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      editorApp.defaultSize, 0, 2 * Math.PI);
    ctx.stroke();
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      editorApp.physics.addFixedBall(editorApp.mouseX,
        editorApp.mouseY,
        editorApp.defaultSize);
    }
  },
  startInteractionFunc: function (editorApp) {
  },
  endInteractionFunc: function (editorApp) {
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};
