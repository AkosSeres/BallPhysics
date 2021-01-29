/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';
import '../components/color-picker';
import '../components/range-slider-number';
import '../components/checkbox';

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
      const densitySlider = (
        <range-slider-number
          min={0.1}
          max={25}
          step={0.05}
          value={Number.parseFloat(selection.density.toFixed(2))}
          onChange={(newDens: number) => {
            if (selection instanceof Body)selection.density = newDens;
          }}
        >
          Density
        </range-slider-number>
      );
      const fixedCheckbox = (
        <check-box
          checked={selection.m === 0}
          onChange={(newBool: boolean) => {
            if (selection instanceof Body) {
              if (!newBool) {
                densitySlider.enable();
                selection.density = 1;
                densitySlider.value = selection.density;
              } else {
                densitySlider.disable();
                selection.density = 0;
                selection.vel = new Vec2(0, 0);
                selection.ang = 0;
                densitySlider.value = 0;
              }
            }
          }}
        >
          Fixed down
        </check-box>
      );

      element.append(
        fixedCheckbox,
        densitySlider,
        <range-slider-number
          min={0}
          max={0.98}
          step={0.02}
          value={selection.k}
          onChange={(newK: number) => { if (selection instanceof Body)selection.k = newK; }}
        >
          Bounciness
        </range-slider-number>,
        <range-slider-number
          min={0}
          max={2}
          step={0.1}
          value={selection.fc}
          onChange={(newFc: number) => { if (selection instanceof Body)selection.fc = newFc; }}
        >
          Coefficient of friction
        </range-slider-number>,
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
