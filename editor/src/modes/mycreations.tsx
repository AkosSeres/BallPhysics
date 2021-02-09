/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../interfaces/modeInterface';
import EditorInterface from '../interfaces/editorInterface';
import elementCreator from '../components/elementCreator';
import '../components/creation-display';
import '../components/number-display';
import '../components/space-height';
import { getSerialisedCreation, getStoredCreationNames, removeCreation } from '../serialise/persistence';
import { groupFromJSONString } from '../serialise/serialiser';
import { Stick, Vec2 } from '../../../src/physics';
import Group from '../serialise/group';
import palette from '../../../src/util/colorpalette';
import rotateCursor from '../addons/rotateCursor';

const MOVE_RADIUS = 8;
const ROTATE_RADIUS = 7;
const SCALE_RADIUS = 7;
const ROTATE_DISTANCE = 23;
const SCALE_DISTANCE = 30;

const element = document.createElement('div');

let groupToPlace: Group | false = false;
let currentCommand = 'none';
let rotateCenter = new Vec2(0, 0);

/**
 * @param {any} creationData The object containing the data
 * @param {string} creationData.name The name of the creation
 * @param {string} creationData.description The description of the creation
 * @param {string} creationData.thumbnail The thumbnail of the creation
 * @param {string} creationData.content The object inside the creation
 * @param {EditorInterface} editor The editor
 */
async function placeMode(creationData: {
  name: string,
  description: string,
  thumbnail: string,
  content: string
}, editor: EditorInterface) {
  const creationGroup = await groupFromJSONString(creationData.content);
  const midPos = editor.convertToPhysicsSpace(
    new Vec2(editor.cnv.clientWidth / 2, editor.cnv.clientHeight / 2),
  );
  creationGroup.move(midPos);
  groupToPlace = creationGroup;

  element.innerHTML = '';
  element.append(
    <number-display>
      Find the intended place for the creation then
      press &apos;Accept&apos; or &apos;Cancel&apos; to discard
    </number-display>,
    <space-height value={0.5} />,
    <apply-cancel
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
      onCancel={() => { MyCreationsMode.activated?.(editor); }}
      onApply={() => {
        if (groupToPlace) {
          groupToPlace.bodies.forEach((b) => editor.physics.addBody(b));
          groupToPlace.springs.forEach((s) => editor.physics.addSpring(s));
          groupToPlace = false;
        }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      MyCreationsMode.activated?.(editor);
      }}
    />,
  );
}

/**
 * @param {CanvasRenderingContext2D} ctx The rendering context
 * @param {Vec2} center The center of the controls
 * @param {EditorInterface} editor The editor
 */
