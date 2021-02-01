/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import {
  Body, Shape, Spring, Stick, Vec2,
} from '../../../src/physics';
import EditorInterface from '../editorInterface';
import elementCreator from '../elementCreator';
import '../components/color-picker';
import '../components/range-slider-number';
import '../components/checkbox';
import '../components/number-display';
import '../components/angle-display';
import '../components/button-btn';
import palette from '../../../src/util/colorpalette';

const CORNER_RADIUS = 7;
const SIDE_RADIUS = 6.5;
const ROTATE_RADIUS = 8;
const ROTATE_DIST = 25;
const SPRING_RADIUS = 7;

/** @type {Body | boolean} */
let selection: Body | boolean = false;
let springSelection: Stick | Spring | boolean = false;
const element = document.createElement('div');
/** @type {Function} */
let updateFunc: Function;

let startingRotation = 0;
let allScaling = 1;

const currentChoosable = {
  body: true,
  spring: true,
};

/**
 *
 */
function setBaseInterface() {
  element.innerHTML = '';
  element.append(
    <number-display value="">Selectable types:</number-display>,
    <check-box
      checked={currentChoosable.body}
      onChange={(nB:boolean) => { currentChoosable.body = nB; }}
    >
      Body
    </check-box>,
    <check-box
      checked={currentChoosable.spring}
      onChange={(nB:boolean) => { currentChoosable.spring = nB; }}
    >
      Stick/Spring
    </check-box>,
  );
}

// Declare Command type
type Command = 'move' | 'rotate' | 'resize-bl' | 'resize-br' | 'resize-tl' | 'resize-tr' | 'resize-t' | 'resize-b' | 'resize-l' | 'resize-r' | 'move-spring0' | 'move-spring1' | 'none';
let currentCommand: Command = 'none';

/**
 * @param {EditorInterface} editor The interface for the editor
 * @returns {Body | boolean} The found body at the pointer's coordinates
 */
function currentChosen(editor: EditorInterface) {
  if (!currentChoosable.body) return false;
  return editor.physics.getObjectAtCoordinates(editor.mouseX, editor.mouseY, 4);
}

/**
 * @param {EditorInterface} editorApp The editor
 * @returns {Command} The command to start doing
 */
function findCommand(editorApp: EditorInterface): Command {
  if (editorApp.timeMultiplier !== 0 && !(selection instanceof Body && selection.m === 0)) return 'none';
  if (selection instanceof Body) {
    const bb = selection.boundingBox;
    const topLeft = new Vec2(bb.x.min, bb.y.min);
    const topRight = new Vec2(bb.x.max, bb.y.min);
    const bottomLeft = new Vec2(bb.x.min, bb.y.max);
    const bottomRight = new Vec2(bb.x.max, bb.y.max);
    const rotateBtn = Vec2.add(Vec2.lerp(topRight, topLeft, 0.5), new Vec2(0, -ROTATE_DIST));
    const mouse = new Vec2(editorApp.mouseX, editorApp.mouseY);
    if (Vec2.dist(rotateBtn, mouse) <= ROTATE_RADIUS) return 'rotate';
    if (Vec2.dist(bottomLeft, mouse) <= CORNER_RADIUS) return 'resize-bl';
    if (Vec2.dist(bottomRight, mouse) <= CORNER_RADIUS) return 'resize-br';
    if (Vec2.dist(topLeft, mouse) <= CORNER_RADIUS) return 'resize-tl';
    if (Vec2.dist(topRight, mouse) <= CORNER_RADIUS) return 'resize-tr';
    if (Vec2.dist(Vec2.lerp(topRight, topLeft, 0.5), mouse) <= SIDE_RADIUS) return 'resize-t';
    if (Vec2.dist(Vec2.lerp(bottomRight, bottomLeft, 0.5), mouse) <= SIDE_RADIUS) return 'resize-b';
    if (Vec2.dist(Vec2.lerp(topLeft, bottomLeft, 0.5), mouse) <= SIDE_RADIUS) return 'resize-l';
    if (Vec2.dist(Vec2.lerp(topRight, bottomRight, 0.5), mouse) <= SIDE_RADIUS) return 'resize-r';
    if (mouse.x >= topLeft.x && mouse.y >= topLeft.y
      && mouse.x <= bottomRight.x && mouse.y <= bottomRight.y) return 'move';
  } else if (typeof springSelection !== 'boolean') {
    const ps = springSelection.points;
    const mouse = new Vec2(editorApp.mouseX, editorApp.mouseY);
    if (ps[0].dist(mouse) <= SPRING_RADIUS) return 'move-spring0';
    if (ps[1].dist(mouse) <= SPRING_RADIUS) return 'move-spring1';
  } return 'none';
}

