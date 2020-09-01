const Vec2 = require('./vec2');
const LineSegment = require('./linesegment');
const Line = require('./line');

/**
 * Class representing a mathematical polygon
 */
class Polygon {
    /**
     * Creates the polygon
     * @param {Vec2[]} points_ Array of the points for the polygon in order
     */
    constructor(points_) {
        if (points_.length < 3) {
            throw new Error(
                'Not enough points in polygon (minimum required: 3)'
            );
        }
        this.points = points_;
        this.makeAntiClockwise();
    }

    /**
     * Returns the vector of the side with the given number
     * The vector has the orientation of the order of the points
     * @param {number} num The number of the side
     * @return {Vec2} The side vector
     */
    getSideVector(num) {
        if (num < 0) num += Math.abs(Math.floor(num)) * this.points.length;
        return Vec2.sub(this.points[(num + 1) % this.points.length],
            this.points[num % this.points.length]);
    }

    /**
     * Returns the side with the given number as a LineSegment
     * @param {number} num The number of the side
     * @return {LineSegment} The side line segment
     */
    getSideSegment(num) {
        if (num < 0) num += Math.abs(Math.floor(num)) * this.points.length;
        return new LineSegment(this.points[(num + 1) % this.points.length],
            this.points[num % this.points.length]);
    }

    /**
     * Returns the side with the given number as a Line
     * @param {number} num The number of the side
     * @return {Line} The side line
     */
    getSideLine(num) {
        if (num < 0) num += Math.abs(Math.floor(num)) * this.points.length;
        return new Line(this.points[(num + 1) % this.points.length],
            this.points[num % this.points.length]);
    }

    /**
     * @return {number} The number of sides of the polygon
     */
    get sides() {
        return this.points.length;
    }

    /**
     * Turns the order of the points to anticlockwise,
     * which is the standard in mathematics
     */
    makeAntiClockwise() {
        let angleSum = 0;

        for (let i = 1; i <= this.sides; i++) {
            let vec1 = this.getSideVector(i);
            let vec2 = this.getSideVector(i - 1);
            vec2.mult(-1);
            angleSum += Vec2.angleACW(vec1, vec2);
        }

        if (this.sides === 3) {
            if (angleSum > Math.PI * 1.5) this.reverseOrder();
        } else if (this.sides === 4) {
            if (Vec2.angleACW(this.getSideVector(1),
                this.getSideVector(0)) >= Math.PI) {
                this.reverseOrder();
            }
        } else if (this.sides > 4) {
            let realAngle = angleSum - this.sides * Math.PI;
            if (realAngle > 0) {
                this.reverseOrder();
            }
        }
    }

    /**
     * Reverses the order of points in the polygon
     */
    reverseOrder() {
        this.points = this.points.reverse();
    }

    /**
     * Determines if a given point is inside the polygon or not
     * @param {Vec2} point The point to investigate
     * @return {boolean} If the point is inside or not
     */
    isPointInside(point) {
        if (Vec2.dist(point, this.centerPoint) > this.boundRadius) return false;

        // Find a point that is outside of the shape for sure
        let outsidePoint = this.centerPoint.copy;
        outsidePoint.add(Vec2.mult(new Vec2(1.1, 0.6), this.boundRadius));

        // Create a LineSegment between the points
        let segment = new LineSegment(point, outsidePoint);

        // Count the intersections
        let intersectionCount = 0;
        [...Array(this.sides).keys()].
            map((number) => this.getSideSegment(number)).forEach((side) => {
                if (LineSegment.intersect(side, segment)) intersectionCount++;
            });

        if (intersectionCount % 2 == 0) return false;
        else if (intersectionCount % 2 == 1) return true;
    }

    /**
     * Returns the mathematical average of the point of the polygon
     * @return {Vec2} The center point
     */
    get centerPoint() {
        let center = new Vec2(0, 0);
        this.points.forEach((p) => {
            center.add(p);
        });
        center.div(this.sides);
        return center;
    }

    /**
     * Returns the radius of the smallest possible
     * circle containing the whole polygon centered
     * around the polygon's centerPoint
     * The circle's center is the centerPoint of the polygon
     * @return {number} The radius
     */
    get boundRadius() {
        let center = this.centerPoint;
        return Math.max(...this.points.map((p) => Vec2.dist(p, center)));
    }

    /**
     * @return {LineSegment[]} Array containing the sides of the polygon
     */
    get allSides() {
        return [...Array(this.sides).keys()].
            map((number) => this.getSideSegment(number));
    }

