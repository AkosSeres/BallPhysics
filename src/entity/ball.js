import { collisionResponse } from '../util/collision';
import Vec2 from '../math/vec2';

/**
 * An object representation of the Ball class for easy conversion to JSON.
 *
 * @typedef {object} BallAsObject
 * @property {import('../math/vec2').Vec2AsObject} pos The position
 * @property {import('../math/vec2').Vec2AsObject} lastPos The last position
 * @property {number} r The radius of the ball
 * @property {number} fc The coefficient of friction
 * @property {number} amc Coefficient for the angular mass
 * @property {number} rotation The rotation of the ball
 * @property {number} ang The angular velocity
 * @property {number} k The coefficient of restitution (bounciness)
 * @property {import('../math/vec2').Vec2AsObject} vel The velocity
 * @property {string | number | undefined} layer The collision layer of the ball
 */

/**
 * A class representing a ball
 * A ball is an object in the physics engine that
 * has a shape of a circle and it is affected by gravity.
 */
class Ball {
  /**
   * Create a ball.
   * The mass of the ball is calculated from its radius.
   *
   * @param {Vec2} pos The position of the center of the circle
   * @param {Vec2} vel The velocity of the circle
   * @param {number} r The radius of the circe
   * @param {number} k Coefficient of restitution
   * @param {number} ang The angular velocity of the ball (optional)
   * @param {number} fc The friction coefficient (optional, defaults to 0.4)
   */
  constructor(pos, vel, r, k, ang, fc) {
    this.pos = pos.copy;
    this.lastPos = this.pos.copy;
    this.r = r;
    this.fc = 0.4;
    this.amc = 0.5;
    this.density = 1;

    this.rotation = 0;

    if (ang) this.ang = ang;
    else this.ang = 0;

    if (fc || fc === 0) this.fc = fc;

    if (Number.isFinite(k)) this.k = k;
    else this.k = 0.8;

    if (vel !== undefined) this.vel = vel.copy;
    else this.vel = new Vec2(0, 0);

    /** @type {string | number | undefined} */
    this.layer = undefined;
  }

  /**
   * Get the mass of the ball
   *
   * @returns {number} The mass
   */
  get m() {
    return this.density * this.r * this.r * Math.PI;
  }

  /**
   * Get the moment of inertia of the ball
   *
   * @returns {number} The moment of inertia
   */
  get am() {
    return this.amc * this.r * this.r * this.m;
  }

  /**
   * Gives the angular mass of the ball measured in a given point
   *
   * @param {Vec2} point The point to measure the angular mass in
   * @returns {number} The adjusted angular mass
   */
  getAmInPoint(point) {
    let ret = this.am;

    ret += Vec2.sub(this.pos, point).sqlength * this.m;

    return ret;
  }

  /**
   * Get a copy of the ball that is not a reference to it
   *
   * @returns {Ball} The copy of the ball
   */
  get copy() {
    const ret = new Ball(
      this.pos.copy,
      this.vel.copy,
      this.r,
      this.k,
      this.ang,
      this.fc,
    );
    ret.lastPos = this.lastPos.copy;
    ret.rotation = this.rotation;
    return ret;
  }

  /**
   * Moves the ball by the given coordinates
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  move(x, y) {
    this.pos.x += x;
    this.pos.y += y;
  }

  /**
   * Rotates the ball with the given angle anticlockwise
   *
   * @param {number} angle The angle to rotate the ball in radians
   */
  rotate(angle) {
    this.rotation += angle;
  }

  /**
   * Checks if two balls are colliding or not
   *
   * @param {Ball} ball the other ball
   * @returns {boolean} True if they colidre
   */
  collided(ball) {
    if (this.pos.dist(ball.pos) < this.r + ball.r) return true;
    return false;
  }

  /**
   * Static function for collision between two balls
   *
   * @param {Ball} ball1 First ball
   * @param {Ball} ball2 Second ball
   * @returns {import('../physics').CollisionData | undefined} The collision data
   */
  static collide(ball1, ball2) {
    if (!ball1.collided(ball2)) return;

    // Completely necessary quantities
    const dist = Vec2.dist(ball1.pos, ball2.pos);
    const m1 = ball1.m;
    const m2 = ball2.m;

    // Separate the balls
    const cp1 = ball1.pos.copy;
    const cp2 = ball2.pos.copy;
    const b1 = ball1;
    const b2 = ball2;
    const too = ball1.r + ball2.r - dist;
    const d = Vec2.sub(ball1.pos, ball2.pos);
    d.setMag(1);
    d.mult((too * m2) / (m1 + m2));
    cp1.add(d);
    d.setMag(1);
    d.mult((-too * m1) / (m1 + m2));
    cp2.add(d);
    b1.pos = cp1;
    b2.pos = cp2;

    // Stop if they move in opposite directions
    if (Vec2.dot(d, Vec2.sub(ball1.vel, ball2.vel)) < 0) return;
    d.setMag(1);
    // Collision point
    const cp = Vec2.add(ball1.pos, Vec2.mult(d, ball1.r));
    collisionResponse(ball1, ball2, cp, d);
    // eslint-disable-next-line consistent-return
    return { cp, n: d };
  }

