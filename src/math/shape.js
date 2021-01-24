import Line from './line';
import { MinMax, minMaxOfArray } from './minmax';
import Polygon from './polygon';
import Vec2 from './vec2';

/**
 * @typedef {{center:Vec2,area:number,secondArea:number}} GeometricalData
 */

/**
 * @typedef {{r:number, points:import('./vec2').Vec2AsObject[]}} ShapeAsObject
 */

/**
 * A class representing a shape. It can be a circle or any convex polygon.
 */
class Shape {
  /**
   * Constructs a point shape.
   */
  constructor() {
    this.r = 0;
    this.points = [new Vec2(0, 0)];
  }

  /**
   * Create a circle shape.
   *
   * @param {number} r The radius of the circle
   * @param {Vec2} center The center of the circle
   * @returns {Shape} The circle
   */
  static Circle(r, center) {
    const ret = new Shape();
    ret.r = Math.abs(r);
    ret.points[0] = center.copy;
    return ret;
  }

  /**
   * Create a polygon shape. The given points are expected to be numbered in a
   * counter-clockwise fashion and to make up a convex polygon.
   *
   * @param {import('./vec2').Vec2AsObject[]} points The points of the polygon
   * @returns {Shape} The polygon
   */
  static Polygon(points) {
    const ret = new Shape();
    if (points.length < 3) throw new Error('A polygon needs at least 3 points to be valid!');
    ret.points = new Polygon(points).points.map((p) => Vec2.fromObject(p));
    return ret;
  }

  /**
   * Calculates and returns the area, center of mass and the second moment of area of the shape.
   *
   * @returns {GeometricalData} The calculated data
   */
  getGeometricalData() {
    const ret = {
      center: this.points[0].copy,
      area: 0,
      secondArea: 0,
    };

    if (this.r !== 0) {
      ret.area = this.r * this.r * Math.PI;
      ret.secondArea = 0.5 * Math.PI * (this.r ** 4);
    } else {
      /**
       * The shape divided into triangles
       *
       * @type {Vec2[][]}
       */
      const poligons = [];
      for (let i = 2; i < this.points.length; i += 1) {
        poligons.push([
          this.points[0],
          this.points[i - 1],
          this.points[i],
        ]);
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
      ret.center = pSum;
      /** @type {number} */
      ret.area = mSum;

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
          ).dist(ret.center) ** 2) * m);
        amSum += am;
      });
      ret.secondArea = amSum;
    }

    return ret;
  }

  /**
   * Calculates and returns the range of the shape on the x direction.
   *
   * @returns {MinMax} The interval
   */
  getMinMaxX() {
    const ret = minMaxOfArray(this.points.map((p) => p.x));
    ret.min -= this.r;
    ret.max += this.r;
    return ret;
  }

  /**
   * Calculates and returns the range of the shape along the y direction.
   *
   * @returns {MinMax} The interval
   */
  getMinMaxY() {
    const ret = minMaxOfArray(this.points.map((p) => p.y));
    ret.min -= this.r;
    ret.max += this.r;
    return ret;
  }

  /**
   * Calculates and returns the range of the shape along the given direction.
   *
   * @param {Vec2} d The direction
   * @returns {MinMax} The interval
   */
  getMinMaxInDirection(d) {
    const ret = minMaxOfArray(this.points.map((p) => Vec2.dot(p, d)));
    ret.min -= this.r;
    ret.max += this.r;
    return ret;
  }

  /**
   * Moves the shape by a given vector
   *
   * @param {Vec2} v The displacement vector
   */
  move(v) {
    this.points.forEach((p) => p.add(v));
  }

  /**
   * Rotates the shape around a point.
   *
   * @param {Vec2} point The center of the rotation
   * @param {number} angle The angle of the rotation
   */
  rotateAround(point, angle) {
    this.points.forEach((p) => {
      p.sub(point);
    });
    Vec2.rotateArr(this.points, angle);
    this.points.forEach((p) => {
      p.add(point);
    });
  }

  /**
   * Check if a point is inside a point or not.
   *
   * @param {Vec2} p The point to take a look at
   * @returns {boolean} Tells if the body contains a point or not
   */
  containsPoint(p) {
    if (this.r !== 0) return Vec2.sub(p, this.points[0]).sqlength <= (this.r * this.r);

    const normals = this.points.map(
      (point, i) => Vec2.sub(this.points[(i + 1) % this.points.length], point),
    );
    return normals.every((n, i) => (Vec2.cross(n, Vec2.sub(p, this.points[i])) >= 0));
  }

  /**
   * Returns the closest point of the shape to the given point.
   *
   * @param {Vec2} p The point to calculate from
   * @returns {Vec2} The closest point
   */
  getClosestPoint(p) {
    const distanceSqs = this.points.map((pp) => Vec2.sub(pp, p).sqlength);
    let smallestDist = distanceSqs[0];
    let index = 0;
    const arrLen = distanceSqs.length;
    for (let i = 1; i < arrLen; i += 1) {
      if (distanceSqs[i] < smallestDist) {
        smallestDist = distanceSqs[i];
        index = i;
      }
    }
    return this.points[index].copy;
  }

  /**
   * Creates a Shape instance from a plain JS object.
   *
   * @param {ShapeAsObject} obj The shape as a plain JS object.
   * @returns {Shape} The created Shape.
   */
  static fromObject(obj) {
    const ret = new Shape();

    ret.r = obj.r;
    ret.points = obj.points.map((p) => Vec2.fromObject(p));

    return ret;
  }

  /**
   * Returns a copy of the shape.
   *
   * @returns {Shape} The clone.
   */
  get copy() {
    const ret = new Shape();
    ret.r = this.r;
    ret.points = this.points.map((p) => p.copy);
    return ret;
  }
}

export default Shape;