function drawMoveControls(ctx: CanvasRenderingContext2D, center: Vec2, editor: EditorInterface) {
  ctx.strokeStyle = palette['Roman Silver'];
  ctx.setLineDash([5, 3.5]);

  if (currentCommand === 'rotate') {
    ctx.beginPath();
    ctx.moveTo(rotateCenter.x, rotateCenter.y);
    ctx.lineTo(editor.mouseX, editor.mouseY);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = palette.blue;
    ctx.beginPath();
    ctx.arc(rotateCenter.x, rotateCenter.y,
      MOVE_RADIUS, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(editor.mouseX, editor.mouseY,
      ROTATE_RADIUS, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    return;
  }
  ctx.beginPath();
  ctx.moveTo(center.x, center.y - ROTATE_DISTANCE);
  ctx.lineTo(center.x, center.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(center.x + SCALE_DISTANCE, center.y + SCALE_DISTANCE);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = palette.blue;
  ctx.beginPath();
  ctx.arc(center.x, center.y, MOVE_RADIUS, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(center.x, center.y - ROTATE_DISTANCE,
    ROTATE_RADIUS, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(center.x + SCALE_DISTANCE, center.y + SCALE_DISTANCE,
    SCALE_RADIUS, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * @param {Vec2} center The center of the group
 * @param {EditorInterface} editor The editor
 * @returns {string} The found command
 */
function findCommand(center: Vec2, editor: EditorInterface) {
  const mouse = new Vec2(editor.mouseX, editor.mouseY);
  if (center.dist(mouse) <= MOVE_RADIUS) return 'move';
  if (new Vec2(center.x, center.y - ROTATE_DISTANCE).dist(mouse)
    <= ROTATE_RADIUS) return 'rotate';
  if (new Vec2(center.x + SCALE_DISTANCE, center.y + SCALE_DISTANCE)
    .dist(mouse) <= SCALE_RADIUS) return 'scale';
  return 'none';
}

/**
 * @param {Vec2} center The center of the group
 * @param {EditorInterface} editor The editor
 */
function updateCommand(center: Vec2, editor: EditorInterface) {
  if (!groupToPlace) return;
  if (currentCommand === 'none') return;

  const mouse = new Vec2(editor.mouseX, editor.mouseY);
  const mouseOld = new Vec2(editor.oldMouseX, editor.oldMouseY);
  const dMouse = Vec2.sub(mouse, mouseOld);

  const rel = Vec2.sub(mouse, rotateCenter);
  const relOld = Vec2.sub(mouseOld, rotateCenter);

  switch (currentCommand) {
    case 'move':
      groupToPlace.move(dMouse);
      break;
    case 'rotate':
      groupToPlace.rotateAround(rotateCenter, rel.heading - relOld.heading);
      break;
    case 'scale':
      groupToPlace.scaleAround(center, rel.length / relOld.length);
      break;
    default:
      break;
  }
}

const cursors = {
  none: 'default',
  move: 'move',
  scale: 'nwse-resize',
  rotate: rotateCursor,
};

/**
 * This mode is for placing down balls in the world
 */
const MyCreationsMode: Mode = {
  name: 'Creations',
  description: '',
  element,
  drawFunc(editorApp: EditorInterface, _dt: number) {
    if (groupToPlace) {
      const bb = groupToPlace.boundingBox;
      let groupCenter = Vec2.div(Vec2.add(new Vec2(bb.x.min, bb.y.min),
        new Vec2(bb.x.max, bb.y.max)), 2);

      updateCommand(groupCenter, editorApp);

      const { cnv } = editorApp;
      const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;

      ctx.save();

      ctx.lineWidth = 2;
      ctx.fillStyle = '#00000000';
      ctx.strokeStyle = '#000000';

      groupToPlace.bodies.forEach((b) => {
        editorApp.renderer.renderBody(b, ctx);
      });
      groupToPlace.springs.forEach((s) => {
        if (s instanceof Stick) {
          editorApp.renderer.renderStick(s, ctx);
        } else {
          editorApp.renderer.renderSpring(s, ctx);
        }
      });

      if (currentCommand === 'rotate')groupCenter = rotateCenter.copy;
      drawMoveControls(ctx, groupCenter, editorApp);

      ctx.restore();

      // Set cursor
      let newCursor;
      if (currentCommand !== 'none') newCursor = currentCommand;
      else newCursor = cursors[findCommand(groupCenter, editorApp)];
      const currentCursor = cnv.style.cursor;
      if (newCursor !== currentCursor) cnv.style.cursor = newCursor;
    } else currentCommand = 'none';
  },
  startInteractionFunc(editorApp) {
    if (groupToPlace) {
      const bb = groupToPlace.boundingBox;
      const groupCenter = Vec2.div(Vec2.add(new Vec2(bb.x.min, bb.y.min),
        new Vec2(bb.x.max, bb.y.max)), 2);
      rotateCenter = groupCenter.copy;
      currentCommand = findCommand(groupCenter, editorApp);
    }
  },
  endInteractionFunc(editorApp) {
    currentCommand = 'none';
  },
  async activated(editorApp) {
    element.innerHTML = '';
    groupToPlace = false;
    element.append(<number-display>My creations:</number-display>,
      <space-height value={1} />);
    const names = await getStoredCreationNames();
    const creationData = await Promise.all(names.map((n) => getSerialisedCreation(n)));
    element.append(...creationData.map((cd) => ((
      <creation-display
        data={cd}
        onPlace={() => { placeMode(cd, editorApp); }}
        onDelete={async () => {
          const message = await removeCreation(cd.name);
          this.activated?.(editorApp);
        }}
      />
    ) as Node)));
  },
};

export default MyCreationsMode;
