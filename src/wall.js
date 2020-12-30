import Vec2 from './vec2';
import LineSegment from './linesegment';
import Ball from './ball';

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

  /**
   * Function for collision detection and behavior between balls and walls
   *
   * @param {Ball} ball The ball that is checked if it collides with the wall
   */
  collideWithBall(ball) {
    let heading;
    let rel;

    this.points.forEach((point, idx) => {
      let p = new Vec2(point.x, point.y);
      p.x -= ball.pos.x;
      p.y -= ball.pos.y;
      p.mult(-1);
      if (p.length <= ball.r) {
        heading = p.heading;
        rel = p.length;
      }
      p = new Vec2(point.x, point.y);
      const np = new Vec2(
        this.points[(idx + 1) % this.points.length].x,
        this.points[(idx + 1) % this.points.length].y,
      );
      const bp = new Vec2(ball.pos.x, ball.pos.y);
      const side = new Vec2(np.x - p.x, np.y - p.y);
      const h = side.heading;
      p.rotate(-h + Math.PI);
      np.rotate(-h + Math.PI);
      bp.rotate(-h + Math.PI);
      const d = bp.y - (p.y + np.y) / 2;
      if (d >= -ball.r && d <= ball.r && bp.x >= np.x && bp.x <= p.x) {
        heading = h - Math.PI / 2;
        rel = d;
      }
    });

    if (typeof heading !== 'undefined' && typeof rel !== 'undefined') {
      const pos = new Vec2(ball.pos.x, ball.pos.y);
      const vel = new Vec2(ball.vel.x, ball.vel.y);
      pos.rotate(-heading + Math.PI / 2);
      vel.rotate(-heading + Math.PI / 2);

      if (vel.y > 0) return;
      vel.y *= -ball.k;
      pos.y += ball.r - rel;
      const dvy = vel.y * (1 + ball.k);

      let deltaAng = (Math.sign(vel.x + ball.ang * ball.r) * (dvy * ball.fc))
        / (ball.amc * ball.r);
      const maxDeltaAng = (vel.x + ball.ang * ball.r) / ball.r;

      if (deltaAng / maxDeltaAng > 1) deltaAng = maxDeltaAng;
      const b = ball;
      b.ang -= deltaAng;

      const dvx = (deltaAng * ball.am) / ball.r / ball.m;
      vel.x -= dvx;

      pos.rotate(heading - Math.PI / 2);
      vel.rotate(heading - Math.PI / 2);
      b.pos.x = pos.x;
      b.pos.y = pos.y;
      b.vel.x = vel.x;
      b.vel.y = vel.y;
    }
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
