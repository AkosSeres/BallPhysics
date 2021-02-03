/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import {
  Body, PinPoint, Shape, Spring, Vec2,
} from '../../../src/physics';
import elementCreator from '../elementCreator';
import '../components/checkbox';
import '../components/range-slider';
import EditorInterface from '../editorInterface';
import palette from '../../../src/util/colorpalette';

let lockRotation = false;
let centerSnap = true;
let startPos = new Vec2(0, 0);
let startRot = 0;
let springConstant = 10000;
const randomSpring = new Spring(1, springConstant);
randomSpring.attachObject(new Body(Shape.Circle(1, new Vec2(0, 0))));
const element = document.createElement('div');

/**
 * @param {EditorInterface} editor The editor
 * @returns {Vec2} The current pos of the original attach point
 */
function convertLastPos(editor: EditorInterface) {
  const { choosed } = editor;
  const last = new Vec2(editor.lastX, editor.lastY);
  if (editor.lastX !== 0 && editor.lastY !== 0 && choosed instanceof Body) {
    const rel = Vec2.sub(last, startPos);
    rel.rotate(choosed.rotation - startRot);
    if (centerSnap) {
      rel.x = 0;
      rel.y = 0;
    }
    rel.add(choosed.pos);
    return rel;
  }
  return last;
}

/**
 * Creates a spring that's starting and ending points are the given vectors.
 *
 * @param {Vec2} a The start vector
 * @param {Vec2} b The end vector
 * @returns {Spring} The resulting spring
 */
function springFromAB(a: Vec2, b: Vec2) {
  randomSpring.length = a.dist(b);
  randomSpring.springConstant = springConstant;
  randomSpring.objects[0].pos = a;
  randomSpring.objects[0].shape.points[0] = a;
  randomSpring.pinHere(b.x, b.y);
  return randomSpring;
}

const SpringCreatorMode: Mode = {
  name: 'Spring creator',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
    ctx.save();

    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      ctx.fillStyle = '#00000000';
      ctx.strokeStyle = '#FFFFFF';

      const start = convertLastPos(editorApp);
      const end = new Vec2(editorApp.mouseX, editorApp.mouseY);
      const springToDraw = springFromAB(start, end);

      editorApp.renderer.renderSpring(springToDraw, ctx);
    }

    // Highlight on hover
    const lookedAt = editorApp.physics.getObjectAtCoordinates(
      editorApp.mouseX, editorApp.mouseY,
    );
    if (lookedAt instanceof Body) {
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#00000000';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      editorApp.renderer.renderBody(lookedAt, ctx);
    }

    ctx.restore();
  },
  startInteractionFunc(editorApp) {
    if (editorApp.choosed instanceof Body) {
      startPos = editorApp.choosed.pos.copy;
      startRot = editorApp.choosed.rotation;
    } else if (typeof editorApp.choosed !== 'boolean') {
      startPos = new Vec2(editorApp.choosed.x, editorApp.choosed.y);
      startRot = 0;
    }
  },
  endInteractionFunc(editorApp) {
    if (editorApp.lastX !== 0 && editorApp.lastY !== 0) {
      /** @type {Body | boolean | PinPoint} */
      let newChoosed = editorApp.physics.getObjectAtCoordinates(
        editorApp.mouseX, editorApp.mouseY,
      );
      let stick;
      let attachPoint1 = convertLastPos(editorApp);
      let attachPoint2 = new Vec2(editorApp.mouseX, editorApp.mouseY);
      if (editorApp.choosed instanceof Body && centerSnap) {
        attachPoint1 = editorApp.choosed.pos.copy;
      }
      if (newChoosed instanceof Body && centerSnap) {
        attachPoint2 = newChoosed.pos.copy;
      }
      const Thing = Spring;
      if (typeof newChoosed === 'boolean') {
        /** @type {PinPoint} */
        newChoosed = {
          x: editorApp.mouseX,
          y: editorApp.mouseY,
          pinPoint: true,
        };
      }

      if (
        editorApp.choosed === newChoosed
        || (editorApp.choosed === undefined && newChoosed === undefined)
      ) {
        return;
      } if (editorApp.choosed instanceof Object && newChoosed instanceof Object
        && 'pinPoint' in editorApp.choosed && 'pinPoint' in newChoosed) return;
      if (editorApp.choosed instanceof Object && newChoosed instanceof Object
        && 'pinPoint' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.y - newChoosed.pos.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(newChoosed, attachPoint2);
        stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
      } else if (newChoosed instanceof Object && editorApp.choosed instanceof Object
         && 'pos' in editorApp.choosed && 'pinPoint' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(editorApp.choosed, attachPoint1);
        stick.pinHere(newChoosed.x, newChoosed.y);
      } else if (editorApp.choosed instanceof Object && newChoosed instanceof Object
        && 'pos' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.pos.y) ** 2),
          ),
          springConstant,
        );
        stick.attachObject(editorApp.choosed, attachPoint1);
        stick.attachObject(newChoosed, attachPoint2);
      }
      if (typeof stick === 'undefined') return;
      editorApp.physics.addSpring(stick);
      if (lockRotation) {
        stick.lockRotation();
      }
    }
  },
};

element.append(
  <check-box checked={lockRotation} onChange={(newBool: boolean) => { lockRotation = newBool; }}>
    Lock rotation
  </check-box>,
  <check-box checked={centerSnap} onChange={(newBool: boolean) => { centerSnap = newBool; }}>
    Snap to center
  </check-box>,
  <range-slider
    min={2000}
    max={100000}
    value={springConstant}
    step={200}
    onChange={(newConst:number) => { springConstant = newConst; }}
  >
    Spring stiffness
  </range-slider>,
);

export default SpringCreatorMode;
