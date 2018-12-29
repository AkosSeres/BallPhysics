// every angle is counterclockwise (anticlockwise)
/** Class representing a 2d vector. */
export default class Vec2 {
    x: number;
    y: number;

    /**
     * Create a vector.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }


    /**
     * Get a copy of the vector.
     * @return {Vec2} The copy.
     */
    get copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    /**
     * Get the length of the vector.
     * @return {number} The length.
     */
    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get the length of the vector squared.
     * @return {number} The length squared.
     */
    get sqlength(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Get the heading of the vector compared to (1, 0).
     * @return {number} The angle between (1, 0)
     * and the vector in anticlockwise direction.
     */
    get heading(): number {
        if (this.x === 0 && this.y === 0) return 0;
        if (this.x === 0) return this.y > 0 ? Math.PI / 2 : 1.5 * Math.PI;
        if (this.y === 0) return this.x > 0 ? 0 : Math.PI;
        let v = Vec2.normalized(this);
        if (this.x > 0 && this.y > 0) return Math.asin(v.y);
        if (this.x < 0 && this.y > 0) return Math.asin(-v.x) + Math.PI / 2;
        if (this.x < 0 && this.y < 0) return Math.asin(-v.y) + Math.PI;
        if (this.x > 0 && this.y < 0) return Math.asin(v.x) + 1.5 * Math.PI;
        return 0;
    }

    /**
     * Adds another vector to the vector.
     * @param {Vec2} a - The other vector.
     */
    add(a: Vec2) {
        this.x += a.x;
        this.y += a.y;
    }

    /**
     * Subtracts another vector from the vector.
     * @param {Vec2} a - The other vector.
     */
    sub(a: Vec2) {
        this.x -= a.x;
        this.y -= a.y;
    }

    /**
     * Multiplies the vector by a scalar.
     * @param {number} x - The scalar.
     */
    mult(x: number) {
        this.x *= x;
        this.y *= x;
    }

    /**
     * Divides the vector by a scalar.
     * @param {number} x - The scalar.
     */
    div(x: number) {
        this.x /= x;
        this.y /= x;
    }

    /**
     * Linearry interpolates the vector into the other vector by scalar x.
     * @param {Vec2} other - The other vector.
     * @param {number} x - The scalar.
     */
    lerp(other: Vec2, x: number) {
        this.x += (other.x - this.x) * x;
        this.y += (other.y - this.y) * x;
    }

    /**
     * Get the distance between the vector and the other vector.
     * Vectors are representing points here.
     * @param {Vec2} other - The other vector.
     * @return {number} The distance between them.
     */
    dist(other: Vec2): number {
        return (new Vec2(this.x - other.x, this.y - other.y)).length;
    }

    /**
     * Set the length of the vector.
     * @param {number} l - The new length value.
     */
    setMag(l: number) {
        if (this.length === 0) return;
        this.mult(l / this.length);
    }

    /**
     * Rotate the vector anticlockwise.
     * @param {number} angle - Rotation angle.
     */
    rotate(angle: number) {
        let h = this.heading;
        let v = Vec2.fromAngle(angle + h);
        v.mult(this.length);
        this.x = v.x;
        this.y = v.y;
    }


    // Static functions:
    /**
     * Add two vectors together.
     * @param {Vec2} a - Vector.
     * @param {Vec2} b - Other vector.
     * @return {Vec2} The sum of the vectors.
     */
    static add(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    /**
     * Subtracts one vector from another.
     * @param {Vec2} a - Vector.
     * @param {Vec2} b - Other vector.
     * @return {Vec2} The subtraction of the vectors.
     */
    static sub(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    /**
     * Multiply the vector by a scalar.
     * @param {Vec2} v - Vector.
     * @param {number} x - Scalar.
     * @return {Vec2} The multiplied vector.
     */
    static mult(v: Vec2, x: number): Vec2 {
        return new Vec2(v.x * x, v.y * x);
    }

    /**
     * Divide the vector by a scalar.
     * @param {Vec2} v - Vector.
     * @param {number} x - Scalar.
     * @return {Vec2} The divided vector.
     */
    static div(v: Vec2, x: number): Vec2 {
        return new Vec2(v.x / x, v.y / x);
    }

    /**
     * Create a unit vector from an angle.
     * @param {number} a - The angle.
     * @return {Vec2} The created vector.
     */
    static fromAngle(a: number): Vec2 {
        return new Vec2(Math.cos(a), Math.sin(a));
    }

    /**
     * Linearry interpolates a vector into another vector by scalar x.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector.
     * @param {number} x - The scalar.
     * @return {Vec2} The created vector.
     */
    static lerp(a: Vec2, b: Vec2, x: number): Vec2 {
        return Vec2.add(a, Vec2.mult(Vec2.sub(b, a), x));
    }

    /**
     * Get the distance between vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} The distance between them.
     */
    static dist(a: Vec2, b: Vec2): number {
        return Vec2.sub(a, b).length;
    }

    /**
     * Get the dot product of two vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} The dot product of them.
     */
    static dot(a: Vec2, b: Vec2): number {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Get the cross product of two vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} The cross product of them.
     */
    static cross(a: Vec2, b: Vec2): number {
        return a.x * b.y - a.y * b.x;
    }

    /**
     * Get the angle between two vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} Angle between them.
     */
    static angle(a: Vec2, b: Vec2): number {
        return Math.acos(Vec2.dot(a, b) / Math.sqrt(a.sqlength * b.sqlength));
    }

    /**
     * Get the angle between two vectors but in the anticlockwise direction.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} Angle between them.
     */
    static angleACW(a: Vec2, b: Vec2): number {
        let ah = a.heading;
        let bh = b.heading;
        let angle = bh - ah;
        return angle < 0 ? 2 * Math.PI + angle : angle;
    }

    /**
     * Get a vector with the same heading with the input vector
     * but with length = 1.
     * @param {Vec2} v - A vector.
     * @return {Vec2} Vector with length = 0.
     */
    static normalized(v: Vec2): Vec2 {
        let l = v.length;
        return l === 0 ? v : new Vec2(v.x / l, v.y / l);
    }
}
