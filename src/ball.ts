import Vec2 from './vec2';

/**
 * A class representing a ball
 * A ball is an object in the physics engine that
 * has a shape of a circle and it is affected by gravity
 */
export default class Ball {
  pos: Vec2;
  lastPos: Vec2;
  r: number;
  fc: number;
  amc: number;
  rotation: number;
  ang: number;
  k: number;
  vel: Vec2;
  layer: any;

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
  constructor(pos: Vec2, vel: Vec2, r: number,
    k: number, ang: number, fc: number) {
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
  }


  /**
   * Get the mass of the ball
   * @return {number} The mass
   */
  get m(): number {
    return this.r * this.r * Math.PI;
  }

  /**
   * Get the moment of inertia of the ball
   * @return {number} The moment of inertia
   */
  get am(): number {
    return this.amc * this.r * this.r * this.m;
  }

  /**
   * Get a copy of the ball that is not a reference to it
   * @return {Ball} The copy of the ball
   */
  get copy(): Ball {
    let ret =
      new Ball(this.pos.copy, this.vel.copy, this.r, this.k, this.ang, this.fc);
    ret.lastPos = this.lastPos.copy;
    ret.rotation = this.rotation;
    return ret;
  }

  /**
   * Moves the ball by the given coordinates
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  move(x: number, y: number) {
    this.pos.x += x;
    this.pos.y += y;
  }

  /**
   * Checks if two balls are colliding or not
   * @param {Ball} ball the other ball
   * @return {boolean} True if they colidre
   */
  collided(ball: Ball): boolean {
    if (this.pos.dist(ball.pos) < (this.r + ball.r)) return true;
    else return false;
  }

  /**
   * Static function for collision between two balls
   * @param {Ball} ball1 First ball
   * @param {Ball} ball2 Second ball
   */
  static collide(ball1: Ball, ball2: Ball) {
    if (!ball1.collided(ball2)) return;

    let pos1 = ball1.pos;
    let pos2 = ball2.pos;
    let r1 = ball1.r;
    let r2 = ball2.r;
    let k = (ball1.k + ball2.k) / 2;
    let m1 = ball1.m;
    let m2 = ball2.m;
    let dist = Vec2.dist(pos1, pos2);
    let fc = (ball1.fc + ball2.fc) / 2;

    let cp1 = pos1.copy;
    let cp2 = pos2.copy;
    let too = r1 + r2 - dist;
    let d = Vec2.sub(pos1, pos2);
    d.setMag(1);
    d.mult(too * m2 / (m1 + m2));
    cp1.add(d);
    d.setMag(1);
    d.mult(-too * m1 / (m1 + m2));
    cp2.add(d);
    ball1.pos = cp1;
    ball2.pos = cp2;

    if (Vec2.dot(d, Vec2.sub(ball1.vel, ball2.vel)) < 0) return;

    d.setMag(1);
    let vel1Parralel = Vec2.cross(d, ball1.vel);
    let vel2Parralel = Vec2.cross(d, ball2.vel);
    let vel1Perpendicular = Vec2.dot(d, ball1.vel);
    let vel2Perpendicular = Vec2.dot(d, ball2.vel);

    let vk1 = r1 * ball1.ang;
    let vk2 = r2 * ball2.ang;

    let vel1InPos = vel1Parralel - vk1;
    let vel2InPos = vel2Parralel + vk2;
    let vCommon = ((vel1InPos * ball1.am) +
      (vel2InPos * ball2.am)) / (ball1.am + ball2.am);
    let tovCommon1 = vCommon - vel1InPos;
    let tovCommon2 = vCommon - vel2InPos;
    let maxDeltaAng1 = tovCommon1 / r1;
    let maxDeltaAng2 = tovCommon2 / r2;

    // Calculate the new perpendicular velocities
    let u1Perpendicular = ((1 + k) *
      ((m1 * vel1Perpendicular + m2 * vel2Perpendicular) / (m1 + m2))) -
      (k * vel1Perpendicular);
    let u2Perpendicular = ((1 + k) *
      ((m1 * vel1Perpendicular + m2 * vel2Perpendicular) / (m1 + m2))) -
      (k * vel2Perpendicular);

    ball1.vel = Vec2.mult(d, u1Perpendicular);
    ball2.vel = Vec2.mult(d, u2Perpendicular);

    let deltav1Perpendicular = u1Perpendicular - vel1Perpendicular;
    let deltav2Perpendicular = u2Perpendicular - vel2Perpendicular;

    let deltaAng1 = -(Math.sign(tovCommon1)) *
      (deltav1Perpendicular * fc) / (ball1.amc * r1);
    let deltaAng2 = (Math.sign(tovCommon2)) *
      (deltav2Perpendicular * fc) / (ball2.amc * r2);

    if (deltaAng1 / maxDeltaAng1 > 1) deltaAng1 = maxDeltaAng1;
    if (deltaAng2 / maxDeltaAng2 > 1) deltaAng2 = maxDeltaAng2;

    ball1.ang -= deltaAng1;
    ball2.ang += deltaAng2;

    let u1Parralel = vel1Parralel;
    let u2Parralel = vel2Parralel;

    d.rotate(Math.PI / 2);
    ball1.vel.add(Vec2.mult(d, u1Parralel));
    ball2.vel.add(Vec2.mult(d, u2Parralel));
  }
}
