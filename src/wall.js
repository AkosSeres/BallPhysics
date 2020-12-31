import Vec2 from './vec2';
import LineSegment from './linesegment';
import Ball from './ball';
import { collisionResponseWithWall, MinMax, minMaxOfArray } from './collision';

/**
 * An object representation of the Wall class for easy conversion to JSON.
 *
 * @typedef {object} WallAsObject
 * @property {import('./vec2').Vec2AsObject[]} points Object prepresentation
 * of the points of the wall
 */

/**
 * Class representing a wall.
 * Walls are objects that are immovable and they are rigid.
 * It can be convex or concave.
 */
class Wall {
  /**
   * Create a wall
   *
   * @param {Vec2[]} _points Array of points that make up the wall
   */
  constructor(_points) {
    this.points = _points;
    const pol = this.points;
    let sum1 = 0;
    let sum2 = 0;
    let angle = Vec2.angleACW(
      Vec2.sub(pol[1], pol[0]),
      Vec2.sub(pol[pol.length - 1], pol[0]),
    );
    if (this.points.length > 0) {
      /** @type {Vec2} The "center" of the wall */
      [this.center] = [this.points[0]];
    } else {
      this.center = new Vec2(0, 0);
    }
    this.boundRadius = 1;
    this.calculateCenterAndRadius();
    this.boundsX = new MinMax(0, 0);
    this.boundsY = new MinMax(0, 0);
    this.calculateBoundingBox();

    sum1 += angle;
    sum2 += Math.PI * 2 - angle;
    for (let i = 1; i < pol.length - 1; i += 1) {
      angle = Vec2.angleACW(
        Vec2.sub(pol[(i + 1) % pol.length], pol[i]),
        Vec2.sub(pol[i - 1], pol[i]),
      );
      sum1 += angle;
      sum2 += Math.PI * 2 - angle;
    }
    angle = Vec2.angleACW(
      Vec2.sub(pol[0], pol[pol.length - 1]),
      Vec2.sub(pol[pol.length - 2], pol[pol.length - 1]),
    );
    sum1 += angle;
    sum2 += Math.PI * 2 - angle;
    if (sum2 > sum1) return;

    const temp = [];
    for (let i = pol.length - 1; i >= 0; i -= 1) temp.push(pol[i]);
    this.points = temp;
  }

  calculateBoundingBox() {
    this.boundsX = minMaxOfArray(this.points.map((p) => p.x));
    this.boundsY = minMaxOfArray(this.points.map((p) => p.y));
  }

  /**
   * Function for collision detection and behavior between balls and walls
   *
   * @param {Ball} ball The ball that is checked if it collides with the wall
   * @returns {import('./physics').CollisionData | undefined} The collision data
   */
  collideWithBall(ball) {
    /** @type {Vec2 | undefined} */
    let cp;
    /** @type {Vec2 | undefined} */
    let n;
    const b = ball;

    const onSide = this.points.some((point, idx) => {
      const bp = Vec2.sub(b.pos, point);
      if (bp.sqlength <= ball.r * ball.r) {
        cp = point;
        n = bp;
      }
      const np = this.points[(idx + 1) % this.points.length].copy;
      const side = new Vec2(np.x - point.x, np.y - point.y);
      const sideLenSq = side.sqlength;
      side.setMag(1);
      const normal = side.copy;
      normal.rotate270();
      const posOnLine = Vec2.dot(bp, side);
      const d = Vec2.dot(bp, normal);
      if (d >= -ball.r && d < ball.r && posOnLine >= 0
        && posOnLine * posOnLine <= sideLenSq) {
        cp = Vec2.add(point, Vec2.mult(side, posOnLine));
        n = normal;
        return true;
      }
      return false;
    });
    if (typeof n !== 'undefined') {
      if (!onSide) n.setMag(1);
      if (typeof cp !== 'undefined') {
        n.mult(-1);
        b.pos = Vec2.add(cp, Vec2.mult(n, -ball.r));
        collisionResponseWithWall(b, cp, n);
        return { cp, n };
      }
    }
  }

  /**
   * Returns the normals of all the sides of the body's polygon.
   *
   * @returns {Vec2[]} The normals
   */
  get normals() {
    return this.sides.map((s) => {
      const v = Vec2.sub(s.b, s.a);
      v.setMag(1);
      v.rotate270();
      return v;
    });
  }

  /**
   *Returns true if the point is inside the body
   *
   * @param {Vec2} p The point
   * @returns {boolean} The boolean value
   */
  containsPoint(p) {
    const { sides } = this;
    const r = Math.max(
      ...this.points.map((point) => Vec2.dist(point, p)),
    ) + 1;

    const v = Vec2.fromAngle(0);
    v.setMag(r);

    const testerSegment = new LineSegment(p, Vec2.add(v, p));

    const filtered = sides.filter(
      (side) => LineSegment.intersect(side, testerSegment) !== undefined,
    );
    return filtered.length % 2 === 1;
  }

  /**
   * Calculates the center and the bound radius of the wall
   */
  calculateCenterAndRadius() {
    this.center = this.points.reduce((prev, curr) => Vec2.add(prev, curr));
    this.center.div(this.points.length);

    this.boundRadius = Math.max(
      ...this.points.map((p) => Vec2.dist(p, this.center)),
    );
  }

  /**
   * Returns an array containing all the sides of the body
   *
   * @returns {Array<LineSegment>} The array of sides
   */
  get sides() {
    return this.points.map((element, index) => new LineSegment(
      element,
      this.points[(index + 1) % this.points.length],
    ));
  }

  /**
   * @returns {WallAsObject} The Wall represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    const ret = {};

    ret.points = this.points.map((p) => ({
      x: p.x,
      y: p.y,
    }));

    return ret;
  }

  /**
   * Creates a Wall class from the given object
   *
   * @param {WallAsObject} obj The object to create the class from
   * @returns {Wall} The Wall object
   */
  static fromObject(obj) {
    const ret = new Wall(
      obj.points.map((p) => new Vec2(p.x, p.y)),
    );

    return ret;
  }
}

export default Wall;
