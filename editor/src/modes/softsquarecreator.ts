/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Ball, Vec2 } from '../../../src/physics';
import * as Creator from '../elementCreator';

let size = 35;
const k = 0.5;
let fc = 1.5;
let resolution = 24;
let pressure = 1;
const element = document.createElement('div');

const SoftSquareCreatorMode: Mode = {
  name: 'Soft square creator',
  description: '',
  element,
  drawFunc(editorApp, dt: number): void {
    const ctx = <CanvasRenderingContext2D>editorApp.cnv.getContext('2d');
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(editorApp.mouseX - size,
      editorApp.mouseY - size);
    ctx.lineTo(editorApp.mouseX + size,
      editorApp.mouseY - size);
    ctx.lineTo(editorApp.mouseX + size,
      editorApp.mouseY + size);
    ctx.lineTo(editorApp.mouseX - size,
      editorApp.mouseY + size);
    ctx.lineTo(editorApp.mouseX - size,
      editorApp.mouseY - size);
    ctx.stroke();

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc(editorApp): void { },
  endInteractionFunc(editorApp): void {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const newBall = new Ball(
        new Vec2(editorApp.lastX, editorApp.lastY),
        new Vec2(editorApp.lastX - editorApp.mouseX,
          editorApp.lastY - editorApp.mouseY), size, k, 0, fc,
      );
      if (
        Number.isFinite(newBall.pos.x)
        && Number.isFinite(newBall.pos.y)
        && Number.isFinite(newBall.vel.x)
        && Number.isFinite(newBall.vel.y)
      ) {
        editorApp.physics.addSoftSquare(newBall.pos,
          size * 2, fc, newBall.vel, resolution, pressure);
      }
    }
  },
  keyGotUpFunc(editorApp): void { },
  keyGotDownFunc(editorApp): void { },
};

[
  Creator.createModeTitle(SoftSquareCreatorMode.name),
  Creator.createSlider('Size', 5, 100, size, (event) => {
    size = (<HTMLInputElement>event.target).valueAsNumber;
  }),
  Creator.createSlider('Pressure', 0.4, 7, pressure, (event) => {
    pressure = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.1),
  Creator.createSlider('Coefficient of friction', 0, 2, fc, (event) => {
    fc = (<HTMLInputElement>event.target).valueAsNumber;
  }, 0.1),
  Creator.createSlider('Resolution', 16, 48, resolution, (event) => {
    resolution = (<HTMLInputElement>event.target).valueAsNumber;
  }, 8),
].forEach(element.appendChild.bind(element));

export default SoftSquareCreatorMode;
