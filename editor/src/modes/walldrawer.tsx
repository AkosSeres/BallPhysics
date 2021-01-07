/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import elementCreator from '../elementCreator';
import '../components/range-slider';

let size = 20;
const element = document.createElement('div');

const WallDrawerMode: Mode = {
  name: 'Wall drawer',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(editorApp.mouseX, editorApp.mouseY,
      size, 0, 2 * Math.PI);
    ctx.stroke();
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      editorApp.physics.addFixedBall(editorApp.mouseX,
        editorApp.mouseY,
        size);
    }
  },
};

element.append(
  <range-slider min={5} max={70} step={1} value={size} onChange={(nS:number) => { size = nS; }}>
    Size
  </range-slider>,
);

export default WallDrawerMode;
