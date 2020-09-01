const Vec2 = require('./vec2');
const LineSegment = require('./linesegment');

/**
 * Class representing a staight line with infinite length
 * Still constructed from two points, but these points do not act as boundaries
 */
class Line extends LineSegment {
    /**
     * Create an infinite length staight line going through the
     * given points points on the 2D plane
     * @param {Vec2} a_ First point
     * @param {Vec2} b_ Second point
     */
    constructor(a_, b_) {
        super(a_, b_);
    }

    /**
     * Returns the length of the line which is always infinite
     * @return {number} The length, infinite
     */
    get length() {
        return Number.POSITIVE_INFINITY;
    }

    /**
     * Get the distance between a point and the line
     * @param {Vec2} p The point as a vector
     * @return {number} The distance
     */
    distFromPoint(p) {
        // Create a vector perpendicular to the line with length 1
        let perpendicular = Vec2.sub(this.a, this.b);
        perpendicular.setMag(1);
        perpendicular.rotate(Math.PI / 2);

        let distVec = Vec2.sub(p, this.a);
        let distance = Math.abs(Vec2.dot(distVec, perpendicular));
        return distance;
    }

    /**
     * Get if they intersect or not
     * If they intersect it returns the intersection point
     * If they not it returns undefined
     * @param {Line} line1 A line
     * @param {Line} line2 Other line
     * @return {Vec2} Intersetion point
     */
    static intersect(line1, line2) {
        let v1 = Vec2.sub(line1.b, line1.a);
        let e1 = v1.y / v1.x;
        let f1 = line1.b.y - line1.b.x * e1;

        let v2 = Vec2.sub(line2.b, line2.a);
        let e2 = v2.y / v2.x;
        let f2 = line2.b.y - line2.b.x * e2;

        if (e1 === e2) {
            if (line1.distFromPoint(line2.a) == 0) {
                return new Vec2(
                    (line1.a.x + line1.b.x + line2.a.x + line2.b.x) / 4,
                    (line1.a.y + line1.b.y + line2.a.y + line2.b.y) / 4);
            } else return undefined;
        } else {
            let foundX = (f2 - f1) / (e1 - e2);
            return new Vec2(foundX, (e1 * foundX) + f1);
        }
    }
}

module.exports = Line;
