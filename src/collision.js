import Vec2 from './vec2';
import Polygon from './polygon';

/**
 * Calculates the collsion response when any two physical objects
 * collide with a given collision point and collision normal.
 *
 * @param {import('./physics').PhysicalObject} object1 The first object
 * @param {import('./physics').PhysicalObject} object2 The second object
 * @param {Vec2} contactPoint The collision point
 * @param {Vec2} normal The normal of the colliding surfaces
 */
export function collisionResponse(object1, object2, contactPoint, normal) {
  const n = normal;
  const cp = contactPoint;
  const b1 = object1;
  const b2 = object2;

  const v1 = b1.vel;
  const v2 = b2.vel;
  const ang1 = b1.ang;
  const ang2 = b2.ang;
  const r1 = Vec2.sub(cp, b1.pos);
  const r2 = Vec2.sub(cp, b2.pos);
  const am1 = b1.am;
  const am2 = b2.am;
  const m1 = b1.m;
  const m2 = b2.m;
  const k = (b1.k + b2.k) / 2;
  const fc = (b1.fc + b2.fc) / 2;

  // Effective velocities in the collision point
  const v1InCP = b1.velInPlace(cp);
  const v2InCP = b2.velInPlace(cp);
  // Relative velocity in collision point
  const vRelInCP = Vec2.sub(v2InCP, v1InCP);

  // Calculate impulse
  let impulse = (1 / m1) + (1 / m2);
  impulse += Vec2.dot(
    Vec2.crossScalarFirst(Vec2.cross(r1, n) / am1, r1), n,
  );
  impulse += Vec2.dot(
    Vec2.crossScalarFirst(Vec2.cross(r2, n) / am2, r2), n,
  );
  impulse = -((1 + k) * Vec2.dot(vRelInCP, n)) / impulse;

  // Calculate post-collision velocities
  let u1 = Vec2.sub(v1, Vec2.mult(n, impulse / m1));
  let u2 = Vec2.add(v2, Vec2.mult(n, impulse / m2));

  // Calculate post-collision angular velocities
  let pAng1 = ang1 - (impulse * Vec2.cross(r1, n)) / am1;
  let pAng2 = ang2 + (impulse * Vec2.cross(r2, n)) / am2;

  /**
   * Now calculate the friction reaction
   */
  // Tangential direction
  const t = vRelInCP.copy;
  t.sub(Vec2.mult(n, Vec2.dot(vRelInCP, n)));
  t.setMag(1);

  // Calculate max impulse
  let maxImpulse = (1 / m1) + (1 / m2);
  maxImpulse += Vec2.dot(
    Vec2.crossScalarFirst(Vec2.cross(r1, t) / am1, r1), t,
  );
  maxImpulse += Vec2.dot(
    Vec2.crossScalarFirst(Vec2.cross(r2, t) / am2, r2), t,
  );
  maxImpulse = -Vec2.dot(vRelInCP, t) / maxImpulse;

  // Friction impulse
  let frictionImpulse = Math.sign(maxImpulse) * impulse * fc;
  if (Math.abs(frictionImpulse) > Math.abs(maxImpulse)) frictionImpulse = maxImpulse;

  // Calculate post-friction velocities
  u1 = Vec2.sub(u1, Vec2.mult(t, frictionImpulse / m1));
  u2 = Vec2.add(u2, Vec2.mult(t, frictionImpulse / m2));

  // Calculate post-friction angular velocities
  pAng1 -= (frictionImpulse * Vec2.cross(r1, t)) / am1;
  pAng2 += (frictionImpulse * Vec2.cross(r2, t)) / am2;

  // Store the new values in the objects
  b1.vel = u1;
  b2.vel = u2;
  b1.ang = pAng1;
  b2.ang = pAng2;
}

/**
 * Calculates the collsion response when a physical object
 * collides with an immovable object, like a {@link Wall} or {@link FixedBall}.
 *
 * @param {import('./physics').PhysicalObject} object The phyisical object
 * @param {Vec2 | import('./vec2').Vec2AsObject} contactPoint The collision point
 * @param {Vec2} normal The surface normal
 */
