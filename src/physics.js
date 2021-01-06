import Ball from './entity/ball';
import LineSegment from './math/linesegment';
import Body from './entity/body';
import Line from './math/line';
import Wall from './entity/wall';
import Stick from './constraint/stick';
import Polygon from './math/polygon';
import Vec2 from './math/vec2';
import Spring from './constraint/spring';
import SoftBall from './entity/softball';
import { collisionResponseWithWall } from './util/collision';

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
 * @typedef {{type: "ball" | "body" | "nothing", index: number}} ObjectIndentifier
 */
/**
 * Any object that has mass and can be moved freely in the world,
 * aka a {@link Body} or a {@link Ball}.
 *
 * @typedef {Ball | Body} PhysicalObject
 */

/**
 * A union type representing either a Stick or a Spring object.
 *
 * @typedef {(Spring|Stick)} StickOrSpring
 */
/**
 * @typedef {StickOrSpring[]} StickOrSpringArray
 * @property {Function} toJSON Function for object serialisation
 */
/**
 * A union type representing either a StickAsObject or a SpringAsObject type.
 *
 * @typedef {import('./constraint/spring').SpringAsObject|import('./constraint/stick').StickAsObject}StickOrSpringAsObject
 */
/**
 * @typedef {{n: Vec2, cp: Vec2}} CollisionData
 */

