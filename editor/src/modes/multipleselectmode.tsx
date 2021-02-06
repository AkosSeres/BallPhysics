import {
  Body, Vec2, Stick, Spring,
} from '../../../src/physics';
import EditorInterface from '../interfaces/editorInterface';
import elementCreator from '../components/elementCreator';
import Mode from '../interfaces/modeInterface';
import Group from '../serialise/group';
import palette from '../../../src/util/colorpalette';

import rotateCursor from '../addons/rotateCursor';
import '../components/number-display';
import '../components/button-btn';
import '../components/text-input';
import '../components/apply-cancel';
import Creation from '../serialise/creation';
import { clearModal, hideModal, useModal } from '../components/modal-control';
import { storeCreation } from '../serialise/persistence';

enum State {
  Select = 'SELECT',
  Resize = 'RESIZE',
}

const ROTATE_DIST = 35;
const CORNER_RADIUS = 8;
const ROTATE_RADIUS = 9;
const SPRING_RADIUS = 7;

interface StateImplementation{
  update: (editor:EditorInterface, dt: number, ctx: CanvasRenderingContext2D) => void;
  startInteraction: (editor:EditorInterface) => void;
  endInteraction: (editor:EditorInterface) => void;
  init: () => void;
  activated: () => void;
  element: HTMLElement;
  [x: string]: any;
}

const selectedGroup = new Group();
let currentState: State = State.Select;

const element = document.createElement('div');

const states: { [key in State]?: StateImplementation } = Object.create({});

/**
 * Returns the current spring pointed at.
 *
 * @param {EditorInterface} editor The editor
 * @returns {Stick | Spring | boolean} The found spring
 */
function getSpring(editor: EditorInterface) {
  const mouse = new Vec2(editor.mouseX, editor.mouseY);
  const foundSpring = editor.physics.springs.find(
    (spring) => spring.getAsSegment().distFromPoint(mouse) <= SPRING_RADIUS,
  );
  if (typeof foundSpring === 'undefined') return false;
  return foundSpring;
}

/**
 * @param {State} wanted The state to switch to
 */
function switchState(wanted: State) {
  element.innerHTML = '';
  currentState = wanted;
  const newImplementation = states[currentState];
  if (newImplementation) {
    element.append(newImplementation.element);
    newImplementation.activated();
  }
}

/**
 * @returns {StateImplementation} The currently chosen state's implementation
 */
function getCurrentImplementation() {
  return states[currentState];
}

/**
 * Requests the creation data from the user.
 *
 * @param {HTMLImageElement} creationImage The image of the creation
 * @returns {Promise<{name: string, description: string}>} The data entered by the user
 */
function requestCreationData(creationImage: HTMLImageElement):
Promise<{name: string, description: string}> {
  return new Promise((resolve, reject) => {
    const warningSign = (
      <div>
        You cannot leave the &apos;Name&apos; field empty!
      </div>
    ) as HTMLDivElement;
    warningSign.style.color = palette['Imperial Red'];
    warningSign.style.fontSize = 'small';
    warningSign.style.marginLeft = 'auto';
    warningSign.style.marginRight = 'auto';
    warningSign.style.width = '100%';
    warningSign.style.display = 'none';
    warningSign.style.textAlign = 'center';
    const nameInput = (
      <text-input>
        Name of creation
      </text-input>
    );
    const descriptionInput = (
      <text-input>
        Description
      </text-input>
    );
    const buttonsBtns = (
      <apply-cancel
        applyText="Save"
        cancelText="Cancel"
        onCancel={() => {
          hideModal();
          setTimeout(clearModal, 450);
          reject(new Error('Canceled'));
        }}
        onApply={() => {
          if (nameInput.inputValue === '') {
            warningSign.style.display = 'block';
          } else {
            const creationData = {
              name: nameInput.inputValue,
              description: descriptionInput.inputValue,
            };
            hideModal();
            setTimeout(clearModal, 450);
            resolve(creationData);
          }
        }}
      />
    );
    buttonsBtns.width = '35%';
    const ce = buttonsBtns.containerElement as HTMLDivElement;
    ce.style.marginLeft = 'auto';
    ce.style.marginRight = 'auto';
    ce.style.marginBottom = '0.7em';
    ce.style.height = '1.5em';
    ce.style.fontSize = 'large';
    useModal([
      creationImage,
      warningSign,
      nameInput,
      descriptionInput,
      buttonsBtns,
    ], () => {
      setTimeout(clearModal, 450);
      reject(new Error('Canceled'));
    });
  });
}

