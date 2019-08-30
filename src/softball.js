const Vec2 = require('./vec2');
const Ball = require('./ball');
const Stick = require('./stick');
const LineSegment = require('./linesegment');

/**
 * Class representing a softbody object
 * They work like a ball, with pressure inside
 */
class SoftBall {
  /**
   * Creates a SoftBall
   * @param {Vec2} pos The starting position of the soft ball
   * @param {number} r The radius of the soft ball
   * @param {number} pressure The "hardness" of the soft ball
   * @param {number} fc Friction coefficient
   * @param {number} resolution The number of points that make up the ball
   */
  constructor(pos, r, pressure, fc, resolution) {
    this.points = [];

    if (fc || fc === 0) this.fc = fc;
    else this.fc = 0.4;

    this.pressure = pressure;

    if (!resolution) this.resolution = 30;
    else this.resolution = resolution;

    r = Math.abs(r);
    this.r = r;

    let layerNumber = Math.random() * 1000000;

    for (let i = 0; i < this.resolution; i++) {
      let newPos = new Vec2(pos.x, pos.y);
      newPos.add(
        Vec2.mult(Vec2.fromAngle((i / this.resolution) * Math.PI * 2), r)
      );
      this.points.push(
        new Ball(
          newPos,
          new Vec2(0, 0),
          r * Math.sin(Math.PI / this.resolution),
          0,
          0,
          this.fc
        )
      );
      this.points[this.points.length - 1].layer = layerNumber;
    }

    this.sides = [];
    for (let i = 0; i < this.resolution; i++) {
      let side = new Stick(2 * r * Math.sin(Math.PI / this.resolution));
      side.attachObject(this.points[i]);
      side.attachObject(this.points[(i + 1) % this.resolution]);
      if (i % 2 === 0) side.lockRotation();
      this.sides.push(side);
    }
  }

  /**
   * Updates the pressure-based forces in the soft ball
   * @param {SoftBall} softBall The soft ball to update
   * @param {number} t Elapsed time
   */
  static updatePressureBasedForces(softBall, t) {
    let poligons = [];
    poligons.push([]);
    softBall.points.forEach((p) => {
      poligons[0].push(new Vec2(p.pos.x, p.pos.y));
    });

    if (
      (function(pol) {
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
      })(poligons[0])
    ) {
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
    });

    let overPressure =
      softBall.pressure * ((softBall.r * softBall.r * Math.PI) / mSum) -
      softBall.pressure;
    softBall.sides.forEach((side) => {
      let force = Vec2.sub(side.objects[0].pos, side.objects[1].pos);
      force.mult(overPressure);
      force.rotate(Math.PI / 2);
      force.mult(t);
      side.objects[0].vel.add(Vec2.div(force, side.objects[0].m));
      side.objects[1].vel.add(Vec2.div(force, side.objects[1].m));
    });
  }

  /**
   * Returns an array containing all the sides of the body
   * @return {Array<LineSegment>} The array of sides
   */
  get sideSegments() {
    return this.points.map((element, index) => {
      return new LineSegment(
        element.pos,
        this.points[(index + 1) % this.points.length].pos
      );
    });
  }

  /**
   *Returns true if the point is inside the body
   * @param {Vec2} p The point
   * @return {boolean} The boolean value
   */
  containsPoint(p) {
    let sides = this.sideSegments;
    let r =
      Math.max(
        ...this.points.map((point) => {
          return Vec2.dist(point.pos, p);
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
   * @return {Object} The SoftBall represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    let ret = {};

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
   * @param {Object} obj The object to create the class from
   * @param {Array<Ball>} ballList An array of all the balls in the system
   * @param {Array<Spring>} springList An array of all the springs in the system
   * @return {SoftBall} The SoftBall object
   */
  static fromObject(obj, ballList, springList) {
    let ret = Object.create(SoftBall.prototype);
    console.log(ret);

    ret.pressure = obj.pressure;
    ret.fc = obj.fc;
    ret.resolution = obj.resolution;
    ret.r = obj.r;
    ret.points = obj.points.map((e) => {
      let arr = ballList.filter((p) => e == p.id);
      return arr[0];
    });
    ret.sides = obj.sides.map((e) => {
      let arr = springList.filter((p) => e == p.id);
      return arr[0];
    });

    return ret;
  }
}

module.exports = SoftBall;
