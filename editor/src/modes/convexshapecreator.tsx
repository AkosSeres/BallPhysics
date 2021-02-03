/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';
import '../components/range-slider';
import '../components/color-picker';
import { defaultBodyColor } from '../../../src/util/colorpalette';

const size = 45;
let k = 0.2;
let fc = 1.5;
let color = defaultBodyColor;
const element = document.createElement('div');
let pointSet: Vec2[] = [];

/**
 * This mode is for placing down balls in the world
 */
const ConvexShapeCreatorMode: Mode = {
  name: 'Draw convex shape',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, _dt: number) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.strokeStyle = 'black';
    const mouse = new Vec2(editorApp.mouseX, editorApp.mouseY);

    if (editorApp.mouseDown) {
      if (!pointSet.some((p) => (p.x === mouse.x && p.y === mouse.y)))pointSet.push(mouse);

      if (pointSet.length > 3) {
        const pointsShape = Shape.Polygon(pointSet);
        pointSet = pointsShape.getConvexHull().points;
      }
    }
    ctx.beginPath();
    pointSet.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.stroke();
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (pointSet.length > 3) {
      const pointsShape = Shape.Polygon(pointSet);
      pointSet = pointsShape.getConvexHull().points;
    } else {
      pointSet = [];
      return;
    }
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const newBall = new Body(
        Shape.Polygon(pointSet), 1, k, fc,
      );
      const directions = [
        ...new Array(100).keys()].map((n) => Vec2.fromAngle((2 * Math.PI * n) / 100));
      const sizes = directions.map((d) => newBall.shape.getMinMaxInDirection(d).size());
      if ((Math.max(...sizes) / Math.min(...sizes)) > 15) {
        pointSet = [];
        return;
      }
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
    pointSet = [];
  },
};

element.append(
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

export default ConvexShapeCreatorMode;
