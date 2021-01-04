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
 * @property {import('../physics').ObjectIndentifier[]} objects The indices of the attached objects
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
   * Updates the stick trough an elapsed time
   */
  update() {
    let p1;
    let p2;
    if (this.pinned instanceof Object && 'x' in this.pinned && this.objects[0]) {
      [p2, p1] = [this.pinned, this.objects[0]];
      const dist = new Vec2(p2.x - p1.pos.x, p2.y - p1.pos.y);
      dist.setMag(1);
      dist.mult(-this.length);
      p1.move(-p1.pos.x + p2.x + dist.x, -p1.pos.y + p2.y + dist.y);

      const v = p1.vel;
      v.rotate(-dist.heading);
      v.x = 0;
      if (this.rotationLocked) {
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
      const dist = Vec2.sub(p1.pos, p2.pos);
      const dl = this.length - dist.length;
      dist.setMag(1);
      const move1 = Vec2.mult(dist, (dl * p2.m) / (p1.m + p2.m));
      const move2 = Vec2.mult(dist, (-dl * p1.m) / (p1.m + p2.m));
      p1.move(move1.x, move1.y);
      p2.move(move2.x, move2.y);

      const v1 = p1.vel;
      const v2 = p2.vel;
      v1.rotate(-dist.heading);
      v2.rotate(-dist.heading);
      v1.x = (p1.m * v1.x + p2.m * v2.x) / (p1.m + p2.m);
      v2.x = v1.x;

      if (this.rotationLocked) {
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

export default Stick;