/**
 * @param {Command} command The command to start
 */
function startCommand(command:Command) {
  if (!(selection instanceof Body)) return;
  const bb = selection.boundingBox;
  const topLeft = new Vec2(bb.x.min, bb.y.min);
  const topRight = new Vec2(bb.x.max, bb.y.min);
  const bottomLeft = new Vec2(bb.x.min, bb.y.max);
  const bottomRight = new Vec2(bb.x.max, bb.y.max);
  allScaling = 1;
  if (command === 'rotate') startingRotation = selection.rotation;
  if (command === 'resize-bl') startingRotation = Vec2.sub(bottomLeft, topRight).heading;
  if (command === 'resize-br') startingRotation = Vec2.sub(bottomRight, topLeft).heading;
  if (command === 'resize-tl') startingRotation = Vec2.sub(topLeft, bottomRight).heading;
  if (command === 'resize-tr') startingRotation = Vec2.sub(topRight, bottomLeft).heading;
  if (command === 'resize-t') startingRotation = new Vec2(0, -1).heading;
  if (command === 'resize-b') startingRotation = new Vec2(0, 1).heading;
  if (command === 'resize-l') startingRotation = new Vec2(-1, 0).heading;
  if (command === 'resize-r') startingRotation = new Vec2(1, 0).heading;
}

/**
 * @param {EditorInterface} editor The editor
 */
