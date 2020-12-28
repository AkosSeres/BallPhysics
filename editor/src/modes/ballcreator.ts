/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import Editor from '../editor';
import BallPhysics from '../../../src/physics';
import * as Creator from '../elementCreator';

let size = 35;
let k = 0.5;
let fc = 1.5;
const element = document.createElement('div');

/**
 * This mode is for placing down balls in the world
 */
export const BallCreatorMode: Mode = {
  name: 'Ball creator',
  description: '',
  element,
  drawFunc: function (editorApp: Editor, dt: number) {
    const ctx: CanvasRenderingContext2D = editorApp.cnv.getContext('2d');
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      size, 0, 2 * Math.PI);
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
        size, k, 0, fc);
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

[
  Creator.createModeTitle(BallCreatorMode.name),
  Creator.createSlider('Size', 5, 120, size, (event) => {
    size = (<HTMLInputElement>event.target).valueAsNumber;
  }),
  Creator.createSlider('Bounciness', 0, 1, k, (event) => {
    k = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.02),
  Creator.createSlider('Coefficient of friction', 0, 2, fc, (event) => {
    fc = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.1),
].forEach(element.appendChild.bind(element));