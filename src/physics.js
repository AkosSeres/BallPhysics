import Ball from './ball';
import LineSegment from './linesegment';
import Body from './body';
import Line from './line';
import Wall from './wall';
import Stick from './stick';
import Polygon from './polygon';
import Vec2 from './vec2';
import Spring from './spring';
import SoftBall from './softball';
import { stickOrSpringFromObject, stickOrSpringToJSObject } from './stickspringhelpers';

/**
 * @typedef {{x:number, y:number, r:number}} FixedBall
 */
/**
 * @typedef {{x: number, y: number, pinPoint: boolean}} PinPoint
 */
/**
 * @typedef {Ball | Body | Wall | FixedBall | SoftBall
 * | PinPoint | Spring | Stick} AnyPhysicsObject
 */

/**
 * An object representation of the Phyisics class
 * to easily convert it to JSON.
 *
 * @typedef PhysicsAsObject
 * @property {import('./ball').BallAsObject[]} balls The balls in the world
 * @property {import('./wall').WallAsObject[]} bounds The world border walls
 * @property {import('./wall').WallAsObject[]} walls The walls in the world
 * @property {import('./body').BodyAsObject[]} bodies The bodies in the world
 * @property {(import('./spring').SpringAsObject | import('./stick').StickAsObject)[]} springs The
 * springs and sticks in the world
 * @property {import('./softball').SoftBallAsObject[]} softBalls The softballs in the world
 * @property {FixedBall[]} fixedBalls The fixedballs in the world
 * @property {number} airFriction The air friction in the world
 * @property {import('./vec2').Vec2AsObject} gravity The gravity vector as an object in the world
 */

/**
 * Class that creates a new world with the physics engine.
 */
class Physics {
  /**
   * Create and initalize a new world.
   */
  constructor() {
    /** @type {Ball[]} */
    this.balls = [];
    /** @type {Body[]} */
    this.bodies = [];
    /** @type {FixedBall[]} */
    this.fixedBalls = [];
    /** @type {SoftBall[]} */
    this.softBalls = [];

    /** @type {Wall[]} */
    this.walls = [];
    /** @type {Wall[]} */
    this.bounds = [];

    /** @type {(Spring|Stick)[]} */
    this.springs = [];

    // Air friction has to be between 0 and 1
    // 0 - no movement
    // 1 - no friction
    this.airFriction = 1;

    this.gravity = new Vec2(0, 0);

    /** @type {boolean} */
    this.addBodyNotBall = false;
  }

