import LineSegment from './math/linesegment';
import Line from './math/line';
import Stick from './constraint/stick';
import Polygon from './math/polygon';
import Vec2 from './math/vec2';
import Spring from './constraint/spring';
import Body from './entity/body';
import { resolveCollisions } from './entity/collision';
import { defaultBodyColor } from './util/colorpalette';
import Shape from './math/shape';

/**
 * @typedef {{x:number, y:number, r:number}} FixedBall
 */
/**
 * @typedef {{x: number, y: number, pinPoint: boolean}} PinPoint
 */
/**
 * @typedef {Body} AnyPhysicsObject
 */
/**
 * @typedef {{type: "ball" | "body" | "nothing", index: number}} ObjectIdentifier
 */
/**
 * Any object that has mass and can be moved freely in the world,
 * aka a {@link Body} or a {@link Ball}.
 *
 * @typedef {Body} PhysicalObject
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
 * @property {Body[]} bodies The bodies in the world
 * @property {StickOrSpringAsObject[]} springs The
 * springs and sticks in the world
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
    /** @type {Body[]} */
    this.bodies = [];

    /** @type {StickOrSpringArray} */
    this.springs = [];

    // Air friction has to be between 0 and 1
    // 0 - no movement
    // 1 - no friction
    this.airFriction = 1;

    this.gravity = new Vec2(0, 0);
  }

  /**
   * Updates the world by a given amount of time.
   *
   * @param {number} t Elapsed time in seconds
   * @returns {CollisionData[]} Debug data
   */
  update(t) {
    /** @type {CollisionData[]} */
    let collisionData = [];

    for (let i = 0; i < this.bodies.length; i += 1) {
      this.bodies[i].move(new Vec2(this.bodies[i].vel.x * t, this.bodies[i].vel.y * t));
      this.bodies[i].rotate(this.bodies[i].ang * t);
    }

    // Update springs multiple times
    for (let i = 0; i < 3; i += 1) {
      this.springs.forEach((element) => {
        element.update(t / 3 / 2);
      });
    }

    for (let i = 0; i < this.bodies.length; i += 1) {
      // Apply gravity
      if (this.bodies[i].m !== 0) {
        this.bodies[i].vel.add(
          new Vec2(this.gravity.x * t, this.gravity.y * t),
        );
      }
    }

    // Resolve collisions
    collisionData = resolveCollisions(this.bodies);

    // Update springs again multiple times
    for (let i = 0; i < 3; i += 1) {
      this.springs.forEach((spring) => {
        spring.update(t / 3 / 2);
      });
    }

    // Apply air friction
    this.bodies.forEach((b) => {
      const body = b;
      if (b.m === 0) return;
      body.vel.mult((this.airFriction ** t));
      body.ang *= (this.airFriction ** t);
    });

    // if (this.bodies.length > 0)console.log(this.bodies[0].pos.y);

    return collisionData;
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
   * Appends a new body to the world
   *
   * @param {Body} body Body to add to the world
   */
  addBody(body) {
    this.bodies.push(body);
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
    /** @type {{sides: Stick[], points: Body[]}} */
    const softSquare = {
      sides: [],
      points: [],
    };
    const r = Math.sqrt((sideSize * sideSize) / Math.PI);
    softSquare.points = [...new Array(resolution).keys()]
      .map((i) => ((2 * i * Math.PI) / resolution))
      .map((angle) => Vec2.add(Vec2.mult(Vec2.fromAngle(angle), r), pos))
      .map((p) => new Body(Shape.Circle((Math.PI * r) / (resolution), p), 1, 0.2, fc));

    softSquare.sides = softSquare.points.map((p, i) => {
      const newStick = new Stick(1);
      newStick.attachObject(p);
      newStick.attachObject(softSquare.points[(i + 1) % softSquare.points.length]);
      if (i % 2 === 0)newStick.lockRotation();
      return newStick;
    });

    softSquare.sides.forEach((side) => {
      const s = side;
      s.length = (0.96 * 4 * sideSize) / resolution;
    });
    softSquare.points.forEach((ball) => {
      const b = ball;
      b.vel = vel.copy;
    });

    this.bodies.push(...softSquare.points);
    this.springs.push(...softSquare.sides);

    const springStrength = sideSize * sideSize * 200 * pressure;

    let bigStick = new Spring(
      Math.sqrt(r * r * Math.PI),
      springStrength / 2,
    );
    bigStick.attachObject(softSquare.points[0]);
    bigStick.attachObject(softSquare.points[resolution / 2]);
    this.springs.push(bigStick);

    bigStick = new Spring(
      Math.sqrt(r * r * Math.PI),
      springStrength / 2,
    );
    bigStick.attachObject(softSquare.points[resolution / 4]);
    bigStick.attachObject(softSquare.points[(3 * resolution) / 4]);
    this.springs.push(bigStick);

    bigStick = new Spring(
      Math.sqrt(2 * r * r * Math.PI),
      springStrength,
    );
    bigStick.attachObject(softSquare.points[resolution / 8]);
    bigStick.attachObject(softSquare.points[(5 * resolution) / 8]);
    this.springs.push(bigStick);

    bigStick = new Spring(
      Math.sqrt(2 * r * r * Math.PI),
      springStrength,
    );
    bigStick.attachObject(softSquare.points[(3 * resolution) / 8]);
    bigStick.attachObject(softSquare.points[(7 * resolution) / 8]);
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
    this.bodies.push(new Body(Shape.Polygon(points), 0));
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
   * @param {string} style The style of the body
   */
  addRectBody(x, y, w, h, fc, k, style = defaultBodyColor) {
    const points = [];
    points.push(new Vec2(x - w / 2, y - h / 2));
    points.push(new Vec2(x + w / 2, y - h / 2));
    points.push(new Vec2(x + w / 2, y + h / 2));
    points.push(new Vec2(x - w / 2, y + h / 2));
    const newBody = new Body(Shape.Polygon(points), 1, k, fc);
    newBody.style = style;
    this.bodies.push(newBody);
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
    this.bodies.push(new Body(Shape.Circle(r, new Vec2(x, y)), 0, 0.5, 0.5));
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
    /**
     * Creates a rectangle wall.
     *
     * @param {number} x_ The x coordinate
     * @param {number} y_ The y coordinate
     * @param {number} w_ The width
     * @param {number} h_ The height
     * @returns {Body} The wall body
     */
    const getRectBody = (x_, y_, w_, h_) => {
      const points = [];
      points.push(new Vec2(x_ - w_ / 2, y_ - h_ / 2));
      points.push(new Vec2(x_ + w_ / 2, y_ - h_ / 2));
      points.push(new Vec2(x_ + w_ / 2, y_ + h_ / 2));
      points.push(new Vec2(x_ - w_ / 2, y_ + h_ / 2));
      return new Body(Shape.Polygon(points), 0);
    };

    this.bodies[0] = (getRectBody(x - w, y, 2 * w, 4 * h));
    this.bodies[1] = (getRectBody(x + 2 * w, y, 2 * w, 4 * h));
    this.bodies[2] = (getRectBody(x, y - h, 4 * w, h * 2));
    this.bodies[3] = (getRectBody(x + w / 2, y + 2 * h, 5 * w, 2 * h));
  }

  /**
   * Search for any object at the given coordinate then returns it
   * Return false if nothing is found
   *
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @returns {Body | boolean} The found object
   */
  getObjectAtCoordinates(x, y) {
    /** @type {Body | boolean} */
    let ret = false;
    const v = new Vec2(x, y);
    this.bodies.some((body) => {
      if (body.containsPoint(v)) { ret = body; return true; }
      return false;
    });
    return ret;
  }

  /**
   * Removes the given object from the system
   *
   * @param {Body | Stick | Spring} obj The object to remove
   */
  removeObjFromSystem(obj) {
    let idx = -1;
    if (obj instanceof Body) idx = this.bodies.indexOf(obj);
    if (idx !== -1) {
      this.bodies.splice(idx, 1);
      return;
    }
    if (obj instanceof Stick || obj instanceof Spring) idx = this.springs.indexOf(obj);
    if (idx !== -1) {
      this.springs.splice(idx, 1);
    }
  }

  /**
   * Finds the object in on of the arrays and returns it's identidier object.
   *
   * @param {Body} obj The object to find.
   * @returns {ObjectIdentifier} The indentifier object.
   */
  getObjectIdentifier(obj) {
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
    retObj.bodies = this.bodies.map((b) => b.copy);

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

    ret.objects = obj.objects.map((o) => this.bodies[o.index]);

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
    ret.bodies = obj.bodies.map((bodyObj) => Body.fromObject(bodyObj));
    ret.airFriction = obj.airFriction;
    ret.gravity = Vec2.fromObject(obj.gravity);
    ret.springs = obj.springs.map((springObj) => ret.stickOrSpringFromObject(springObj));
    return ret;
  }
}

export {
  Body, Vec2, LineSegment, Spring, Stick, Shape, Line, Polygon,
};
export default Physics;
