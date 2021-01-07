/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Ball, Vec2 } from '../../../src/physics';
import elementCreator from '../elementCreator';
import '../components/range-slider';

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
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
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
};

element.append(
  <range-slider
    min={5}
    max={100}
    step={1}
    value={size}
    onChange={(newS: number) => { size = newS; }}
  >
    Size
  </range-slider>,
  <range-slider
    min={0.4}
    max={3}
    step={0.1}
    value={pressure}
    onChange={(newP: number) => { pressure = newP; }}
  >
    Pressure
  </range-slider>,
  <range-slider
    min={0}
    max={2}
    step={0.1}
    value={fc}
    onChange={(newFc: number) => { fc = newFc; }}
  >
    Coefficient of friction
  </range-slider>,
  <range-slider
    min={16}
    max={48}
    step={8}
    value={resolution}
    onChange={(newRes: number) => { resolution = newRes; }}
  >
    Resolution
  </range-slider>,
);

export default SoftSquareCreatorMode;
