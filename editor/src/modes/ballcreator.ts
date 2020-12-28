import Mode from '../modeInterface';
import Editor from '../editor';
import BallPhysics from '../../../src/physics';

export const BallCreatorMode: Mode = {
  name: 'Ball creator',
  description: '',
  drawFunc: function (editorApp: Editor, dt: number) {
    const ctx: CanvasRenderingContext2D = editorApp.cnv.getContext('2d');
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      editorApp.defaultSize, 0, 2 * Math.PI);
    ctx.stroke();

    if (editorApp.lastX != 0 && editorApp.lastY != 0) {
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc: function (editorApp) { },
  endInteractionFunc: function (editorApp) {
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
        editorApp.physics.addBall(newBall);
      } else {
        newBall.vel.x = 0;
        newBall.vel.y = 0;
        editorApp.physics.addBall(newBall);
      }
    }
  },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};
