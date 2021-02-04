/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../interfaces.ts/modeInterface';
import elementCreator from '../components/elementCreator';
import '../components/range-slider';
import { defaultBodyColor } from '../../../src/util/colorpalette';

let k = 0.2;
let fc = 0.5;
let color = defaultBodyColor;
const element = document.createElement('div');

const RectangleBodyMode: Mode = {
  name: 'Rectangle body',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      ctx.strokeStyle = 'black';
      ctx.strokeRect(editorApp.mouseX, editorApp.mouseY,
        editorApp.lastX - editorApp.mouseX, editorApp.lastY - editorApp.mouseY);
    }
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      const w = Math.abs(editorApp.mouseX - editorApp.lastX);
      const h = Math.abs(editorApp.mouseY - editorApp.lastY);
      if (w / h > 50 || h / w > 50 || h === 0 || w === 0) return;
      editorApp.physics.addRectBody(
        editorApp.lastX / 2 + editorApp.mouseX / 2,
        editorApp.lastY / 2 + editorApp.mouseY / 2,
        2 * Math.abs(editorApp.lastX / 2 - editorApp.mouseX / 2),
        2 * Math.abs(editorApp.lastY / 2 - editorApp.mouseY / 2),
        fc, k, color,
      );
    }
  },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

element.append(
  <range-slider min={0} max={0.6} step={0.02} value={k} onChange={(newK: number) => { k = newK; }}>
    Bounciness
  </range-slider>,
  <range-slider min={0} max={2} step={0.1} value={fc} onChange={(newFc: number) => { fc = newFc; }}>
    Coefficient of friction
  </range-slider>,
  <color-picker value={color} onChange={(newColor: string) => { color = newColor; }}>
    Color:
  </color-picker>,
);

export default RectangleBodyMode;
