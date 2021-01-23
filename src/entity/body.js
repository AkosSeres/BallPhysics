import { findOverlap, MinMax } from '../math/minmax';
import Shape from '../math/shape';
import Vec2 from '../math/vec2';
import { defaultBodyColor } from '../util/colorpalette';

const MAX_AXES = 15;

/**
 * @typedef BodyAsObject
 * @property {import('../math/shape').ShapeAsObject} shape The shape of the body
 * @property {number} k Coefficient of restitution
 * @property {number} fc Coefficient of friction
 * @property {number} m The mass of the body
 * @property {import('../math/vec2').Vec2AsObject} pos The center of mass of the body
 * @property {number} am The angular mass of the body
 * @property {number} rotation The rotation of the body
 * @property {number} ang The angular velocity of the body
 * @property {import('../math/vec2').Vec2AsObject} vel The velocity of the body
 * @property {string | number} [layer] The layer of the body
 * @property {import('../math/vec2').Vec2AsObject[]} defaultAxes The axes of the body when
 * it's rotation is 0
 * @property {import('../math/vec2').Vec2AsObject[]} axes The axes of the body
 * @property {{x:import('../math/minmax').MinMaxAsObject,y:import('../math/minmax').MinMaxAsObject}}
 * boundingBox The bounding box of the body
 * @property {string} style The style of the body
 */

/**
 * A class representing a body
 */
class Body {
  /**
   * Creates and initalises a body.
   *
   * @param {Shape} shape The frame of the body
   * @param {number} density The density of the body. If set to 0, the body is fixed.
   * @param {number} k The coefficient of restitution of the body
   * @param {number} fc The friction coefficient of the body
   */
  constructor(shape, density = 1, k = 0.2, fc = 0.5) {
    this.shape = shape;
    this.k = k;
    this.fc = fc;

    const geometryDat = this.shape.getGeometricalData();
    this.m = geometryDat.area * density;
    this.pos = geometryDat.center;
    this.am = geometryDat.secondArea * density;
    this.rotation = 0;
    this.ang = 0;
    this.vel = new Vec2(0, 0);
    /** @type {number | string | undefined} */
    this.layer = undefined;

    /** @type {Vec2[]} */
    this.defaultAxes = [];
    /** @type {Vec2[]} */
    this.axes = [];
    this.calculateAxes();

    this.boundingBox = {
      x: this.shape.getMinMaxX(),
      y: this.shape.getMinMaxY(),
    };

    /** The style of the body. Has to be a hex color or a texture pointer. */
    this.style = defaultBodyColor;
  }

  /**
   * Calculates the axes of the body and stores them.
   */
  calculateAxes() {
    const maxCos = Math.cos(Math.PI / MAX_AXES);

    this.defaultAxes = this.normals.map((n) => new Vec2(n.x, Math.abs(n.y)));
    for (let i = this.defaultAxes.length - 2; i >= 0; i -= 1) {
      for (let j = this.defaultAxes.length - 1; j > i; j -= 1) {
        const v1 = this.defaultAxes[j];
        const v2 = this.defaultAxes[i];
        if (Math.abs(Vec2.dot(v1, v2)) > maxCos) {
          this.defaultAxes.splice(j, 1);
          this.defaultAxes[i] = v1;
        }
      }
    }
    this.axes = this.defaultAxes.map((a) => a.copy);
  }

  /**
   * Returns the normals of all the sides of the body's polygon.
   *
   * @returns {Vec2[]} The normals
   */
  get normals() {
    if (this.shape.r !== 0) {
      return [new Vec2(0, 1)];
    }
    const normals = this.shape.points.map(
      (p, i) => Vec2.sub(this.shape.points[(i + 1) % this.shape.points.length], p),
    );
    normals.forEach((n) => {
      n.rotate270();
      n.normalize();
    });
    return normals;
  }

  /**
   * Moves the body by a given vector
   *
   * @param {Vec2} v The offset to move by
   */
  move(v) {
    this.shape.move(v);
    this.pos.add(v);
    this.boundingBox.x.max += v.x;
    this.boundingBox.x.min += v.x;
    this.boundingBox.y.max += v.y;
    this.boundingBox.y.min += v.y;
  }

  /**
   * Rotates the body.
   *
   * @param {number} angle The angle to rotate by
   */
  rotate(angle) {
    this.rotation += angle;
    if (this.shape.r === 0) this.shape.rotateAround(this.pos, angle);

    Vec2.rotateArr(this.axes, angle);

    this.boundingBox = {
      x: this.shape.getMinMaxX(),
      y: this.shape.getMinMaxY(),
    };
  }

  /**
   * Calculates the effective velocity of the ball in a
   * given point from it's velocity and angular velocity.
   *
   * @param {Vec2 | import('../math/vec2').Vec2AsObject} point The point to be taken a look at
   * @returns {Vec2} The velocity of the Body in the given point
   */
  velInPlace(point) {
    const vp = Vec2.sub(point, this.pos);
    vp.rotate90();
    vp.mult(this.ang);
    vp.add(this.vel);
    return vp;
  }

