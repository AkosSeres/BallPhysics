const Vec2 = require('./vec2');
const LineSegment = require('./linesegment');

/**
 * Class representing a body
 * Bodies are movable objects
 * and they collide with other objects (balls)
 */
class Body {
  /**
   * Creates a body and calculates it's centre of mass (position)
   * @param {Array} points The points that make up the body
   * @param {Vec2} vel The velocity of the body
   * @param {number} k Coefficient of restitution
   * @param {number} ang Angular velocity
   * @param {number} fc Friction coefficient
   */
  constructor(points, vel, k, ang, fc) {
    this.points = points;

    let pol = this.points;
    let sum1 = 0;
    let sum2 = 0;
    let angle = Vec2.angleACW(
      Vec2.sub(pol[1], pol[0]),
      Vec2.sub(pol[pol.length - 1], pol[0])
    );
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
    if (sum2 < sum1) {
      let temp = [];
      for (let i = pol.length - 1; i >= 0; i--) temp.push(pol[i]);
      this.points = temp;
    }

    this.calculatePosAndMass();
    this.lastPos = this.pos.copy;
    this.fc = 0.4;

    this.rotation = 0;

    if (ang) this.ang = ang;
    else this.ang = 0;

    if (fc || fc === 0) this.fc = fc;

    if (k) this.k = k;
    else this.k = 0.8;

    if (vel != undefined) this.vel = vel.copy;
    else this.vel = new Vec2(0, 0);

    this.id =
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9);
  }

  /**
   * Get a copy of the body that is not a reference to it
   * @return {Body} The copy of the body
   */
  get copy() {
    let pointsCopy = [];
    for (let i = 0; i < this.points.length; i++) {
      pointsCopy.push(new Vec2(this.points[i].x, this.points[i].y));
    }
    let ret = new Body(pointsCopy, this.vel.copy, this.k, this.ang, this.fc);
    ret.rotation = this.rotation;
    ret.lastPos = this.lastPos.copy;
    ret.pos = this.pos.copy;

    return ret;
  }

  /**
   * Moves the body by the given coordinates
   * It has to move all the points of the body and
   * also the centre of mass (pos) of the body
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  move(x, y) {
    this.pos.x += x;
    this.pos.y += y;
    this.points.forEach((p) => {
      p.x += x;
      p.y += y;
    });
  }

  /**
   * Function that does the collision detection and
   * collision behavior between the body and ball
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

        let move = Vec2.fromAngle(heading);
        move.mult(ball.r - rel);
        this.move(
          (move.x * -1 * ball.m) / (this.m + ball.m),
          (move.y * -1 * ball.m) / (this.m + ball.m)
        );
        ball.move(
          (move.x * 1 * this.m) / (this.m + ball.m),
          (move.y * 1 * this.m) / (this.m + ball.m)
        );

        cp = new Vec2(point.x, point.y);

        let a = Vec2.fromAngle(heading);
        a.mult(-30);
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

        let move = Vec2.fromAngle(heading);
        move.mult(ball.r - rel);
        this.move(
          (move.x * -1 * ball.m) / (this.m + ball.m),
          (move.y * -1 * ball.m) / (this.m + ball.m)
        );
        ball.move(
          (move.x * 1 * this.m) / (this.m + ball.m),
          (move.y * 1 * this.m) / (this.m + ball.m)
        );

        cp = ball.pos.copy;
        cp.add(Vec2.mult(Vec2.fromAngle(heading + Math.PI), d));

        let a = Vec2.fromAngle(heading);
        a.mult(-30);
      }
    });

    if (heading === 0 || heading) {
      let v1 = this.vel.copy;
      let v2 = ball.vel.copy;
      let ang1 = this.ang;
      let ang2 = ball.ang;
      let r1 = Vec2.sub(cp, this.pos);
      let r2 = Vec2.sub(cp, ball.pos);
      let am1 = this.am;
      let am2 = ball.am;
      let m1 = this.m;
      let m2 = ball.m;
      let k = (this.k + ball.k) / 2;
      let fc = (this.fc + ball.fc) / 2;

      let v1v = r1.copy;
      let v2v = r2.copy;
      v1v.rotate(Math.PI / 2);
      v2v.rotate(-Math.PI / 2);
      v1v.mult(ang1);
      v2v.mult(ang2);
      v1v.add(v1);
      v2v.add(v2);

      v1v.rotate(-heading);
      v2v.rotate(-heading);

      let dv1vx =
        ((1 + k) * (m1 * v1v.x + m2 * v2v.x)) / (m1 + m2) - (k + 1) * v1v.x;
      let dv2vx =
        ((1 + k) * (m1 * v1v.x + m2 * v2v.x)) / (m1 + m2) - (k + 1) * v2v.x;

      let vk = (v1v.y * m1 + v2v.y * m2) / (m1 + m2);

      let dv1vy = -Math.sign(v1v.y) * fc * dv1vx;
      let dv2vy = -Math.sign(v2v.y) * fc * dv2vx;
      if (Math.abs(vk - v1v.y) > Math.abs(dv1vy)) dv1vy = vk - v1v.y;
      if (Math.abs(vk - v2v.y) > Math.abs(dv2vy)) dv2vy = vk - v2v.y;

      let dv1v = new Vec2(dv1vx, dv1vy);
      let dv2v = new Vec2(dv2vx, dv2vy);
      dv1v.rotate(heading);
      dv2v.rotate(heading);

      v1.add(dv1v);
      v2.add(dv2v);

      dv1v.rotate(-r1.heading);
      dv2v.rotate(-r2.heading);

      let dang1 =
        (dv1v.y * m1 * r1.length) / (am1 + r1.length * r1.length * m1);
      let dang2 =
        -(dv2v.y * m2 * r2.length) / (am2 + r2.length * r2.length * m2);

      ang1 += dang1;
      ang2 += dang2;

      let vp1 = Vec2.fromAngle(r1.heading - Math.PI / 2);
      vp1.mult(r1.length * dang1);
      let vp2 = Vec2.fromAngle(r2.heading - Math.PI / 2);
      vp2.mult(r2.length * dang2);
      v2.sub(vp2);
      v1.add(vp1);

      this.vel = v1;
      ball.vel = v2;

      this.ang = ang1;
      ball.ang = ang2;
    }
  }

  /**
   * Calculates the mass, moment od intertia and
   * the centre of mass of the body
   */
  calculatePosAndMass() {
    let poligons = [];
    poligons.push([]);
    this.points.forEach((p) => {
      poligons[0].push(new Vec2(p.x, p.y));
    });

    if (this.isConcave) {
      const includes = (arr, item) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === item) return true;
        }
        return false;
      };
      const intersectWithPoligon = function(segment, pol, exceptions) {
        for (let i = 0; i < pol.length; i++) {
          if (!includes(exceptions, i)) {
            let side = new LineSegment(
              new Vec2(pol[i].x, pol[i].y),
              new Vec2(pol[(i + 1) % pol.length].x, pol[(i + 1) % pol.length].y)
            );
            if (LineSegment.intersect(segment, side)) return true;
          }
        }
        return false;
      };
      let found = true;

      checkAllPoligons: while (found) {
        found = false;
        for (let i = 0; i < poligons.length; i++) {
          let pol = poligons[i];
          let a = Vec2.sub(pol[1], pol[0]);
          let b = Vec2.sub(pol[pol.length - 1], pol[0]);
          let angle = Vec2.angleACW(a, b);
          if (angle > Math.PI) {
            found = true;
            let j = 0;
            let k = j + 2;
            let newSide = new LineSegment(
              new Vec2(pol[j].x, pol[j].y),
              new Vec2(pol[k % pol.length].x, pol[k % pol.length].y)
            );
            let newSideHeading = new Vec2(
              newSide.b.x - newSide.a.x,
              newSide.b.y - newSide.a.y
            ).heading;
            while (
              !(a.heading > b.heading
                ? (newSideHeading > a.heading &&
                    newSideHeading < 2 * Math.PI) ||
                  (newSideHeading > 0 && newSideHeading < b.heading)
                : newSideHeading > a.heading && newSideHeading < b.heading) ||
              intersectWithPoligon(
                new LineSegment(
                  new Vec2(pol[j % pol.length].x, pol[j % pol.length].y),
                  new Vec2(pol[k % pol.length].x, pol[k % pol.length].y)
                ),
                pol,
                [
                  (pol.length - 1) % pol.length,
                  j % pol.length,
                  (k - 1) % pol.length,
                  k % pol.length,
                ]
              )
            ) {
              k++;
              newSide = new LineSegment(
                new Vec2(pol[j].x, pol[j].y),
                new Vec2(pol[k % pol.length].x, pol[k % pol.length].y)
              );
              newSideHeading = new Vec2(
                newSide.b.x - newSide.a.x,
                newSide.b.y - newSide.a.y
              ).heading;
            }
            let pol1 = [];
            let pol2 = [];
            for (let l = j; l <= k; l++) {
              pol1.push(pol[l % pol.length]);
            }
            for (let l = k; l <= j + pol.length; l++) {
              pol2.push(pol[l % pol.length]);
            }
            poligons[i] = pol1;
            poligons.push(pol2);
            continue checkAllPoligons;
          }
          for (let j = 1; j < pol.length; j++) {
            let a = Vec2.sub(pol[(j + 1) % pol.length], pol[j]);
            let b = Vec2.sub(pol[j - 1], pol[j]);
            let angle = Vec2.angleACW(a, b);
            if (angle > Math.PI) {
              found = true;
              let k = j + 2;
              let newSide = new LineSegment(
                new Vec2(pol[j].x, pol[j].y),
                new Vec2(pol[k % pol.length].x, pol[k % pol.length].y)
              );
              let newSideHeading = new Vec2(
                newSide.b.x - newSide.a.x,
                newSide.b.y - newSide.a.y
              ).heading;
              while (
                !(a.heading > b.heading
                  ? (newSideHeading > a.heading &&
                      newSideHeading < 2 * Math.PI) ||
                    (newSideHeading > 0 && newSideHeading < b.heading)
                  : newSideHeading > a.heading && newSideHeading < b.heading) ||
                intersectWithPoligon(newSide, pol, [
                  (j - 1) % pol.length,
                  j % pol.length,
                  (k - 1) % pol.length,
                  k % pol.length,
                ])
              ) {
                k++;
                newSide = new LineSegment(
                  new Vec2(pol[j].x, pol[j].y),
                  new Vec2(pol[k % pol.length].x, pol[k % pol.length].y)
                );
                newSideHeading = new Vec2(
                  newSide.b.x - newSide.a.x,
                  newSide.b.y - newSide.a.y
                ).heading;
              }
              let pol1 = [];
              let pol2 = [];
              for (let l = j; l <= k; l++) {
                pol1.push(pol[l % pol.length]);
              }
              for (let l = k; l <= j + pol.length; l++) {
                pol2.push(pol[l % pol.length]);
              }
              poligons[i] = pol1;
              poligons.push(pol2);
              continue checkAllPoligons;
            }
          }
        }
      }
    }

    for (let i = poligons.length - 1; i >= 0; i--) {
      let pol = poligons[i];
      while (pol.length > 3) {
        poligons.push([pol[0], pol[1], pol[2]]);
        pol.splice(1, 1);
      }
    }

    let mSum = 0;
    let amSum = 0;
    let pSum = new Vec2(0, 0);
    poligons.forEach((pol) => {
      let a = Math.sqrt(
        Math.pow(pol[0].x - pol[1].x, 2) + Math.pow(pol[0].y - pol[1].y, 2)
      );
      let b = Math.sqrt(
        Math.pow(pol[1].x - pol[2].x, 2) + Math.pow(pol[1].y - pol[2].y, 2)
      );
      let c = Math.sqrt(
        Math.pow(pol[2].x - pol[0].x, 2) + Math.pow(pol[2].y - pol[0].y, 2)
      );
      let s = (a + b + c) / 2;
      let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      mSum += m;
      pSum.x += (m * (pol[0].x + pol[1].x + pol[2].x)) / 3;
      pSum.y += (m * (pol[0].y + pol[1].y + pol[2].y)) / 3;
    });
    pSum.div(mSum);
    this.pos = pSum;
    this.m = mSum;

    // calculating the moment of inertia finally
    for (let pol of poligons) {
      let a = Math.sqrt(
        Math.pow(pol[0].x - pol[1].x, 2) + Math.pow(pol[0].y - pol[1].y, 2)
      );
      let b = Math.sqrt(
        Math.pow(pol[1].x - pol[2].x, 2) + Math.pow(pol[1].y - pol[2].y, 2)
      );
      let c = Math.sqrt(
        Math.pow(pol[2].x - pol[0].x, 2) + Math.pow(pol[2].y - pol[0].y, 2)
      );
      let w = Math.max(a, b, c);
      let s = (a + b + c) / 2;
      let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      let h = (2 * m) / w;
      let wpartial = Math.sqrt(Math.min(a, c, b) ** 2 - h * h);
      let am = (h * w * (h * h + w * w)) / 24;
      let d = Math.sqrt((h * h) / 36 + (Math.abs(wpartial - w / 2) / 3) ** 2);
      am -= d * d * m;
      am +=
        new Vec2(
          (pol[0].x + pol[1].x + pol[2].x) / 3,
          (pol[0].y + pol[1].y + pol[2].y) / 3
        ).dist(this.pos) **
          2 *
        m;
      amSum += am;
    }
    this.am = amSum;

    this.boundRadius = Math.max(
      ...this.points.map((p) => {
        return Vec2.dist(p, this.pos);
      })
    );
  }

  /**
   * Rotates the body around it's centre of mass by a given ange
   * Has to do the transformation for all the points
   * @param {number} angle Rotation angle
   */
  rotate(angle) {
    this.points.forEach((p) => {
      let point = new Vec2(p.x, p.y);
      point.sub(this.pos);
      point.rotate(angle);
      point.add(this.pos);
      p.x = point.x;
      p.y = point.y;
    });
    this.rotation += angle;
  }

  /**
   * Finds out if the body is concave or not
   * @return {Boolean} True if the body is concave
   */
  get isConcave() {
    let pol = this.points;
    let angle = Vec2.angleACW(
      Vec2.sub(pol[1], pol[0]),
      Vec2.sub(pol[pol.length - 1], pol[0])
    );
    if (angle > Math.PI) return true;
    for (let i = 1; i < pol.length - 1; i++) {
      angle = Vec2.angleACW(
        Vec2.sub(pol[(i + 1) % pol.length], pol[i]),
        Vec2.sub(pol[i - 1], pol[i])
      );
      if (angle > Math.PI) return true;
    }
    angle = Vec2.angleACW(
      Vec2.sub(pol[0], pol[pol.length - 1]),
      Vec2.sub(pol[pol.length - 2], pol[pol.length - 1])
    );
    if (angle > Math.PI) return true;
    return false;
  }

  /**
   * Does the collision algorithm between two bodies
   * @param {Body} b1 First body
   * @param {Body} b2 Second body
   */
  static collide(b1, b2) {
    let matches = 0;
    let heading = 0;
    let cp = new Vec2(0, 0);
    let cps = [];
    let intersect = false;
    b1.points.forEach((p, idx) => {
      let side1 = new LineSegment(
        new Vec2(p.x, p.y),
        new Vec2(
          b1.points[(idx + 1) % b1.points.length].x,
          b1.points[(idx + 1) % b1.points.length].y
        )
      );
      b2.points.forEach((pp, idxx) => {
        let side2 = new LineSegment(
          new Vec2(pp.x, pp.y),
          new Vec2(
            b2.points[(idxx + 1) % b2.points.length].x,
            b2.points[(idxx + 1) % b2.points.length].y
          )
        );
        let sect = LineSegment.intersect(side1, side2);
        if (sect) {
          matches++;
          cp.add(sect);
          cps.push(sect);
          intersect = true;
        }
      });
    });

    if (!intersect) return;
    cp.div(matches);

    for (let i = 0; i < Math.floor(matches / 2); i++) {
      heading += Vec2.sub(cps[2 * i + 1], cps[2 * i]).heading;
    }
    heading /= matches / 2;
    heading += Math.PI / 2;

    let a = Vec2.fromAngle(heading);

    let move1Min = 0;
    let move1Max = 0;
    let move2Min = 0;
    let move2Max = 0;
    for (let point of b1.points) {
      move1Min = Math.min(
        Vec2.dot(a, Vec2.sub(new Vec2(point.x, point.y), cp)),
        move1Min
      );
      move1Max = Math.max(
        Vec2.dot(a, Vec2.sub(new Vec2(point.x, point.y), cp)),
        move1Max
      );
    }
    for (let point of b2.points) {
      move2Min = Math.min(
        Vec2.dot(a, Vec2.sub(new Vec2(point.x, point.y), cp)),
        move2Min
      );
      move2Max = Math.max(
        Vec2.dot(a, Vec2.sub(new Vec2(point.x, point.y), cp)),
        move2Max
      );
    }
    if (Math.abs(move1Min - move2Max) < Math.abs(move2Min - move1Max)) {
      b1.move(-a.x * move1Min, -a.y * move1Min);
      b2.move(-a.x * move2Max, -a.y * move2Max);
    } else {
      b1.move(-a.x * move1Max, -a.y * move1Max);
      b2.move(-a.x * move2Min, -a.y * move2Min);
    }

    let k = (b1.k + b2.k) / 2;
    // let vel1parralel = Vec2.cross(b1.vel, a);
    let vel1perpendicular = Vec2.dot(b1.vel, a);
    // let vel2parralel = Vec2.cross(b2.vel, a);
    let vel2perpendicular = Vec2.dot(b2.vel, a);

    let newVel1Perpendicular =
      ((1 + k) * (b1.m * vel1perpendicular + b2.m * vel2perpendicular)) /
        (b1.m + b2.m) -
      k * vel1perpendicular;
    let newVel2Perpendicular =
      ((1 + k) * (b1.m * vel1perpendicular + b2.m * vel2perpendicular)) /
        (b1.m + b2.m) -
      k * vel2perpendicular;

    b1.vel.add(Vec2.mult(a.copy, newVel1Perpendicular - vel1perpendicular));
    b2.vel.add(Vec2.mult(a.copy, newVel2Perpendicular - vel2perpendicular));
  }

  /**
   * Detects and reacts to collision with a fixedBall
   * @param {FixedBall} fixedBall The fixedBall to take the collision with
   */
  collideWithFixedBall(fixedBall) {
    let fbPos = new Vec2(fixedBall.x, fixedBall.y);
    let collisionPoint;

    if (Vec2.dist(fbPos, this.pos) > this.boundRadius + fixedBall.r) return;

    // Detect collision with sides
    for (let side of this.sides) {
      let angle1;
      let angle2;
      angle1 = Vec2.angle(Vec2.sub(side.a, side.b), Vec2.sub(fbPos, side.b));
      angle2 = Vec2.angle(Vec2.sub(side.b, side.a), Vec2.sub(fbPos, side.a));

      if (angle1 < Math.PI / 2 && angle2 < Math.PI / 2) {
        let d = side.distFromPoint(fbPos);
        if (d <= fixedBall.r) {
          let perp = Vec2.sub(side.a, side.b);
          perp.rotate(Math.PI / 2);
          perp.setMag(fixedBall.r * 2);
          let negPerp = Vec2.mult(perp, -1);
          let detectorSegment = new LineSegment(
            Vec2.add(perp, fbPos),
            Vec2.add(negPerp, fbPos)
          );
          collisionPoint = LineSegment.intersect(detectorSegment, side);
          if (collisionPoint != undefined) {
            perp = Vec2.sub(collisionPoint, fbPos);
            perp.setMag(fixedBall.r - perp.length);
            this.move(perp.x, perp.y);
          }
        }
      }
    }

    // Detect collison with points
    if (!collisionPoint || collisionPoint == undefined) {
      pointLoop: for (let point of this.points) {
        if (Vec2.dist(point, fbPos) < fixedBall.r) {
          let d = Vec2.sub(point, fbPos);
          d.setMag(fixedBall.r - d.length);
          this.move(d.x, d.y);
          d.setMag(fixedBall.r);
          collisionPoint = Vec2.add(fbPos, d);
          break pointLoop;
        }
      }
    }

    if (!collisionPoint || collisionPoint == undefined) return;

    // Deal with the change in velocity by the collision
    let vel = this.vel;
    let pos = this.pos;
    let normal = Vec2.sub(collisionPoint, fbPos);
    normal.setMag(1);
    let r = Vec2.sub(pos, collisionPoint);
    let angle = Vec2.angleACW(normal, r);

    let velInCollisionPoint = vel.copy;
    let rotater = r.copy;
    rotater.mult(-1 * this.ang);
    rotater.rotate(Math.PI / 2);
    velInCollisionPoint.add(rotater);
    let perpVel = Vec2.dot(normal, velInCollisionPoint);
    if (perpVel >= 0) return;
    perpVel *= 1 + this.k;

    let deltaVel = Vec2.mult(Vec2.normalized(normal), -1 * perpVel);
    let deltaAng = deltaVel.copy;

    deltaVel.mult(Math.cos(angle));
    this.vel.add(deltaVel);

    deltaAng = deltaAng.length / r.length;
    deltaAng *= Math.sin(angle);
    this.ang += deltaAng;

    // Then deal with friction
    let massInPoint =
      this.m * Math.abs(Math.cos(angle)) +
      (this.am / r.length / r.length) * Math.abs(Math.sin(angle));
    let massParralel =
      this.m * Math.abs(Math.sin(angle)) +
      (this.am / r.length / r.length) * Math.abs(Math.cos(angle));

    deltaVel = Vec2.mult(Vec2.normalized(normal), -1 * perpVel);

    let parralelVec = normal.copy;
    parralelVec.rotate(Math.PI / 2);
    parralelVec.mult(Math.sign(Vec2.dot(parralelVec, velInCollisionPoint)));
    if (parralelVec.length == 0) return;

    let parralelVel = Vec2.dot(velInCollisionPoint, parralelVec);
    let deltaMomentum = Vec2.mult(deltaVel, massInPoint);
    let deltaVelParralel = Vec2.div(deltaMomentum, massParralel);

    deltaVelParralel.mult(this.fc);
    deltaVelParralel = Vec2.mult(parralelVec, deltaVelParralel.length);
    if (deltaVelParralel.length > parralelVel) {
      deltaVelParralel.setMag(parralelVel);
    }

    angle = Vec2.angleACW(parralelVec, r);

    deltaVel = deltaVelParralel;
    deltaAng = deltaVel.copy;

    deltaVel.mult(Math.cos(angle));
    this.vel.add(deltaVel);

    deltaAng = deltaAng.length / r.length;
    deltaAng *= Math.sin(angle);
    this.ang -= deltaAng;
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
   * Returns an array containing all the sides of the body
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
   * @return {Object} The Body represented in a JS object
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
   * @param {Object} obj The object to create the class from
   * @return {Body} The Body object
   */
  static fromObject(obj) {
    let ret = new Body(
      obj.points.map((p) => {
        return {
          x: p.x,
          y: p.y,
        };
      }),
      Vec2.fromObject(obj.vel),
      obj.k,
      obj.ang,
      obj.fc
    );

    ret.id = obj.id;
    ret.pos = Vec2.fromObject(obj.pos);
    ret.lastPos = Vec2.fromObject(obj.lastPos);
    ret.rotation = obj.rotation;

    return ret;
  }
}

module.exports = Body;