/**
 * Exports the selected items as a creation, in a bpcreation (JSON format) file.
 */
async function saveCreation() {
  const img = new Image();
  img.className = 'creation-image-modal';
  const creation = new Creation('', '', selectedGroup);
  img.src = creation.thumbnail;
  try {
    const creationData = await requestCreationData(img);
    creation.name = creationData.name;
    creation.description = creationData.description;

    storeCreation(creation);
  // eslint-disable-next-line no-empty
  } catch { }
}

states[State.Select] = {
  update(editor, dt, ctx) {
    const { boundingBox } = selectedGroup;
    if (boundingBox.x.size() !== 0) {
      ctx.lineWidth = 3;
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = '#FFFFFF55';
      ctx.strokeRect(boundingBox.x.min, boundingBox.y.min,
        boundingBox.x.size(), boundingBox.y.size());
    }
  },
  startInteraction(editor) {
    const mouse = new Vec2(editor.mouseX, editor.mouseY);
    const atCoord = editor.physics.getObjectAtCoordinates(mouse.x, mouse.y, 4);
    if (atCoord instanceof Body) {
      if (!selectedGroup.bodies.includes(atCoord))selectedGroup.addBody(atCoord);
      else selectedGroup.bodies.splice(selectedGroup.bodies.indexOf(atCoord), 1);
      return;
    }
    const springAtCoord = getSpring(editor);
    if (springAtCoord instanceof Spring) {
      if (!selectedGroup.springs.includes(springAtCoord)) {
        selectedGroup.addSpring(springAtCoord);
      } else {
        selectedGroup.springs.splice(
          selectedGroup.springs.indexOf(springAtCoord), 1,
        );
      }
    }
  },
  endInteraction() {
    if (selectedGroup.bodies.length === 0) this.editBtn.hide();
    else this.editBtn.show();
  },
  init() {
    this.editBtn.smallMargin();
    if (selectedGroup.bodies.length === 0) this.editBtn.hide();
    else this.editBtn.show();
  },
  activated() {
    if (selectedGroup.bodies.length === 0) this.editBtn.hide();
    else this.editBtn.show();
  },
  get editBtn() {
    return this.element.querySelector('#editBtn');
  },
  element:
  <div>
    <number-display>Select/deselect anything</number-display>
    <button-btn
      id="editBtn"
      onClick={() => { switchState(State.Resize); }}
    >
      Edit selection
    </button-btn>
  </div>,
};

