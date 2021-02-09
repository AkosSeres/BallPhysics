import {MinMax} from '../../../src/math/minmax';
import {
  Body, Spring, StickOrSpring, Vec2,
} from '../../../src/physics';

/**
 * A group contains a set of bodies or
 * springs/stick and groups them together.
 */
class Group {
  bodies: Body[];

  springs: StickOrSpring[];

  /**
   * Initalised the group.
   */
  constructor() {
    this.bodies = [];
    this.springs = [];
  }

  /**
   * Adds a body to the group.
   *
   * @param {Body} b The body to append to the group
   */
  addBody(b: Body) {
    this.bodies.push(b);
  }

  /**
   * Adds a spring to the group.
   *
   * @param {Spring} s The spring to append to the group
   */
  addSpring(s: Spring) {
    this.springs.push(s);
  }

  /**
   * Moves the whole group by a given vector
   *
   * @param {Vec2} d The amount to move the group by
   */
  move(d: Vec2) {
    this.bodies.forEach((b) => b.move(d));
    this.springs.forEach((s) => {
      if (typeof s.pinned !== 'boolean') {
        const pin = s.pinned;
        pin.x += d.x;
        pin.y += d.y;
      }
    });
  }

  /**
   * Scales the contents of the group around a given point.
   *
   * @param {Vec2} center The center of scaling
   * @param {number} factor The scaling factor
   */
  scaleAround(center: Vec2, factor: number) {
    this.bodies.forEach((b) => {
      b.scaleAround(center, factor);
      b.vel.mult(factor);
      if (b.texture !== 'none') {
        // eslint-disable-next-line no-param-reassign
        b.textureTransform.scale *= factor;
        b.textureTransform.offset.mult(factor);
      }
    });
    this.springs.forEach((s) => s.scaleAround(center, factor));
  }

  /**
   * Rotates the contents of the group around a given point.
   *
   * @param {Vec2} center The center of rotation
   * @param {number} angle The angle of rotation
   */
  rotateAround(center: Vec2, angle: number) {
    this.bodies.forEach((b) => b.rotateAround(center, angle));
    this.springs.forEach((s) => s.rotateAround(center, angle));
  }

  /**
   * Calculates and returns the bounding box of the Group.
   *
   * @returns {{x: MinMax, y: MinMax}} The bounding box of the Group
   */
  get boundingBox() {
    let xSize: MinMax;
    if (this.bodies.length !== 0) {
      xSize = this.bodies[0].shape.getMinMaxX();
      this.bodies.forEach((b) => xSize.add(b.boundingBox.x));
      this.springs.forEach((s) => xSize.add(s.getMinMaxX()));
    } else if (this.springs.length !== 0) {
      xSize = this.springs[0].getMinMaxX();
      this.springs.forEach((s) => xSize.add(s.getMinMaxX()));
    } else xSize = new MinMax(0, 0);
    let ySize: MinMax;
    if (this.bodies.length !== 0) {
      ySize = this.bodies[0].shape.getMinMaxY();
      this.bodies.forEach((b) => ySize.add(b.boundingBox.y));
      this.springs.forEach((s) => ySize.add(s.getMinMaxY()));
    } else if (this.springs.length !== 0) {
      ySize = this.springs[0].getMinMaxY();
      this.springs.forEach((s) => ySize.add(s.getMinMaxY()));
    } else ySize = new MinMax(0, 0);
    return {
      x: xSize,
      y: ySize,
    };
  }

  /**
   * Removes the springs from the groups that are
   * attached to bodies that are not part of the group.
   */
  removeUnusedSprings() {
    for (let i = this.springs.length - 1; i >= 0; i -= 1) {
      const spring = this.springs[i];
      if (spring.objects.some((b) => !this.bodies.includes(b))) {
        this.springs.splice(i, 1);
      }
    }
  }

  /**
   * Creates a copy of all the contents of the group and returns it.
   *
   * @returns {Group} The copy of the group
   */
  get copy() {
    const ret: Group = Object.create(Group.prototype);
    this.removeUnusedSprings();

    ret.bodies = this.bodies.map((b) => b.copy);
    ret.springs = this.springs.map((s) => [...s.objects.map((b) => this.bodies.indexOf(b))]).map((ids, i) => {
      const springCopy = this.springs[i].copy;
      springCopy.objects = ids.map((bIndex) => ret.bodies[bIndex]);
      return springCopy;
    });

    return ret;
  }
}

export default Group;
