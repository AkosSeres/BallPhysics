import { MinMax } from '../../../src/math/minmax';
import { Vec2AsObject } from '../../../src/math/vec2';
import {
  Body, Shape, Spring, Stick, StickOrSpring, Vec2,
} from '../../../src/physics';
import Group from './group';

/**
 * Converts a body into a plain object.
 *
 * @param {Body} body The body to be serialised
 * @param {number | 'none'} textureNum The index of the texture of the body
 * @returns {any} The body as a JSON string
 */
function bodyToPlain(body: Body, textureNum: number | 'none' = 'none') {
  const plain: any = body.copy;
  plain.texture = textureNum;
  return plain;
}

/**
 * Converts a spring or stick into a plain object.
 *
 * @param {StickOrSpring} spring The spring to be converted
 * @param {Group} parentGroup The group that contains the spring
 * @returns {any} The plain object
 */
function springToPlain(spring: StickOrSpring, parentGroup: Group) {
  const ret: any = {};

  ret.length = spring.length;
  ret.springConstant = spring.springConstant;
  if (typeof spring.pinned === 'boolean') {
    ret.pinned = spring.pinned;
  } else ret.pinned = { x: spring.pinned.x, y: spring.pinned.y };
  ret.rotationLocked = spring.rotationLocked;
  ret.initialHeading = spring.initialHeading;
  ret.initialOrientations = [...spring.initialOrientations];
  ret.attachPoints = spring.attachPoints.map((p) => p.copy);
  ret.attachRotations = [...spring.attachRotations];
  ret.attachPositions = spring.attachPositions.map((pos) => pos.copy);

  // Convert object to index to eliminate circular references
  ret.objects = [...spring.objects.map((b) => parentGroup.bodies.indexOf(b))];

  // Set type of the spring/stick
  if (spring instanceof Stick) {
    ret.type = 'stick';
  } else ret.type = 'spring';

  return ret;
}

/**
 * Converts a texture to base64.
 *
 * @param {ImageBitmap} texture The texture to be converted
 * @returns {string} The base64 data URL
 */
function textureToBase64(texture: ImageBitmap) {
  const cnv = document.createElement('cnv') as HTMLCanvasElement;
  cnv.width = texture.width;
  cnv.height = texture.height;
  const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(texture, 0, 0, texture.width, texture.height);
  return cnv.toDataURL();
}

/**
 * Converts a group into a plain object.
 *
 * @param {Group} group The group to be serialised
 * @returns {any} The plained group
 */
export function groupToPlain(group: Group) {
  const ret: any = {};
  group.removeUnusedSprings();

  // Convert textures to base64 and store indices
  const textures = group.bodies.map((b) => b.texture);
  const textureSet = [...new Set(textures)];
  const indices = group.bodies.map((b) => textureSet.indexOf(b.texture));
  const base64s = textureSet.map((texture) => {
    if (typeof texture === 'string') return texture;
    return textureToBase64(texture);
  });
  const base64Set = [...new Set(base64s)];
  const finalIndices = indices.map(
    (oldI) => base64Set.indexOf(base64s[oldI]),
  );

  ret.textureSet = base64Set;
  ret.bodies = group.bodies.map((b, i) => bodyToPlain(b, finalIndices[i]));
  ret.springs = group.springs.map((s) => springToPlain(s, group));

  return ret;
}

/**
 * Converts a group into a JSON string.
 *
 * @param {Group} group The group to be serialised
 * @returns {string} The JSON string
 */
export function groupToJSONString(group: Group) {
  return JSON.stringify(groupToPlain(group));
}

/**
 * Returns the loaded image from the base64 string.
 *
 * @param {string} imgSrc The base64 data url with the image
 * @returns {Promise<ImageBitmap | 'none'>} The promise to the loaded image
 */
function imageBitmapFromBase64(imgSrc: string | 'none'): Promise<ImageBitmap | 'none'> {
  return new Promise((resolve, reject) => {
    if (imgSrc === 'none') {
      resolve('none');
    }
    try {
      const img = new Image();
      img.onload = () => {
        createImageBitmap(img)
          .then((imgB) => resolve(imgB))
          .catch((err) => reject(err));
      };
      img.src = imgSrc;
    } catch {
      reject(new Error('Texture could not be loaded'));
    }
  });
}