  /**
   * Updates the world by a given amount of time
   *
   * @param {number} t Elapsed time
   * @param {boolean} precise If this is true,
   * then the simulation is going to be more precise
   */
  update(t, precise) {
    // Do the simulation on the reversed system
    // if the simulation is in precise mode
    const clonedSystem = precise ? this.copy : new Physics();
    if (precise) {
      clonedSystem.bodies.reverse();
      clonedSystem.balls.reverse();
      clonedSystem.update(t, false);
    }

    // At first move objets
    for (let i = 0; i < this.balls.length; i += 1) {
      // Move
      this.balls[i].lastPos = this.balls[i].pos.copy;
      this.balls[i].pos.add(Vec2.mult(this.balls[i].vel, t));

      // Angular velocity
      this.balls[i].rotation += this.balls[i].ang * t;
      this.balls[i].rotation %= Math.PI * 2;
    }
    for (let i = 0; i < this.bodies.length; i += 1) {
      this.bodies[i].lastPos = this.bodies[i].pos.copy;
      this.bodies[i].move(this.bodies[i].vel.x * t, this.bodies[i].vel.y * t);
      this.bodies[i].rotate(this.bodies[i].ang * t);
    }

    // Update springs multiple times
    for (let i = 0; i < 3; i += 1) {
      this.springs.forEach((element) => {
        element.update(t / 3 / 2);
      });
    }

    for (let i = 0; i < this.balls.length; i += 1) {
      // Apply gravity
      if (this.gravity) {
        this.balls[i].vel.add(new Vec2(this.gravity.x * t, this.gravity.y * t));
      }

      // Collision
      for (let j = i + 1; j < this.balls.length; j += 1) {
        if (
          this.balls[i].layer !== this.balls[j].layer
          || (!this.balls[i].layer && !this.balls[j].layer)
        ) {
          Ball.collide(this.balls[i], this.balls[j]);
        }
      }

      // Collision with walls
      this.walls.forEach((wall) => {
        wall.collideWithBall(this.balls[i]);
      });

      // Collision with fixed balls
      this.fixedBalls.forEach((b) => {
        const ball = this.balls[i];

        let heading;
        let rel = 0;
        const p = new Vec2(b.x, b.y);
        p.x -= ball.pos.x;
        p.y -= ball.pos.y;
        p.mult(-1);
        if (p.length <= ball.r + b.r) {
          heading = p.heading;
          rel = p.length;
        }

        if (Number.isFinite(heading) && typeof heading !== 'undefined') {
          const pos = ball.pos.copy;
          const vel = ball.vel.copy;
          pos.rotate(-heading + Math.PI / 2);
          vel.rotate(-heading + Math.PI / 2);

          // Only collide when moving towards the wall
          if (vel.y <= 0) {
            vel.y *= -ball.k;
            pos.y += ball.r + b.r - rel;
            const dvy = vel.y * (1 + ball.k);

            let deltaAng = (Math.sign(vel.x + ball.ang * ball.r) * (dvy * ball.fc))
              / (ball.amc * ball.r);
            const maxDeltaAng = (vel.x + ball.ang * ball.r) / ball.r;

            if (deltaAng / maxDeltaAng > 1) deltaAng = maxDeltaAng;
            ball.ang -= deltaAng;

            const dvx = (deltaAng * ball.am) / ball.r / ball.m;
            vel.x -= dvx;

            pos.rotate(heading - Math.PI / 2);
            vel.rotate(heading - Math.PI / 2);
            ball.pos.x = pos.x;
            ball.pos.y = pos.y;
            ball.vel.x = vel.x;
            ball.vel.y = vel.y;
          }
        }
      });

      // Bounce off the edges
      this.bounds.forEach((bound) => {
        bound.collideWithBall(this.balls[i]);
      });
    }

    for (let i = 0; i < this.bodies.length; i += 1) {
      this.balls.forEach((ball) => {
        this.bodies[i].collideWithBall(ball);
      });

      for (let j = i + 1; j < this.bodies.length; j += 1) {
        Body.collide(this.bodies[i], this.bodies[j]);
      }

      // Body vs fixedBall collisions
      this.bodies.forEach((body) => {
        this.fixedBalls.forEach((fixedBall) => {
          body.collideWithFixedBall(fixedBall);
        });
      });

      // Body vs wall collisions
      this.bodies.forEach((body) => {
        this.walls.forEach((wall) => {
          body.collideWithWall(wall);
        });
      });

      // Body vs world boundary collision
      this.bodies.forEach((body) => {
        this.bounds.forEach((bound) => {
          body.collideWithWall(bound);
        });
      });

      // Apply gravity
      if (this.gravity) {
        this.bodies[i].vel.add(
          new Vec2(this.gravity.x * t, this.gravity.y * t),
        );
      }
    }

    // Update soft balls
    this.softBalls.forEach((sb) => {
      SoftBall.updatePressureBasedForces(sb, t);
    });

    // Update springs again multiple times
    for (let i = 0; i < 3; i += 1) {
      this.springs.forEach((spring) => {
        spring.update(t / 3 / 2);
      });
    }

    // Apply air friction
    this.balls.forEach((b) => {
      const ball = b;
      ball.vel.mult((this.airFriction ** t));
      ball.ang *= (this.airFriction ** t);
    });
    this.bodies.forEach((b) => {
      const ball = b;
      ball.vel.mult((this.airFriction ** t));
      ball.ang *= (this.airFriction ** t);
    });

    // Then take the average of this system and the other system
    // if in precise mode
    if (precise) {
      clonedSystem.bodies.reverse();
      clonedSystem.balls.reverse();

      // Take the average of the balls
      this.balls.forEach((ball, i) => {
        ball.move(
          (clonedSystem.balls[i].pos.x - ball.pos.x) * 0.5,
          (clonedSystem.balls[i].pos.y - ball.pos.y) * 0.5,
        );
        ball.vel.add(
          new Vec2(
            (clonedSystem.balls[i].vel.x - ball.vel.x) * 0.5,
            (clonedSystem.balls[i].vel.y - ball.vel.y) * 0.5,
          ),
        );
        const b = ball;
        b.rotation = (ball.rotation + clonedSystem.balls[i].rotation) / 2;
        b.ang = (ball.ang + clonedSystem.balls[i].ang) / 2;
      });

      // Take the average of the bodies
      this.bodies.forEach((body, i) => {
        const other = clonedSystem.bodies[i];
        body.move(
          (other.pos.x - body.pos.x) * 0.5,
          (other.pos.y - body.pos.y) * 0.5,
        );
        body.vel.add(
          new Vec2(
            (other.vel.x - body.vel.x) * 0.5,
            (other.vel.y - body.vel.y) * 0.5,
          ),
        );
        body.rotate((other.rotation - body.rotation) / 2);
        const b = body;
        b.ang = (body.ang + other.ang) / 2;
      });
    }
  }

