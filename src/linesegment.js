/** Class representing a segment of a line */
class LineSegment {
    /**
     * Create a segment.
     * @param {Vec2} a - Starting point.
     * @param {Vec2} b - Ending point.
     */
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    /**
     * Get the length of the segment.
     * @return {number} The length.
     */
    get length() {
        return Vec.dist(this.a, this.b);
    }

    /**
     * Get the distance between a point and the line segment.
     * @param {Vec2} p - The point as a vector.
     * @return {number} The distance.
     */
    distFromPoint(p) {
        let e = Vec.sub(this.a, this.b);
        let A = Vec.sub(p, this.b);
        let B = Vec.sub(p, this.a);
        let a = A.length;
        let b = B.length;
        let c = e.length;
        if (c === 0) return a;
        let gamma = Vec.angle(A, B);
        let betha = Vec.angle(A, e);
        let alpha = Math.PI - gamma - betha;
        let area = Math.sin(alpha) * b * c / 2;
        let m = 2 * area / c;
        if (alpha > Math.PI / 2) return b;
        if (betha > Math.PI / 2) return a;
        return m;
    }

    /**
     * Get if they intersect or not.
     * If they intersect it returns true.
     * If they not it returns false.
     * @param {LineSegment} segment1 - A segment.
     * @param {LineSegment} segment2 - Other segment.
     * @return {Boolean} If they intersect or not.
     */
    static intersect(segment1, segment2) {
        let v1 = Vec.sub(segment1.b, segment1.a);
        let a1 = v1.y / v1.x;
        let c1 = segment1.b.y - (segment1.b.x * a1);

        let v2 = Vec.sub(segment2.b, segment2.a);
        let a2 = v2.y / v2.x;
        let c2 = segment2.b.y - (segment2.b.x * a2);

        if (v1.x === 0 && v2.x !== 0) {
            if ((segment1.a.x >= segment2.a.x &&
                segment1.a.x <= segment2.b.x) ||
                (segment1.a.x <= segment2.a.x &&
                    segment1.a.x >= segment2.b.x)) {
                let h = a2 * segment1.a.x + c2;
                if ((h > segment1.a.y && h < segment1.b.y) ||
                    (h < segment1.a.y && h > segment1.b.y)) return true;
            }
            return false;
        }
        if (v2.x === 0 && v1.x !== 0) {
            if ((segment2.a.x >= segment1.a.x &&
                segment2.a.x <= segment1.b.x) ||
                (segment2.a.x <= segment1.a.x &&
                    segment2.a.x >= segment1.b.x)) {
                let h = a1 * segment2.a.x + c1;
                if ((h > segment2.a.y && h < segment2.b.y) ||
                    (h < segment2.a.y && h > segment2.b.y)) return true;
            }
            return false;
        }
        if (v1.x === 0 && v2.x === 0) {
            if (segment1.a.x === segment2.a.x) {
                if (segment1.a.y >= segment2.a.y &&
                    segment1.a.y <= segment2.b.y) return true;
                if (segment1.b.y >= segment2.a.y &&
                    segment1.b.y <= segment2.b.y) return true;
                if (segment1.a.y <= segment2.a.y &&
                    segment1.a.y >= segment2.b.y) return true;
                if (segment1.b.y <= segment2.a.y &&
                    segment1.b.y >= segment2.b.y) return true;
            }
            return false;
        }

        // If they are parralel the only time they intersect is when c1 == c2.
        if ((a1 - a2) == 0) return c1 == c2;
        let x = (c2 - c1) / (a1 - a2);
        let interval1 = (segment1.a.x < segment1.b.x) ?
            [segment1.a.x, segment1.b.x] : [segment1.b.x, segment1.a.x];
        let interval2 = (segment2.a.x < segment2.b.x) ?
            [segment2.a.x, segment2.b.x] : [segment2.b.x, segment2.a.x];
        let interval = [(interval1[0] > interval2[0]) ?
            interval1[0] : interval2[0],
        (interval1[1] < interval2[1]) ?
            interval1[1] : interval2[1]];
        if (x >= interval[0] && x <= interval[1]) return true;
        else return false;
    }
};
