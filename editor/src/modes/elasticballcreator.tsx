/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Ball, SoftBall, Vec2 } from '../../../src/physics';
import elementCreator from '../elementCreator';
import '../components/range-slider';
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
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
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
        const sb = new SoftBall(
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
};

element.append(
  <range-slider
    min={5}
    max={60}
    step={1}
    value={size}
    onChange={(nS: number) => { size = nS; }}
  >
    Size
  </range-slider>,
  <range-slider
    min={500000}
    max={3000000}
    step={4000}
    value={pressure}
    onChange={(nP: number) => { pressure = nP; }}
  >
    Pressure
  </range-slider>,
  <range-slider
    min={0}
    max={2}
    step={0.1}
    value={fc}
    onChange={(nFc: number) => { fc = nFc; }}
  >
    Coefficient of friction
  </range-slider>,
  <range-slider
    min={6}
    max={24}
    step={1}
    value={resolution}
    onChange={(nR: number) => { resolution = nR; }}
  >
    Resolution
  </range-slider>,
);

export default ElasticBallCreatorMode;