function updateCommand(editor: EditorInterface) {
  if (typeof selection !== 'boolean') {
    const mouse = new Vec2(editor.mouseX, editor.mouseY);
    const mouseOld = new Vec2(editor.oldMouseX, editor.oldMouseY);
    const pastV = Vec2.sub(mouseOld, selection.pos);
    const v = Vec2.sub(mouse, selection.pos);
    const bb = selection.boundingBox;
    const topLeft = new Vec2(bb.x.min, bb.y.min);
    const topRight = new Vec2(bb.x.max, bb.y.min);
    const bottomLeft = new Vec2(bb.x.min, bb.y.max);
    const bottomRight = new Vec2(bb.x.max, bb.y.max);
    const top = Vec2.lerp(topLeft, topRight, 0.5);
    const bottom = Vec2.lerp(bottomLeft, bottomRight, 0.5);
    const right = Vec2.lerp(bottomRight, topRight, 0.5);
    const left = Vec2.lerp(bottomLeft, topLeft, 0.5);
    const startDir = Vec2.fromAngle(startingRotation);
    let factor = 1;
    switch (currentCommand) {
      case 'move':
        selection.move(new Vec2(editor.mouseX - editor.oldMouseX,
          editor.mouseY - editor.oldMouseY));
        break;
      case 'rotate':
        selection.rotate(v.heading - pastV.heading);
        break;
      case 'resize-bl':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, topRight))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, topRight));
        if (factor * allScaling >= 0.03) {
          selection.scaleAround(topRight, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-br':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, topLeft))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, topLeft));
        if (factor * allScaling >= 0.03) {
          selection.scaleAround(topLeft, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-tl':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, bottomRight))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, bottomRight));
        if (factor * allScaling >= 0.03) {
          selection.scaleAround(bottomRight, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-tr':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, bottomLeft))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, bottomLeft));
        if (factor * allScaling >= 0.03) {
          selection.scaleAround(bottomLeft, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-t':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, bottom))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, bottom));
        if (factor * allScaling >= 0.1) {
          selection.scaleAroundY(bottom, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-b':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, top))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, top));
        if (factor * allScaling >= 0.1) {
          selection.scaleAroundY(top, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-l':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, right))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, right));
        if (factor * allScaling >= 0.1) {
          selection.scaleAroundX(right, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      case 'resize-r':
        factor = Vec2.dot(startDir, Vec2.sub(mouse, left))
      / Vec2.dot(startDir, Vec2.sub(mouseOld, left));
        if (factor * allScaling >= 0.1) {
          selection.scaleAroundX(left, factor);
          allScaling *= factor;
        } else currentCommand = 'none';
        break;
      default:
        break;
    }
  } else if (typeof springSelection !== 'boolean') {
    const mouse = new Vec2(editor.mouseX, editor.mouseY);
    const mouseOld = new Vec2(editor.oldMouseX, editor.oldMouseY);
    const dMouse = Vec2.sub(mouse, mouseOld);
    switch (currentCommand) {
      case 'move-spring0':
        springSelection.updateAttachPoint0(mouse, SPRING_RADIUS);
        break;
      case 'move-spring1':
        springSelection.updateAttachPoint1(mouse, SPRING_RADIUS);
        break;
      default:
        break;
    }
  }
}

const cursors = {
  none: 'default',
  move: 'move',
  rotate: 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAyklEQVQ4T6XST0qCQRjH8Y8JBnoCr9DGjXQBEbqDm6QQgvZeoX0bQVy7cRtBeIPcewi3bYLKeF6mmAZBeZvN8Pz5PvOb53ka/p4mHnGDVgp9YIVrvCdft5FxV3guCpXmBD1sfsAhXrKseOUVcV/ivKgwDvAMn1ngFosisVRTgQ+YpsQ7zA7IjX/fZ/4KfEMHX4jmlKePUeFcBrhPzi0ujjTnN/wv8JjUXMQO7fjWqc0JeIB1qvJUdxydOgtQjazOys1Dbg6GfeqS+wZwAS6Pac4meQAAAABJRU5ErkJggg==\') 6.5 6.5, auto',
  'resize-bl': 'nesw-resize',
  'resize-br': 'nwse-resize',
  'resize-tl': 'nwse-resize',
  'resize-tr': 'nesw-resize',
  'resize-t': 'ns-resize',
  'resize-b': 'ns-resize',
  'resize-l': 'ew-resize',
  'resize-r': 'ew-resize',
  'move-spring0': 'move',
  'move-spring1': 'move',
};

/**
 * Returns the current spring pointed at.
 *
 * @param {EditorInterface} editor The editor
 * @returns {Stick | Spring | boolean} The found spring
 */
function getSpring(editor: EditorInterface) {
  if (!currentChoosable.spring) return false;
  const mouse = new Vec2(editor.mouseX, editor.mouseY);
  const foundSpring = editor.physics.springs.find(
    (spring) => spring.getAsSegment().distFromPoint(mouse) <= SPRING_RADIUS,
  );
  if (typeof foundSpring === 'undefined') return false;
  return foundSpring;
}

/**
 * @param {CanvasRenderingContext2D} ctx The rendering context
 * @param {EditorInterface} editor The editor
 */
function drawResizer(ctx: CanvasRenderingContext2D, editor: EditorInterface) {
  if (selection instanceof Body) {
    if (currentCommand !== 'rotate') {
    // Dashed rectangle and line to rotator dot
      ctx.strokeStyle = palette['Roman Silver'];
      ctx.setLineDash([5, 3.5]);
      ctx.strokeRect(selection.boundingBox.x.min, selection.boundingBox.y.min,
        selection.boundingBox.x.max - selection.boundingBox.x.min,
        selection.boundingBox.y.max - selection.boundingBox.y.min);
      ctx.beginPath();
      ctx.moveTo(selection.boundingBox.x.max / 2 + selection.boundingBox.x.min / 2,
        selection.boundingBox.y.min);
      ctx.lineTo(selection.boundingBox.x.max / 2 + selection.boundingBox.x.min / 2,
        selection.boundingBox.y.min - ROTATE_DIST);
      ctx.stroke();

      // Corner and side dots
      ctx.fillStyle = palette.blue;
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.min, selection.boundingBox.y.min, CORNER_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.min, selection.boundingBox.y.max, CORNER_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.max, selection.boundingBox.y.min, CORNER_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.max, selection.boundingBox.y.max, CORNER_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.min,
        selection.boundingBox.y.min / 2 + selection.boundingBox.y.max / 2,
        SIDE_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.max,
        selection.boundingBox.y.min / 2 + selection.boundingBox.y.max / 2,
        SIDE_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.max / 2 + selection.boundingBox.x.min / 2,
        selection.boundingBox.y.max,
        SIDE_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.max / 2 + selection.boundingBox.x.min / 2,
        selection.boundingBox.y.min,
        SIDE_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
      // Circle of rotating
      ctx.beginPath();
      ctx.arc(
        selection.boundingBox.x.max / 2 + selection.boundingBox.x.min / 2,
        selection.boundingBox.y.min - ROTATE_DIST,
        ROTATE_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();

      // Then set cursor
      const command = findCommand(editor);
      const newCursor = cursors[command];
      const cnvStyle = editor.cnv.style;
      if (cnvStyle.cursor !== newCursor)cnvStyle.cursor = newCursor;
    } else {
      ctx.strokeStyle = palette['Roman Silver'];
      ctx.setLineDash([5, 3.5]);
      ctx.beginPath();
      ctx.moveTo(selection.pos.x, selection.pos.y);
      ctx.lineTo(editor.mouseX, editor.mouseY);
      ctx.stroke();

      ctx.fillStyle = palette.blue;
      ctx.beginPath();
      ctx.arc(
        editor.mouseX,
        editor.mouseY,
        ROTATE_RADIUS, 0, Math.PI * 2,
      );
      ctx.fill();
    }
  }
}

/**
 * Draws the mover points on the selected spring.
 *
 * @param {CanvasRenderingContext2D} ctx The drawing context
 * @param {EditorInterface} editor The editor
 */
function drawAttachPointMover(ctx: CanvasRenderingContext2D, editor: EditorInterface) {
  if (typeof springSelection !== 'boolean') {
    const ps = springSelection.points;
    ctx.fillStyle = palette.blue;
    ctx.beginPath();
    ps.forEach((p) => { ctx.arc(p.x, p.y, SPRING_RADIUS, 0, Math.PI * 2); });
    ctx.fill();

    // Then set cursor
    const command = findCommand(editor);
    const newCursor = cursors[command];
    const cnvStyle = editor.cnv.style;
    if (cnvStyle.cursor !== newCursor)cnvStyle.cursor = newCursor;
  }
}

/**
 * Handles the selection of a spring or stick.
 *
 * @param {EditorInterface} editor The editor
 */
function chooseSpring(editor: EditorInterface) {
  const newSelSpring = getSpring(editor);
  if (typeof newSelSpring !== 'boolean') {
    element.innerHTML = '';
    springSelection = newSelSpring;
    const lengthDisplay = (
      <number-display value={springSelection.getAsSegment().length.toFixed(1)}>
        Length:&nbsp;
      </number-display>
    );
    const initLengthInput = (
      <range-slider-number
        min={15}
        max={Math.max(editor.worldSize.width, editor.worldSize.height)}
        step={1}
        value={springSelection.length.toFixed(1)}
        onChange={(newLen: number) => {
          if (typeof springSelection !== 'boolean')springSelection.length = newLen;
        }}
      >
        Start length
      </range-slider-number>
    );
    let stiffnessInput;
    if (springSelection instanceof Spring && !(springSelection instanceof Stick)) {
      stiffnessInput = (
        <range-slider-number
          min={2000}
          max={100000}
          value={springSelection.springConstant}
          step={200}
          onChange={(newConst:number) => {
            if (springSelection instanceof Spring) springSelection.springConstant = newConst;
          }}
        >
          Spring stiffness
        </range-slider-number>
      );
    } else stiffnessInput = <div />;
    const angleDisplay = <angle-display value={0}>Orientation:&nbsp;</angle-display>;
    angleDisplay.hideNumber();

    element.append(
      <number-display value={springSelection instanceof Stick ? 'stick' : 'spring'}>
        Type:&nbsp;
      </number-display>,
      lengthDisplay,
      angleDisplay,
      initLengthInput,
      stiffnessInput,
      <check-box
        checked={springSelection.rotationLocked}
        onChange={(newB: boolean) => {
          if (typeof springSelection === 'boolean') return;
          if (newB) {
            springSelection.lockRotation();
          } else {
            springSelection.unlockRotation();
          }
        }}
      >
        Locked
      </check-box>,
      <button-btn
        bgColor={palette['Imperial Red']}
        textColor="white"
        onClick={() => {
          if (typeof springSelection !== 'boolean') {
            editor.physics.removeObjFromSystem(springSelection);
            setBaseInterface();
            updateFunc = () => {};
            selection = false;
            springSelection = false;
          }
        }}
      >
        Delete
      </button-btn>,
    );

    updateFunc = () => {
      if (typeof springSelection === 'boolean') return;
      lengthDisplay.value = springSelection.getAsSegment().length.toFixed(1);
      const segment = springSelection.getAsSegment();
      angleDisplay.value = Vec2.sub(segment.b, segment.a).heading;
    };
  } else {
    springSelection = false;
    setBaseInterface();
  }
}

/**
 * This mode is for placing down balls in the world
 */
const SelectMode: Mode = {
  name: 'Select',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, _dt: number) {
    const atCoord = currentChosen(editorApp);
    const springAtCoord = getSpring(editorApp) as (Stick | Spring | boolean);
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.save();
    ctx.strokeStyle = 'orange';
    ctx.fillStyle = '#00000000';
    ctx.setLineDash([]);
    ctx.lineWidth = 4;

    if (typeof selection !== 'boolean') {
      editorApp.renderer.renderBody(selection, ctx);

      // Highlight attached springs
      ctx.globalAlpha = 0.6;
      editorApp.physics.getSpringsWithBody(selection).forEach((s) => {
        ctx.fillStyle = '#00000000';
        ctx.strokeStyle = '#FFFFFF';
        if (s instanceof Stick)editorApp.renderer.renderStick(s, ctx);
        else if (s instanceof Spring) {
          editorApp.renderer.renderSpring(s, ctx);
        }
      });
      ctx.globalAlpha = 1;

      // Draw mover box if fixed
      if (selection.m === 0 || editorApp.timeMultiplier === 0) {
        updateCommand(editorApp);
        drawResizer(ctx, editorApp);
      }
    } else {
      const cnvStyle = editorApp.cnv.style;
      if (cnvStyle.cursor !== 'default') cnvStyle.cursor = 'default';
    }

    if (typeof springSelection !== 'boolean') {
      ctx.fillStyle = '#00000000';
      if (springSelection instanceof Stick)editorApp.renderer.renderStick(springSelection, ctx);
      else if (springSelection instanceof Spring) {
        editorApp.renderer.renderSpring(springSelection, ctx);
      }

      // Highlight attached bodies
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = '#FFFFFF';
      springSelection.objects.forEach((b) => editorApp.renderer.renderBody(b, ctx));
      ctx.globalAlpha = 1;

      if (editorApp.timeMultiplier === 0) {
        updateCommand(editorApp);
        drawAttachPointMover(ctx, editorApp);
      }
    } else if (typeof selection === 'boolean') {
      const cnvStyle = editorApp.cnv.style;
      if (cnvStyle.cursor !== 'default')cnvStyle.cursor = 'default';
    }

    ctx.strokeStyle = 'yellow';
    ctx.fillStyle = '#00000000';
    ctx.setLineDash([3, 5]);

    if (typeof atCoord !== 'boolean') {
      editorApp.renderer.renderBody(atCoord, ctx);
    } else if (typeof springAtCoord !== 'boolean') {
      ctx.fillStyle = '#00000000';
      if (springAtCoord instanceof Stick)editorApp.renderer.renderStick(springAtCoord, ctx);
      else editorApp.renderer.renderSpring(springAtCoord, ctx);
    }
    ctx.restore();

    updateFunc?.();
  },
  startInteractionFunc(editorApp) {
    const command = findCommand(editorApp);
    if (command !== 'none') {
      currentCommand = command;
      startCommand(command);
      return;
    } currentCommand = 'none';
    const newSel = currentChosen(editorApp);
    if (newSel instanceof Body && selection !== newSel && command === 'none') {
      element.innerHTML = '';
      selection = newSel;
      springSelection = false;
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
        <button-btn
          bgColor={palette['Imperial Red']}
          textColor="white"
          onClick={() => {
            if (typeof selection !== 'boolean') {
              editorApp.physics.removeObjFromSystem(selection);
              setBaseInterface();
              updateFunc = () => {};
              selection = false;
              springSelection = false;
            }
          }}
        >
          Delete
        </button-btn>,
      );
    } else if (typeof newSel === 'boolean' && command === 'none') {
      selection = newSel;
      updateFunc = () => {};
      chooseSpring(editorApp);
    }
  },
  endInteractionFunc(editorApp) {
    currentCommand = 'none';
  },
  deactivated() {
    selection = false;
    springSelection = false;
    updateFunc = () => {};
  },
  activated() {
    setBaseInterface();
  },
};

export default SelectMode;
