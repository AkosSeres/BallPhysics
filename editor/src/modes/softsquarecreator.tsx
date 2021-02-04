/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../interfaces.ts/modeInterface';
import { Body, Vec2 } from '../../../src/physics';
import elementCreator from '../components/elementCreator';
import '../components/range-slider';

let size = 35;
const k = 0.5;
let fc = 1.5;
let resolution = 24;
let pressure = 1;
const element = document.createElement('div');

const SoftSquareCreatorMode: Mode = {
  name: 'Soft square',
  description: '',
  element,
  drawFunc(editorApp, dt: number): void {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.strokeStyle = 'black';

    if (editorApp.mouseDown) {
      ctx.strokeRect(editorApp.lastX - size, editorApp.lastY - size, size * 2, size * 2);
    } else {
      ctx.strokeRect(editorApp.mouseX - size, editorApp.mouseY - size, size * 2, size * 2);
    }

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
      editorApp.physics.addSoftSquare(new Vec2(editorApp.lastX, editorApp.lastY),
        size * 2, fc, new Vec2(editorApp.lastX - editorApp.mouseX,
          editorApp.lastY - editorApp.mouseY), resolution, pressure);
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
