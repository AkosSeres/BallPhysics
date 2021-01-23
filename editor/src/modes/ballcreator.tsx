/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';
import '../components/range-slider';
import '../components/color-picker';
import { defaultBallColor } from '../../../src/util/colorpalette';

let size = 35;
let k = 0.5;
let fc = 1.5;
let color = defaultBallColor;
const element = document.createElement('div');

/**
 * This mode is for placing down balls in the world
 */
const BallCreatorMode: Mode = {
  name: 'Ball creator',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, _dt: number) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      size, 0, 2 * Math.PI);
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
      const newBall = new Body(
        Shape.Circle(size, new Vec2(editorApp.lastX, editorApp.lastY)), 1, k, fc,
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
  <range-slider min={0} max={1} step={0.02} value={k} onChange={(newK: number) => { k = newK; }}>
    Bounciness
  </range-slider>,
  <range-slider min={0} max={2} step={0.1} value={fc} onChange={(newFc: number) => { fc = newFc; }}>
    Coefficient of friction
  </range-slider>,
  <color-picker value={color} onChange={(newColor: string) => { color = newColor; }}>
    Color:
  </color-picker>,
);

export default BallCreatorMode;
