import Vec2 from '../math/vec2';
import Body from './body';

/**
 * @typedef {{dVel: Vec2, dAng: number}} ChangeOfMotion
 */

/**
 * Calculates the collsion response when any two physical objects
 * collide with a given collision point and collision normal.
 *
 * @param {Body} object1 The first object
 * @param {Body} object2 The second object
 * @param {Vec2} contactPoint The collision point
 * @param {Vec2} normal The normal of the colliding surfaces
 * @returns {ChangeOfMotion[]} The changes in the motion states
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
  if ((Vec2.dot(n, t) ** 2) > 0.5) {
    // No friction impulse is needed, return
    return [
      { dVel: Vec2.sub(u1, b1.vel), dAng: pAng1 - b1.ang },
      { dVel: Vec2.sub(u2, b2.vel), dAng: pAng2 - b2.ang },
    ];
  }

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

  return [
    { dVel: Vec2.sub(u1, b1.vel), dAng: pAng1 - b1.ang },
    { dVel: Vec2.sub(u2, b2.vel), dAng: pAng2 - b2.ang },
  ];
}

/**
 * Calculates the collsion response when a physical object
 * collides with an immovable object, like a {@link Wall} or {@link FixedBall}.
 *
 * @param {Body} object The phyisical object
 * @param {Vec2 | import('../math/vec2').Vec2AsObject} contactPoint The collision point
 * @param {Vec2} normal The surface normal
 * @returns {ChangeOfMotion} The change of the motion state
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
  if ((Vec2.dot(n, t) ** 2) > 0.5) {
    // No friction impulse is needed, return
    b.vel = u;
    b.ang = pAng;
    return { dVel: Vec2.sub(u, b.vel), dAng: pAng - b.ang };
  }

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

  return { dVel: Vec2.sub(u, b.vel), dAng: pAng - b.ang };
}

/**
 * Calculates and applies all collisions on the bodies in the array
 *
 * @param {Body[]} bodies All bodies
 * @returns {import('../physics').CollisionData[]} All the collsions that occured
 */
export function resolveCollisions(bodies) {
  const collisions = [];
  const bodyCount = bodies.length;
  const moveAmountsX = Array(bodyCount).fill(0);
  const moveAmountsY = Array(bodyCount).fill(0);
  const collisionCounts = Array(bodyCount).fill(0);
  const dVelXs = Array(bodyCount).fill(0);
  const dVelYs = Array(bodyCount).fill(0);
  const dAngs = Array(bodyCount).fill(0);

  // Precalculate all minmaxes
  bodies.forEach((b) => b.calculateMinMaxes());

  for (let i = 0; i < bodyCount - 1; i += 1) {
    for (let j = i + 1; j < bodyCount; j += 1) {
      const b1 = bodies[i];
      const b2 = bodies[j];
      // eslint-disable-next-line no-continue
      if (b1.m === 0 && b2.m === 0) continue;
      const collDat = Body.detectCollision(b1, b2);
      if (collDat && typeof collDat !== 'boolean') {
        // Skip if moving away from each other
        const vInPlace1 = Vec2.dot(b1.velInPlace(collDat.contactPoint), collDat.normal);
        const vInPlace2 = Vec2.dot(b2.velInPlace(collDat.contactPoint), collDat.normal);
        collisions.push({ n: collDat.normal, cp: collDat.contactPoint });
        let toMove1 = -collDat.overlap;
        let toMove2 = collDat.overlap;
        if (b1.m === 0) {
          toMove1 = 0;
          const change1 = collisionResponseWithWall(
            b2, collDat.contactPoint, Vec2.mult(collDat.normal, -1),
          );
          dVelXs[j] += change1.dVel.x;
          dVelYs[j] += change1.dVel.y;
          dAngs[j] += change1.dAng;
          collisionCounts[j] += 1;
        } else if (b2.m === 0) {
          toMove2 = 0;
          const change2 = collisionResponseWithWall(
            b1, collDat.contactPoint, Vec2.mult(collDat.normal, 1),
          );
          dVelXs[i] += change2.dVel.x;
          dVelYs[i] += change2.dVel.y;
          dAngs[i] += change2.dAng;
          collisionCounts[i] += 1;
        } else {
          toMove1 *= (b2.m / (b1.m + b2.m));
          toMove2 *= (b1.m / (b1.m + b2.m));
          const [change1, change2] = collisionResponse(
            b1, b2, collDat.contactPoint, Vec2.mult(collDat.normal, 1),
          );
          if (vInPlace1 >= vInPlace2) {
            dVelXs[i] += change1.dVel.x;
            dVelYs[i] += change1.dVel.y;
            dAngs[i] += change1.dAng;
            dVelXs[j] += change2.dVel.x;
            dVelYs[j] += change2.dVel.y;
            dAngs[j] += change2.dAng;
          }
        }
        const toMove1V = Vec2.mult(collDat.normal, toMove1);
        const toMove2V = Vec2.mult(collDat.normal, toMove2);
        moveAmountsX[i] += toMove1V.x;
        moveAmountsX[j] += toMove2V.x;
        moveAmountsY[i] += toMove1V.y;
        moveAmountsY[j] += toMove2V.y;
      }
    }
  }

  for (let i = 0; i < bodyCount; i += 1) {
    const b = bodies[i];
    // eslint-disable-next-line no-continue
    if (b.m === 0) continue;
    const cCount = Math.max(collisionCounts[i], 1);
    b.move(new Vec2(moveAmountsX[i], moveAmountsY[i]));
    b.vel.add(new Vec2(dVelXs[i] / cCount, dVelYs[i] / cCount));
    b.ang += dAngs[i] / cCount;
  }

  return collisions;
}
