/* eslint-disable no-continue */
/* eslint-disable no-labels */
import Vec2 from './vec2';
import Ball from './ball';
import Stick from './stick';
import LineSegment from './linesegment';
import Spring from './spring';

/**
 * An object representation of the SoftBall class for easy conversion to JSON.
 *
 * @typedef {object} SoftBallAsObject
 * @property {number} pressure The pressure inside the softball
 * @property {number} fc The friction coefficient
 * @property {number} r The original radius of the softball
 * @property {number} resolution The number of Balls used to construct the SoftBall
 * @property {string[]} points The IDs Balls' that make up the SoftBall
 * @property {string[]} sides The IDs of the sticks' holding the softball together
 */

/**
 * Class representing a softbody object
 * They work like a ball, with pressure inside
 */
class SoftBall {
  /**
   * Creates a SoftBall
   *
   * @param {Vec2} pos The starting position of the soft ball
   * @param {number} r The radius of the soft ball
   * @param {number} pressure The "hardness" of the soft ball
   * @param {number} fc Friction coefficient
   * @param {number} resolution The number of points that make up the ball
   */
  constructor(pos, r, pressure, fc, resolution) {
    /** @type {Ball[]} */
    this.points = [];

    if (fc || fc === 0) this.fc = fc;
    else this.fc = 0.4;

    this.pressure = pressure;

    if (!resolution) this.resolution = 30;
    else this.resolution = resolution;

    this.r = Math.abs(r);

    const layerNumber = Math.random() * 1000000;

    for (let i = 0; i < this.resolution; i += 1) {
      const newPos = new Vec2(pos.x, pos.y);
      newPos.add(
        Vec2.mult(Vec2.fromAngle((i / this.resolution) * Math.PI * 2), this.r),
      );
      this.points.push(
        new Ball(
          newPos,
          new Vec2(0, 0),
          this.r * Math.sin(Math.PI / this.resolution),
          0,
          0,
          this.fc,
        ),
      );
      this.points[this.points.length - 1].layer = layerNumber;
    }

    this.sides = [];
    for (let i = 0; i < this.resolution; i += 1) {
      const side = new Stick(2 * this.r * Math.sin(Math.PI / this.resolution));
      side.attachObject(this.points[i]);
      side.attachObject(this.points[(i + 1) % this.resolution]);
      if (i % 2 === 0) side.lockRotation();
      this.sides.push(side);
    }
  }

  /**
   * Updates the pressure-based forces in the soft ball
   *
   * @param {SoftBall} softBall The soft ball to update
   * @param {number} t Elapsed time
   */
  static updatePressureBasedForces(softBall, t) {
    /** @type {Vec2[][]} */
    const poligons = [];
    poligons.push([]);
    softBall.points.forEach((p) => {
      poligons[0].push(new Vec2(p.pos.x, p.pos.y));
    });

    if (
      ((pol) => {
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
      })(poligons[0])
    ) {
      /**
       * @param {number[]} arr Numbers
       * @param {number} item Number to find
       * @returns {boolean} Whether the number is in the array
       */ const includes = (arr, item) => {
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i] === item) return true;
        }
        return false;
      };
      /**
       * @param {LineSegment} segment Line segment to intersect with
       * @param {Vec2[]} pol Polygon to intersect with
       * @param {number[]} exc Exceptions
       * @returns {boolean} Whether intersection is detected
       */ const intersectWithPoligon = (segment, pol, exc) => {
        for (let i = 0; i < pol.length; i += 1) {
          if (!includes(exc, i)) {
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

      // eslint-disable-next-line no-restricted-syntax
      checkAllPoligons: while (found) {
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
            continue checkAllPoligons;
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
              continue checkAllPoligons;
            }
          }
        }
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
    });

    const overPressure = softBall.pressure * ((softBall.r * softBall.r * Math.PI) / mSum)
      - softBall.pressure;
    softBall.sides.forEach((side) => {
      const force = Vec2.sub(side.objects[0].pos, side.objects[1].pos);
      force.mult(overPressure);
      force.rotate(Math.PI / 2);
      force.mult(t);
      side.objects[0].vel.add(Vec2.div(force, side.objects[0].m));
      side.objects[1].vel.add(Vec2.div(force, side.objects[1].m));
    });
  }

  /**
   * Returns an array containing all the sides of the body
   *
   * @returns {Array<LineSegment>} The array of sides
   */
  get sideSegments() {
    return this.points.map((element, index) => new LineSegment(
      element.pos,
      this.points[(index + 1) % this.points.length].pos,
    ));
  }

  /**
   *Returns true if the point is inside the body
   *
   * @param {Vec2} p The point
   * @returns {boolean} The boolean value
   */
  containsPoint(p) {
    const sides = this.sideSegments;
    const r = Math.max(
      ...this.points.map((point) => Vec2.dist(point.pos, p)),
    ) + 1;

    const v = Vec2.fromAngle(0);
    v.setMag(r);

    const testerSegment = new LineSegment(p, Vec2.add(v, p));

    const filt = sides.filter((side) => LineSegment.intersect(side, testerSegment) !== undefined);
    return filt.length % 2 === 1;
  }

  /**
   * @returns {SoftBallAsObject} The SoftBall represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    const ret = {};

    ret.pressure = this.pressure;
    ret.fc = this.fc;
    ret.r = this.r;
    ret.resolution = this.resolution;
    ret.points = this.points.map((p) => p.id);
    ret.sides = this.sides.map((s) => s.id);

    return ret;
  }

  /**
   * Creates a SoftBall class from the given object
   *
   * @param {SoftBallAsObject} obj The object to create the class from
   * @param {Ball[]} ballList An array of all the balls in the system
   * @param {Spring[]} springList An array of all the springs in the system
   * @returns {SoftBall} The SoftBall object
   */
  static fromObject(obj, ballList, springList) {
    const ret = Object.create(SoftBall.prototype);

    ret.pressure = obj.pressure;
    ret.fc = obj.fc;
    ret.resolution = obj.resolution;
    ret.r = obj.r;
    ret.points = obj.points.map((e) => {
      const arr = ballList.filter((p) => e === p.id);
      return arr[0];
    });
    ret.sides = obj.sides.map((e) => {
      const arr = springList.filter((p) => e === p.id);
      return arr[0];
    });

    return ret;
  }
}

export default SoftBall;