/**
 * An object representation of the Phyisics class
 * to easily convert it to JSON.
 *
 * @typedef PhysicsAsObject
 * @property {import('./entity/ball').BallAsObject[]} balls The balls in the world
 * @property {import('./entity/wall').WallAsObject[]} bounds The world border walls
 * @property {import('./entity/wall').WallAsObject[]} walls The walls in the world
 * @property {import('./entity/body').BodyAsObject[]} bodies The bodies in the world
 * @property {StickOrSpringAsObject[]} springs The
 * springs and sticks in the world
 * @property {import('./entity/softball').SoftBallAsObject[]} softBalls The softballs in the world
 * @property {FixedBall[]} fixedBalls The fixedballs in the world
 * @property {number} airFriction The air friction in the world
 * @property {import('./math/vec2').Vec2AsObject} gravity The gravity
 * vector as an object in the world
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

    /** @type {StickOrSpringArray} */
    this.springs = [];

    // Air friction has to be between 0 and 1
    // 0 - no movement
    // 1 - no friction
    this.airFriction = 1;

    this.gravity = new Vec2(0, 0);

    /** @type {boolean} */
    this.addBodyNotBall = false;
    /** @type {CollisionData[]} */
    this.collisionData = [];
  }

  /**
   * Updates the world by a given amount of time
   *
   * @param {number} t Elapsed time
   */
  update(t) {
    this.collisionData = [];

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
          const cd = Ball.collide(this.balls[i], this.balls[j]);
          if (cd) this.collisionData.push(cd);
        }
      }

      // Collision with walls
      this.walls.forEach((wall) => {
        const cd = wall.collideWithBall(this.balls[i]);
        if (cd) this.collisionData.push(cd);
      });

      // Collision with fixed balls
      this.fixedBalls.forEach((b) => {
        const ball = this.balls[i];

        const p = Vec2.sub(ball.pos, b);
        if (p.sqlength <= (ball.r + b.r) ** 2) {
          const n = p;
          n.setMag(1);
          ball.pos = Vec2.add(b, Vec2.mult(n, ball.r + b.r));
          n.mult(-1);
          collisionResponseWithWall(ball, b, n);
          this.collisionData.push({ cp: Vec2.fromObject(b), n });
        }
      });

      // Bounce off the edges
      this.bounds.forEach((bound) => {
        const cd = bound.collideWithBall(this.balls[i]);
        if (cd) this.collisionData.push(cd);
      });
    }

    for (let i = 0; i < this.bodies.length; i += 1) {
      this.balls.forEach((ball) => {
        const cd = this.bodies[i].collideWithBall(ball);
        if (cd) this.collisionData.push(cd);
      });

      for (let j = i + 1; j < this.bodies.length; j += 1) {
        const cd = Body.collide(this.bodies[i], this.bodies[j]);
        if (cd) this.collisionData.push(cd);
      }

      // Body vs fixedBall collisions
      this.bodies.forEach((body) => {
        this.fixedBalls.forEach((fixedBall) => {
          const cd = body.collideWithFixedBall(fixedBall);
          if (cd) this.collisionData.push(cd);
        });
      });

      // Body vs wall collisions
      this.bodies.forEach((body) => {
        this.walls.forEach((wall) => {
          const cd = body.collideWithWall(wall);
          if (cd) this.collisionData.push(cd);
        });
      });

      // Body vs world boundary collision
      this.bodies.forEach((body) => {
        this.bounds.forEach((bound) => {
          const cd = body.collideWithWall(bound);
          if (cd) this.collisionData.push(cd);
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
  }

  /**
   * Returns a copy of this system
   *
   * @returns {Physics} The copy of this system
   */
  get copy() {
    const ret = this.toJSON();
    return Physics.fromObject(ret);
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
      /**
       * Creates a ball shape from a polygon
       *
       * @param {Vec2} pos Position
       * @param {number} r Radius
       * @param {number} resolution Resolution
       * @returns {Vec2[]} Points
       */
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
   * @param {boolean} ceiling Whether the world has a ceiling or nor
   */
  setBounds(x, y, w, h, ceiling = true) {
    this.bounds = [];

    /**
     * Creates a rectangle wall.
     *
     * @param {number} x_ The x coordinate
     * @param {number} y_ The y coordinate
     * @param {number} w_ The width
     * @param {number} h_ The height
     * @returns {Wall} The wall
     */
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
    if (ceiling) this.bounds.push(getRectBody(x, y - h, 4 * w, h * 2));
    this.bounds.push(getRectBody(x + w / 2, y + 2 * h, 5 * w, 2 * h));
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
    if (this.balls.some((ball) => {
      if (ball.containsPoint(v)) { ret = ball; return true; }
      return false;
    })) return ret;
    if (this.bodies.some((body) => {
      if (body.containsPoint(v)) { ret = body; return true; }
      return false;
    })) return ret;
    if (this.walls.some((wall) => {
      if (wall.containsPoint(v)) { ret = wall; return true; }
      return false;
    })) return ret;
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
    if (obj instanceof SoftBall) idx = this.softBalls.indexOf(obj);
    if (idx !== -1) {
      const sf = this.softBalls[idx];
      this.softBalls.splice(idx, 1);
      sf.points.forEach((p) => {
        this.removeObjFromSystem(p);
      });
    }
  }

  /**
   * Finds the object in on of the arrays and returns it's identidier object.
   *
   * @param {Ball | Body} obj The object to find.
   * @returns {ObjectIndentifier} The indentifier object.
   */
  getObjectIdentifier(obj) {
    if (obj instanceof Ball) {
      return {
        type: 'ball',
        index: this.balls.indexOf(obj),
      };
    }
    if (obj instanceof Body) {
      return {
        type: 'body',
        index: this.bodies.indexOf(obj),
      };
    }
    return {
      type: 'nothing',
      index: -1,
    };
  }

  /**
   * @returns {PhysicsAsObject} The world represented in a JS object
   * Ready to be converted into JSON.
   */
  toJSON() {
    /** @type {PhysicsAsObject} */
    const retObj = {};

    retObj.airFriction = this.airFriction;
    retObj.gravity = this.gravity.toJSON();
    retObj.balls = this.balls.map((b) => b.toJSON());
    retObj.bodies = this.bodies.map((b) => b.toJSON());
    retObj.bounds = this.bounds.map((b) => b.toJSON());
    retObj.fixedBalls = this.fixedBalls.map((fb) => ({ ...fb }));
    retObj.walls = this.walls.map((w) => w.toJSON());

    retObj.springs = this.springs.map((spring) => {
      /** @type {import('./constraint/spring').SpringAsObject} */
      const ret = {};
      ret.length = spring.length;
      ret.pinned = spring.pinned;
      ret.rotationLocked = spring.rotationLocked;
      ret.springConstant = spring.springConstant;
      if (spring instanceof Spring) ret.type = 'spring';
      // @ts-ignore
      else if (spring instanceof Stick) ret.type = 'stick';
      ret.objects = spring.objects.map((o) => this.getObjectIdentifier(o));
      return ret;
    });

    retObj.softBalls = this.softBalls.map((sb) => {
      /** @type {import('./entity/softball').SoftBallAsObject} */
      const ret = {};
      ret.fc = sb.fc;
      ret.points = sb.points.map((o) => this.getObjectIdentifier(o));
      ret.pressure = sb.pressure;
      ret.r = sb.r;
      ret.resolution = sb.resolution;
      ret.sides = sb.sides.map((side) => this.springs.indexOf(side));
      return ret;
    });

    return retObj;
  }

  /**
   * Creates a Spring or Stick from an object.
   *
   * @param {StickOrSpringAsObject} obj The object.
   * @returns {StickOrSpring} The resulting Stick or Spring.
   */
  stickOrSpringFromObject(obj) {
    /** @type {StickOrSpring} */
    let ret = {};
    if (obj.type === 'spring') {
      ret = new Spring(obj.length, obj.springConstant);
    } else if (obj.type === 'stick') {
      ret = new Stick(obj.length);
    }

    ret.pinned = obj.pinned;
    ret.rotationLocked = obj.rotationLocked;

    ret.objects = obj.objects.map((o) => {
      if (o.type === 'ball') return this.balls[o.index];
      return this.bodies[o.index];
    });

    return ret;
  }

  /**
   * Creates a SoftBall from an object.
   *
   * @param {import('./entity/softball').SoftBallAsObject} obj The object.
   * @returns {SoftBall} The resulting SoftBall.
   */
  softBallFromObject(obj) {
    /** @type {SoftBall} */
    const ret = Object.create(SoftBall.prototype);

    ret.fc = obj.fc;
    ret.pressure = obj.pressure;
    ret.resolution = obj.resolution;
    ret.r = obj.r;

    ret.points = obj.points.map((o) => this.balls[o.index]);

    ret.sides = obj.sides.map((s) => this.springs[s]);

    return ret;
  }

  /**
   * Creates a new Physics instance from an object.
   *
   * @param {PhysicsAsObject} obj The object data.
   * @returns {Physics} The created world.
   */
  static fromObject(obj) {
    const ret = new Physics();
    ret.balls = obj.balls.map((ballObj) => Ball.fromObject(ballObj));
    ret.bounds = obj.bounds.map((boundObj) => Wall.fromObject(boundObj));
    ret.walls = obj.walls.map((wallObj) => Wall.fromObject(wallObj));
    ret.bodies = obj.bodies.map((bodyObj) => Body.fromObject(bodyObj));
    ret.fixedBalls = obj.fixedBalls;
    ret.airFriction = obj.airFriction;
    ret.gravity = Vec2.fromObject(obj.gravity);
    ret.springs = obj.springs.map((springObj) => ret.stickOrSpringFromObject(springObj));
    ret.softBalls = obj.softBalls.map((sbObj) => ret.softBallFromObject(sbObj));
    return ret;
  }
}

export {
  Ball, Body, Vec2, LineSegment, Spring, Stick, SoftBall, Line, Polygon, Wall,
};
export default Physics;
