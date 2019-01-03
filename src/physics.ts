import Vec2 from './vec2';
import Ball from './ball';
import Wall from './wall';
import LineSegment from './linesegment';
import Stick from './stick';
import Spring from './spring';
import SoftBall from './softball';
import Body from './body';

/**
 * Class that creates a new world ba the physics engine
 */
class Physics {
  balls: Array<Ball>;
  bodies: Array<Body>;
  fixedBalls: Array<{x: number, y: number, r: number, }>
  softBalls: Array<SoftBall>;
  walls: Array<Wall>;
  bounds: Array<number>;
  springs: Array<Spring>;
  airFriction: number;
  gravity: Vec2;

  /**
   * Create and initalize a new world
   */
  constructor() {
    this.balls = [];
    this.bodies = [];
    this.fixedBalls = [];
    this.softBalls = [];

    this.walls = [];

    this.bounds = [];

    this.springs = [];

    // Air friction has to be between 0 and 1
    // 0 - no movement
    // 1 - no friction
    this.airFriction = 1;

    this.gravity = new Vec2(0, 0);
  }

  /**
   * Updates the world by a given amount of time
   * @param {number} t Elapsed time
   * @param {boolean} precise If this is true,
   * then the simulation is going to be more precise
   */
  update(t: number, precise: boolean) {
    // Do the simulation on the reversed system
    // if the simulation is in precise mode
    let clonedSystem: Physics = precise ? this.copy : new Physics();
    if (precise) {
      clonedSystem.bodies.reverse();
      clonedSystem.balls.reverse();
      clonedSystem.update(t, false);
    }

    // At first move objets
    for (let i = 0; i < this.balls.length; i++) {
      // Move
      this.balls[i].lastPos = this.balls[i].pos.copy;
      this.balls[i].pos.add(Vec2.mult(this.balls[i].vel, t));

      // Angular velocity
      this.balls[i].rotation += this.balls[i].ang * t;
      this.balls[i].rotation %= (Math.PI * 2);
    }
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].lastPos = this.bodies[i].pos.copy;
      this.bodies[i].move(this.bodies[i].vel.x * t, this.bodies[i].vel.y * t);
      this.bodies[i].rotate(this.bodies[i].ang * t);
    }

    // Update springs multiple times
    for (let i = 0; i < 3; i++) {
      for (let element of this.springs) {
        element.update(t / 3 / 2);
      }
    }

    for (let i = 0; i < this.balls.length; i++) {
      // Apply gravity
      if (this.gravity) {
        this.balls[i].vel.add(
          new Vec2(this.gravity.x * t, this.gravity.y * t));
      }

      // Collision
      for (let j = i + 1; j < this.balls.length; j++) {
        if (this.balls[i].layer != this.balls[j].layer ||
          (!this.balls[i].layer && !this.balls[j].layer)) {
          Ball.collide(this.balls[i], this.balls[j]);
        }
      }

      // Collision with walls
      for (let wall of this.walls) {
        wall.collideWithBall(this.balls[i]);
      }

      // Collision with fixed balls
      for (let b of this.fixedBalls) {
        let ball = this.balls[i];

        let heading;
        let rel = 0;
        let p = new Vec2(b.x, b.y);
        p.x -= ball.pos.x;
        p.y -= ball.pos.y;
        p.mult(-1);
        if (p.length <= ball.r + b.r) {
          heading = p.heading;
          rel = p.length;
        }

        if (heading === 0 || heading) {
          let pos = new Vec2(ball.pos.x, ball.pos.y);
          let vel = new Vec2(ball.vel.x, ball.vel.y);
          pos.rotate(-heading + Math.PI / 2);
          vel.rotate(-heading + Math.PI / 2);

          vel.y *= -ball.k;
          pos.y += ball.r + b.r - rel;
          let dvy = vel.y * (1 + (1 / ball.k));
          let dvx = Math.abs(dvy) * ball.fc *
            Math.sign(vel.x - ball.ang * ball.r) * -1;
          if (Math.abs(dvx) > Math.abs(vel.x - ball.ang * ball.r)) {
            dvx = -vel.x + ball.ang * ball.r;
          }
          vel.x += dvx - ball.r * ball.r * ball.m * dvx /
            (ball.am + ball.r * ball.r * ball.m);
          ball.ang -= ball.r * ball.r * ball.m * dvx /
            ((ball.am + ball.r * ball.r * ball.m) * ball.r);
          pos.rotate(heading - Math.PI / 2);
          vel.rotate(heading - Math.PI / 2);
          ball.pos.x = pos.x;
          ball.pos.y = pos.y;
          ball.vel.x = vel.x;
          ball.vel.y = vel.y;
        }
      }

      // Bounce off the edges
      if (this.bounds.length > 0) {
        if (this.balls[i].pos.x - this.balls[i].r < this.bounds[0]) {
          let ball = this.balls[i];
          ball.vel.x *= -ball.k;
          ball.pos.x = this.bounds[1] + ball.r;
          let dvx = ball.vel.x * (1 + (1 / ball.k));
          let dvy = Math.abs(dvx) * ball.fc *
            Math.sign(ball.vel.y + ball.ang * ball.r) * -1;
          if (Math.abs(dvy) > Math.abs(ball.vel.y + ball.ang * ball.r)) {
            dvy = -ball.vel.y - ball.ang * ball.r;
          }
          ball.vel.y += dvy - ball.r * ball.r * ball.m * dvy /
            (ball.am + ball.r * ball.r * ball.m);
          ball.ang += ball.r * ball.r * ball.m * dvy /
            ((ball.am + ball.r * ball.r * ball.m) * ball.r);
        } else if (this.balls[i].pos.x + this.balls[i].r >
          (this.bounds[0] + this.bounds[2])) {
          let ball = this.balls[i];
          ball.vel.x *= -ball.k;
          ball.pos.x = (this.bounds[0] + this.bounds[2]) - ball.r;
          let dvx = ball.vel.x * (1 + (1 / ball.k));
          let dvy = Math.abs(dvx) * ball.fc *
            Math.sign(ball.vel.y - ball.ang * ball.r) * -1;
          if (Math.abs(dvy) > Math.abs(ball.vel.y - ball.ang * ball.r)) {
            dvy = -ball.vel.y + ball.ang * ball.r;
          }
          ball.vel.y += dvy + ball.r * ball.r * ball.m * dvy /
            (ball.am + ball.r * ball.r * ball.m);
          ball.ang -= ball.r * ball.r * ball.m * dvy /
            ((ball.am + ball.r * ball.r * ball.m) * ball.r);
        }
        if (this.balls[i].pos.y + this.balls[i].r >
          (this.bounds[1] + this.bounds[3])) {
          let ball = this.balls[i];
          ball.vel.y *= -ball.k;
          ball.pos.y = (this.bounds[1] + this.bounds[3]) - ball.r;
          let dvy = ball.vel.y * (1 + (1 / ball.k));
          let dvx = Math.abs(dvy) * ball.fc *
            Math.sign(ball.vel.x + ball.ang * ball.r) * -1;
          if (Math.abs(dvx) > Math.abs(ball.vel.x + ball.ang * ball.r)) {
            dvx = -ball.vel.x - ball.ang * ball.r;
          }
          ball.vel.x += dvx - ball.r * ball.r * ball.m * dvx /
            (ball.am + ball.r * ball.r * ball.m);
          ball.ang += ball.r * ball.r * ball.m * dvx /
            ((ball.am + ball.r * ball.r * ball.m) * ball.r);
        } else if (this.balls[i].pos.y - this.balls[i].r < this.bounds[1]) {
          let ball = this.balls[i];
          ball.vel.y *= -ball.k;
          ball.pos.y = this.bounds[1] + ball.r;
          let dvy = ball.vel.y * (1 + (1 / ball.k));
          let dvx = Math.abs(dvy) * ball.fc *
            Math.sign(ball.vel.x - ball.ang * ball.r) * -1;
          if (Math.abs(dvx) > Math.abs(ball.vel.x - ball.ang * ball.r)) {
            dvx = -ball.vel.x + ball.ang * ball.r;
          }
          ball.vel.x += dvx + ball.r * ball.r * ball.m * dvx /
            (ball.am + ball.r * ball.r * ball.m);
          ball.ang -= ball.r * ball.r * ball.m * dvx /
            ((ball.am + ball.r * ball.r * ball.m) * ball.r);
        }
      }
    }

    for (let i = 0; i < this.bodies.length; i++) {
      for (let ball of this.balls) {
        if (ball.layer != this.bodies[i].layer ||
          (!ball.layer && !this.bodies[i].layer)) {
          this.bodies[i].collideWithBall(ball);
        }
      }

      for (let j = i + 1; j < this.bodies.length; j++) {
        if (this.bodies[i].layer != this.bodies[j].layer ||
          (!this.bodies[j].layer && !this.bodies[i].layer)) {
          Body.collide(this.bodies[i], this.bodies[j]);
        }
      }

      // Apply gravity
      if (this.gravity) {
        this.bodies[i].vel.add(
          new Vec2(this.gravity.x * t, this.gravity.y * t));
      }
    }

    // Update soft balls
    this.softBalls.forEach((sb) => {
      SoftBall.updatePressureBasedForces(sb, t);
    });

    // Update springs again multiple times
    for (let i = 0; i < 3; i++) {
      for (let element of this.springs) {
        element.update(t / 3 / 2);
      }
    }

    // Apply air friction
    this.balls.forEach((b) => {
      b.vel.mult(Math.pow(this.airFriction, t));
      b.ang *= (Math.pow(this.airFriction, t));
    });
    this.bodies.forEach((b) => {
      b.vel.mult(Math.pow(this.airFriction, t));
      b.ang *= (Math.pow(this.airFriction, t));
    });

    // Then take the average of this system and the other system
    // if in precise mode
    if (precise) {
      clonedSystem.bodies.reverse();
      clonedSystem.balls.reverse();

      // Take the average of the balls
      this.balls.forEach((ball, i) => {
        ball.move((clonedSystem.balls[i].pos.x - ball.pos.x) * 0.5,
          (clonedSystem.balls[i].pos.y - ball.pos.y) * 0.5);
        ball.vel.add(new Vec2((clonedSystem.balls[i].vel.x - ball.vel.x) * 0.5,
          (clonedSystem.balls[i].vel.y - ball.vel.y) * 0.5));
        ball.rotation = (ball.rotation + clonedSystem.balls[i].rotation) / 2;
        ball.ang = (ball.ang + clonedSystem.balls[i].ang) / 2;
      });

      // Take the average of the bodies
      this.bodies.forEach((body, i) => {
        let other = clonedSystem.bodies[i];
        body.move((other.pos.x - body.pos.x) * 0.5,
          (other.pos.y - body.pos.y) * 0.5);
        body.vel.add(new Vec2((other.vel.x - body.vel.x) * 0.5,
          (other.vel.y - body.vel.y) * 0.5));
        body.rotate((other.rotation - body.rotation) / 2);
        body.ang = (body.ang + other.ang) / 2;
      });
    }
  }

  /**
   * Returns a copy of this system
   * @return {Physics} The copy of this system
   */
  get copy(): Physics {
    let ret = new Physics();
    ret.balls = this.getCopyOfBalls();
    ret.bodies = this.getCopyOfBodies();
    ret.fixedBalls = this.fixedBalls;
    ret.walls = this.walls;
    ret.bounds = this.bounds;
    ret.gravity = this.gravity;

    this.springs.forEach((spring) => {
      let TypeOfSpring = spring.constructor == Spring ? Spring : Stick;
      let copiedSpring = new TypeOfSpring(spring.length,
        spring.springConstant);
      copiedSpring.rotationLocked = spring.rotationLocked;
      copiedSpring.pinned = spring.pinned;

      spring.objects.forEach((obj) => {
        let idx = this.balls.indexOf(obj);
        if (idx != -1) copiedSpring.attachObject(ret.balls[idx]);
        else {
          idx = this.bodies.indexOf(obj);
          if (idx != -1) copiedSpring.attachObject(ret.bodies[idx]);
        }
      });

      ret.springs.push(copiedSpring);
    });

    return ret;
  }

  /**
   * Air friction. has to be between 0 and 1
   * 0 - no movement
   * 1 - no friction
   * @param {number} airFriction Has to be between 0 and 1
   */
  setAirFriction(airFriction: number) {
    if (!isFinite(airFriction)) return;
    this.airFriction = airFriction;
    if (this.airFriction < 0) this.airFriction = 0;
    if (this.airFriction > 1) this.airFriction = 1;
  }

  /**
   * Sets the gravity in the world
   * @param {Vec2} dir The acceleration vector of the gravity
   */
  setGravity(dir: Vec2) {
    this.gravity = dir.copy;
  }

  /**
   * Appends a new ball to the world
   * @param {Ball} ball Ball to add to the world
   */
  addBall(ball: Ball) {
    this.balls.push(ball);
  }

  /**
   * Appends a new body to the world
   * @param {Body} body Body to add to the world
   */
  addBody(body: Body) {
    this.bodies.push(body);
  }

  /**
   * Appends a new soft ball to the world
   * @param {SoftBall} softBall SoftBall to be added to the world
   */
  addSoftBall(softBall: SoftBall) {
    this.balls.push(...softBall.points);
    this.springs.push(...softBall.sides);

    this.softBalls.push(softBall);
  }

  /**
   * Appends a rectangular wall to the world
   * @param {number} x x coordinate of the rectangular wall
   * @param {number} y y coordinate of the rectangular wall
   * @param {number} w width of the rectangular wall
   * @param {number} h height of the rectangular wall
   */
  addRectWall(x: number, y: number, w: number, h: number) {
    let points = [];
    points.push(new Vec2(
      x - w / 2,
      y - h / 2
    ));
    points.push(new Vec2(
      x + w / 2,
      y - h / 2
    ));
    points.push(new Vec2(
      x + w / 2,
      y + h / 2
    ));
    points.push(new Vec2(
      x - w / 2,
      y + h / 2
    ));
    this.walls.push(new Wall(points));
    // this.bodies.push(new Body(points, new Vec2(0, 0), 0.5, 0, 0.3));
  }

  /**
   * Appends a rectangular body to the world
   * @param {number} x x coordinate of the rectangular body
   * @param {number} y y coordinate of the rectangular body
   * @param {number} w width of the rectangular body
   * @param {number} h height of the rectangular body
   * @param {number} fc friction coefficient of the body
   * @param {number} k coefficient of restitution of the body
   */
  addRectBody(x: number, y: number, w: number, h: number, fc: number, k: number) {
    let points = [];
    points.push(new Vec2(
      x - w / 2,
      y - h / 2
    ));
    points.push(new Vec2(
      x + w / 2,
      y - h / 2
    ));
    points.push(new Vec2(
      x + w / 2,
      y + h / 2
    ));
    points.push(new Vec2(
      x - w / 2,
      y + h / 2
    ));
    this.bodies.push(new Body(points, new Vec2(0, 0), 0.5, 0, 0.3));
  }

  /**
   * Append a new wall to the world
   * @param {Wall} wall Wall to append to the world
   */
  addWall(wall: Wall) {
    this.walls.push(wall);
  }

  /**
   * Appends a fixed ball to the world
   * A fixed ball is immovable and other objects collide with it
   * @param {number} x x coordinate of the fixed ball
   * @param {number} y y coordinate of the fixed ball
   * @param {number} r radius of the fixed ball
   */
  addFixedBall(x: number, y: number, r: number) {
    this.fixedBalls.push({
      x: x, y: y, r: r,
    });
  }

  /**
   * Appends a new spring to the world
   * @param {Spring} spring Spring to add to the world
   */
  addSpring(spring: Spring) {
    this.springs.push(spring);
  }

  /**
   * Sets the size of the world (without this the world
   * does not have bounds)
   * @param {number} x x coordinate of the centre of the world
   * @param {number} y y coordinate of the centre of the world
   * @param {number} w Width of the world
   * @param {number} h Height of the world
   */
  setBounds(x: number, y: number, w: number, h: number) {
    this.bounds = [x, y, w, h];
  }

  /**
   * Search for any object at the given coordinate then returns it
   * Return false if nothing is found
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @return {Ball} The found object
   */
  getObjectAtCoordinates(x: number, y: number): Ball {
    let ret = undefined;
    let v = new Vec2(x, y);
    this.balls.forEach((ball) => {
      if (ball.pos.dist(v) < ball.r) ret = ball;
    });
    return ret;
  }

  /**
   * Returns an array of copies of all balls in the system
   * @return {Array<Ball>} The array of the copied balls
   */
  getCopyOfBalls(): Array<Ball> {
    let ret: Array<Ball> = [];
    this.balls.forEach((item) => {
      ret.push(item.copy);
    });
    return ret;
  }

  /**
   * Returns an array of copies of all bodies in the system
   * @return {Array<Body>} The array of the copied bodies
   */
  getCopyOfBodies(): Array<Body> {
    let ret: Array<Body> = [];
    this.bodies.forEach((item) => {
      ret.push(item.copy);
    });
    return ret;
  }
}

export {Ball};
export {Body};
export {Vec2};
export {Wall};
export {LineSegment};
export {Spring};
export {Stick};
export {SoftBall};
export {Physics};
