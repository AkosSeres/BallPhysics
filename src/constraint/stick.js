import Vec2 from '../math/vec2';
import Spring from './spring';

/**
 * An object representation of the Spring class for easy conversion to JSON.
 *
 * @typedef {object} StickAsObject
 * @property {number} length The length of the stick
 * @property {number} springConstant Always 0 for sticks
 * @property {boolean | {x:number, y:number}} pinned This property indicates whether
 * the stick is pinned or not
 * @property {import('../physics').ObjectIdentifier[]} objects The indices of the attached objects
 * @property {boolean} rotationLocked The variable inticating whether or not
 * the attached objects are allowed to rotate freely
 * @property {"stick"} type Indicates that the object is a stick
 */

/**
 * Stick class for the physics engine
 * Sticks are not strechable objects that do not collide
 * with other objects but they can hold other objects on their ends
 *
 * @implements {Spring}
 */
class Stick extends Spring {
  /**
   * Creates a stick
   *
   * @param {number} length The length of the stick
   */
  constructor(length) {
    super(length, 0);
    this.springConstant = 0;
  }

  /**
   * Returns a copy of the spring
   *
   * @returns {Stick} The copy
   */
  get copy() {
    /** @type {Stick} */
    const ret = Object.create(Stick.prototype);

    ret.length = this.length;
    ret.springConstant = this.springConstant;
    if (typeof this.pinned === 'boolean') {
      ret.pinned = this.pinned;
    } else ret.pinned = { x: this.pinned.x, y: this.pinned.y };
    ret.objects = this.objects;
    ret.rotationLocked = this.rotationLocked;
    ret.initialHeading = this.initialHeading;
    ret.initialOrientations = [...this.initialOrientations];
    ret.attachPoints = this.attachPoints.map((p) => p.copy);
    ret.attachRotations = [...this.attachRotations];
    ret.attachPositions = this.attachPositions.map((pos) => pos.copy);

    return ret;
  }

  /**
   * Updates the first attach point.
   *
   * @param {Vec2} newAttachPoint The new attach point to have on the first object
   * @param {number} snapRadius The max radius where it snaps to the pos of the object
   */
  updateAttachPoint0(newAttachPoint, snapRadius = 0) {
    const isLocked = this.rotationLocked;
    if (isLocked) this.unlockRotation();
    this.attachPoints[0] = newAttachPoint.copy;
    this.attachPositions[0] = this.objects[0].pos.copy;
    this.attachRotations[0] = this.objects[0].rotation;
    if (this.attachPoints[0].dist(this.attachPositions[0]) <= snapRadius) {
      this.attachPoints[0] = this.attachPositions[0].copy;
    }
    this.length = this.getAsSegment().length;
    if (isLocked) this.lockRotation();
  }

  /**
   * Updates the second attach point.
   *
   * @param {Vec2} newAttachPoint The new attach point to have on the second object
   * or on the pinpoint
   * @param {number} snapRadius The max radius where it snaps to the pos of the object
   */
  updateAttachPoint1(newAttachPoint, snapRadius = 0) {
    const isLocked = this.rotationLocked;
    if (isLocked) this.unlockRotation();
    if (this.objects.length === 2) {
      this.attachPoints[1] = newAttachPoint.copy;
      this.attachPositions[1] = this.objects[1].pos.copy;
      this.attachRotations[1] = this.objects[1].rotation;
      if (this.attachPoints[1].dist(this.attachPositions[1]) <= snapRadius) {
        this.attachPoints[1] = this.attachPositions[1].copy;
      }
    } else if (typeof this.pinned !== 'boolean') {
      this.pinned = newAttachPoint.copy;
    }
    this.length = this.getAsSegment().length;
    if (isLocked) this.lockRotation();
  }

