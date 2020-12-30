import Vec2 from './vec2';
import LineSegment from './linesegment';
import Ball from './ball';
import Wall from './wall';

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
    this.calculatePosAndMass();
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
   * Gives the angular mass of the body measured in a given point
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
  }

  /**
   * Function that does the collision detection and
   * collision behavior between the body and ball
   *
   * @param {Ball} ball The ball to collide with the body
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

        const a = Vec2.fromAngle(heading);
        a.mult(-30);
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

        const a = Vec2.fromAngle(heading);
        a.mult(-30);
      }
    });

    if (Number.isFinite(heading) && cp) {
      const v1 = this.vel.copy;
      const v2 = ball.vel.copy;
      const ang1 = this.ang;
      const ang2 = ball.ang;
      const r1 = Vec2.sub(cp, this.pos);
      const r2 = Vec2.sub(cp, ball.pos);
      const am1 = this.am;
      const am2 = ball.am;
      const m1 = this.m;
      const m2 = ball.m;
      const k = (this.k + ball.k) / 2;
      const fc = (this.fc + ball.fc) / 2;

      // Create collision space basis
      const n = r2.copy;// normal/perpendicular
      n.setMag(-1);

      // Effective velocities in the collision point
      const v1InCP = this.velInPlace(cp);
      const v2InCP = ball.velInPlace(cp);
      // Relative velocity in collision point
      const vRelInCP = Vec2.sub(v2InCP, v1InCP);

      // Calculate impulse
      let impulse = (1 / m1) + (1 / m2);
      impulse += Vec2.dot(
        Vec2.crossScalarFirst(Vec2.cross(r1, n) / am1, r1), n,
      );
      impulse = -((1 + k) * Vec2.dot(vRelInCP, n)) / impulse;

      // Calculate post-collision velocities
      let u1 = Vec2.sub(v1, Vec2.mult(n, impulse / m1));
      let u2 = Vec2.add(v2, Vec2.mult(n, impulse / m2));

      // Calculate post-collision angular velocities
      let pAng1 = ang1 - (impulse * Vec2.cross(r1, n)) / am1;
      let pAng2 = ang2;

      /**
       * Now calculate the friction reaction
       */
      // Tangential direction
      const t = vRelInCP.copy;
      t.sub(Vec2.mult(n, Vec2.dot(vRelInCP, n)));
      t.setMag(1);

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
      let frictionImpulse = impulse * fc;
      if (frictionImpulse > maxImpulse) frictionImpulse = maxImpulse;

      // Calculate post-friction velocities
      u1 = Vec2.sub(u1, Vec2.mult(t, frictionImpulse / m1));
      u2 = Vec2.add(u2, Vec2.mult(t, frictionImpulse / m2));

      // Calculate post-friction angular velocities
      pAng1 -= (frictionImpulse * Vec2.cross(r1, t)) / am1;
      pAng2 += (frictionImpulse * Vec2.cross(r2, t)) / am2;

      // Store the new values in the ball and body
      const b = ball;
      this.vel = u1;
      b.vel = u2;
      this.ang = pAng1;
      b.ang = pAng2;
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
      const a = Math.sqrt(
        ((pol[0].x - pol[1].x) ** 2) + ((pol[0].y - pol[1].y) ** 2),
      );
      const b = Math.sqrt(
        ((pol[1].x - pol[2].x) ** 2) + ((pol[1].y - pol[2].y) ** 2),
      );
      const c = Math.sqrt(
        ((pol[2].x - pol[0].x) ** 2) + ((pol[2].y - pol[0].y) ** 2),
      );
      const w = Math.max(a, b, c);
      const s = (a + b + c) / 2;
      const m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const h = (2 * m) / w;
      const wpartial = Math.sqrt(Math.min(a, c, b) ** 2 - h * h);
      let am = (h * w * (h * h + w * w)) / 24;
      const d = Math.sqrt((h * h) / 36 + (Math.abs(wpartial - w / 2) / 3) ** 2);
      am -= d * d * m;
      am
        += new Vec2(
          (pol[0].x + pol[1].x + pol[2].x) / 3,
          (pol[0].y + pol[1].y + pol[2].y) / 3,
        ).dist(this.pos)
        ** 2
        * m;
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
   * @param {Body} b1 First body
   * @param {Body} b2 Second body
   */
  static collide(b1, b2) {
    let matches = 0;
    let heading = 0;
    let cp = new Vec2(0, 0);
    /** @type {Vec2[]} */
    const cps = [];
    let intersect = false;
    const body1 = b1;
    const body2 = b2;
    b1.points.forEach((p, idx) => {
      const side1 = new LineSegment(
        new Vec2(p.x, p.y),
        new Vec2(
          b1.points[(idx + 1) % b1.points.length].x,
          b1.points[(idx + 1) % b1.points.length].y,
        ),
      );
      b2.points.forEach((pp, idxx) => {
        const side2 = new LineSegment(
          new Vec2(pp.x, pp.y),
          new Vec2(
            b2.points[(idxx + 1) % b2.points.length].x,
            b2.points[(idxx + 1) % b2.points.length].y,
          ),
        );
        const sect = LineSegment.intersect(side1, side2);
        if (sect instanceof Vec2) {
          matches += 1;
          cp.add(sect);
          cps.push(sect);
          intersect = true;
        }
      });
    });

    if (!intersect) return;
    cp.div(matches);

    for (let i = 0; i < Math.floor(matches / 2); i += 1) {
      heading += Vec2.sub(cps[2 * i + 1], cps[2 * i]).heading;
    }
    heading /= matches / 2;
    heading += Math.PI / 2;

    const a = Vec2.fromAngle(heading);

    const startAng1 = b1.ang;
    const startVel1 = b1.vel.copy;
    const startAng2 = b2.ang;
    const startVel2 = b2.vel.copy;

    let move1Min = 0;
    let move1Max = 0;
    let move2Min = 0;
    let move2Max = 0;
    b1.points.forEach((point) => {
      move1Min = Math.min(
        Vec2.dot(a, Vec2.sub(point, cp)),
        move1Min,
      );
      move1Max = Math.max(
        Vec2.dot(a, Vec2.sub(point, cp)),
        move1Max,
      );
    });
    b2.points.forEach((point) => {
      move2Min = Math.min(
        Vec2.dot(a, Vec2.sub(point, cp)),
        move2Min,
      );
      move2Max = Math.max(
        Vec2.dot(a, Vec2.sub(point, cp)),
        move2Max,
      );
    });
    if (Math.abs(move1Min - move2Max) < Math.abs(move2Min - move1Max)) {
      b1.move(-a.x * move1Min, -a.y * move1Min);
      b2.move(-a.x * move2Max, -a.y * move2Max);
    } else {
      b1.move(-a.x * move1Max, -a.y * move1Max);
      b2.move(-a.x * move2Min, -a.y * move2Min);
    }

    const collisionPoints = cps;

    /** @type {number[]} */
    const endAngs1 = [];
    /** @type {number[]} */
    const endAngs2 = [];
    /** @type {Vec2[]} */
    const endVels1 = [];
    /** @type {Vec2[]} */
    const endVels2 = [];

    collisionPoints.forEach((collisionPoint) => {
      // Deal with the change in velocity by the collision
      const n = Vec2.fromAngle(heading);
      cp = collisionPoint;

      const v1 = b1.vel.copy;
      const v2 = b2.vel.copy;
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
      let frictionImpulse = impulse * fc;
      if (frictionImpulse > maxImpulse) frictionImpulse = maxImpulse;

      // Calculate post-friction velocities
      u1 = Vec2.sub(u1, Vec2.mult(t, frictionImpulse / m1));
      u2 = Vec2.add(u2, Vec2.mult(t, frictionImpulse / m2));

      // Calculate post-friction angular velocities
      pAng1 -= (frictionImpulse * Vec2.cross(r1, t)) / am1;
      pAng2 += (frictionImpulse * Vec2.cross(r2, t)) / am2;

      // Store the new values in the ball and body
      body1.vel = u1;
      body2.vel = u2;
      body1.ang = pAng1;
      body2.ang = pAng2;

      // Store calculated values and revert
      endAngs1.push(b1.ang);
      endVels1.push(b1.vel);
      endAngs2.push(b2.ang);
      endVels2.push(b2.vel);

      body1.ang = startAng1;
      body1.vel = startVel1;
      body2.ang = startAng2;
      body2.vel = startVel2;
    });

    if (endAngs1.length !== endVels1.length) return;
    if (endAngs1.length === 0) return;
    if (endVels1.length === 0) return;
    if (endAngs2.length !== endVels2.length) return;
    if (endAngs2.length === 0) return;
    if (endVels2.length === 0) return;

    body1.vel = endVels1.reduce((prev, curr) => Vec2.add(prev, curr));
    body1.vel.div(endVels1.length);
    body1.ang = endAngs1.reduce((prev, curr) => prev + curr);
    body1.ang /= endAngs1.length;
    body2.vel = endVels2.reduce((prev, curr) => Vec2.add(prev, curr));
    body2.vel.div(endVels2.length);
    body2.ang = endAngs2.reduce((prev, curr) => prev + curr);
    body2.ang /= endAngs2.length;
  }

  /**
   * Detects and reacts to collision with a fixedBall
   *
   * @param {import('./physics').FixedBall} fixedBall The fixedBall to take the collision with
   */
  collideWithFixedBall(fixedBall) {
    const fbPos = new Vec2(fixedBall.x, fixedBall.y);
    let collisionPoint;

    if (Vec2.dist(fbPos, this.pos) > this.boundRadius + fixedBall.r) return;

    // Detect collision with sides
    this.sides.forEach((side) => {
      const angle1 = Vec2.angle(Vec2.sub(side.a, side.b), Vec2.sub(fbPos, side.b));
      const angle2 = Vec2.angle(Vec2.sub(side.b, side.a), Vec2.sub(fbPos, side.a));

      if (angle1 < Math.PI / 2 && angle2 < Math.PI / 2) {
        const d = side.distFromPoint(fbPos);
        if (d <= fixedBall.r) {
          let perp = Vec2.sub(side.a, side.b);
          perp.rotate(Math.PI / 2);
          perp.setMag(fixedBall.r * 2);
          const negPerp = Vec2.mult(perp, -1);
          const detectorSegment = new LineSegment(
            Vec2.add(perp, fbPos),
            Vec2.add(negPerp, fbPos),
          );
          collisionPoint = LineSegment.intersect(detectorSegment, side);
          if (collisionPoint instanceof Vec2) {
            perp = Vec2.sub(collisionPoint, fbPos);
            perp.setMag(fixedBall.r - perp.length);
            this.move(perp.x, perp.y);
          }
        }
      }
    });

    // Detect collison with points
    if (!collisionPoint || collisionPoint === undefined) {
      this.points.forEach((point) => {
        if (Vec2.dist(point, fbPos) < fixedBall.r) {
          const d = Vec2.sub(point, fbPos);
          d.setMag(fixedBall.r - d.length);
          this.move(d.x, d.y);
          d.setMag(fixedBall.r);
          collisionPoint = Vec2.add(fbPos, d);
        }
      });
    }

    if (!collisionPoint || collisionPoint === undefined) return;

    // Deal with the change in velocity by the collision
    const n = Vec2.sub(collisionPoint, fbPos);
    n.setMag(1);
    const cp = collisionPoint;
    const v = this.vel.copy;
    const { ang } = this;
    const r = Vec2.sub(cp, this.pos);
    const { am } = this;
    const { m } = this;
    const { k } = this;
    const { fc } = this;

    // Relative velocity in collision point
    const vRelInCP = Vec2.mult(this.velInPlace(cp), -1);

    // Calculate impulse
    let impulse = (1 / m);
    impulse += Vec2.dot(
      Vec2.crossScalarFirst(Vec2.cross(r, n) / am, r), n,
    );
    impulse = -((1 + k) * Vec2.dot(vRelInCP, n)) / impulse;

    // Calculate post-collision velocity
    let u = Vec2.sub(v, Vec2.mult(n, impulse / m));

    // Calculate post-collision angular velocity
    let pAng = ang - (impulse * Vec2.cross(r, n)) / am;

    /**
     * Now calculate the friction reaction
     */
    // Tangential direction
    const t = vRelInCP.copy;
    t.sub(Vec2.mult(n, Vec2.dot(vRelInCP, n)));
    t.setMag(1);

    // Calculate max impulse
    let maxImpulse = (1 / m);
    maxImpulse += Vec2.dot(
      Vec2.crossScalarFirst(Vec2.cross(r, t) / am, r), t,
    );
    maxImpulse = -Vec2.dot(vRelInCP, t) / maxImpulse;

    // Friction impulse
    let frictionImpulse = impulse * fc;
    if (frictionImpulse > maxImpulse) frictionImpulse = maxImpulse;

    // Calculate post-friction velocity
    u = Vec2.sub(u, Vec2.mult(t, frictionImpulse / m));

    // Calculate post-friction angular velocity
    pAng -= (frictionImpulse * Vec2.cross(r, t)) / am;

    // Store the new values in the body
    this.vel = u;
    this.ang = pAng;
  }

  /**
   * Does a collision with a wall
   *
   * @param {Wall} wall The wall to collide with
   */
  collideWithWall(wall) {
    if (
      this.boundRadius + wall.boundRadius
      < Vec2.dist(this.pos, wall.center)
    ) {
      return;
    }

    const { sides } = this;

    const debugData = [];
    /** @type {Vec2[]} */
    const collisionPoints = [];
    sides.forEach((bodySide) => {
      wall.sides.forEach((wallSide) => {
        const collisionPoint = LineSegment.intersect(bodySide, wallSide);
        if (collisionPoint instanceof Vec2) {
          collisionPoints.push(collisionPoint);
        }
      });
    });

    const startingVel = this.vel.copy;
    const startingAng = this.ang;

    /** @type {Vec2[]} */
    const endVels = [];
    /** @type {number[]} */
    const endAngs = [];

    // Need to adjust the position of the Body
    if (collisionPoints.length >= 2) {
      const normal = Vec2.sub(collisionPoints[0], collisionPoints[1]);
      normal.rotate(Math.PI / 2);

      let r = Vec2.sub(collisionPoints[0], this.pos);
      if (Vec2.dot(normal, r) > 0) normal.mult(-1);
      normal.setMag(1);
      if (Vec2.dot(normal, Vec2.sub(this.pos, wall.center)) < 0) {
        normal.mult(-1);
      }

      debugData.push(new LineSegment(collisionPoints[0], collisionPoints[1]));
      debugData.push(
        new LineSegment(
          collisionPoints[0],
          Vec2.add(collisionPoints[0], Vec2.mult(normal, 20)),
        ),
      );
      debugData.push(
        new LineSegment(
          collisionPoints[1],
          Vec2.add(collisionPoints[1], Vec2.mult(normal, 20)),
        ),
      );
      /** @type {number[]} */
      let moveAmounts = [];

      let cp = collisionPoints[0];
      wall.points.forEach((p) => {
        const pointVec = Vec2.sub(p, cp);
        const dist = Vec2.dot(pointVec, normal);
        if (dist > 0) {
          moveAmounts.push(dist);
        }
      });

      if (moveAmounts.length > 0) {
        const moveVector = normal.copy;
        moveVector.mult(Math.max(...moveAmounts));
        this.move(moveVector.x, moveVector.y);
      }

      moveAmounts = [];
      const midCp = Vec2.add(collisionPoints[0], collisionPoints[1]);
      midCp.div(2);
      if (this.containsPoint(midCp)) {
        sides.forEach((side) => {
          moveAmounts.push(side.distFromPoint(midCp));
        });
      }

      if (moveAmounts.length > 0) {
        const moveVector = normal.copy;
        moveVector.mult(Math.min(...moveAmounts));
        if (moveVector.length < this.boundRadius / 2) {
          this.move(moveVector.x, moveVector.y);
        }
      }

      collisionPoints.forEach((collisionPoint) => {
        // Deal with the change in velocity by the collision
        const n = normal;
        n.setMag(1);
        cp = collisionPoint;
        const v = this.vel.copy;
        const { ang } = this;
        r = Vec2.sub(cp, this.pos);
        const { am } = this;
        const { m } = this;
        const { k } = this;
        const { fc } = this;

        // Relative velocity in collision point
        const vRelInCP = Vec2.mult(this.velInPlace(cp), -1);

        // Calculate impulse
        let impulse = (1 / m);
        impulse += Vec2.dot(
          Vec2.crossScalarFirst(Vec2.cross(r, n) / am, r), n,
        );
        impulse = -((1 + k) * Vec2.dot(vRelInCP, n)) / impulse;

        // Calculate post-collision velocity
        let u = Vec2.sub(v, Vec2.mult(n, impulse / m));

        // Calculate post-collision angular velocity
        let pAng = ang - (impulse * Vec2.cross(r, n)) / am;

        /**
         * Now calculate the friction reaction
         */
        // Tangential direction
        const t = vRelInCP.copy;
        t.sub(Vec2.mult(n, Vec2.dot(vRelInCP, n)));
        t.setMag(1);

        // Calculate max impulse
        let maxImpulse = (1 / m);
        maxImpulse += Vec2.dot(
          Vec2.crossScalarFirst(Vec2.cross(r, t) / am, r), t,
        );
        maxImpulse = -Vec2.dot(vRelInCP, t) / maxImpulse;

        // Friction impulse
        let frictionImpulse = impulse * fc;
        if (frictionImpulse > maxImpulse) frictionImpulse = maxImpulse;

        // Calculate post-friction velocity
        u = Vec2.sub(u, Vec2.mult(t, frictionImpulse / m));

        // Calculate post-friction angular velocity
        pAng -= (frictionImpulse * Vec2.cross(r, t)) / am;

        // Store the new values in the body
        this.vel = u;
        this.ang = pAng;

        endVels.push(this.vel);
        this.vel = startingVel.copy;

        endAngs.push(this.ang);
        this.ang = startingAng;
      });

      if (endAngs.length !== endVels.length) return;
      if (endAngs.length === 0) return;
      if (endVels.length === 0) return;

      this.vel = endVels.reduce((prev, curr) => Vec2.add(prev, curr));
      this.vel.div(endVels.length);
      this.ang = endAngs.reduce((prev, curr) => prev + curr);
      this.ang /= endAngs.length;

      if (!Number.isFinite(this.vel.x)
        || !Number.isFinite(this.vel.y)
        || !Number.isFinite(this.ang)) {
        this.vel = startingVel;
        this.ang = startingAng;
      }
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

    const filtered = sides
      .filter((side) => LineSegment.intersect(side, testerSegment) !== undefined);
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
   * @param {Vec2} point The point to be taken a look at
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
