import Mode from '../modeInterface';
import BallPhysics from '../../../src/physics';

/**
 * @type {Mode}
 */
export const ElasticBallCreatorMode = {
  name: 'Elastic ball creator',
  description: '',
  drawFunc: function(
    editorApp,
    dt
  ) {
    let ctx = editorApp.cnv.getContext('2d');
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY, editorApp.defaultSize, 0, 2 * Math.PI);
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
        const sb = new BallPhysics.SoftBall(
          newBall.pos,
          editorApp.defaultSize,
          1000000,
          editorApp.fc,
          24
        );
        sb.points.forEach((p) => {
          p.vel = newBall.vel.copy;
        });
        editorApp.physics.addSoftBall(sb);
      }
    }
  },
  keyGotUpFunc: function(editorApp) { },
  keyGotDownFunc: function(editorApp) { },
};
