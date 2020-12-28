import Mode from '../modeInterface';
import BallPhysics from '../../../src/physics';

/**
 * @type {Mode}
 */
export const SoftSquareCreatorMode = {
  name: 'Soft square creator',
  description: '',
  drawFunc: function(editorApp, dt) {
    let ctx = editorApp.cnv.getContext('2d');
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(editorApp.mouseX - editorApp.defaultSize,
      editorApp.mouseY - editorApp.defaultSize);
    ctx.lineTo(editorApp.mouseX + editorApp.defaultSize,
      editorApp.mouseY - editorApp.defaultSize);
    ctx.lineTo(editorApp.mouseX + editorApp.defaultSize,
      editorApp.mouseY + editorApp.defaultSize);
    ctx.lineTo(editorApp.mouseX - editorApp.defaultSize,
      editorApp.mouseY + editorApp.defaultSize);
    ctx.lineTo(editorApp.mouseX - editorApp.defaultSize,
      editorApp.mouseY - editorApp.defaultSize);
    ctx.stroke();

    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc: function(editorApp) { },
  endInteractionFunc: function(editorApp) {
    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      const newBall = new BallPhysics.Ball(
        new BallPhysics.Vec2(editorApp.lastX, editorApp.lastY),
        new BallPhysics.Vec2(editorApp.lastX - editorApp.mouseX,
          editorApp.lastY - editorApp.mouseY),
        editorApp.defaultSize,
        editorApp.k,
        0,
        editorApp.fc
      );
      if (
        isFinite(newBall.pos.x) &&
        isFinite(newBall.pos.y) &&
        isFinite(newBall.vel.x) &&
        isFinite(newBall.vel.y)
      ) {
        editorApp.physics.addSoftSquare(newBall.pos,
          editorApp.defaultSize * 2, editorApp.fc, newBall.vel);
      }
    }
  },
  keyGotUpFunc: function(editorApp) { },
  keyGotDownFunc: function(editorApp) { },
};
