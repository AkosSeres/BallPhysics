const Vec2 = require('./vec2');
const LineSegment = require('./linesegment');

/** Class representing a wall
 * Walls are objects that are immovable  and they are rigid
 * It can be convex or concave
 */
class Wall {
  /**
   * Create a wall
   * @param {Array<Vec2>} _points Array of points that make up the wall
   */
  constructor(_points) {
    this.points = _points;
    let pol = this.points;
    let sum1 = 0;
    let sum2 = 0;
    let angle = Vec2.angleACW(
      Vec2.sub(pol[1], pol[0]),
      Vec2.sub(pol[pol.length - 1], pol[0])
    );
    this.calculateCenterAndRadius();

    sum1 += angle;
    sum2 += Math.PI * 2 - angle;
    for (let i = 1; i < pol.length - 1; i++) {
      angle = Vec2.angleACW(
        Vec2.sub(pol[(i + 1) % pol.length], pol[i]),
        Vec2.sub(pol[i - 1], pol[i])
      );
      sum1 += angle;
      sum2 += Math.PI * 2 - angle;
    }
    angle = Vec2.angleACW(
      Vec2.sub(pol[0], pol[pol.length - 1]),
      Vec2.sub(pol[pol.length - 2], pol[pol.length - 1])
    );
    sum1 += angle;
    sum2 += Math.PI * 2 - angle;
    if (sum2 > sum1) return;
    else {
      let temp = [];
      for (let i = pol.length - 1; i >= 0; i--) temp.push(pol[i]);
      this.points = temp;
    }
  }

  /**
   * Function for collision detection and behavior between balls and walls
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
      let np = new Vec2(
        this.points[(idx + 1) % this.points.length].x,
        this.points[(idx + 1) % this.points.length].y
      );
      let bp = new Vec2(ball.pos.x, ball.pos.y);
      let side = new Vec2(np.x - p.x, np.y - p.y);
      let h = side.heading;
      p.rotate(-h + Math.PI);
      np.rotate(-h + Math.PI);
      bp.rotate(-h + Math.PI);
      let d = bp.y - (p.y + np.y) / 2;
      if (d >= -ball.r && d <= ball.r && bp.x >= np.x && bp.x <= p.x) {
        heading = h - Math.PI / 2;
        rel = d;
      }
    });

    if (heading === 0 || heading) {
      let pos = new Vec2(ball.pos.x, ball.pos.y);
      let vel = new Vec2(ball.vel.x, ball.vel.y);
      pos.rotate(-heading + Math.PI / 2);
      vel.rotate(-heading + Math.PI / 2);

      if (vel.y > 0) return;
      vel.y *= -ball.k;
      pos.y += ball.r - rel;
      let dvy = vel.y * (1 + 1 / ball.k);

      let deltaAng =
        (Math.sign(vel.x - ball.ang * ball.r) * (dvy * ball.fc)) /
        (ball.amc * ball.r);
      let maxDeltaAng = (vel.x - ball.ang * ball.r) / ball.r;

      if (deltaAng / maxDeltaAng > 1) deltaAng = maxDeltaAng;
      ball.ang += deltaAng;

      let dvx = deltaAng * ball.am / ball.r / ball.m;
      vel.x -= dvx;

      pos.rotate(heading - Math.PI / 2);
      vel.rotate(heading - Math.PI / 2);
      ball.pos.x = pos.x;
      ball.pos.y = pos.y;
      ball.vel.x = vel.x;
      ball.vel.y = vel.y;
    }
  }

  /**
   *Returns true if the point is inside the body
   * @param {Vec2} p The point
   * @return {boolean} The boolean value
   */
  containsPoint(p) {
    let sides = this.sides;
    let r =
      Math.max(
        ...this.points.map((point) => {
          return Vec2.dist(point, p);
        })
      ) + 1;

    let v = Vec2.fromAngle(0);
    v.setMag(r);

    let testerSegment = new LineSegment(p, Vec2.add(v, p));

    let filtered = sides.filter((side) => {
      return LineSegment.intersect(side, testerSegment) != undefined;
    });
    return filtered.length % 2 == 1;
  }

  /**
   * Calculates the center and the bound radius of the wall
   */
  calculateCenterAndRadius() {
    this.center = this.points.reduce((prev, curr) => {
      return Vec2.add(prev, curr);
    });
    this.center.div(this.points.length);

    this.boundRadius = Math.max(
      this.points.map((p) => {
        return Vec2.dist(p, this.center);
      })
    );
  }

  /**
   * Returns an array containing all the sides of the body
   * @return {Array<LineSegment>} The array of sides
   */
  get sides() {
    return this.points.map((element, index) => {
      return new LineSegment(
        element,
        this.points[(index + 1) % this.points.length]
      );
    });
  }

  /**
   * @return {Object} The Wall represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    let ret = {};

    ret.points = this.points.map((p) => {
      return {
        x: p.x,
        y: p.y,
      };
    });

    return ret;
  }

  /**
   * Creates a Wall class from the given object
   * @param {Object} obj The object to create the class from
   * @return {Wall} The Wall object
   */
  static fromObject(obj) {
    let ret = new Wall(
      obj.points.map((p) => {
        return new Vec2(v.x, v.y);
      })
    );

    return ret;
  }
}

module.exports = Wall;
