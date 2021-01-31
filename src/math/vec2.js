// every angle is counterclockwise (anticlockwise)

/**
 * An object representation of the Vec2 class for easy conversion to JSON.
 *
 * @typedef {object} Vec2AsObject
 * @property {number} x The x coordinate
 * @property {number} y The y coordinate
 */

/** Class representing a 2d vector. */
class Vec2 {
  /**
   * Create a vector.
   *
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get a copy of the vector.
   *
   * @returns {Vec2} The copy.
   */
  get copy() {
    return new Vec2(this.x, this.y);
  }

  /**
   * Sets the coordinates to the given ones.
   *
   * @param {number} x The new x coordinate.
   * @param {number} y The new y coordinate.
   */
  setCoordinates(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get the length of the vector.
   *
   * @returns {number} The length.
   */
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get the length of the vector squared.
   *
   * @returns {number} The length squared.
   */
  get sqlength() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Get the heading of the vector compared to (1, 0).
   *
   * @returns {number} The angle between (1, 0)
   * and the vector in anticlockwise direction.
   */
  get heading() {
    if (this.x === 0 && this.y === 0) return 0;
    if (this.x === 0) return this.y > 0 ? Math.PI / 2 : 1.5 * Math.PI;
    if (this.y === 0) return this.x > 0 ? 0 : Math.PI;
    const v = Vec2.normalized(this);
    if (this.x > 0 && this.y > 0) return Math.asin(v.y);
    if (this.x < 0 && this.y > 0) return Math.asin(-v.x) + Math.PI / 2;
    if (this.x < 0 && this.y < 0) return Math.asin(-v.y) + Math.PI;
    if (this.x > 0 && this.y < 0) return Math.asin(v.x) + 1.5 * Math.PI;
    return 0;
  }

  /**
   * Adds another vector to the vector.
   *
   * @param {Vec2 | Vec2AsObject} a - The other vector.
   */
  add(a) {
    this.x += a.x;
    this.y += a.y;
  }

  /**
   * Subtracts another vector from the vector.
   *
   * @param {Vec2 | Vec2AsObject} a - The other vector.
   */
  sub(a) {
    this.x -= a.x;
    this.y -= a.y;
  }

  /**
   * Multiplies the vector by a scalar.
   *
   * @param {number} x - The scalar.
   */
  mult(x) {
    this.x *= x;
    this.y *= x;
  }

  /**
   * Divides the vector by a scalar.
   *
   * @param {number} x - The scalar.
   */
  div(x) {
    this.x /= x;
    this.y /= x;
  }

  /**
   * Linearry interpolates the vector into the other vector by scalar x.
   *
   * @param {Vec2 | Vec2AsObject} other - The other vector.
   * @param {number} x - The scalar.
   */
  lerp(other, x) {
    this.x += (other.x - this.x) * x;
    this.y += (other.y - this.y) * x;
  }

  /**
   * Get the distance between the vector and the other vector.
   * Vectors are representing points here.
   *
   * @param {Vec2 | Vec2AsObject} other - The other vector.
   * @returns {number} The distance between them.
   */
  dist(other) {
    return new Vec2(this.x - other.x, this.y - other.y).length;
  }

  /**
   * Returns the p-norm of the vector in Lp space.
   *
   * @param {number} par The p parameter
   * @returns {number} The calculated p-norm
   */
  pNorm(par) {
    let p = par;
    if (p < 1) p = 1;
    return (Math.abs(this.x ** p) + Math.abs(this.y ** p)) ** (1 / p);
  }

  /**
   * Set the length of the vector.
   *
   * @param {number} l - The new length value.
   */
  setMag(l) {
    if (this.length === 0) return;
    this.mult(l / this.length);
  }

  /**
   * Normalizes the vector.
   */
  normalize() {
    if (this.length === 0) return;
    this.div(this.length);
  }

  /**
   * Scales the vector around a given center by a given factor.
   *
   * @param {Vec2 | Vec2AsObject} center The center of the scaling transformation
   * @param {number} scalingFactor The factor of the scaling
   */
  scaleAround(center, scalingFactor) {
    this.x = center.x + ((this.x - center.x) * scalingFactor);
    this.y = center.y + ((this.y - center.y) * scalingFactor);
  }

  /**
   * Scales the vector around a given center by a given factor only on the X axis.
   *
   * @param {Vec2 | Vec2AsObject} center The center of the scaling transformation
   * @param {number} scalingFactor The factor of the scaling
   */
  scaleAroundX(center, scalingFactor) {
    this.x = center.x + ((this.x - center.x) * scalingFactor);
  }

  /**
   * Scales the vector around a given center by a given factor only on the Y axis.
   *
   * @param {Vec2 | Vec2AsObject} center The center of the scaling transformation
   * @param {number} scalingFactor The factor of the scaling
   */
  scaleAroundY(center, scalingFactor) {
    this.y = center.y + ((this.y - center.y) * scalingFactor);
  }

  /**
   * Rotate the vector anticlockwise.
   *
   * @param {number} angle Rotation angle in radians
   */
  rotate(angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    this.setCoordinates(this.x * cosA - this.y * sinA, this.x * sinA + this.y * cosA);
  }

  /**
   * Rotates all the vectors in a given array.
   *
   * @param {Vec2[]} vArr The array containing the vectors
   * @param {number} angle The angle to rotate with
   */
  static rotateArr(vArr, angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    vArr.forEach((v) => {
      v.setCoordinates(v.x * cosA - v.y * sinA, v.x * sinA + v.y * cosA);
    });
  }

  /**
   * Rotates the vector by 90 degrees
   */
  rotate90() {
    const { x } = this;
    this.x = -this.y;
    this.y = x;
  }

  /**
   * Rotates the vector by 270 degrees
   */
  rotate270() {
    const { x } = this;
    this.x = this.y;
    this.y = -x;
  }

  // Static functions:
  /**
   * Add two vectors together.
   *
   * @param {Vec2 | Vec2AsObject} a - Vector.
   * @param {Vec2 | Vec2AsObject} b - Other vector.
   * @returns {Vec2} The sum of the vectors.
   */
  static add(a, b) {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  /**
   * Subtracts one vector from another.
   *
   * @param {Vec2 | Vec2AsObject} a - Vector.
   * @param {Vec2 | Vec2AsObject} b - Other vector.
   * @returns {Vec2} The subtraction of the vectors.
   */
  static sub(a, b) {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  /**
   * Multiply the vector by a scalar.
   *
   * @param {Vec2 | Vec2AsObject} v - Vector.
   * @param {number} x - Scalar.
   * @returns {Vec2} The multiplied vector.
   */
  static mult(v, x) {
    return new Vec2(v.x * x, v.y * x);
  }

  /**
   * Divide the vector by a scalar.
   *
   * @param {Vec2 | Vec2AsObject} v - Vector.
   * @param {number} x - Scalar.
   * @returns {Vec2} The divided vector.
   */
  static div(v, x) {
    return new Vec2(v.x / x, v.y / x);
  }

  /**
   * Create a unit vector from an angle.
   *
   * @param {number} a The angle
   * @returns {Vec2} The created vector
   */
  static fromAngle(a) {
    return new Vec2(Math.cos(a), Math.sin(a));
  }

  /**
   * Create a unit vector from an angle in a p-normed space.
   *
   * @param {number} a The angle
   * @param {number} p The p parameter of the p-normed space
   * @returns {Vec2} The created vector
   */
  static fromAnglePNorm(a, p) {
    const unit = new Vec2(Math.cos(a), Math.sin(a));
    unit.div(unit.pNorm(p));
    return unit;
  }

  /**
   * Linearry interpolates a vector into another vector by scalar x.
   *
   * @param {Vec2 | Vec2AsObject} a - A vector.
   * @param {Vec2 | Vec2AsObject} b - Other vector.
   * @param {number} x - The scalar.
   * @returns {Vec2} The created vector.
   */
  static lerp(a, b, x) {
    return Vec2.add(a, Vec2.mult(Vec2.sub(b, a), x));
  }

  /**
   * Get the distance between vectors.
   *
   * @param {Vec2 | Vec2AsObject} a - A vector.
   * @param {Vec2 | Vec2AsObject} b - Other vector
   * @returns {number} The distance between them.
   */
  static dist(a, b) {
    return Vec2.sub(a, b).length;
  }

  /**
   * Get the dot product of two vectors.
   *
   * @param {Vec2 | Vec2AsObject} a - A vector.
   * @param {Vec2 | Vec2AsObject} b - Other vector
   * @returns {number} The dot product of them.
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * Get the cross product of two vectors.
   *
   * @param {Vec2 | Vec2AsObject} a - A vector.
   * @param {Vec2 | Vec2AsObject} b - Other vector
   * @returns {number} The cross product of them.
   */
  static cross(a, b) {
    return a.x * b.y - a.y * b.x;
  }

  /**
   * Returns the cross product of a scalar and a 2D vector
   * when the scalar goes first
   *
   * @param {number} s The scalar
   * @param {Vec2 | Vec2AsObject} v The vector
   * @returns {Vec2} The cross product
   */
  static crossScalarFirst(s, v) {
    return new Vec2(-v.y * s, v.x * s);
  }

  /**
   * Returns the cross product of a scalar and a 2D vector
   * when the scalar goes second
   *
   * @param {Vec2 | Vec2AsObject} v The vector
   * @param {number} s The scalar
   * @returns {Vec2} The cross product
   */
  static crossScalarSecond(v, s) {
    return new Vec2(v.y * s, -v.x * s);
  }

  /**
   * Get the angle between two vectors.
   *
   * @param {Vec2} a - A vector.
   * @param {Vec2} b - Other vector
   * @returns {number} Angle between them.
   */
  static angle(a, b) {
    return Math.acos(
      Math.min(
        Math.max(
          Vec2.dot(a, b) / Math.sqrt(a.sqlength * b.sqlength), 1,
        ), -1,
      ),
    );
  }

  /**
   * Get the angle between two vectors but in the anticlockwise direction.
   *
   * @param {Vec2} a - A vector.
   * @param {Vec2} b - Other vector
   * @returns {number} Angle between them.
   */
  static angleACW(a, b) {
    const ah = a.heading;
    const bh = b.heading;
    const angle = bh - ah;
    return angle < 0 ? 2 * Math.PI + angle : angle;
  }

  /**
   * Get a vector with the same heading with the input vector
   * but with length = 1.
   *
   * @param {Vec2} v A vector.
   * @returns {Vec2} Vector with length = 1.
   */
  static normalized(v) {
    const l = v.length;
    return l === 0 ? v : new Vec2(v.x / l, v.y / l);
  }

  /**
   * @returns {Vec2AsObject} The vector represented in a JS object,
   * ready to be converted into JSON.
   */
  toJSON() {
    return { x: this.x, y: this.y };
  }

  /**
   * Creates a Vec2 class from the given object.
   *
   * @param {Vec2AsObject} obj The object to create the class from
   * @returns {Vec2} The Vec2 object
   */
  static fromObject(obj) {
    return new Vec2(obj.x, obj.y);
  }
}

export default Vec2;
