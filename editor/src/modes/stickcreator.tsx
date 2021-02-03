/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import {
  Body, Shape, Stick, Vec2, PinPoint,
} from '../../../src/physics';
import elementCreator from '../elementCreator';
import '../components/checkbox';
import EditorInterface from '../editorInterface';

let lockRotation = false;
let centerSnap = true;
let startPos = new Vec2(0, 0);
let startRot = 0;
const randomStick = new Stick(1);
randomStick.attachObject(new Body(Shape.Circle(1, new Vec2(0, 0))));
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
 * Creates a stick that's starting and ending points are the given vectors.
 *
 * @param {Vec2} a The start vector
 * @param {Vec2} b The end vector
 * @returns {Stick} The resulting spring
 */
function stickFromAB(a: Vec2, b: Vec2) {
  randomStick.length = a.dist(b);
  randomStick.objects[0].pos = a;
  randomStick.objects[0].shape.points[0] = a;
  randomStick.pinHere(b.x, b.y);
  return randomStick;
}

const StickCreatorMode: Mode = {
  name: 'Stick creator',
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
      const springToDraw = stickFromAB(start, end);

      editorApp.renderer.renderStick(springToDraw, ctx);
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
      let newChoosed = editorApp.physics.getObjectAtCoordinates(editorApp.mouseX, editorApp.mouseY);
      let stick;
      let attachPoint1 = convertLastPos(editorApp);
      let attachPoint2 = new Vec2(editorApp.mouseX, editorApp.mouseY);
      if (editorApp.choosed instanceof Body && centerSnap) {
        attachPoint1 = editorApp.choosed.pos.copy;
      }
      if (newChoosed instanceof Body && centerSnap) {
        attachPoint2 = newChoosed.pos.copy;
      }
      const Thing = Stick;
      if (typeof newChoosed === 'boolean') {
        newChoosed = {
          x: editorApp.mouseX,
          y: editorApp.mouseY,
          pinPoint: true,
        };
      }

      if (typeof editorApp.choosed === 'boolean'
        || editorApp.choosed === newChoosed
        || (editorApp.choosed === undefined && newChoosed === undefined)
      ) {
        return;
      } if ('pinPoint' in editorApp.choosed && 'pinPoint' in newChoosed) return;
      if ('pinPoint' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.y - newChoosed.pos.y) ** 2),
          ),
        );
        stick.attachObject(newChoosed, attachPoint2);
        stick.pinHere(editorApp.choosed.x, editorApp.choosed.y);
      } else if ('pinPoint' in newChoosed && 'pos' in editorApp.choosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.y) ** 2),
          ),
        );
        stick.attachObject(editorApp.choosed, attachPoint1);
        stick.pinHere(newChoosed.x, newChoosed.y);
      } else if ('pos' in editorApp.choosed && 'pos' in newChoosed) {
        stick = new Thing(
          Math.sqrt(
            ((editorApp.choosed.pos.x - newChoosed.pos.x) ** 2)
            + ((editorApp.choosed.pos.y - newChoosed.pos.y) ** 2),
          ),
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
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  <check-box checked={lockRotation} onChange={(newBool: boolean) => { lockRotation = newBool; }}>
    Lock rotation
  </check-box>,
  <check-box checked={centerSnap} onChange={(newBool: boolean) => { centerSnap = newBool; }}>
    Snap to center
  </check-box>,
].forEach(element.appendChild.bind(element));

export default StickCreatorMode;
