/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../interfaces/modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../interfaces/editorInterface';
import elementCreator from '../components/elementCreator';
import '../components/range-slider';
import '../components/color-picker';
import { defaultBodyColor } from '../../../src/util/colorpalette';

let size = 45;
let k = 0.2;
let fc = 1.5;
let color = defaultBodyColor;
const element = document.createElement('div');

/**
 * Generates the shape shape.
 *
 * @param {Vec2} offset The offset for the center of the shape
 * @returns {Vec2[]} The generated shape
 */
function generateTriangle(offset: Vec2) {
  let os = offset;
  if (offset === undefined) os = new Vec2(0, 0);
  return Shape.Polygon([...new Array(3).keys()].map((n) => {
    const angle = (2 * Math.PI * n) / 3;
    const v = Vec2.fromAngle(angle);
    v.rotate(-(Math.PI * 7) / 6);
    v.mult(size);
    v.add(os);
    return v;
  }));
}

/**
 * This mode is for placing down balls in the world
 */
const TriangleCreatorMode: Mode = {
  name: 'Triangle',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, _dt: number) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.strokeStyle = 'black';
    const mouse = new Vec2(editorApp.mouseX, editorApp.mouseY);

    if (editorApp.mouseDown) {
      mouse.x = editorApp.lastX;
      mouse.y = editorApp.lastY;
      ctx.beginPath();
      generateTriangle(mouse).points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.beginPath();
      generateTriangle(mouse).points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();
    }

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
      const mouse = new Vec2(editorApp.lastX, editorApp.lastY);
      const newBall = new Body(
        generateTriangle(mouse), 1, k, fc,
      );
      newBall.vel = new Vec2(editorApp.lastX - editorApp.mouseX,
        editorApp.lastY - editorApp.mouseY);
      newBall.style = color;
      if (
        Number.isFinite(newBall.pos.x)
        && Number.isFinite(newBall.pos.y)
        && Number.isFinite(newBall.vel.x)
        && Number.isFinite(newBall.vel.y)
      ) {
        editorApp.physics.addBody(newBall);
      } else {
        newBall.vel.x = 0;
        newBall.vel.y = 0;
        editorApp.physics.addBody(newBall);
      }
    }
  },
};

element.append(
  <range-slider min={5} max={120} step={1} value={size} onChange={(nS:number) => { size = nS; }}>
    Size
  </range-slider>,
  <range-slider min={0} max={0.35} step={0.02} value={k} onChange={(newK: number) => { k = newK; }}>
    Bounciness
  </range-slider>,
  <range-slider min={0} max={2} step={0.1} value={fc} onChange={(newFc: number) => { fc = newFc; }}>
    Coefficient of friction
  </range-slider>,
  <color-picker value={color} onChange={(newColor: string) => { color = newColor; }}>
    Color:
  </color-picker>,
);

export default TriangleCreatorMode;