export function collisionResponseWithWall(object, contactPoint, normal) {
  const cp = contactPoint;
  const n = normal;
  const b = object;
  const r = Vec2.sub(cp, b.pos);
  const { am, m } = b;

  // Relative velocity in collision point
  const vRelInCP = Vec2.mult(b.velInPlace(cp), -1);

  // Calculate impulse
  let impulse = (1 / m);
  impulse += Vec2.dot(
    Vec2.crossScalarFirst(Vec2.cross(r, n) / am, r), n,
  );
  impulse = -((1 + b.k) * Vec2.dot(vRelInCP, n)) / impulse;

  // Calculate post-collision velocity
  let u = Vec2.sub(b.vel, Vec2.mult(n, impulse / m));

  // Calculate post-collision angular velocity
  let pAng = b.ang - (impulse * Vec2.cross(r, n)) / am;

  /**
   * Now calculate the friction reaction
   */
  // Tangential direction
  const t = vRelInCP.copy;
  t.sub(Vec2.mult(n, Vec2.dot(vRelInCP, n)));
  t.setMag(1);

  // Calculate max impulse
  let maxImpulse = (1 / m);
  maxImpulse += Vec2.dot(
    Vec2.crossScalarFirst(Vec2.cross(r, t) / am, r), t,
  );
  maxImpulse = -Vec2.dot(vRelInCP, t) / maxImpulse;

  // Friction impulse
  let frictionImpulse = Math.sign(maxImpulse) * impulse * b.fc;
  if (Math.abs(frictionImpulse) > Math.abs(maxImpulse)) frictionImpulse = maxImpulse;

  // Calculate post-friction velocity
  u = Vec2.sub(u, Vec2.mult(t, frictionImpulse / m));

  // Calculate post-friction angular velocity
  pAng -= (frictionImpulse * Vec2.cross(r, t)) / am;

  // Store the new values in the body
  b.vel = u;
  b.ang = pAng;
}

/**
 * Used to descrive an interval.
 *
 * @class
 * @param {number} min The lower bound
 * @param {number} max The high bound
 */
export function MinMax(min, max) {
  this.min = min;
  this.max = max;
}

MinMax.prototype.size = function size() {
  return this.max - this.min;
};

/**
 * Returns the min and max of an array of numbers
 *
 * @param {number[]} arr Array of numbers
 * @returns {MinMax} The min and max value
 */
export function minMaxOfArray(arr) {
  return new MinMax(Math.min(...arr), Math.max(...arr));
}

/**
 * Finds the overlap of two {@link MinMax}-es.
 *
 * @param {MinMax} interval1 The first MinMax
 * @param {MinMax} interval2 The second MinMax
 * @returns {MinMax} Their overlap
 */
export function findOverlap(interval1, interval2) {
  return new MinMax(Math.max(interval1.min, interval2.min),
    Math.min(interval1.max, interval2.max));
}

/**
 * Detects the collision and returns collision data.
 *
 * @param {Vec2[]} points1 The first shape
 * @param {Vec2[]} points2 The other shape
 * @param {Vec2[]} normals1 The axes of the first shape
 * @param {Vec2[]} normals2 The axes of the other shape
 * @returns {{normal:Vec2, overlap:number, index:number} | boolean} Collision data
 */
export function detectCollision(points1, points2, normals1, normals2) {
  const coordinateSystems = [...normals1, ...normals2];
  /**
   * Return the max and min coordinates of the points in the given space.
   *
   * @param {Vec2} normal The vector to project with
   * @returns {import('./collision').MinMax} The max and min values
   */
  const getMinMaxes1 = (normal) => minMaxOfArray(points1.map((p) => Vec2.dot(p, normal)));
  /**
   * Return the max and min coordinates of the points in the given space.
   *
   * @param {Vec2} normal The vector to project with
   * @returns {import('./collision').MinMax} The max and min values
   */
  const getMinMaxes2 = (normal) => minMaxOfArray(points2.map((p) => Vec2.dot(p, normal)));
  /** @type {MinMax[]} */
  const overlaps = [];
  if (coordinateSystems.some((s) => {
    const currMinMax1 = getMinMaxes1(s);
    const currMinMax2 = getMinMaxes2(s);
    const overlap = findOverlap(currMinMax1, currMinMax2);
    overlaps.push(overlap);
    if (overlap.max < overlap.min) return true;
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
  return {
    normal: n,
    overlap: smallestOverlap,
    index,
  };
}

/**
 * @callback supportFunction
 * @param {Vec2} d The direction
 * @returns {Vec2} The max point
 */

/**
 * Detect collision using the GJK algorithm.
 *
 * @param {{pos: Vec2, support: supportFunction}} shape1 The first object
 * @param {{pos: Vec2, support: supportFunction}} shape2 The second object
 * @returns {boolean} Does a collision appear
 */
export function detectCollisionGJK(shape1, shape2) {
  const initial = Vec2.sub(shape2.pos, shape1.pos);
  let sup1 = shape1.support(initial);
  initial.mult(-1);
  let sup2 = shape1.support(initial);
  const points = [Vec2.sub(sup1, sup2)];
  let D = Vec2.sub(sup2, sup1);

  sup1 = shape1.support(D);
  D.mult(-1);
  sup2 = shape2.support(D);
  if ((-Vec2.dot(Vec2.sub(sup1, sup2), D)) < 0) return false;
  points.push(Vec2.sub(sup1, sup2));
  if (points[0].length < points[1].length) D = Vec2.mult(points[0], -1);
  else D = Vec2.mult(points[1], -1);
  sup1 = shape1.support(D);
  D.mult(-1);
  sup2 = shape2.support(D);
  if ((-Vec2.dot(Vec2.sub(sup1, sup2), D)) < 0) return false;
  points.push(Vec2.sub(sup1, sup2));
  const triangle = new Polygon(points);
  return triangle.isPointInside(new Vec2(0, 0));
}
