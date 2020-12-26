const Vec2 = require('./vec2');

/**
 * A class representing a ball
 * A ball is an object in the physics engine that
 * has a shape of a circle and it is affected by gravity
 */
class Ball {
  /**
   * Crete a ball
   * The mass of the ball is calculated from its radius
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
    this.amc = 2 / 5;

    this.rotation = 0;

    if (ang) this.ang = ang;
    else this.ang = 0;

    if (fc || fc === 0) this.fc = fc;

    if (k) this.k = k;
    else this.k = 0.8;

    if (vel != undefined) this.vel = vel.copy;
    else this.vel = new Vec2(0, 0);

    this.id =
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9);
  }

  /**
   * Get the mass of the ball
   * @return {number} The mass
   */
  get m() {
    return this.r * this.r * Math.PI;
  }

  /**
   * Get the moment of inertia of the ball
   * @return {number} The moment of inertia
   */
  get am() {
    return this.amc * this.r * this.r * this.m;
  }

  /**
   * Gives the angular mass of the ball measured in a given point
   * @param {Vec2} point The point to measure the angular mass in
   * @return {number} The adjusted angular mass
   */
  getAmInPoint(point) {
    let ret = this.am;

    ret += Vec2.sub(this.pos, point).sqlength * this.m;

    return ret;
  }

  /**
   * Get a copy of the ball that is not a reference to it
   * @return {Ball} The copy of the ball
   */
  get copy() {
    let ret = new Ball(
      this.pos.copy,
      this.vel.copy,
      this.r,
      this.k,
      this.ang,
      this.fc
    );
    ret.lastPos = this.lastPos.copy;
    ret.rotation = this.rotation;
    return ret;
  }

  /**
   * Moves the ball by the given coordinates
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  move(x, y) {
    this.pos.x += x;
    this.pos.y += y;
  }

  /**
   * Rotates the ball with the given angle anticlockwise
   * @param {number} angle The angle to rotate the ball in radians
   */
  rotate(angle) {
    this.rotation += angle;
  }

  /**
   * Checks if two balls are colliding or not
   * @param {Ball} ball the other ball
   * @return {boolean} True if they colidre
   */
  collided(ball) {
    if (this.pos.dist(ball.pos) < this.r + ball.r) return true;
    else return false;
  }

  /**
   * Static function for collision between two balls
   * @param {Ball} ball1 First ball
   * @param {Ball} ball2 Second ball
   */
  static collide(ball1, ball2) {
    if (!ball1.collided(ball2)) return;

    // Completely necessary quantities
    let dist = Vec2.dist(ball1.pos, ball2.pos);
    let m1 = ball1.m;
    let m2 = ball2.m;

    // Separate the balls
    let cp1 = ball1.pos.copy;
    let cp2 = ball2.pos.copy;
    let too = ball1.r + ball2.r - dist;
    let d = Vec2.sub(ball1.pos, ball2.pos);
    d.setMag(1);
    d.mult((too * m2) / (m1 + m2));
    cp1.add(d);
    d.setMag(1);
    d.mult((-too * m1) / (m1 + m2));
    cp2.add(d);
    ball1.pos = cp1;
    ball2.pos = cp2;

    // Stop if they move in opposite directions
    if (Vec2.dot(d, Vec2.sub(ball1.vel, ball2.vel)) < 0) return;
    d.setMag(1);
    // Collision point
    let cp = Vec2.add(ball1.pos, Vec2.mult(d, ball1.r));

    // Calculate collision response
    let v1 = ball1.vel.copy;
    let v2 = ball2.vel.copy;
    let ang1 = ball1.ang;
    let ang2 = ball2.ang;
    let r1 = Vec2.sub(cp, ball1.pos);
    let r2 = Vec2.sub(cp, ball2.pos);
    let am1 = ball1.am;
    let am2 = ball2.am;
    let k = (ball1.k + ball2.k) / 2;
    let fc = (ball1.fc + ball2.fc) / 2;

    // Create collision space basis
    let n = d.copy;// normal/perpendicular

    // Effective velocities in the collision point
    let v1InCP = ball1.velInPlace(cp);
    let v2InCP = ball2.velInPlace(cp);
    // Relative velocity in collision point
    let vRelInCP = Vec2.sub(v2InCP, v1InCP);

    // Calculate impulse
    let impulse = (1 / m1) + (1 / m2);
    impulse = -(1 + k) * Vec2.dot(vRelInCP, n) / impulse;

    // Calculate post-collision velocities
    let u1 = Vec2.sub(v1, Vec2.mult(n, impulse / m1));
    let u2 = Vec2.add(v2, Vec2.mult(n, impulse / m2));

    // Calculate post-collision angular velocities
    let pAng1 = ang1 - impulse * Vec2.cross(r1, n) / am1;
    let pAng2 = ang2;

    /**
     * Now calculate the friction reaction
     */
    // Tangential direction
    let t = vRelInCP.copy;
    t.sub(Vec2.mult(n, Vec2.dot(vRelInCP, n)));
    t.setMag(1);

    // Calculate max impulse
    let maxImpulse = (1 / m1) + (1 / m2);
    maxImpulse += Vec2.dot(
      Vec2.crossScalarFirst(Vec2.cross(r1, t) / am1, r1), t);
    maxImpulse += Vec2.dot(
      Vec2.crossScalarFirst(Vec2.cross(r2, t) / am2, r2), t);
    maxImpulse = -0.5 * Vec2.dot(vRelInCP, t) / maxImpulse;

    // Friction impulse
    let frictionImpulse = impulse * fc;
    if (frictionImpulse > maxImpulse) frictionImpulse = maxImpulse;

    // Calculate post-friction velocities
    u1 = Vec2.sub(u1, Vec2.mult(t, frictionImpulse / m1));
    u2 = Vec2.add(u2, Vec2.mult(t, frictionImpulse / m2));

    // Calculate post-friction angular velocities
    pAng1 = pAng1 - frictionImpulse * Vec2.cross(r1, t) / am1;
    pAng2 = pAng2 + frictionImpulse * Vec2.cross(r2, t) / am2;

    // Store the new values in the balls
    ball1.vel = u1;
    ball2.vel = u2;
    ball1.ang = pAng1;
    ball2.ang = pAng2;
  }

