/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import { Body, Shape, Vec2 } from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';
import '../components/color-picker';
import '../components/range-slider-number';
import '../components/checkbox';
import '../components/number-display';
import '../components/angle-display';
import palette from '../../../src/util/colorpalette';

/** @type {Body | boolean} */
let selection: Body | boolean = false;
const element = document.createElement('div');
/** @type {Function} */
let updateFunc: Function;

let startedInside = false;

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

      // Move when dragged
      if (editorApp.mouseDown && editorApp.cnv.style.cursor === 'move' && !startedInside) {
        selection.move(new Vec2(editorApp.mouseX - editorApp.oldMouseX,
          editorApp.mouseY - editorApp.oldMouseY));
      }

      // Draw mover box if fixed
      if (selection.m === 0 || editorApp.timeMultiplier === 0) {
        ctx.fillStyle = palette.blue;
        ctx.beginPath();
        ctx.arc(selection.boundingBox.x.min, selection.boundingBox.y.min, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(selection.boundingBox.x.min, selection.boundingBox.y.max, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(selection.boundingBox.x.max, selection.boundingBox.y.min, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(selection.boundingBox.x.max, selection.boundingBox.y.max, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = palette['Roman Silver'];
        ctx.setLineDash([5, 3.5]);
        ctx.strokeRect(selection.boundingBox.x.min, selection.boundingBox.y.min,
          selection.boundingBox.x.max - selection.boundingBox.x.min,
          selection.boundingBox.y.max - selection.boundingBox.y.min);

        if (editorApp.mouseX >= selection.boundingBox.x.min
          && editorApp.mouseX <= selection.boundingBox.x.max
        && editorApp.mouseY >= selection.boundingBox.y.min
        && editorApp.mouseY <= selection.boundingBox.y.max) {
          const cnvStyle = editorApp.cnv.style;
          if (cnvStyle.cursor !== 'move')cnvStyle.cursor = 'move';
        } else {
          const cnvStyle = editorApp.cnv.style;
          if (cnvStyle.cursor !== 'default')cnvStyle.cursor = 'default';
        }
      }
    } else {
      const cnvStyle = editorApp.cnv.style;
      if (cnvStyle.cursor !== 'default')cnvStyle.cursor = 'default';
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

    updateFunc?.();
  },
  startInteractionFunc(editorApp) {
    element.innerHTML = '';
    const newSel = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
    if (typeof newSel !== 'boolean' && newSel !== selection) {
      startedInside = true;
    }
    selection = newSel;
    if (selection instanceof Body) {
      const densitySlider = (
        <range-slider-number
          min={0.1}
          max={25}
          step={0.05}
          value={Number.parseFloat(selection.density.toFixed(2))}
          onChange={(newDens: number) => {
            if (selection instanceof Body)selection.density = newDens;
            updateFunc?.();
          }}
        >
          Density
        </range-slider-number>
      );
      if (selection.m === 0)densitySlider.disable();
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
              updateFunc?.();
            }
          }}
        >
          Fixed down
        </check-box>
      );
      const typeDisplay = (
        <number-display value={(selection.shape.r !== 0 ? 'circle' : 'polygon')}>
          Type:&nbsp;
        </number-display>
      );
      const massDisplay = (
        <number-display value={selection.m.toFixed(2)}>
          Mass:&nbsp;
        </number-display>
      );
      const xDisplay = (
        <number-display value={selection.pos.x.toFixed(2)}>
          X coord:&nbsp;
        </number-display>
      );
      const yDisplay = (
        <number-display value={selection.pos.y.toFixed(2)}>
          Y coord:&nbsp;
        </number-display>
      );
      const rotationDisplay = (
        <angle-display value={selection.rotation.toFixed(2)}>
          Rotation:&nbsp;
        </angle-display>
      );

      // Set update function for calling later
      updateFunc = () => {
        if (!(selection instanceof Body)) return;
        if (xDisplay.value != selection.pos.x)xDisplay.value = selection.pos.x.toFixed(2);
        if (yDisplay.value != selection.pos.y)yDisplay.value = selection.pos.y.toFixed(2);
        if (massDisplay.value != selection.m)massDisplay.value = selection.m.toFixed(2);
        rotationDisplay.value = selection.rotation.toFixed(2);
      };

      element.append(
        typeDisplay,
        massDisplay,
        rotationDisplay,
        xDisplay,
        yDisplay,
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
    } else {
      updateFunc = () => {};
    }
  },
  endInteractionFunc(editorApp) {
    startedInside = false;
  },
  deactivated() {
    selection = false;
    updateFunc = () => {};
    element.innerHTML = '';
  },
};

export default SelectMode;