  /**
   * Updates the stick trough an elapsed time
   */
  update() {
    if (this.rotationLocked) this.arrangeOrientations();
    let p1;
    let p2;
    if (this.pinned instanceof Object && 'x' in this.pinned && this.objects[0]) {
      [p2, p1] = [this.pinned, this.objects[0]];
      if (p1.m === 0) return;
      const ps = this.points;
      let dist = new Vec2(ps[1].x - ps[0].x, ps[1].y - ps[0].y);
      dist.setMag(dist.length - this.length);
      p1.move(dist);
      dist = new Vec2(ps[1].x - ps[0].x, ps[1].y - ps[0].y);
      dist.normalize();
      const cp = ps[0];
      const n = dist;
      const b = p1;
      const r = Vec2.sub(cp, b.pos);
      // Relative velocity in collision point
      const vRelInCP = Vec2.mult(b.velInPlace(cp), -1);
      // Calculate impulse
      let impulse = (1 / b.m);
      impulse += Vec2.dot(
        Vec2.crossScalarFirst(Vec2.cross(r, n) / b.am, r), n,
      );
      impulse = -(Vec2.dot(vRelInCP, n)) / impulse;
      // Calculate post-collision velocity
      const u = Vec2.sub(b.vel, Vec2.mult(n, impulse / b.m));
      // Calculate post-collision angular velocity
      const pAng = b.ang - (impulse * Vec2.cross(r, n)) / b.am;
      p1.vel = u;
      p1.ang = pAng;

      const v = p1.vel;
      v.rotate(-dist.heading);
      if (this.rotationLocked && p1.m !== 0) {
        const s = new Vec2(p2.x, p2.y);
        const r2 = Vec2.sub(p1.pos, s);
        const len = r2.length;
        const am = len * len * p1.m + p1.am;
        const ang = (p1.am * p1.ang + len * p1.m * v.y) / am;

        v.y = ang * len;

        p1.ang = ang;
      }
      v.rotate(dist.heading);
    } else if (this.objects[0] && this.objects[1]) {
      [p1, p2] = [this.objects[0], this.objects[1]];
      let ps = this.points;
      let dist = Vec2.sub(ps[0], ps[1]);
      const dl = this.length - dist.length;
      dist.setMag(1);
      const b1 = p1;
      const b2 = p2;
      const m1 = b1.m === 0 ? Infinity : b1.m;
      const m2 = b2.m === 0 ? Infinity : b2.m;
      let move1;
      let move2;
      if (m1 !== Infinity && m2 !== Infinity) {
        move1 = Vec2.mult(dist, (dl * m2) / (m1 + m2));
        move2 = Vec2.mult(dist, (-dl * m1) / (m1 + m2));
      } else if (m1 === Infinity && m2 !== Infinity) {
        move1 = new Vec2(0, 0);
        move2 = Vec2.mult(dist, -dl);
      } else if (m1 !== Infinity && m2 === Infinity) {
        move2 = new Vec2(0, 0);
        move1 = Vec2.mult(dist, dl);
      } else return;
      p1.move(move1);
      p2.move(move2);
      ps = this.points;
      dist = Vec2.sub(ps[1], ps[0]);
      dist.normalize();
      const n = dist;
      const cp0 = ps[0];
      const cp1 = ps[1];
      const ang1 = b1.ang;
      const ang2 = b2.ang;
      const r1 = Vec2.sub(cp0, b1.pos);
      const r2 = Vec2.sub(cp1, b2.pos);
      const am1 = b1.m === 0 ? Infinity : b1.am;
      const am2 = b2.m === 0 ? Infinity : b2.am;
      // Effective velocities in the collision point
      const v1InCP = b1.velInPlace(cp0);
      const v2InCP = b2.velInPlace(cp1);
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
      impulse = -(Vec2.dot(vRelInCP, n)) / impulse;
      // Calculate post-collision velocities
      const u1 = Vec2.sub(b1.vel, Vec2.mult(n, impulse / m1));
      const u2 = Vec2.add(b2.vel, Vec2.mult(n, impulse / m2));
      // Calculate post-collision angular velocities
      const pAng1 = ang1 - (impulse * Vec2.cross(r1, n)) / am1;
      const pAng2 = ang2 + (impulse * Vec2.cross(r2, n)) / am2;
      if (p1.m !== 0) {
        p1.vel = u1;
        p1.ang = pAng1;
      } if (p2.m !== 0) {
        p2.vel = u2;
        p2.ang = pAng2;
      }

      const v1 = p1.vel;
      const v2 = p2.vel;
      v1.rotate(-dist.heading);
      v2.rotate(-dist.heading);
      if (this.rotationLocked && p1.m !== 0 && p2.m !== 0) {
        const s = new Vec2(
          p1.pos.x * p1.m + p2.pos.x * p2.m,
          p1.pos.y * p1.m + p2.pos.y * p2.m,
        );
        s.div(p1.m + p2.m);
        const len1 = Vec2.sub(p1.pos, s).length;
        const len2 = Vec2.sub(p2.pos, s).length;
        const am = len1 * len1 * p1.m
          + p1.am
          + len2 * len2 * p2.m
          + p2.am;
        const sv = ((v1.y - v2.y) * len2) / (len1 + len2) + v2.y;
        const ang = (p1.am * p1.ang
          + p2.am * p2.ang
          + len1 * p1.m * (v1.y - sv)
          - len2 * p2.m * (v2.y - sv))
          / am;

        v1.y = ang * len1 + sv;
        v2.y = -ang * len2 + sv;

        p1.ang = ang;
        p2.ang = ang;
      }

      v1.rotate(dist.heading);
      v2.rotate(dist.heading);
    }
  }
}

export default Stick;
