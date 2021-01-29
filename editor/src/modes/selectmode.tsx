/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';

const element = document.createElement('div');

/**
 * This mode is for placing down balls in the world
 */
const SelectMode: Mode = {
  name: 'Select',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, _dt: number) {
    const atCoord = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.setLineDash([3, 5]);
    ctx.lineWidth = 4;

    if (typeof atCoord !== 'boolean') {
      if (atCoord.shape.r !== 0) {
        // The chosen body is a circle
        ctx.beginPath();
        ctx.arc(atCoord.pos.x, atCoord.pos.y, atCoord.shape.r, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // The body is a polygon
        ctx.beginPath();
        ctx.moveTo(atCoord.shape.points[0].x, atCoord.shape.points[0].y);
        for (let i = 1; i < atCoord.shape.points.length; i += 1) {
          ctx.lineTo(atCoord.shape.points[i].x, atCoord.shape.points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  startInteractionFunc(editorApp) { },
  endInteractionFunc(editorApp) {
  },
};

element.append(

);

export default SelectMode;
