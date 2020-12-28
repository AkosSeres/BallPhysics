/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import BallPhysics from '../../../src/physics';
import * as Creator from '../elementCreator';
import EditorInterface from '../editorInterface';

let size = 35;
const k = 0.5;
let fc = 1.5;
let resolution = 24;
let pressure = 1000000;
const element = document.createElement('div');

const ElasticBallCreatorMode: Mode = {
  name: 'Elastic ball creator',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, dt: number): void {
    const ctx = <CanvasRenderingContext2D>editorApp.cnv.getContext('2d');
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY, size, 0, 2 * Math.PI);
    ctx.stroke();

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const newBall = new BallPhysics.Ball(
        new BallPhysics.Vec2(editorApp.lastX, editorApp.lastY),
        new BallPhysics.Vec2(editorApp.lastX - editorApp.mouseX,
          editorApp.lastY - editorApp.mouseY), size, k, 0, fc,
      );
      if (
        Number.isFinite(newBall.pos.x)
        && Number.isFinite(newBall.pos.y)
        && Number.isFinite(newBall.vel.x)
        && Number.isFinite(newBall.vel.y)
      ) {
        const sb = new BallPhysics.SoftBall(
          newBall.pos, size, pressure, fc, resolution,
        );
        sb.points.forEach((p) => {
          const point = p;
          point.vel = newBall.vel.copy;
        });
        editorApp.physics.addSoftBall(sb);
      }
    }
  },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createModeTitle(ElasticBallCreatorMode.name),
  Creator.createSlider('Size', 5, 60, size, (event) => {
    size = (<HTMLInputElement>event.target).valueAsNumber;
  }),
  Creator.createSlider('Pressure', 500000, 3000000, pressure, (event) => {
    pressure = (<HTMLInputElement>event.target).valueAsNumber;
  }, 4000),
  Creator.createSlider('Coefficient of friction', 0, 2, fc, (event) => {
    fc = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.1),
  Creator.createSlider('Resolution', 6, 24, resolution, (event) => {
    resolution = (<HTMLInputElement>event.target).valueAsNumber;
  }, 1),
].forEach(element.appendChild.bind(element));

export default ElasticBallCreatorMode;