  /**
   * Check if a point is inside a point or not.
   *
   * @param {Vec2} p The point to take a look at
   * @returns {boolean} Tells if the body contains a point or not
   */
  containsPoint(p) {
    return this.shape.containsPoint(p);
  }

  /**
   * Fixes the body making it into a wall.
   */
  fixDown() {
    this.m = 0;
  }

  /**
   * Detects collsion between two bodies and returns the collision data.
   *
   * @param {Body} body1 The first body
   * @param {Body} body2 The second body
   * @returns {{normal:Vec2, overlap:number, contactPoint:Vec2} | boolean} Collsion data
   */
  static detectCollision(body1, body2) {
    const b1 = body1;
    const b2 = body2;
    let axes1 = body1.axes;
    let axes2 = body2.axes;
    if (b1.shape.r !== 0) {
      const closest = b2.shape.getClosestPoint(b1.pos);
      const axe = Vec2.sub(closest, b1.pos);
      axe.normalize();
      axes1 = [axe];
    }
    if (b2.shape.r !== 0) {
      const closest = b1.shape.getClosestPoint(b2.pos);
      const axe = Vec2.sub(closest, b2.pos);
      axe.normalize();
      axes2 = [axe];
    }
    const coordinateSystems = [...axes1, ...axes2];
    /**
     * Return the max and min coordinates of the points in the given space.
     *
     * @param {Vec2} normal The vector to project with
     * @returns {import('../math/minmax').MinMax} The max and min values
     */
    const getMinMaxes1 = (normal) => b1.shape.getMinMaxInDirection(normal);
    /**
     * Return the max and min coordinates of the points in the given space.
     *
     * @param {Vec2} normal The vector to project with
     * @returns {import('../math/minmax').MinMax} The max and min values
     */
    const getMinMaxes2 = (normal) => b2.shape.getMinMaxInDirection(normal);
    /** @type {import('../math/minmax').MinMax[]} */
    const overlaps = [];
    if (coordinateSystems.some((s) => {
      const currMinMax1 = getMinMaxes1(s);
      const currMinMax2 = getMinMaxes2(s);
      const overlap = findOverlap(currMinMax1, currMinMax2);
      if (overlap.max < overlap.min) return true;

      overlaps.push(overlap);
      return false;
    })) return false;
    const overlapSizes = overlaps.map((overlap) => overlap.size());
    let smallestOverlap = overlapSizes[0];
    let index = 0;
    for (let i = 1; i < overlapSizes.length; i += 1) {
      if (smallestOverlap > overlapSizes[i]) {
        smallestOverlap = overlapSizes[i];
        index = i;
      }
    }

    const n = coordinateSystems[index].copy;
    // Make n point towards the second body
    if (Vec2.dot(n, Vec2.sub(b1.pos, b2.pos)) > 0)n.mult(-1);
    let cp;
    if (index < axes1.length) {
      const projected = b2.shape.points.map((p) => Vec2.dot(p, n));
      cp = b2.shape.points[projected.indexOf(Math.min(...projected))].copy;
      if (b2.shape.r !== 0)cp.sub(Vec2.mult(n, b2.shape.r));
    } else {
      const projected = b1.shape.points.map((p) => Vec2.dot(p, n));
      cp = b1.shape.points[projected.indexOf(Math.max(...projected))].copy;
      if (b1.shape.r !== 0)cp.add(Vec2.mult(n, b1.shape.r));
    }
    return {
      normal: n,
      overlap: smallestOverlap,
      contactPoint: cp,
    };
  }

  /**
   * Converts an object to a Body.
   *
   * @param {BodyAsObject} obj The body represented as a JS object.
   * @returns {Body} The created body.
   */
  static fromObject(obj) {
    /** @type {Body} */
    const ret = Object.create(Body.prototype);

    ret.am = obj.am;
    ret.ang = obj.ang;
    ret.axes = obj.axes.map((a) => Vec2.fromObject(a));
    ret.boundingBox = {
      x: new MinMax(obj.boundingBox.x.min, obj.boundingBox.x.max),
      y: new MinMax(obj.boundingBox.y.min, obj.boundingBox.y.max),
    };
    ret.defaultAxes = obj.defaultAxes.map((da) => Vec2.fromObject(da));
    ret.fc = obj.fc;
    ret.k = obj.k;
    ret.layer = obj.layer;
    ret.m = obj.m;
    ret.pos = Vec2.fromObject(obj.pos);
    ret.rotation = obj.rotation;
    ret.shape = Shape.fromObject(obj.shape);
    ret.style = obj.style;
    ret.vel = Vec2.fromObject(obj.vel);

    return ret;
  }

  /**
   * Returns a copy of the body.
   *
   * @returns {Body} The clone.
   */
  get copy() {
    return Body.fromObject(this);
  }
}

export default Body;
