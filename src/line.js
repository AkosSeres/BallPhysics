import Vec2 from './vec2';
import LineSegment from './linesegment';

/**
 * Class representing a staight line with infinite length
 * Still constructed from two points, but these points do not act as boundaries
 */
class Line extends LineSegment {
  /**
   * Returns the length of the line which is always infinite
   *
   * @returns {number} The length, infinite
   */
  // eslint-disable-next-line class-methods-use-this
  get length() {
    return Number.POSITIVE_INFINITY;
  }

  /**
   * Get the distance between a point and the line
   *
   * @param {Vec2} p The point as a vector
   * @returns {number} The distance
   */
  distFromPoint(p) {
    // Create a vector perpendicular to the line with length 1
    const perpendicular = Vec2.sub(this.a, this.b);
    perpendicular.setMag(1);
    perpendicular.rotate(Math.PI / 2);

    const distVec = Vec2.sub(p, this.a);
    const distance = Math.abs(Vec2.dot(distVec, perpendicular));
    return distance;
  }

  /**
   * Get if they intersect or not.
   * If they intersect it returns the intersection point.
   * If they not it returns false.
   *
   * @param {Line} line1 A line
   * @param {Line} line2 Other line
   * @returns {Vec2 | boolean} Intersetion point
   */
  static intersect(line1, line2) {
    const v1 = Vec2.sub(line1.b, line1.a);
    const e1 = v1.y / v1.x;
    const f1 = line1.b.y - line1.b.x * e1;

    const v2 = Vec2.sub(line2.b, line2.a);
    const e2 = v2.y / v2.x;
    const f2 = line2.b.y - line2.b.x * e2;

    if (e1 === e2) {
      if (line1.distFromPoint(line2.a) === 0) {
        return new Vec2(
          (line1.a.x + line1.b.x + line2.a.x + line2.b.x) / 4,
          (line1.a.y + line1.b.y + line2.a.y + line2.b.y) / 4,
        );
      } return false;
    }
    const foundX = (f2 - f1) / (e1 - e2);
    return new Vec2(foundX, (e1 * foundX) + f1);
  }

  /**
   * Returns the intersection point of a line and a line segment.
   * If there is none, it returns false.
   *
   * @param {Line} line The line
   * @param {LineSegment} segment The line segment
   * @returns {Vec2 | boolean} Intersection point
   */
  static intersectWithLineSegment(line, segment) {
    const v1 = Vec2.sub(line.b, line.a);
    const e1 = v1.y / v1.x;
    const f1 = line.b.y - line.b.x * e1;

    const v2 = Vec2.sub(segment.b, segment.a);
    const e2 = v2.y / v2.x;
    const f2 = segment.b.y - segment.b.x * e2;

    if (v1.x === 0) {
      if (v2.x === 0) {
        if (line.a.x === segment.a.x) {
          return new Vec2(
            (segment.a.x + segment.b.x) / 2,
            (segment.a.y + segment.b.y) / 2,
          );
        } return false;
      }

      const foundX = line.a.x;
      const foundY = (e2 * foundX) + f2;
      if (Math.min(segment.a.x, segment.b.x) < foundX
                && foundX < Math.max(segment.a.x, segment.b.x)
                && Math.min(segment.a.y, segment.b.y) < foundY
                && Math.max(segment.a.y, segment.b.y) > foundY) {
        return new Vec2(foundX, foundY);
      } return false;
    }
    if (v2.x === 0) {
      const foundX = segment.a.x;
      const foundY = (e1 * foundX) + f1;
      if (Math.min(segment.a.x, segment.b.x) < foundX
                && foundX < Math.max(segment.a.x, segment.b.x)
                && Math.min(segment.a.y, segment.b.y) < foundY
                && Math.max(segment.a.y, segment.b.y) > foundY) {
        return new Vec2(foundX, foundY);
      } return false;
    }

    if (e1 === e2) {
      if (line.distFromPoint(segment.a) === 0) {
        return new Vec2(
          (segment.a.x + segment.b.x) / 2,
          (segment.a.y + segment.b.y) / 2,
        );
      } return false;
    }
    const foundX = (f2 - f1) / (e1 - e2);
    const foundY = (e1 * foundX) + f1;
    if (Math.min(segment.a.x, segment.b.x) < foundX
                && foundX < Math.max(segment.a.x, segment.b.x)
                && Math.min(segment.a.y, segment.b.y) < foundY
                && Math.max(segment.a.y, segment.b.y) > foundY) {
      return new Vec2(foundX, foundY);
    } return false;
  }
}

export default Line;