  /**
   * Returns a copy of this system
   *
   * @returns {Physics} The copy of this system
   */
  get copy() {
    const ret = new Physics();
    ret.balls = this.getCopyOfBalls();
    ret.bodies = this.getCopyOfBodies();
    ret.fixedBalls = this.fixedBalls;
    ret.walls = this.walls;
    ret.bounds = this.bounds;
    ret.gravity = this.gravity;

    this.springs.forEach((spring) => {
      /** @type {typeof Spring | typeof Stick} */
      const TypeOfSpring = spring instanceof Spring ? Spring : Stick;
      /** @type {Spring | Stick} */
      const copiedSpring = new TypeOfSpring(spring.length, spring.springConstant);
      copiedSpring.rotationLocked = spring.rotationLocked;
      copiedSpring.pinned = spring.pinned;

      spring.objects.forEach((obj) => {
        let idx = -1;
        if (obj instanceof Ball)idx = this.balls.indexOf(obj);
        if (idx !== -1) copiedSpring.attachObject(ret.balls[idx]);
        else {
          idx = -1;
          if (obj instanceof Body)idx = this.bodies.indexOf(obj);
          if (idx !== -1) copiedSpring.attachObject(ret.bodies[idx]);
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
   *
   * @param {number} airFriction Has to be between 0 and 1
   */
  setAirFriction(airFriction) {
    if (!Number.isFinite(airFriction)) return;
    this.airFriction = airFriction;
    if (this.airFriction < 0) this.airFriction = 0;
    if (this.airFriction > 1) this.airFriction = 1;
  }

  /**
   * Sets the gravity in the world
   *
   * @param {Vec2} dir The acceleration vector of the gravity
   */
  setGravity(dir) {
    this.gravity = dir.copy;
  }

  /**
   * Appends a new ball to the world
   *
   * @param {Ball} ball Ball to add to the world
   */
  addBall(ball) {
    if (this.addBodyNotBall) {
      /** @type {(pos:Vec2,r:number,resolution:number)=>Vec2[]} */
      const getPointsForBall = (pos, r, resolution) => {
        const points = [];

        for (let i = 0; i < resolution; i += 1) {
          const newPoint = Vec2.fromAngle((i / resolution) * 2 * Math.PI);
          newPoint.mult(r);
          newPoint.add(pos);
          points.push(newPoint);
        }

        return points;
      };

      this.bodies.push(
        new Body(
          getPointsForBall(ball.pos, ball.r, 24),
          ball.vel,
          ball.k,
          ball.ang,
          ball.fc,
        ),
      );
    } else {
      this.balls.push(ball);
    }
  }

  /**
   * Appends a new body to the world
   *
   * @param {Body} body Body to add to the world
   */
  addBody(body) {
    this.bodies.push(body);
  }

  /**
   * Appends a new soft ball to the world
   *
   * @param {SoftBall} softBall SoftBall to be added to the world
   */
  addSoftBall(softBall) {
    this.balls.push(...softBall.points);
    this.springs.push(...softBall.sides);

    this.softBalls.push(softBall);
  }

  /**
   * Appends a new soft square to the world
   *
   * @param {Vec2} pos The position of the soft square
   * @param {number} sideSize The size of the square
   * @param {number} fc Friction coefficient
   * @param {Vec2} vel The initial velocity of the soft square
   * @param {number} resolution The resolution of the soft square
   * @param {number} pressure The 'pressure' of the soft square
   */
  addSoftSquare(pos, sideSize, fc, vel, resolution = 24, pressure = 1) {
    const softSquare = new SoftBall(
      pos,
      Math.sqrt((sideSize * sideSize) / Math.PI),
      pressure,
      fc,
      resolution,
    );
    softSquare.sides.forEach((side) => {
      const s = side;
      s.length = (0.96 * 4 * sideSize) / softSquare.resolution;
    });
    softSquare.points.forEach((ball) => {
      const b = ball;
      b.vel = vel.copy;
    });

    this.balls.push(...softSquare.points);
    this.springs.push(...softSquare.sides);

    const springStrength = sideSize * sideSize * 200 * pressure;

    let bigStick = new Spring(
      Math.sqrt(softSquare.r * softSquare.r * Math.PI),
      springStrength / 2,
    );
    bigStick.attachObject(softSquare.points[0]);
    bigStick.attachObject(softSquare.points[softSquare.resolution / 2]);
    this.springs.push(bigStick);

    bigStick = new Spring(
      Math.sqrt(softSquare.r * softSquare.r * Math.PI),
      springStrength / 2,
    );
    bigStick.attachObject(softSquare.points[softSquare.resolution / 4]);
    bigStick.attachObject(softSquare.points[(3 * softSquare.resolution) / 4]);
    this.springs.push(bigStick);

    bigStick = new Spring(
      Math.sqrt(2 * softSquare.r * softSquare.r * Math.PI),
      springStrength,
    );
    bigStick.attachObject(softSquare.points[softSquare.resolution / 8]);
    bigStick.attachObject(softSquare.points[(5 * softSquare.resolution) / 8]);
    this.springs.push(bigStick);

    bigStick = new Spring(
      Math.sqrt(2 * softSquare.r * softSquare.r * Math.PI),
      springStrength,
    );
    bigStick.attachObject(softSquare.points[(3 * softSquare.resolution) / 8]);
    bigStick.attachObject(softSquare.points[(7 * softSquare.resolution) / 8]);
    this.springs.push(bigStick);
  }

  /**
   * Appends a rectangular wall to the world
   *
   * @param {number} x x coordinate of the rectangular wall
   * @param {number} y y coordinate of the rectangular wall
   * @param {number} w width of the rectangular wall
   * @param {number} h height of the rectangular wall
   */
  addRectWall(x, y, w, h) {
    const points = [];
    points.push(new Vec2(x - w / 2, y - h / 2));
    points.push(new Vec2(x + w / 2, y - h / 2));
    points.push(new Vec2(x + w / 2, y + h / 2));
    points.push(new Vec2(x - w / 2, y + h / 2));
    this.walls.push(new Wall(points));
  }

  /**
   * Appends a rectangular body to the world
   *
   * @param {number} x x coordinate of the rectangular body
   * @param {number} y y coordinate of the rectangular body
   * @param {number} w width of the rectangular body
   * @param {number} h height of the rectangular body
   * @param {number} fc friction coefficient of the body
   * @param {number} k coefficient of restitution of the body
   */
  addRectBody(x, y, w, h, fc, k) {
    const points = [];
    points.push(new Vec2(x - w / 2, y - h / 2));
    points.push(new Vec2(x + w / 2, y - h / 2));
    points.push(new Vec2(x + w / 2, y + h / 2));
    points.push(new Vec2(x - w / 2, y + h / 2));
    this.bodies.push(new Body(points, new Vec2(0, 0), k, 0, fc));
  }

  /**
   * Append a new wall to the world
   *
   * @param {Wall} wall Wall to append to the world
   */
  addWall(wall) {
    this.walls.push(wall);
  }

  /**
   * Appends a fixed ball to the world
   * A fixed ball is immovable and other objects collide with it
   *
   * @param {number} x x coordinate of the fixed ball
   * @param {number} y y coordinate of the fixed ball
   * @param {number} r radius of the fixed ball
   */
  addFixedBall(x, y, r) {
    this.fixedBalls.push({
      x,
      y,
      r,
    });
  }

  /**
   * Appends a new spring to the world
   *
   * @param {Spring} spring Spring to add to the world
   */
  addSpring(spring) {
    this.springs.push(spring);
  }

  /**
   * Sets the size of the world (without this the world
   * does not have bounds)
   *
   * @param {number} x x coordinate of the centre of the world
   * @param {number} y y coordinate of the centre of the world
   * @param {number} w Width of the world
   * @param {number} h Height of the world
   */
  setBounds(x, y, w, h) {
    this.bounds = [];

    /** @type {(x_:number, y_:number, w_:number, h_:number)=>Wall} */
    const getRectBody = (x_, y_, w_, h_) => {
      const points = [];
      points.push(new Vec2(x_ - w_ / 2, y_ - h_ / 2));
      points.push(new Vec2(x_ + w_ / 2, y_ - h_ / 2));
      points.push(new Vec2(x_ + w_ / 2, y_ + h_ / 2));
      points.push(new Vec2(x_ - w_ / 2, y_ + h_ / 2));
      return new Wall(points);
    };

    this.bounds.push(getRectBody(x - w, y, 2 * w, 4 * h));
    this.bounds.push(getRectBody(x + 2 * w, y, 2 * w, 4 * h));
    this.bounds.push(getRectBody(x, y - h, 4 * w, h * 2));
    this.bounds.push(getRectBody(x, y + 2 * h, 4 * w, 2 * h));
  }

  /**
   * Search for any object at the given coordinate then returns it
   * Return false if nothing is found
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @returns {AnyPhysicsObject} The found object
   */
  getObjectAtCoordinates(x, y) {
    /** @type {AnyPhysicsObject} */
    let ret = {
      x, y, pinPoint: true,
    };
    const v = new Vec2(x, y);
    this.balls.forEach((ball) => {
      if (ball.containsPoint(v)) ret = ball;
    });
    this.bodies.forEach((body) => {
      if (body.containsPoint(v)) ret = body;
    });
    this.walls.forEach((wall) => {
      if (wall.containsPoint(v)) ret = wall;
    });
    this.fixedBalls.forEach((e) => {
      if (Vec2.dist(new Vec2(e.x, e.y), new Vec2(x, y)) <= e.r) ret = e;
    });
    this.softBalls.forEach((softBall) => {
      if (softBall.containsPoint(v)) ret = softBall;
    });
    return ret;
  }

  /**
   * Returns an array of copies of all balls in the system
   *
   * @returns {Ball[]} The array of the copied balls
   */
  getCopyOfBalls() {
    return this.balls.map((b) => b.copy);
  }

  /**
   * Returns an array of copies of all bodies in the system
   *
   * @returns {Body[]} The array of the copied bodies
   */
  getCopyOfBodies() {
    return this.bodies.map((b) => b.copy);
  }

  /**
   * Removes the given object from the system
   *
   * @param {AnyPhysicsObject} obj The object to remove
   */
  removeObjFromSystem(obj) {
    let idx = -1;
    if (obj instanceof Ball) idx = this.balls.indexOf(obj);
    if (idx !== -1) {
      let toReturn = false;
      this.softBalls.forEach((s) => {
        if (s.points.includes(this.balls[idx])) {
          this.removeObjFromSystem(s);
          toReturn = true;
        }
      });
      if (toReturn) return;
      this.springs.forEach((s) => {
        if (s.objects.includes(this.balls[idx])) this.removeObjFromSystem(s);
      });
      this.balls.splice(idx, 1);
      return;
    }
    if (obj instanceof Body) idx = this.bodies.indexOf(obj);
    if (idx !== -1) {
      this.bodies.splice(idx, 1);
      return;
    }
    if (obj instanceof Wall) idx = this.walls.indexOf(obj);
    if (idx !== -1) {
      this.walls.splice(idx, 1);
      return;
    }
    if (obj instanceof Object && 'r' in obj && 'x' in obj) { idx = this.fixedBalls.indexOf(obj); }
    if (idx !== -1) {
      this.fixedBalls.splice(idx, 1);
      return;
    }
    if (obj instanceof Stick || obj instanceof Spring) idx = this.springs.indexOf(obj);
    if (idx !== -1) {
      this.springs.splice(idx, 1);
      const invesigated = this.springs[idx];
      this.softBalls.forEach((s) => {
        if (invesigated instanceof Stick && s.sides.includes(invesigated)) {
          this.removeObjFromSystem(s);
        }
      });
      return;
    }
    if (obj instanceof SoftBall)idx = this.softBalls.indexOf(obj);
    if (idx !== -1) {
      const sf = this.softBalls[idx];
      this.softBalls.splice(idx, 1);
      sf.points.forEach((p) => {
        this.removeObjFromSystem(p);
      });
    }
  }

  /**
   * Finds the ball or body with the given id
   *
   * @param {string} id The id of the object to find
   * @returns {{type:("ball"|"body"|"spring"|""), num:number}} The data of the object
   */
  getItemDataFromId(id) {
    /** @type {(b:(Ball|Body|Spring|Stick))=>boolean} */
    const filter = (b) => b.id === id;

    const balls = this.balls.filter(filter);
    if (balls.length >= 1) {
      return { type: 'ball', num: this.balls.indexOf(balls[0]) };
    }

    const bodies = this.bodies.filter(filter);
    if (bodies.length >= 1) {
      return { type: 'body', num: this.bodies.indexOf(bodies[0]) };
    }

    const springs = this.springs.filter(filter);
    if (springs.length >= 1) {
      return { type: 'spring', num: this.springs.indexOf(springs[0]) };
    }

    return { type: '', num: -1 };
  }

  /**
   * @returns {PhysicsAsObject} The physics world represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    const ret = {};

    ret.balls = this.balls.map((b) => b.toJSObject());
    ret.bounds = this.bounds.map((w) => w.toJSObject());
    ret.walls = this.walls.map((w) => w.toJSObject());
    ret.bodies = this.bodies.map((b) => b.toJSObject());
    ret.springs = this.springs.map((s) => stickOrSpringToJSObject(s));
    ret.softBalls = this.softBalls.map((s) => s.toJSObject());

    ret.fixedBalls = this.fixedBalls;
    ret.airFriction = this.airFriction;
    ret.gravity = this.gravity.toJSObject();

    return ret;
  }

  /**
   * Creates a Physics class from the given object
   *
   * @param {PhysicsAsObject} obj The object to create the class from
   * @returns {Physics} The Physics object
   */
  static fromObject(obj) {
    const newWorld = new Physics();

    newWorld.balls = obj.balls.map((b) => Ball.fromObject(b));
    newWorld.bounds = obj.bounds.map((b) => Wall.fromObject(b));
    newWorld.walls = obj.walls.map((w) => Wall.fromObject(w));
    newWorld.bodies = obj.bodies.map((b) => Body.fromObject(b));
    newWorld.springs = obj.springs.map((s) => stickOrSpringFromObject(s, newWorld.balls));
    newWorld.softBalls = obj.softBalls.map((s) => SoftBall.fromObject(s,
      newWorld.balls, newWorld.springs));

    newWorld.fixedBalls = obj.fixedBalls;
    newWorld.airFriction = obj.airFriction;
    newWorld.gravity = Vec2.fromObject(obj.gravity);

    return newWorld;
  }

  /**
   * @returns {string} The physics object in JSON format in a string
   */
  toJSON() {
    return JSON.stringify(this.toJSObject());
  }

  /**
   * Recreates the phyisics object from JSON
   *
   * @param {string} jsonString The JSON containing the physics object
   * @returns {Physics} The created Physics object
   */
  static fromJSON(jsonString) {
    return Physics.fromObject(JSON.parse(jsonString));
  }
}

export {
  Ball, Body, Vec2, LineSegment, Spring, Stick, SoftBall, Line, Polygon, Wall,
};
export default Physics;