  /**
   * Returns true if the point is inside the ball
   *
   * @param {Vec2} p The point
   * @returns {boolean} The boolean value
   */
  containsPoint(p) {
    return Vec2.dist(this.pos, p) <= this.r;
  }

  /**
   * Calculates the effective velocity of the ball in a
   * given point from it's velocity and angular velocity
   *
   * @param {Vec2 | import('../math/vec2').Vec2AsObject} point The point to be taken a look at
   * @returns {Vec2} The velocity of the Ball in the given point
   */
  velInPlace(point) {
    const vp = Vec2.sub(point, this.pos);
    vp.rotate(Math.PI / 2);
    vp.mult(this.ang);
    vp.add(this.vel);
    return vp;
  }

  /**
   * Calculates the effective mass of the ball in
   * a given point when pulled/pushed in a given direction
   * by a hypothetical force
   *
   * @param {Vec2} point The given point
   * @param {Vec2} direction The direction of the force
   * @returns {number} The effective mass of the ball in the given
   * point when acting on it in the direction
   */
  effectiveMass(point, direction) {
    const r = Vec2.sub(point, this.pos);// Vector to the collision point
    if (r.length === 0) return this.m;
    const angle = Vec2.angle(direction, r);
    const rotationalMass = ((Math.sin(angle) ** 2) * (r.length ** 2)) / this.am;
    return 1 / (rotationalMass + (1 / this.m));
  }

  /**
   * Realistically applies a change of velocity (momentum)
   * on the ball
   *
   * @param {Vec2} dvel The change in velocity
   * @param {Vec2} point The point of pushing
   */
  applyDeltaVelInPoint(dvel, point) {
    const r = Vec2.sub(point, this.pos);
    if (r.length === 0) {
      this.vel.add(dvel);
      return;
    }
    const angle = Vec2.angle(r, dvel);
    // Change vel in line with the center of mass
    const deltaVlined = Vec2.mult(r, Vec2.dot(dvel, r) / (r.length ** 2));
    this.vel.add(deltaVlined);

    // Change it perpendicular to the line
    const d = r.copy;
    d.rotate(Math.PI / 2);
    d.setMag(1);
    const rotateDirection = Math.sign(Vec2.dot(dvel, d));
    const dvelAng = dvel.length * Math.cos(angle);
    const mEff = 1 / ((1 / this.m) + ((r.length ** 2) / this.am));
    const dvm = (dvelAng * mEff) / this.m;
    this.vel.add(Vec2.mult(d, dvm * rotateDirection));

    const dAng = (rotateDirection * dvelAng * mEff * r.length) / this.am;
    this.ang -= dAng;
  }

  /**
   * @returns {BallAsObject} The ball represented in a JS object
   * Ready to be converted into JSON
   */
  toJSON() {
    const ret = {};

    ret.pos = this.pos.toJSON();
    ret.lastPos = this.lastPos.toJSON();
    ret.r = this.r;
    ret.fc = this.fc;
    ret.amc = this.amc;
    ret.rotation = this.rotation;
    ret.ang = this.ang;
    ret.fc = this.fc;
    ret.k = this.k;
    ret.vel = this.vel.toJSON();
    if (typeof this.layer !== 'undefined') {
      ret.layer = this.layer;
    }

    return ret;
  }

  /**
   * Creates a Ball class from the given object
   *
   * @param {BallAsObject} obj The object to create the class from
   * @returns {Ball} The Ball object
   */
  static fromObject(obj) {
    const ret = new Ball(
      Vec2.fromObject(obj.pos),
      Vec2.fromObject(obj.vel),
      obj.r,
      obj.k,
      obj.ang,
      obj.fc,
    );

    ret.lastPos = Vec2.fromObject(obj.lastPos);
    ret.amc = obj.amc;
    ret.rotation = obj.rotation;
    ret.vel = Vec2.fromObject(obj.vel);
    if (typeof obj.layer !== 'undefined') {
      ret.layer = obj.layer;
    }

    return ret;
  }
}

export default Ball;
