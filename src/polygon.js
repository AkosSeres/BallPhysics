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
        if (points_.length < 3) throw new Error('Not enough points in polygon (minimum required: 3)');
        this.points = points_;
        this.makeAntiClockwise();
    }

    /**
     * Returns the vector of the side with the given number
     * The vector has the orientation of the order of the points
     * @param {number} num The vector of the side
     * @return {Vec2} The side vector
     */
    getSideVector(num) {
        if (num < 0) num += Math.abs(Math.floor(num)) * this.points.length;
        return Vec2.sub(this.points[(num + 1) % this.points.length],
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
}

module.exports = Polygon;