    /**
     * Determines the intersecting area of two polygons
     * Returns undefined if there is none
     * @param {Polygon} poly1 The first polygon
     * @param {Polygon} poly2 The second polygon
     * @return {Polygon} The intersection area
     */
    static intersection(poly1, poly2) {
        if (Vec2.dist(poly1.centerPoint, poly2.centerPoint) >
            poly1.boundRadius + poly2.boundRadius) return undefined;

        // Determine intersection points
        let sideIntersections = [];
        let sides1 = poly1.allSides;
        let sides2 = poly2.allSides;
        sides1.forEach((side1, idx1) => {
            sides2.forEach((side2, idx2) => {
                let intersectionOfSides = LineSegment.intersect(side1, side2);
                if (intersectionOfSides) {
                    intersectionOfSides['isIntersectionPoint'] = true;
                    sideIntersections.push({
                        intersectionPoint: intersectionOfSides,
                        sideNumber1: idx1,
                        sideNumber2: idx2,
                    });
                };
            });
        });

        if (sideIntersections.length === 0) {
            if (poly1.isPointInside(poly2.points[0])) {
                return new Polygon(poly2.points.map((p) => p.copy));
            }
            if (poly2.isPointInside(poly1.points[0])) {
                return new Polygon(poly1.points.map((p) => p.copy));
            }
        }

        // Put the intersection points into the copy of polygons
        let new1 = new Polygon(poly1.points.map((p) => p.copy));
        for (let i = new1.points.length - 1; i >= 0; i--) {
            let intersectionsOnThis =
                sideIntersections.filter((it) => it.sideNumber1 == i);
            if (intersectionsOnThis.length > 1) {
                intersectionsOnThis.sort((a, b) => {
                    return Vec2.dist(new1.points[i], a.intersectionPoint)
                        - Vec2.dist(new1.points[i], b.intersectionPoint);
                });
            }
            if (intersectionsOnThis.length > 0) {
                new1.points.splice(i + 1, 0,
                    ...intersectionsOnThis.map((it) => it.intersectionPoint));
            }
        }
        let new2 = new Polygon(poly2.points.map((p) => p.copy));
        for (let i = new2.points.length - 1; i >= 0; i--) {
            let intersectionsOnThis =
                sideIntersections.filter((it) => it.sideNumber2 == i);
            if (intersectionsOnThis.length > 1) {
                intersectionsOnThis.sort((a, b) => {
                    return Vec2.dist(new2.points[i], a.intersectionPoint)
                        - Vec2.dist(new2.points[i], b.intersectionPoint);
                });
            }
            if (intersectionsOnThis.length > 0) {
                new2.points.splice(i + 1, 0,
                    ...intersectionsOnThis.map((it) => it.intersectionPoint));
            }
        }

        // Find a starting point outside of the other poly
        let currInv = {
            polyNum: 1,
            pointNum: 0,
        };
        for (let i = 0; i < new1.points.length; i++) {
            if (new1.points[i].isIntersectionPoint) {
                currInv.pointNum = i;
                break;
            } else if (new2.isPointInside(new1.points[i])) {
                currInv.pointNum = i;
                break;
            }
        }
        let isDone = false;
        let finalPoints = [];
        while (!isDone) {
            let currentPoly = (currInv.polyNum === 1) ? new1 : new2;
            let otherPoly = (currInv.polyNum === 1) ? new2 : new1;
            finalPoints.push(
                currentPoly.points[
                    currInv.pointNum % currentPoly.points.length].copy
            );
            if (finalPoints.length > 2 &&
                finalPoints[0].x == finalPoints[finalPoints.length - 1].x &&
                finalPoints[0].y == finalPoints[finalPoints.length - 1].y) {
                finalPoints.pop();
                break;
            }
            if (finalPoints.length > new1.points.length + new2.points.length) {
                break;
            }

            if (currentPoly.points[currInv.pointNum %
                currentPoly.points.length].isIntersectionPoint) {
                if (currentPoly.points[(currInv.pointNum + 1) %
                    currentPoly.points.length].isIntersectionPoint) {
                    currInv.pointNum++;
                } else if (otherPoly.isPointInside(
                    currentPoly.points[(currInv.pointNum + 1) %
                    currentPoly.points.length]) &&
                    !currentPoly.points[(currInv.pointNum + 1) %
                        currentPoly.points.length].isIntersectionPoint) {
                    currInv.pointNum++;
                } else {
                    currInv.pointNum = otherPoly.points.indexOf(
                        currentPoly.points[currInv.pointNum %
                        currentPoly.points.length]) + 1;
                    currInv.polyNum = (currInv.polyNum === 1) ? 2 : 1;
                }
            } else {
                currInv.pointNum++;
            }
        }

        return new Polygon(finalPoints);
    }
}

module.exports = Polygon;
