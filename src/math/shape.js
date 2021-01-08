import Line from './line';
import { MinMax, minMaxOfArray } from './minmax';
import Vec2 from './vec2';

/**
 * @typedef {{center:import('./vec2').Vec2AsObject,area:number,secondArea:number}} GeometricalData
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
    ret.points[0] = center;
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
    ret.points = points.map((v) => Vec2.fromObject(v));
    return ret;
  }

  /**
   * Calculates and returns the area, center of mass and the second moment of area of the shape.
   *
   * @returns {GeometricalData} The calculated data
   */
  getGeometricalData() {
    const ret = {
      center: this.points[0],
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
}

export default Shape;