states[State.Resize] = {
  update(editor, dt, ctx) {
    // If deletion is needed, delete
    if (this.toDelete) {
      this.toDelete = false;
      selectedGroup.bodies.forEach((b) => {
        editor.physics.removeObjFromSystem(b);
      });
      selectedGroup.bodies = [];
      selectedGroup.springs = [];
      switchState(State.Select);
    }

    // If time is going, stop it
    if (editor.timeMultiplier !== 0) {
        document.getElementById('pause')?.click();
    }

    // Draw resize box
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3.5]);
    ctx.strokeStyle = palette['Roman Silver'];
    const { boundingBox } = selectedGroup;
    const bb = boundingBox;

    if (this.command !== 'rotate') {
      ctx.strokeRect(boundingBox.x.min, boundingBox.y.min,
        boundingBox.x.max - boundingBox.x.min,
        boundingBox.y.max - boundingBox.y.min);
      ctx.beginPath();
      ctx.moveTo(boundingBox.x.max / 2 + boundingBox.x.min / 2,
        boundingBox.y.min);
      ctx.lineTo(boundingBox.x.max / 2 + boundingBox.x.min / 2,
        boundingBox.y.min - ROTATE_DIST);
      ctx.stroke();

      ctx.fillStyle = palette.blue;
      ctx.beginPath();
      ctx.arc(bb.x.min, bb.y.min, CORNER_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bb.x.max, bb.y.min, CORNER_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bb.x.max, bb.y.max, CORNER_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bb.x.min, bb.y.max, CORNER_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc((bb.x.min + bb.x.max) / 2, bb.y.min - ROTATE_DIST, ROTATE_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = palette.blue;
      ctx.beginPath();
      ctx.moveTo(editor.mouseX, editor.mouseY);
      ctx.lineTo(this.rotateCenter.x, this.rotateCenter.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(editor.mouseX, editor.mouseY, ROTATE_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.rotateCenter.x, this.rotateCenter.y, ROTATE_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (this.command === 'none') {
      const commandHover = this.findCommand(editor.mouseX, editor.mouseY);
      const ed = editor;
      if (ed.cnv.style.cursor !== this.cursors[commandHover]) {
        ed.cnv.style.cursor = this.cursors[commandHover];
      }
    }

    this.updateCommand(editor);
  },
  startInteraction(editor) {
    this.command = this.findCommand(editor.mouseX, editor.mouseY);
    if (this.command === 'rotate') {
      const bb = selectedGroup.boundingBox;
      const bottomRight = new Vec2(bb.x.max, bb.y.max);
      const topLeft = new Vec2(bb.x.min, bb.y.min);
      this.rotateCenter = Vec2.add(topLeft, bottomRight);
      this.rotateCenter.div(2);
    }
  },
  endInteraction(editorApp) {
    const editor = editorApp;
    editor.cnv.style.cursor = 'default';
    this.command = 'none';
  },
  updateCommand(editor: EditorInterface) {
    if (this.command === 'none') return;

    const mouse = new Vec2(editor.mouseX, editor.mouseY);
    const mouseOld = new Vec2(editor.oldMouseX, editor.oldMouseY);
    const dMouse = Vec2.sub(mouse, mouseOld);
    const bb = selectedGroup.boundingBox;
    const topLeft = new Vec2(bb.x.min, bb.y.min);
    const topRight = new Vec2(bb.x.max, bb.y.min);
    const bottomLeft = new Vec2(bb.x.min, bb.y.max);
    const bottomRight = new Vec2(bb.x.max, bb.y.max);
    const middle = Vec2.add(topLeft, bottomRight);
    middle.div(2);
    const rotateAngle = Vec2.sub(mouse, middle).heading - Vec2.sub(mouseOld, middle).heading;
    const dirNW = Vec2.sub(topLeft, bottomRight);
    const dirSW = Vec2.sub(topRight, bottomLeft);

    switch (this.command) {
      case 'move':
        selectedGroup.move(dMouse);
        break;
      case 'rotate':
        selectedGroup.rotateAround(this.rotateCenter, rotateAngle);
        break;
      case 'resize-br':
        selectedGroup.scaleAround(topLeft,
          Vec2.dot(Vec2.sub(mouse, topLeft), dirNW)
            / Vec2.dot(Vec2.sub(mouseOld, topLeft), dirNW));
        break;
      case 'resize-bl':
        selectedGroup.scaleAround(topRight,
          Vec2.dot(Vec2.sub(mouse, topRight), dirSW)
            / Vec2.dot(Vec2.sub(mouseOld, topRight), dirSW));
        break;
      case 'resize-tr':
        selectedGroup.scaleAround(bottomLeft,
          Vec2.dot(Vec2.sub(mouse, bottomLeft), dirSW)
            / Vec2.dot(Vec2.sub(mouseOld, bottomLeft), dirSW));
        break;
      case 'resize-tl':
        selectedGroup.scaleAround(bottomRight,
          Vec2.dot(Vec2.sub(mouse, bottomRight), dirNW)
            / Vec2.dot(Vec2.sub(mouseOld, bottomRight), dirNW));
        break;
      default:
        break;
    }
  },
  findCommand(x: number, y: number) {
    const p = new Vec2(x, y);
    const bb = selectedGroup.boundingBox;

    if (p.dist(new Vec2(bb.x.min, bb.y.min)) <= CORNER_RADIUS) return 'resize-tl';
    if (p.dist(new Vec2(bb.x.max, bb.y.min)) <= CORNER_RADIUS) return 'resize-tr';
    if (p.dist(new Vec2(bb.x.min, bb.y.max)) <= CORNER_RADIUS) return 'resize-bl';
    if (p.dist(new Vec2(bb.x.max, bb.y.max)) <= CORNER_RADIUS) return 'resize-br';
    if (p.x >= bb.x.min && p.x <= bb.x.max
        && p.y >= bb.y.min && p.y <= bb.y.max) return 'move';
    const rotatePos = new Vec2((bb.x.min + bb.x.max) / 2, bb.y.min - ROTATE_DIST);
    if (p.dist(rotatePos) <= ROTATE_RADIUS) return 'rotate';

    return 'none';
  },
  command: 'none',
  cursors: {
    none: 'default',
    rotate: rotateCursor,
    move: 'move',
    'resize-bl': 'nesw-resize',
    'resize-br': 'nwse-resize',
    'resize-tl': 'nwse-resize',
    'resize-tr': 'nesw-resize',
  },
  rotateCenter: new Vec2(0, 0),
  init() {
    selectedGroup.removeUnusedSprings();
    if (selectedGroup.bodies.length === 0) switchState(State.Select);
  },
  activated() {
    this.command = 'none';
  },
  element:
  <div>
    <number-display>Move, resize, scale or export creation</number-display>
    <button-btn
      bgColor={palette['Imperial Red']}
      onClick={() => {
        const resizeImpl = states[State.Resize];
        if (resizeImpl)resizeImpl.toDelete = true;
      }}
      decreasedMargin
    >
      Delete
    </button-btn>
    <button-btn
      onClick={() => saveCreation()}
      decreasedMargin
    >
      Save as creation
    </button-btn>
    <button-btn
      onClick={() => switchState(State.Select)}
      decreasedMargin
    >
      Stop editing
    </button-btn>
  </div>,
  toDelete: false,
};

const MultipleSelectMode: Mode = {
  name: 'Select multiple',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const { cnv } = editorApp;
    const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.save();
    const mouse = new Vec2(editorApp.mouseX, editorApp.mouseY);

    // Highlight selected bodies
    ctx.lineWidth = 4;
    ctx.fillStyle = '#00000000';
    ctx.setLineDash([]);
    ctx.strokeStyle = 'orange';
    selectedGroup.bodies.forEach((b) => {
      editorApp.renderer.renderBody(b, ctx);
    });
    selectedGroup.springs.forEach((s) => {
      ctx.strokeStyle = 'orange';
      if (s instanceof Stick)editorApp.renderer.renderStick(s, ctx);
      else editorApp.renderer.renderSpring(s, ctx);
    });

    // Highlight body under the cursor
    ctx.strokeStyle = 'yellow';
    ctx.setLineDash([3, 5]);
    const lookingAt = editorApp.physics.getObjectAtCoordinates(mouse.x, mouse.y, 4);
    if (lookingAt instanceof Body) {
      editorApp.renderer.renderBody(lookingAt, ctx);
    } else {
      const springLookingAt = getSpring(editorApp);
      if (springLookingAt instanceof Spring) {
        if (springLookingAt instanceof Stick) {
          editorApp.renderer.renderStick(springLookingAt, ctx);
        } else { editorApp.renderer.renderSpring(springLookingAt, ctx); }
      }
    }

    getCurrentImplementation()?.update?.(editorApp, dt, ctx);

    ctx.restore();
  },
  startInteractionFunc(editorApp) {
    getCurrentImplementation()?.startInteraction?.(editorApp);
  },
  endInteractionFunc(editorApp) {
    getCurrentImplementation()?.endInteraction?.(editorApp);
  },
  deactivated(editorApp) {
    selectedGroup.bodies = [];
    selectedGroup.springs = [];
    const editor = editorApp;
    editor.cnv.style.cursor = 'default';
    switchState(State.Select);
  },
  activated() {
    getCurrentImplementation()?.activated();
  },
};

switchState(State.Select);
Object.values(states).forEach((stateImpl: StateImplementation | undefined) => {
  if (stateImpl)stateImpl.init();
});

export default MultipleSelectMode;
