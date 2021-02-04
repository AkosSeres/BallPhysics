import Body from '../entity/body';
import LineSegment from '../math/linesegment';
import Vec2 from '../math/vec2';

/**
 * An object representation of the Spring class for easy conversion to JSON.
 *
 * @typedef {object} SpringAsObject
 * @property {number} length The length of the spring
 * @property {number} springConstant The stiffness of the spring
 * @property {boolean | {x:number, y:number}} pinned This property indicates whether
 * the spring is pinned or not
 * @property {import('../physics').ObjectIdentifier[]} objects The indices of the attached objects
 * @property {boolean} rotationLocked The variable inticating whether or not
 * the attached objects are allowed to rotate freely
 * @property {"spring"} type Indicates that the object is a spring
 */

/**
 * Class representing a string
 * They act like springs in real life
 * You can attach other objects to the ends of them
 * They do not collide with other object neither with each other
 */
class Spring {
  /**
   * Creates a spring
   *
   * @param {number} length The unstreched length of the spring
   * @param {number} springConstant Spring constant
   */
  constructor(length, springConstant) {
    this.length = length;
    this.springConstant = springConstant;
    /** @type {boolean | {x:number, y:number}} */
    this.pinned = false;
    /** @type {Body[]} */
    this.objects = [];
    this.rotationLocked = false;
    this.initialHeading = 0;
    this.initialOrientations = [0, 0];
    /** @type {Vec2[]} */
    this.attachPoints = [];
    /** @type {number[]} */
    this.attachRotations = [];
    /** @type {Vec2[]} */
    this.attachPositions = [];
  }

  /**
   * Returns a copy of the spring
   *
   * @returns {Spring} The copy
   */
  get copy() {
    /** @type {Spring} */
    const ret = Object.create(Spring.prototype);

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
   * Pins one side of the the spring to a given coordinate in space
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  pinHere(x, y) {
    this.pinned = {
      x,
      y,
    };
  }

  /**
   * Removes the pinned tag from the spring
   * You can now attach it to another object
   */
  unpin() {
    this.pinned = false;
  }

  /**
   * Attaches one end of the spring to an object (eg. Ball)
   *
   * @param {Body} object The object that the spring is getting attached to
   * @param {Vec2 | undefined} attachPoint The point to attach the spring to on the body
   */
  attachObject(object, attachPoint = undefined) {
    let ob = this.objects;
    ob.push(object);
    if (attachPoint) this.attachPoints.push(attachPoint.copy);
    else this.attachPoints.push(object.pos.copy);
    this.attachPositions.push(object.pos.copy);
    this.attachRotations.push(object.rotation);
    if (ob.length === 2) {
      this.pinned = false;
    }
    if (ob.length >= 3) {
      ob = [ob[ob.length - 2], ob[ob.length - 1]];
      this.attachPoints = [
        this.attachPoints[this.attachPoints.length - 2],
        this.attachPoints[this.attachPoints.length - 1],
      ];
      this.attachPositions = [
        this.attachPositions[this.attachPositions.length - 2],
        this.attachPositions[this.attachPositions.length - 1],
      ];
      this.attachRotations = [
        this.attachRotations[this.attachRotations.length - 2],
        this.attachRotations[this.attachRotations.length - 1],
      ];
    }
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
    if (isLocked) this.lockRotation();
  }

  /**
   * Updates the seccond attach point.
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
    if (isLocked) this.lockRotation();
  }

  /**
   * Returns the current absolute attach points of the spring.
   *
   * @returns {Vec2[]} The array of points
   */
  get points() {
    const ps = this.objects.map((o, i) => {
      const rStart = Vec2.sub(this.attachPoints[i], this.attachPositions[i]);
      rStart.rotate(o.rotation - this.attachRotations[i]);
      return Vec2.add(rStart, o.pos);
    });
    if (typeof this.pinned !== 'boolean') ps.push(Vec2.fromObject(this.pinned));
    return ps;
  }

  /**
   * Locks the objects attached to the ends of the spring
   * to not rotate around the attach point
   */
  lockRotation() {
    this.rotationLocked = true;
    this.initialOrientations = this.objects.map((body) => body.rotation);
    const ps = this.points;
    this.initialHeading = Vec2.sub(ps[1], ps[0]).heading;
  }

  /**
   * Releases the objects attached to the ends of the spring
   * to rotate around the attach point
   */
  unlockRotation() {
    this.rotationLocked = false;
  }

  /**
   * Arranges the rotations of the bodies to match the orientation when got locked.
   */
  arrangeOrientations() {
    const ps = this.points;
    const currentHeading = Vec2.sub(ps[1], ps[0]).heading;
    const dHeading = currentHeading - this.initialHeading;
    this.objects.forEach((body, i) => {
      const rotationGoal = this.initialOrientations[i] + dHeading;
      body.rotate(rotationGoal - body.rotation);
    });
  }

  /**
   * Returns the spring as a LineSegment.
   *
   * @returns {LineSegment} The segment made from the spring
   */
  getAsSegment() {
    const ps = this.points;
    return new LineSegment(ps[0], ps[1]);
  }

  /**
   * Updates the spring bay the elapsed time
   *
   * @param {number} t Elapsed time
   */
  update(t) {
    if (this.rotationLocked) this.arrangeOrientations();
    let p1;
    let p2;
    if (this.pinned instanceof Object && this.objects[0]) {
      [p2, p1] = [this.pinned, this.objects[0]];
      const ps = this.points;
      const dist = new Vec2(ps[1].x - ps[0].x, ps[1].y - ps[0].y);
      const dl = dist.length - this.length;
      dist.setMag(1);
      dist.mult((dl * this.springConstant * t));
      p1.applyImpulse(ps[1], dist);

      const v = p1.vel;
      v.rotate(-dist.heading);
      if (this.rotationLocked && p1.m !== 0) {
        const s = new Vec2(p2.x, p2.y);
        const r2 = Vec2.sub(p1.pos, s);
        const len = r2.length;
        const am = len * len * p1.m + p1.am;
        const ang = (p1.am * p1.ang - len * p1.m * v.y) / am;

        v.y = -ang * len;

        p1.ang = ang;
      }
      v.rotate(dist.heading);
    } else if (this.objects[0] && this.objects[1]) {
      [p1, p2] = [this.objects[0], this.objects[1]];
      const ps = this.points;
      let dist = Vec2.sub(ps[0], ps[1]);
      const dl = dist.length - this.length;
      dist.setMag(1);
      dist.mult(dl * this.springConstant * t);
      p2.applyImpulse(ps[1], dist);
      dist.mult(-1);
      p1.applyImpulse(ps[0], dist);

      dist = Vec2.sub(p1.pos, p2.pos);
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
        const r1 = Vec2.sub(p1.pos, s);
        const r2 = Vec2.sub(p2.pos, s);
        const len1 = r1.length;
        const len2 = r2.length;
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

export default Spring;
