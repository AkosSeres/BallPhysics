/* eslint-disable consistent-return */
import Vec2 from './vec2';
import LineSegment from './linesegment';
import Ball from './ball';
import Wall from './wall';
import Line from './line';
import {
  collisionResponse, collisionResponseWithWall, detectCollision, findOverlap, MinMax, minMaxOfArray,
} from './collision';

const MAX_AXES = 15;

/**
 * An object representation of the Body class for easy conversion to JSON.
 *
 * @typedef {object} BodyAsObject
 * @property {import('./vec2').Vec2AsObject} pos The position
 * @property {import('./vec2').Vec2AsObject} lastPos The last position
 * @property {import('./vec2').Vec2AsObject[]} points The points of the body
 * @property {number} fc The coefficient of friction
 * @property {number} rotation The rotation of the body
 * @property {number} ang The angular velocity
 * @property {number} k The coefficient of restitution (bounciness)
 * @property {import('./vec2').Vec2AsObject} vel The velocity
 * @property {string} id The ID of the body
 */

/**
 * Class representing a body
 * Bodies are movable objects
 * and they collide with other objects (balls)
 */
class Body {
  /**
   * Creates a body and calculates it's centre of mass (position)
   *
   * @param {Vec2[]} points The points that make up the body
   * @param {Vec2} vel The velocity of the body
   * @param {number} k Coefficient of restitution
   * @param {number} ang Angular velocity
   * @param {number} fc Friction coefficient
   */
  constructor(points, vel, k, ang, fc) {
    this.points = points;
    this.pos = new Vec2(points[0].x, points[0].y);

    const pol = this.points;
    let sum1 = 0;
    let sum2 = 0;
    let angle = Vec2.angleACW(
      Vec2.sub(pol[1], pol[0]),
      Vec2.sub(pol[pol.length - 1], pol[0]),
    );
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
    if (sum2 < sum1) {
      const temp = [];
      for (let i = pol.length - 1; i >= 0; i -= 1) temp.push(pol[i]);
      this.points = temp;
    }

    this.m = 1;
    this.am = 1;
    this.boundRadius = 1;
    this.boundsX = new MinMax(0, 0);
    this.boundsY = new MinMax(0, 0);
    /** @type {Vec2[]} */
    this.defaultAxes = [];
    /** @type {Vec2[]} */
    this.axes = [];
    this.recalculateBoundingBox();
    this.calculatePosAndMass();
    this.calculateAxes();
    this.lastPos = this.pos.copy;
    this.fc = 0.4;

    this.rotation = 0;

    if (ang) this.ang = ang;
    else this.ang = 0;

    if (fc || fc === 0) this.fc = fc;

    if (k) this.k = k;
    else this.k = 0.8;

    if (vel !== undefined) this.vel = vel.copy;
    else this.vel = new Vec2(0, 0);

    this.id = `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  /**
   * Calculates the axes of the body. Removes duplicates and too dense areas.
   */
  calculateAxes() {
    const maxCos = Math.cos(Math.PI / MAX_AXES);

    this.defaultAxes = this.normals.map((n) => new Vec2(n.x, Math.abs(n.y)));
    for (let i = this.defaultAxes.length - 2; i >= 0; i -= 1) {
      for (let j = this.defaultAxes.length - 1; j > i; j -= 1) {
        const v1 = this.defaultAxes[j];
        const v2 = this.defaultAxes[i];
        if (Vec2.dot(v1, v2) > maxCos) {
          // const newV = Vec2.add(v1, v2);
          // newV.normalize();
          this.defaultAxes.splice(j, 1);
          this.defaultAxes[i] = v1;
        }
      }
    }
    this.axes = this.defaultAxes.map((a) => a.copy);
  }

  /**
   * Support function for GJK. Returns the point with the biggest dot product with the given vec.
   *
   * @param {Vec2} d The direction
   * @returns {Vec2} The found point.
   */
  support(d) {
    let maxVal = Number.NEGATIVE_INFINITY;
    /** @type {Vec2} */
    let maxP = this.pos;
    this.points.forEach((p) => {
      const dot = Vec2.dot(d, p);
      if (dot > maxVal) {
        maxVal = dot;
        maxP = p;
      }
    });

    return maxP.copy;
  }

  /**
   * Gives the angular mass of the body measured in a given point.
   *
   * @param {Vec2} point The point to measure the angular mass ins
   * @returns {number} The adjusted angular mass
   */
  getAmInPoint(point) {
    let ret = this.am;

    ret += Vec2.sub(this.pos, point).sqlength * this.m;

    return ret;
  }

  /**
   * Get a copy of the body that is not a reference to it
   *
   * @returns {Body} The copy of the body
   */
  get copy() {
    const pointsCopy = this.points.map((p) => new Vec2(p.x, p.y));

    const ret = new Body(pointsCopy, this.vel.copy, this.k, this.ang, this.fc);
    ret.rotation = this.rotation;
    ret.lastPos = this.lastPos.copy;
    ret.pos = this.pos.copy;

    return ret;
  }

  /**
   * Moves the body by the given coordinates
   * It has to move all the points of the body and
   * also the centre of mass (pos) of the body
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  move(x, y) {
    this.pos.x += x;
    this.pos.y += y;
    this.points.forEach((point) => {
      const p = point;
      p.x += x;
      p.y += y;
    });
    this.boundsX.min += x;
    this.boundsX.max += x;
    this.boundsY.min += y;
    this.boundsY.max += y;
  }

  recalculateBoundingBox() {
    this.boundsX = minMaxOfArray(this.points.map((p) => p.x));
    this.boundsY = minMaxOfArray(this.points.map((p) => p.y));
  }

  /**
   * Function that does the collision detection and
   * collision behavior between the body and ball
   *
   * @param {Ball} ball The ball to collide with the body
   * @returns {import('./physics').CollisionData | undefined} The collision data
   */
  collideWithBall(ball) {
    let heading;
    let rel;
    let cp;

    if (Vec2.dist(ball.pos, this.pos) > ball.r + this.boundRadius) return;

    this.points.forEach((point, idx) => {
      let p = new Vec2(point.x, point.y);
      p.x -= ball.pos.x;
      p.y -= ball.pos.y;
      if (p.length <= ball.r) {
        heading = p.heading + Math.PI;
        rel = p.length;

        const move = Vec2.fromAngle(heading);
        move.mult(ball.r - rel);
        this.move(
          (move.x * -1 * ball.m) / (this.m + ball.m),
          (move.y * -1 * ball.m) / (this.m + ball.m),
        );
        ball.move(
          (move.x * 1 * this.m) / (this.m + ball.m),
          (move.y * 1 * this.m) / (this.m + ball.m),
        );

        cp = new Vec2(point.x, point.y);
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

        const move = Vec2.fromAngle(heading);
        move.mult(ball.r - rel);
        this.move(
          (move.x * -1 * ball.m) / (this.m + ball.m),
          (move.y * -1 * ball.m) / (this.m + ball.m),
        );
        ball.move(
          (move.x * 1 * this.m) / (this.m + ball.m),
          (move.y * 1 * this.m) / (this.m + ball.m),
        );

        cp = ball.pos.copy;
        cp.add(Vec2.mult(Vec2.fromAngle(heading + Math.PI), d));
      }
    });

    if (Number.isFinite(heading) && cp) {
      // Create collision space basis
      const n = Vec2.sub(cp, ball.pos);// normal/perpendicular
      n.setMag(-1);
      // Calculate collsion response
      collisionResponse(this, ball, cp, n);
      return { cp, n };
    }
  }

  /**
   * Calculates the mass, moment od intertia and
   * the centre of mass of the body
   */
  calculatePosAndMass() {
    /** @type {Vec2[][]} */
    const poligons = [];
    poligons.push([]);
    this.points.forEach((p) => {
      poligons[0].push(new Vec2(p.x, p.y));
    });

    if (this.isConcave) {
      /**
       * @param {number[]} arr Numbers
       * @param {number} item Number to find
       * @returns {boolean} Whether the number is in the array
       */
      const includes = (arr, item) => {
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i] === item) return true;
        }
        return false;
      };
      /**
       * @param {LineSegment} segment Line segment to intersect with
       * @param {Vec2[]} pol Polygon to intersect with
       * @param {number[]} exceptions Exceptions
       * @returns {boolean} Whether intersection is detected
       */
      const intersectWithPoligon = (segment, pol, exceptions) => {
        for (let i = 0; i < pol.length; i += 1) {
          if (!includes(exceptions, i)) {
            const side = new LineSegment(
              new Vec2(pol[i].x, pol[i].y),
              new Vec2(pol[(i + 1) % pol.length].x, pol[(i + 1) % pol.length].y),
            );
            if (LineSegment.intersect(segment, side)) return true;
          }
        }
        return false;
      };
      let found = true;

      const loopFunc = () => {
        found = false;
        for (let i = 0; i < poligons.length; i += 1) {
          const pol = poligons[i];
          let a = Vec2.sub(pol[1], pol[0]);
          let b = Vec2.sub(pol[pol.length - 1], pol[0]);
          let angle = Vec2.angleACW(a, b);
          if (angle > Math.PI) {
            found = true;
            const j = 0;
            let k = j + 2;
            let newSide = new LineSegment(
              new Vec2(pol[j].x, pol[j].y),
              new Vec2(pol[k % pol.length].x, pol[k % pol.length].y),
            );
            let newSideHeading = new Vec2(
              newSide.b.x - newSide.a.x,
              newSide.b.y - newSide.a.y,
            ).heading;
            while (
              !(a.heading > b.heading
                ? (newSideHeading > a.heading
                  && newSideHeading < 2 * Math.PI)
                || (newSideHeading > 0 && newSideHeading < b.heading)
                : newSideHeading > a.heading && newSideHeading < b.heading)
              || intersectWithPoligon(
                new LineSegment(
                  new Vec2(pol[j % pol.length].x, pol[j % pol.length].y),
                  new Vec2(pol[k % pol.length].x, pol[k % pol.length].y),
                ),
                pol,
                [
                  (pol.length - 1) % pol.length,
                  j % pol.length,
                  (k - 1) % pol.length,
                  k % pol.length,
                ],
              )
            ) {
              k += 1;
              newSide = new LineSegment(
                new Vec2(pol[j].x, pol[j].y),
                new Vec2(pol[k % pol.length].x, pol[k % pol.length].y),
              );
              newSideHeading = new Vec2(
                newSide.b.x - newSide.a.x,
                newSide.b.y - newSide.a.y,
              ).heading;
            }
            const pol1 = [];
            const pol2 = [];
            for (let l = j; l <= k; l += 1) {
              pol1.push(pol[l % pol.length]);
            }
            for (let l = k; l <= j + pol.length; l += 1) {
              pol2.push(pol[l % pol.length]);
            }
            poligons[i] = pol1;
            poligons.push(pol2);
            return;
          }
          for (let j = 1; j < pol.length; j += 1) {
            a = Vec2.sub(pol[(j + 1) % pol.length], pol[j]);
            b = Vec2.sub(pol[j - 1], pol[j]);
            angle = Vec2.angleACW(a, b);
            if (angle > Math.PI) {
              found = true;
              let k = j + 2;
              let newSide = new LineSegment(
                new Vec2(pol[j].x, pol[j].y),
                new Vec2(pol[k % pol.length].x, pol[k % pol.length].y),
              );
              let newSideHeading = new Vec2(
                newSide.b.x - newSide.a.x,
                newSide.b.y - newSide.a.y,
              ).heading;
              while (
                !(a.heading > b.heading
                  ? (newSideHeading > a.heading
                    && newSideHeading < 2 * Math.PI)
                  || (newSideHeading > 0 && newSideHeading < b.heading)
                  : newSideHeading > a.heading && newSideHeading < b.heading)
                || intersectWithPoligon(newSide, pol, [
                  (j - 1) % pol.length,
                  j % pol.length,
                  (k - 1) % pol.length,
                  k % pol.length,
                ])
              ) {
                k += 1;
                newSide = new LineSegment(
                  new Vec2(pol[j].x, pol[j].y),
                  new Vec2(pol[k % pol.length].x, pol[k % pol.length].y),
                );
                newSideHeading = new Vec2(
                  newSide.b.x - newSide.a.x,
                  newSide.b.y - newSide.a.y,
                ).heading;
              }
              const pol1 = [];
              const pol2 = [];
              for (let l = j; l <= k; l += 1) {
                pol1.push(pol[l % pol.length]);
              }
              for (let l = k; l <= j + pol.length; l += 1) {
                pol2.push(pol[l % pol.length]);
              }
              poligons[i] = pol1;
              poligons.push(pol2);
              return;
            }
          }
        }
      };
      while (found) {
        loopFunc();
      }
    }

    for (let i = poligons.length - 1; i >= 0; i -= 1) {
      const pol = poligons[i];
      while (pol.length > 3) {
        poligons.push([pol[0], pol[1], pol[2]]);
        pol.splice(1, 1);
      }
    }

    let mSum = 0;
    let amSum = 0;
    const pSum = new Vec2(0, 0);
    poligons.forEach((pol) => {
      const a = Math.sqrt(
        ((pol[0].x - pol[1].x) ** 2) + ((pol[0].y - pol[1].y) ** 2),
      );
      const b = Math.sqrt(
        ((pol[1].x - pol[2].x) ** 2) + ((pol[1].y - pol[2].y) ** 2),
      );
      const c = Math.sqrt(
        ((pol[2].x - pol[0].x) ** 2) + ((pol[2].y - pol[0].y) ** 2),
      );
      const s = (a + b + c) / 2;
      const m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      mSum += m;
      pSum.x += (m * (pol[0].x + pol[1].x + pol[2].x)) / 3;
      pSum.y += (m * (pol[0].y + pol[1].y + pol[2].y)) / 3;
    });
    pSum.div(mSum);
    /** @type {Vec2} */
    this.pos = pSum;
    /** @type {number} */
    this.m = mSum;

    // calculating the moment of inertia finally
    poligons.forEach((pol) => {
      let a = Math.sqrt(
        ((pol[0].x - pol[1].x) ** 2) + ((pol[0].y - pol[1].y) ** 2),
      );
      const b = Math.sqrt(
        ((pol[1].x - pol[2].x) ** 2) + ((pol[1].y - pol[2].y) ** 2),
      );
      const c = Math.sqrt(
        ((pol[2].x - pol[0].x) ** 2) + ((pol[2].y - pol[0].y) ** 2),
      );
      const s = (a + b + c) / 2;
      const m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const bLine = new Line(pol[1], pol[2]);
      const h = bLine.distFromPoint(pol[0]);
      const nVec = Vec2.sub(pol[2], pol[1]);
      nVec.rotate90();
      nVec.add(pol[1]);
      const nLine = new Line(pol[1], nVec);
      a = nLine.distFromPoint(pol[0]);
      let am = ((b * b * b * h) - (b * b * h * a) + (b * h * a * a) + (b * h * h * h)) / 36;
      am
        += ((new Vec2(
          (pol[0].x + pol[1].x + pol[2].x) / 3,
          (pol[0].y + pol[1].y + pol[2].y) / 3,
        ).dist(this.pos) ** 2) * m);
      amSum += am;
    });
    this.am = amSum;

    this.boundRadius = Math.max(
      ...this.points.map((p) => Vec2.dist(p, this.pos)),
    );
  }

  /**
   * Rotates the body around it's centre of mass by a given ange
   * Has to do the transformation for all the points
   *
   * @param {number} angle Rotation angle
   */
  rotate(angle) {
    this.points.forEach((p) => {
      const point = p;
      point.sub(this.pos);
      point.rotate(angle);
      point.add(this.pos);
    });
    this.rotation += angle;
    this.recalculateBoundingBox();
    Vec2.rotateArr(this.axes, angle);
  }

  /**
   * Finds out if the body is concave or not
   *
   * @returns {boolean} True if the body is concave
   */
  get isConcave() {
    const pol = this.points;
    let angle = Vec2.angleACW(
      Vec2.sub(pol[1], pol[0]),
      Vec2.sub(pol[pol.length - 1], pol[0]),
    );
    if (angle > Math.PI) return true;
    for (let i = 1; i < pol.length - 1; i += 1) {
      angle = Vec2.angleACW(
        Vec2.sub(pol[(i + 1) % pol.length], pol[i]),
        Vec2.sub(pol[i - 1], pol[i]),
      );
      if (angle > Math.PI) return true;
    }
    angle = Vec2.angleACW(
      Vec2.sub(pol[0], pol[pol.length - 1]),
      Vec2.sub(pol[pol.length - 2], pol[pol.length - 1]),
    );
    if (angle > Math.PI) return true;
    return false;
  }

  /**
   * Does the collision algorithm between two bodies
   *
   * @param {Body} body1 First body
   * @param {Body} body2 Second body
   * @returns {import('./physics').CollisionData | undefined} The collision data
   */
  static collide(body1, body2) {
    const b1 = body1;
    const b2 = body2;

    const coordinateSystems = [...b1.axes, ...b2.axes];
    const minMaxes1 = coordinateSystems.map(
      (normal) => minMaxOfArray(b1.points.map((p) => Vec2.dot(p, normal))),
    );
    const minMaxes2 = coordinateSystems.map(
      (normal) => minMaxOfArray(b2.points.map((p) => Vec2.dot(p, normal))),
    );

    const overlaps = coordinateSystems.map((s, i) => findOverlap(minMaxes1[i], minMaxes2[i]));
    const overlapSizes = overlaps.map((overlap) => (overlap.max - overlap.min));
    if (overlapSizes.some((size) => (size < 0))) return;

    let smallestOverlap = Number.MAX_VALUE;
    let index = 0;
    overlapSizes.forEach((size, idx) => {
      if (size < smallestOverlap) {
        smallestOverlap = size;
        index = idx;
      }
    });

    /** @type {Body} */
    let guest;
    let owner;
    const n = coordinateSystems[index].copy;
    if (Vec2.dot(Vec2.sub(b1.pos, b2.pos), n) > 0) n.mult(-1);
    const toMove1 = Vec2.mult(n, -(smallestOverlap * b1.m) / (b1.m + b2.m));
    const toMove2 = Vec2.mult(n, (smallestOverlap * b2.m) / (b1.m + b2.m));

    if (index < b1.axes.length) {
      guest = b2;
      owner = b1;
    } else {
      guest = b1;
      owner = b2;
    }
    b1.move(toMove1.x, toMove1.y);
    b2.move(toMove2.x, toMove2.y);

    const d = Vec2.sub(guest.pos, owner.pos);
    let projected;
    if (Vec2.dot(d, n) >= 0) {
      projected = guest.points.map((p) => Vec2.dot(p, n));
    } else {
      const negN = Vec2.mult(n, -1);
      projected = guest.points.map((p) => Vec2.dot(p, negN));
    }
    const cp = guest.points[projected.indexOf(Math.min(...projected))];
    const vel1InPos = b1.velInPlace(cp);
    const vel2InPos = b2.velInPlace(cp);
    if (Vec2.dot(vel1InPos, n) < Vec2.dot(vel2InPos, n)) return;

    // Calculate collision response
    n.mult(1);
    collisionResponse(b1, b2, cp, n);
    return { n, cp };
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
   * Detects and reacts to collision with a fixedBall
   *
   * @param {import('./physics').FixedBall} fixedBall The fixedBall to take the collision with
   * @returns {import('./physics').CollisionData | undefined} The collision data
   */
  collideWithFixedBall(fixedBall) {
    /** @type {Vec2 | undefined} */
    let cp;
    /** @type {Vec2 | undefined} */
    let n;
    const b = fixedBall;

    const onSide = this.points.some((point, idx) => {
      const bp = Vec2.sub(b, point);
      if (bp.sqlength <= b.r * b.r) {
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
      if (d >= -b.r && d < b.r && posOnLine >= 0
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
        const toMoveAmount = Vec2.sub(cp, b).length - b.r;
        const toMove = Vec2.mult(n, toMoveAmount);
        this.move(toMove.x, toMove.y);
        collisionResponseWithWall(this, cp, n);
        return { cp, n };
      }
    }
  }

  /**
   * Does a collision with a wall.
   *
   * @param {Wall} wall The wall to collide with
   * @returns {import('./physics').CollisionData | undefined} Collision data
   */
  collideWithWall(wall) {
    const xOverlap = findOverlap(this.boundsX, wall.boundsX);
    const yOverlap = findOverlap(this.boundsY, wall.boundsY);
    if (xOverlap.size() <= 0 || yOverlap.size() <= 0) return;

    const data = detectCollision(this.points, wall.points, this.axes, wall.axes);
    if (typeof data !== 'boolean') {
      const { normal, overlap, index } = data;
      if (Vec2.dot(Vec2.sub(this.pos, wall.center), normal) < 0) normal.mult(-1);
      const toMove = Vec2.mult(normal, overlap);
      /** @type {Wall|Body} */
      let guest;
      let d;

      if (index < this.axes.length) {
        guest = wall;
        d = Vec2.sub(guest.center, this.pos);
      } else {
        guest = this;
        d = Vec2.sub(this.pos, wall.center);
      }
      this.move(toMove.x, toMove.y);

      let projected;
      if (Vec2.dot(d, normal) >= 0) {
        projected = guest.points.map((p) => Vec2.dot(p, normal));
      } else {
        const negN = Vec2.mult(normal, -1);
        projected = guest.points.map((p) => Vec2.dot(p, negN));
      }
      const cp = guest.points[projected.indexOf(Math.min(...projected))];
      const velInPos = this.velInPlace(cp);
      if (Vec2.dot(velInPos, normal) > 0) return;

      collisionResponseWithWall(this, cp, normal);
      return { n: normal, cp };
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

    const v = new Vec2(r, 0);

    const testerSegment = new LineSegment(p, Vec2.add(v, p));

    const filtered = sides
      .filter((side) => LineSegment.intersect(side, testerSegment) instanceof Object);
    return filtered.length % 2 === 1;
  }

  /**
   * Returns an array containing all the sides of the body
   *
   * @returns {LineSegment[]} All the sides of the body
   */
  get sides() {
    return this.points.map((element, index) => new LineSegment(
      element,
      this.points[(index + 1) % this.points.length],
    ));
  }

  /**
   * Calculates the effective velocity of the body object in a
   * given point from it's velocity and angular velocity
   *
   * @param {Vec2 | import('./vec2').Vec2AsObject} point The point to be taken a look at
   * @returns {Vec2} The velocity of the Body in the given point
   */
  velInPlace(point) {
    const vp = Vec2.sub(point, this.pos);
    vp.rotate(Math.PI / 2);
    vp.mult(this.ang);
    vp.add(this.vel);
    return vp;
  }

  /**
   * Calculates the effective mass of the body in
   * a given point when pulled/pushed in a given direction
   * by a hypothetical force
   *
   * @param {Vec2} point The given point
   * @param {Vec2} direction The direction of the force
   * @returns {number} The effective mass of the body in the given point
   */
  effectiveMass(point, direction) {
    const r = Vec2.sub(point, this.pos);// Vector to the collision point
    const angle = Vec2.angle(direction, r);
    const rotationalMass = ((Math.sin(angle) ** 2) * (r.length ** 2)) / this.am;
    return 1 / (rotationalMass + (1 / this.m));
  }

  /**
   * Realistically applies a change of velocity (momentum)
   * on the body
   *
   * @param {Vec2} dvel The change in velocity
   * @param {Vec2} point The point of pushing
   */
  applyDeltaVelInPoint(dvel, point) {
    const r = Vec2.sub(point, this.pos);
    if (r.length === 0) {
      this.vel.add(dvel);
      return;
    }
    const angle = Vec2.angle(r, dvel);
    // Change vel in line with the center of mass
    const deltaVlined = Vec2.mult(r, Vec2.dot(dvel, r) / (r.length ** 2));
    this.vel.add(deltaVlined);

    // Change it perpendicular to the line
    const d = r.copy;
    d.rotate(Math.PI / 2);
    d.setMag(1);
    const rotateDirection = Math.sign(Vec2.dot(dvel, d));
    const dvelAng = dvel.length * Math.cos(angle);
    const mEff = 1 / ((1 / this.m) + ((r.length ** 2) / this.am));
    const dvm = (dvelAng * mEff) / this.m;
    this.vel.add(Vec2.mult(d, dvm * rotateDirection));

    const dAng = (rotateDirection * dvelAng * mEff * r.length) / this.am;
    this.ang -= dAng;
  }

  /**
   * @returns {BodyAsObject} The Body represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    const ret = {};

    ret.points = this.points.map((p) => ({
      x: p.x,
      y: p.y,
    }));
    ret.vel = this.vel.toJSObject();
    ret.k = this.k;
    ret.ang = this.ang;
    ret.fc = this.fc;
    ret.pos = this.pos.toJSObject();
    ret.lastPos = this.lastPos.toJSObject();
    ret.rotation = this.rotation;
    ret.id = this.id;

    return ret;
  }

  /**
   * Creates a Body class from the given object
   *
   * @param {BodyAsObject} obj The object to create the class from
   * @returns {Body} The Body object
   */
  static fromObject(obj) {
    const ret = new Body(
      obj.points.map((p) => (new Vec2(p.x, p.y))),
      Vec2.fromObject(obj.vel),
      obj.k,
      obj.ang,
      obj.fc,
    );

    ret.id = obj.id;
    ret.pos = Vec2.fromObject(obj.pos);
    ret.lastPos = Vec2.fromObject(obj.lastPos);
    ret.rotation = obj.rotation;

    return ret;
  }
}

export default Body;
