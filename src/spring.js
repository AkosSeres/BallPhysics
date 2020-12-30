import Ball from './ball';
import Body from './body';
import Vec2 from './vec2';

/**
 * An object representation of the Spring class for easy conversion to JSON.
 *
 * @typedef {object} SpringAsObject
 * @property {number} length The length of the spring
 * @property {number} springConstant The stiffness of the spring
 * @property {boolean | {x:number, y:number}} pinned This property indicates whether
 * the spring is pinned or not
 * @property {string[]} objects The IDs of the attached objects
 * @property {boolean} rotationLocked The variable inticating whether or not
 * the attached objects are allowed to rotate freely
 * @property {string} id The ID of the Spring
 * @property {"spring"} type Indicates that the object is a spring
 */

/** @typedef {Body|Ball} MovableObject */

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
    /** @type {MovableObject[]} */
    this.objects = [];
    this.rotationLocked = false;
    this.id = `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
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
   * @param {Body | Ball} object The object that the spring is getting attached to
   */
  attachObject(object) {
    let ob = this.objects;
    ob.push(object);
    if (ob.length === 2) {
      this.pinned = false;
    }
    if (ob.length >= 3) {
      ob = [ob[ob.length - 2], ob[ob.length - 1]];
    }
  }

  /**
   * Locks the objects attached to the ends of the spring
   * to not rotate around the attach point
   */
  lockRotation() {
    this.rotationLocked = true;
  }

  /**
   * Releases the objects attached to the ends of the spring
   * to rotate around the attach point
   */
  unlockRotation() {
    this.rotationLocked = false;
  }

  /**
   * Updates the spring bay the elapsed time
   *
   * @param {number} t Elapsed time
   */
  update(t) {
    let p1;
    let p2;
    if (this.pinned instanceof Object && this.objects[0]) {
      [p2, p1] = [this.pinned, this.objects[0]];
      const dist = new Vec2(p2.x - p1.pos.x, p2.y - p1.pos.y);
      const dl = dist.length - this.length;
      dist.setMag(1);
      dist.mult((dl * this.springConstant * t) / p1.m);
      p1.vel.x += dist.x;
      p1.vel.y += dist.y;

      const v = p1.vel;
      v.rotate(-dist.heading);
      if (this.rotationLocked) {
        const s = new Vec2(p2.x, p2.y);
        const r2 = Vec2.sub(p1.pos, s);
        const am = r2.length * r2.length * p1.m + p1.am;
        const ang = (p1.am * p1.ang - r2.length * p1.m * v.y) / am;

        v.y = -ang * r2.length;

        p1.ang = ang;
      }
      v.rotate(dist.heading);
    } else if (this.objects[0] && this.objects[1]) {
      [p1, p2] = [this.objects[0], this.objects[1]];
      let dist = Vec2.sub(p1.pos, p2.pos);
      const dl = dist.length - this.length;
      dist.setMag(1);
      dist.mult(dl * this.springConstant * t);
      p2.vel.add(Vec2.div(dist, p2.m));
      p1.vel.add(Vec2.div(dist, -p1.m));

      dist = Vec2.sub(p1.pos, p2.pos);
      const v1 = p1.vel;
      const v2 = p2.vel;
      v1.rotate(-dist.heading);
      v2.rotate(-dist.heading);

      if (this.rotationLocked) {
        const s = new Vec2(
          p1.pos.x * p1.m + p2.pos.x * p2.m,
          p1.pos.y * p1.m + p2.pos.y * p2.m,
        );
        s.div(p1.m + p2.m);
        const r1 = Vec2.sub(p1.pos, s);
        const r2 = Vec2.sub(p2.pos, s);
        const am = r1.length * r1.length * p1.m
          + p1.am
          + r2.length * r2.length * p2.m
          + p2.am;
        const sv = ((v1.y - v2.y) * r2.length) / (r1.length + r2.length) + v2.y;
        const ang = (p1.am * p1.ang
          + p2.am * p2.ang
          + r1.length * p1.m * (v1.y - sv)
          - r2.length * p2.m * (v2.y - sv))
          / am;

        v1.y = ang * r1.length + sv;
        v2.y = -ang * r2.length + sv;

        p1.ang = ang;
        p2.ang = ang;
      }

      v1.rotate(dist.heading);
      v2.rotate(dist.heading);
    }
  }
}

export default Spring;
