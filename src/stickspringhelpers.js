import Ball from './ball';
import Spring from './spring';
import Stick from './stick';

/**
 * Creates either a spring or a stick
 *
 * @param {"spring"|"stick"} type Specifies the type of the new item
 * @param {number} length The length of the item
 * @param {number} springConstant The spring constant
 * @returns {Spring | Stick} Returns the item
 */
function createStickOrSpring(type, length, springConstant) {
  if (type === 'spring') {
    return new Spring(length, springConstant);
  }
  if (type === 'stick') {
    return new Stick(length);
  }
  return new Spring(0, 0);
}

/**
 * Creates a Spring class from the given object
 *
 * @param {import('./spring').SpringAsObject | import('./stick').StickAsObject} obj The
 * object to create the class from
 * @param {Ball[]} ballList An array of all the balls in the system
 * @returns {Spring | Stick} The Spring object
 */
export function stickOrSpringFromObject(obj, ballList) {
  const ret = createStickOrSpring(obj.type,
    obj.length, obj.springConstant);

  ret.pinned = obj.pinned;
  ret.rotationLocked = obj.rotationLocked;
  ret.id = obj.id;

  ret.objects = obj.objects.map((e) => {
    const arr = ballList.filter((p) => e === p.id);
    return arr[0];
  });

  return ret;
}

/**
 * @param {Stick | Spring} s The spring or the stick
 * @returns {import('./spring').SpringAsObject | import('./stick').StickAsObject} The
 * spring represented in a JS object.
 * Ready to be converted into JSON
 */
export function stickOrSpringToJSObject(s) {
  /** @type {import('./spring').SpringAsObject | import('./stick').StickAsObject} */
  const ret = {};

  ret.length = s.length;
  ret.springConstant = s.springConstant;
  ret.pinned = s.pinned;
  ret.rotationLocked = s.rotationLocked;
  ret.id = s.id;
  ret.objects = s.objects.map((o) => o.id);
  if (s instanceof Spring) {
    ret.type = 'spring';
  }
  if (s instanceof Stick) {
    ret.type = 'stick';
  }

  return ret;
}
