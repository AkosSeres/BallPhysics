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

    /** @type {MinMax[]} */
    this.minMaxes = [];
    this.calculateMinMaxes();

    /** The style of the body. Has to be a hex color or a texture pointer. */
    this.style = defaultBodyColor;
    /** The texture of the body */
    /** @type {ImageBitmap | 'none'} */
    this.texture = 'none';
    this.textureTransform = {
      offset: new Vec2(0, 0),
      scale: 1,
      rotation: 0,
    };
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
   * Calculates the MinMax intervals in the body's axes' directions.
   */
  calculateMinMaxes() {
    this.minMaxes = this.axes.map((axe) => this.shape.getMinMaxInDirection(axe));
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
   * Calculates the density of the body.
   *
   * @returns {number} The density
   */
  get density() {
    return this.m / this.shape.getGeometricalData().area;
  }

  /**
   * Sets the new density of the shape
   */
  set density(newDensity) {
    if (newDensity < 0 || !Number.isFinite(newDensity)) return;
    const geomDat = this.shape.getGeometricalData();
    this.m = geomDat.area * newDensity;
    this.am = geomDat.secondArea * newDensity;
  }

  /**
   * Fixes the body making it into a wall.
   */
  fixDown() {
    this.m = 0;
  }

  /**
   * Scales the body around a given point.
   *
   * @param {Vec2} center The center of the transformation
   * @param {number} scalingFactor The factor of the scaling
   */
  scaleAround(center, scalingFactor) {
    if (scalingFactor === 0) return;
    this.pos.scaleAround(center, scalingFactor);
    this.shape.points.forEach((p) => p.scaleAround(center, scalingFactor));
    this.shape.r = Math.abs(this.shape.r * scalingFactor);
    this.m *= (scalingFactor ** 2);
    this.am *= (scalingFactor ** 4);
  }

  /**
   * Scales the body around a given point only on the X axis.
   *
   * @param {Vec2} center The center of the transformation
   * @param {number} scalingFactor The factor of the scaling
   */
  scaleAroundX(center, scalingFactor) {
    if (scalingFactor === 0) return;
    const { density } = this;
    this.shape.points.forEach((p) => p.scaleAroundX(center, scalingFactor));
    this.shape.r = Math.abs(this.shape.r * scalingFactor);
    const geometryDat = this.shape.getGeometricalData();
    this.m = geometryDat.area * density;
    this.pos = geometryDat.center;
    this.am = geometryDat.secondArea * density;
    this.calculateAxes();
    this.calculateMinMaxes();
  }

  /**
   * Scales the body around a given point only on the Y axis.
   *
   * @param {Vec2} center The center of the transformation
   * @param {number} scalingFactor The factor of the scaling
   */
  scaleAroundY(center, scalingFactor) {
    if (scalingFactor === 0) return;
    const { density } = this;
    this.shape.points.forEach((p) => p.scaleAroundY(center, scalingFactor));
    this.shape.r = Math.abs(this.shape.r * scalingFactor);
    const geometryDat = this.shape.getGeometricalData();
    this.m = geometryDat.area * density;
    this.pos = geometryDat.center;
    this.am = geometryDat.secondArea * density;
    this.calculateAxes();
    this.calculateMinMaxes();
  }

  /**
   * Applies and impulse on the body.
   *
   * @param {Vec2} contactPoint The point where the impulse applies
   * @param {Vec2} impulse The vector of the impulse
   */
  applyImpulse(contactPoint, impulse) {
    if (this.m === 0) return;
    const r = Vec2.sub(contactPoint, this.pos);
    this.vel.add(Vec2.div(impulse, this.m));
    this.ang += Vec2.cross(r, impulse) / this.am;
  }

  /**
   * Detects collsion between two bodies and returns the collision data.
   * The algorithm expects a precalculated minMaxes array in each of the bodies.
   *
   * @param {Body} body1 The first body
   * @param {Body} body2 The second body
   * @returns {{normal:Vec2, overlap:number, contactPoint:Vec2} | boolean} Collsion data
   */
  static detectCollision(body1, body2) {
    const b1 = body1;
    const b2 = body2;

    // Check if their bounding boxes overlap and return if they do not
    {
      const xOverlap = findOverlap(b1.boundingBox.x, b2.boundingBox.x);
      if (xOverlap.max < xOverlap.min) return false;
      const yOverlap = findOverlap(b1.boundingBox.y, b2.boundingBox.y);
      if (yOverlap.max < yOverlap.min) return false;
    }

    let axes1 = body1.axes;
    let axes2 = body2.axes;
    if (b1.shape.r !== 0) {
      const closest = b2.shape.getClosestPoint(b1.pos);
      const axe = Vec2.sub(closest, b1.pos);
      axe.normalize();
      axes1 = [axe];
      b1.minMaxes = [b1.shape.getMinMaxInDirection(axe)];
    }
    if (b2.shape.r !== 0) {
      const closest = b1.shape.getClosestPoint(b2.pos);
      const axe = Vec2.sub(closest, b2.pos);
      axe.normalize();
      axes2 = [axe];
      b2.minMaxes = [b2.shape.getMinMaxInDirection(axe)];
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
    if (coordinateSystems.some((s, i) => {
      // Retrieve the MinMax from the precalculated ones if it is in there
      let currMinMax1;
      if (i < axes1.length) {
        currMinMax1 = body1.minMaxes[i];
      } else {
        currMinMax1 = getMinMaxes1(s);
      }
      let currMinMax2;
      if (i >= axes1.length) {
        currMinMax2 = body2.minMaxes[i - axes1.length];
      } else {
        currMinMax2 = getMinMaxes2(s);
      }
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
    ret.minMaxes = [];
    ret.calculateMinMaxes();

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
