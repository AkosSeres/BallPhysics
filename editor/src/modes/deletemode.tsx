/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body, StickOrSpring, Vec2, Stick, Spring,
} from '../../../src/physics';
import palette from '../../../src/util/colorpalette';
import EditorInterface from '../interfaces.ts/editorInterface';
import Mode from '../interfaces.ts/modeInterface';
import elementCreator from '../components/elementCreator';
import '../components/number-display';
import '../components/checkbox';

const currentChoosable = {
  spring: true,
  body: true,
};
const SPRING_RADIUS = 7;

const element = document.createElement('div');

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
    (spring: StickOrSpring) => spring.getAsSegment().distFromPoint(mouse) <= SPRING_RADIUS,
  );
  if (typeof foundSpring === 'undefined') return false;
  return foundSpring;
}

const DeleteMode: Mode = {
  name: 'Delete',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const lookingAt = currentChoosable.body && editorApp.physics.getObjectAtCoordinates(
      editorApp.mouseX, editorApp.mouseY, 4,
    );
    if (typeof lookingAt !== 'boolean') {
      // Highlight with red if the mouse points at an object
      const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
      ctx.save();
      ctx.fillStyle = '#00000000';
      ctx.strokeStyle = palette['Imperial Red'];
      ctx.lineWidth = 3;
      editorApp.renderer.renderBody(lookingAt, ctx);
      ctx.restore();
      return;
    }
    const cSpring = getSpring(editorApp);
    if (cSpring) {
      // Highlight with red if the mouse points at a spring
      const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
      ctx.save();
      ctx.fillStyle = '#00000000';
      ctx.strokeStyle = palette['Imperial Red'];
      ctx.lineWidth = 3;
      if (cSpring instanceof Stick) {
        editorApp.renderer.renderStick(cSpring, ctx);
      } else { editorApp.renderer.renderSpring(cSpring, ctx); }
      ctx.restore();
    }
  },
  startInteractionFunc(editorApp) {
    const cSpring = getSpring(editorApp);
    if (editorApp.choosed && editorApp.choosed instanceof Body && currentChoosable.body) {
      editorApp.physics.removeObjFromSystem(editorApp.choosed);
    } else if (currentChoosable.spring && cSpring) {
      editorApp.physics.removeObjFromSystem(cSpring);
    }
  },
};

element.append(
  <number-display>Deletable types:</number-display>,
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

export default DeleteMode;
