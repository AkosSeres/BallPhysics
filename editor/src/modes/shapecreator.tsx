/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import Vec2 from '../../../src/math/vec2';
import Body from '../../../src/entity/body';
import elementCreator from '../elementCreator';
import '../components/range-slider';
import { defaultBodyColor } from '../../../src/util/colorpalette';
import { Shape } from '../../../src/physics';

let size = 35;
let k = 0.5;
let fc = 0.5;
let roundness = 4;
let res = 24;
let color = defaultBodyColor;
const element = document.createElement('div');

/**
 * Returns an array of points resulting in a squircle with the given resolution.
 *
 * @param {number} resolution The wanted resolution
 * @param {number} p The p-norm parameter
 * @returns {Vec2[]} The points of the squircle
 */
function generateUnitSquircle(resolution = 24, p = 4) {
  return [
    ...new Array(resolution).keys(),
  ].map((i) => Vec2.fromAnglePNorm((Math.PI * 2 * i) / resolution, p));
}

const ShapeCreatorMode: Mode = {
  name: 'Squircle creator',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.strokeStyle = 'black';
    const shape = generateUnitSquircle(res, roundness);
    shape.forEach((p) => p.mult(size));

    ctx.beginPath();
    ctx.moveTo(editorApp.mouseX + shape[0].x, editorApp.mouseY + shape[0].y);
    for (let i = 1; i < shape.length; i += 1) {
      ctx.lineTo(editorApp.mouseX + shape[i].x, editorApp.mouseY + shape[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    if (editorApp.mouseDown) {
      ctx.beginPath();
      ctx.moveTo(editorApp.mouseX, editorApp.mouseY);
      ctx.lineTo(editorApp.lastX, editorApp.lastY);
      ctx.stroke();
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    const shape = generateUnitSquircle(res, roundness);
    const mouseVec = new Vec2(editorApp.lastX, editorApp.lastY);
    shape.forEach((p) => { p.mult(size); p.add(mouseVec); });

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const newBody = new Body(Shape.Polygon(shape), 1, k, fc);
      newBody.vel = new Vec2(editorApp.lastX - editorApp.mouseX,
        editorApp.lastY - editorApp.mouseY);
      newBody.style = color;
      editorApp.physics.addBody(newBody);
    }
  },
};

element.append(
  <range-slider
    min={5}
    max={120}
    step={1}
    value={size}
    onChange={(newSize: number) => { size = newSize; }}
  >
    Size
  </range-slider>,
  <range-slider
    min={2}
    max={7}
    step={1}
    value={9 - roundness}
    onChange={(newRoun: number) => { roundness = 9 - newRoun; }}
  >
    Roundness
  </range-slider>,
  <range-slider
    min={12}
    max={36}
    step={1}
    value={res}
    onChange={(newRes: number) => { res = newRes; }}
  >
    Resolution
  </range-slider>,
  <range-slider min={0} max={0.9} step={0.02} value={k} onChange={(newK: number) => { k = newK; }}>
    Bounciness
  </range-slider>,
  <range-slider min={0} max={2} step={0.1} value={fc} onChange={(newFc: number) => { fc = newFc; }}>
    Coefficient of friction
  </range-slider>,
  <color-picker value={color} onChange={(newColor: string) => { color = newColor; }}>
    Color:
  </color-picker>,
);

export default ShapeCreatorMode;
