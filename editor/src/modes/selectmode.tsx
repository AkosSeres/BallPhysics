/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';
import '../components/color-picker';

/** @type {Body | boolean} */
let selection: Body | boolean = false;
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
    ctx.strokeStyle = 'orange';
    ctx.setLineDash([]);
    ctx.lineWidth = 4;

    if (typeof selection !== 'boolean') {
      if (selection.shape.r !== 0) {
        // The chosen body is a circle
        ctx.beginPath();
        ctx.arc(selection.pos.x, selection.pos.y, selection.shape.r, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // The body is a polygon
        ctx.beginPath();
        ctx.moveTo(selection.shape.points[0].x, selection.shape.points[0].y);
        for (let i = 1; i < selection.shape.points.length; i += 1) {
          ctx.lineTo(selection.shape.points[i].x, selection.shape.points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'yellow';
    ctx.setLineDash([3, 5]);

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
  startInteractionFunc(editorApp) {
    element.innerHTML = '';
    selection = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
    if (selection instanceof Body) {
      element.append(
        <color-picker
          value={selection.style}
          onChange={
            (newColor: string) => { if (selection instanceof Body)selection.style = newColor; }
          }
        >
          Color:
        </color-picker>,
      );
    }
  },
  endInteractionFunc(editorApp) {
  },
};

export default SelectMode;