/**
 * Converts a body into a plain object.
 *
 * @param {any} bodyPlain The body as a plain object
 * @param {(ImageBitmap | 'none')[]} textureSet The textures in the system
 * @returns {Body} The created Body
 */
function bodyFromPlain(bodyPlain: any, textureSet: (ImageBitmap | 'none')[]) {
  const ret: Body = Object.create(Body.prototype);
  const obj = bodyPlain;

  ret.pos = Vec2.fromObject(obj.pos);
  ret.shape = Shape.fromObject(obj.shape);
  ret.am = obj.am;
  ret.ang = obj.ang;
  ret.axes = obj.axes.map((a: Vec2AsObject) => Vec2.fromObject(a));
  ret.boundingBox = {
    x: new MinMax(obj.boundingBox.x.min, obj.boundingBox.x.max),
    y: new MinMax(obj.boundingBox.y.min, obj.boundingBox.y.max),
  };
  ret.defaultAxes = obj.defaultAxes.map((da: Vec2AsObject) => Vec2.fromObject(da));
  ret.fc = obj.fc;
  ret.k = obj.k;
  if (Number.isFinite(obj.layer)) ret.layer = obj.layer;
  else ret.layer = undefined;
  ret.m = obj.m;
  ret.rotation = obj.rotation;
  ret.style = obj.style;
  ret.vel = Vec2.fromObject(obj.vel);
  ret.minMaxes = obj.minMaxes.map((mmObj: MinMax) => new MinMax(mmObj.min, mmObj.max));

  ret.texture = textureSet[obj.texture];
  ret.textureRepeat = obj.textureRepeat;
  ret.textureTransform = {
    offset: Vec2.fromObject(obj.textureTransform.offset),
    scale: obj.textureTransform.scale,
    rotation: obj.textureTransform.rotation,
  };

  return ret;
}

/**
 * Creates a spring or stick from the plain object representation
 *
 * @param {any} springPlain The spring as a plain object
 * @param {Body[]} bodyList The list of bodies in the system
 * @returns {StickOrSpring} The created object (stick/spring)
 */
function springFromPlain(springPlain: any, bodyList: Body[]) {
  let ret;
  const obj = springPlain;
  if (obj.type as ('stick' | 'spring') === 'stick') {
    ret = Object.create(Stick.prototype) as Stick;
  } else ret = Object.create(Spring.prototype) as Spring;

  ret.length = obj.length;
  ret.springConstant = obj.springConstant;
  ret.pinned = obj.pinned;
  ret.objects = obj.objects.map((bIndex: number) => bodyList[bIndex]);
  ret.rotationLocked = obj.rotationLocked;
  ret.initialHeading = obj.initialHeading;
  ret.initialOrientations = obj.initialOrientations;
  ret.attachRotations = obj.attachRotations;
  ret.attachPoints = obj.attachPoints.map((p: Vec2) => Vec2.fromObject(p));
  ret.attachPositions = obj.attachPositions.map((p: Vec2) => Vec2.fromObject(p));

  return ret;
}

/**
 * Creates a group from a plain object representation.
 *
 * @param {any} groupObj The plain object to create the group from
 * @returns {Group} The created group
 */
export async function groupFromPlain(groupObj: any) {
  const ret: Group = Object.create(Group.prototype);

  const textures: (ImageBitmap | 'none')[] = await Promise.all(
    groupObj.textureSet.map((t: string | 'none') => imageBitmapFromBase64(t)),
  );
  ret.bodies = groupObj.bodies.map((bObj: any) => bodyFromPlain(bObj, textures));
  ret.springs = groupObj.springs.map(
    (springObj: any) => springFromPlain(springObj, ret.bodies),
  );

  return ret;
}

/**
 * Recreates the group from a JSON string.
 *
 * @param {string} jsonStr The JSON string representing a group
 * @returns {Promise<Group>} The group
 */
export function groupFromJSONString(jsonStr:string) {
  return groupFromPlain(JSON.parse(jsonStr));
}