  /**
   *Returns true if the point is inside the ball
   * @param {Vec2} p The point
   * @return {boolean} The boolean value
   */
  containsPoint(p) {
    return Vec2.dist(this.pos, p) <= this.r;
  }

  /**
   * Calculates the effective velocity of the ball in a
   * given point from it's velocity and angular velocity
   * @param {Vec2} point The point to be taken a look at
   * @return {Vec2} The velocity of the Ball in the given point
   */
  velInPlace(point) {
    let vp = Vec2.sub(point, this.pos);
    vp.rotate(Math.PI / 2);
    vp.mult(this.ang);
    vp.add(this.vel);
    return vp;
  }

  /**
   * Calculates the effective mass of the ball in
   * a given point when pulled/pushed in a given direction
   * by a hypothetical force
   * @param {Vec2} point The given point
   * @param {Vec2} direction The direction of the force
   * @return {Number}
   */
  effectiveMass(point, direction) {
    let r = Vec2.sub(point, this.pos);// Vector to the collision point
    if (r.length === 0) return this.m;
    let angle = Vec2.angle(direction, r);
    let rotationalMass = (Math.sin(angle) ** 2) * (r.length ** 2) / this.am;
    if (isNaN(angle)) console.log(direction, r, angle);
    return 1 / (rotationalMass + (1 / this.m));
  }

  /**
   * Realistically applies a change of velocity (momentum)
   * on the ball
   * @param {Vec2} dvel The change in velocity
   * @param {Vec2} point The point of pushing
   */
  applyDeltaVelInPoint(dvel, point) {
    let r = Vec2.sub(point, this.pos);
    if (r.length === 0) {
      this.vel.add(dvel);
      return;
    }
    let angle = Vec2.angle(r, dvel);
    // Change vel in line with the center of mass
    let deltaVlined = Vec2.mult(r, Vec2.dot(dvel, r) / (r.length ** 2));
    this.vel.add(deltaVlined);

    // Change it perpendicular to the line
    let d = r.copy;
    d.rotate(Math.PI / 2);
    d.setMag(1);
    let rotateDirection = Math.sign(Vec2.dot(dvel, d));
    let dvelAng = dvel.length * Math.cos(angle);
    let mEff = 1 / ((1 / this.m) + ((r.length ** 2) / this.am));
    let dvm = dvelAng * mEff / this.m;
    this.vel.add(Vec2.mult(d, dvm * rotateDirection));

    let dAng = rotateDirection * dvelAng * mEff * r.length / this.am;
    this.ang -= dAng;
  }

  /**
   * @return {Object} The ball represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    let ret = {};

    ret.pos = this.pos.toJSObject();
    ret.lastPos = this.lastPos.toJSObject();
    ret.r = this.r;
    ret.fc = this.fc;
    ret.amc = this.amc;
    ret.rotation = this.rotation;
    ret.ang = this.ang;
    ret.fc = this.fc;
    ret.k = this.k;
    ret.vel = this.vel.toJSObject();
    ret.id = this.id;
    if (this.layer != undefined) {
      ret.layer = this.layer;
    }

    return ret;
  }

  /**
   * Creates a Ball class from the given object
   * @param {Object} obj The object to create the class from
   * @return {Ball} The Ball object
   */
  static fromObject(obj) {
    let ret = new Ball(
      Vec2.fromObject(obj.pos),
      Vec2.fromObject(obj.vel),
      obj.r,
      obj.k,
      obj.ang,
      obj.fc
    );

    ret.lastPos = Vec2.fromObject(obj.lastPos);
    ret.amc = obj.amc;
    ret.rotation = obj.rotation;
    ret.vel = Vec2.fromObject(obj.vel);
    ret.id = obj.id;
    if (obj.layer != undefined) {
      ret.layer = obj.layer;
    }

    return ret;
  }
}

module.exports = Ball;
