const Vec2 = require('./vec2');

/**
 * Class representing a string
 * They act like springs in real life
 * You can attach other objects to the ends of them
 * They do not collide with other object neither with each other
 */
class Spring {
  /**
   * Creates a spring
   * @param {number} length The unstreched length of the spring
   * @param {number} springConstant Spring constant
   */
  constructor(length, springConstant) {
    this.length = length;
    this.springConstant = springConstant;
    this.pinned = false;
    this.objects = [];
    this.rotationLocked = false;
    this.id =
      '_' +
      Math.random()
      .toString(36)
      .substr(2, 9);
  }

  /**
   * Pins one side of the the spring to a given coordinate in space
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  pinHere(x, y) {
    this.pinned = {
      x: x,
      y: y,
    };
  }

  /**
   * Removes the pinned tag from the spring
   * You can now attach it to another object
   */
  unpin() {
    this.pinned = false;
  }

  /**
   * Attaches one end of the spring to an object (eg. Ball)
   * @param {any} object The object that the spring is getting attached to
   */
  attachObject(object) {
    let ob = this.objects;
    ob.push(object);
    if (ob.length === 2) {
      this.pinned = false;
    }
    if (ob.length >= 3) {
      ob = [ob[ob.length - 2], ob[ob.length - 1]];
    }
  }

  /**
   * Locks the objects attached to the ends of the spring
   * to not rotate around the attach point
   */
  lockRotation() {
    this.rotationLocked = true;
  }

  /**
   * Releases the objects attached to the ends of the spring
   * to rotate around the attach point
   */
  unlockRotation() {
    this.rotationLocked = false;
  }

  /**
   * Updates the spring bay the elapsed time
   * @param {number} t Elapsed time
   */
  update(t) {
    let p1;
    let p2;
    if (this.pinned && this.objects[0]) {
      p2 = this.pinned;
      p1 = this.objects[0];
      let dist = new Vec2(p2.x - p1.pos.x, p2.y - p1.pos.y);
      let dl = dist.length - this.length;
      dist.setMag(1);
      dist.mult((dl * this.springConstant * t) / p1.m);
      p1.vel.x += dist.x;
      p1.vel.y += dist.y;

      let v = p1.vel;
      v.rotate(-dist.heading);
      if (this.rotationLocked) {
        let s = new Vec2(p2.x, p2.y);
        let r2 = Vec2.sub(p1.pos, s);
        let am = r2.length * r2.length * p1.m + p1.am;
        let ang = (p1.am * p1.ang - r2.length * p1.m * v.y) / am;

        v.y = -ang * r2.length;

        p1.ang = ang;
      }
      v.rotate(dist.heading);
    } else if (this.objects[0] && this.objects[1]) {
      p1 = this.objects[0];
      p2 = this.objects[1];
      let dist = Vec2.sub(p1.pos, p2.pos);
      let dl = dist.length - this.length;
      dist.setMag(1);
      dist.mult(dl * this.springConstant * t);
      p2.vel.add(Vec2.div(dist, p2.m));
      p1.vel.add(Vec2.div(dist, -p1.m));

      dist = Vec2.sub(p1.pos, p2.pos);
      let v1 = p1.vel;
      let v2 = p2.vel;
      v1.rotate(-dist.heading);
      v2.rotate(-dist.heading);

      if (this.rotationLocked) {
        let s = new Vec2(
          p1.pos.x * p1.m + p2.pos.x * p2.m,
          p1.pos.y * p1.m + p2.pos.y * p2.m
        );
        s.div(p1.m + p2.m);
        let r1 = Vec2.sub(p1.pos, s);
        let r2 = Vec2.sub(p2.pos, s);
        let am =
          r1.length * r1.length * p1.m +
          p1.am +
          r2.length * r2.length * p2.m +
          p2.am;
        let sv = ((v1.y - v2.y) * r2.length) / (r1.length + r2.length) + v2.y;
        let ang =
          (p1.am * p1.ang +
            p2.am * p2.ang -
            r1.length * p1.m * (v1.y - sv) +
            r2.length * p2.m * (v2.y - sv)) /
          am;

        v1.y = -ang * r1.length + sv;
        v2.y = +ang * r2.length + sv;

        p1.ang = ang;
        p2.ang = ang;
      }

      v1.rotate(dist.heading);
      v2.rotate(dist.heading);
    }
  }

  /**
   * @return {Object} The spring represented in a JS object
   * Ready to be converted into JSON
   */
  toJSObject() {
    let ret = {};

    ret.length = this.length;
    ret.springConstant = this.springConstant;
    ret.pinned = this.pinned;
    ret.rotationLocked = this.rotationLocked;
    ret.id = this.id;
    ret.objects = this.objects.map((o) => o.id);
    ret.type = this.__proto__ == Spring.prototype ? 'spring' : 'stick';

    return ret;
  }

  /**
   * Creates a Spring class from the given object
   * @param {Object} obj The object to create the class from
   * @param {Array<Ball>} ballList An array of all the balls in the system
   * @return {Spring} The Spring object
   */
  static fromObject(obj, ballList) {
    let factory = new TypeSetter();
    let ret = factory.createStickOrSpring(obj.type,
      obj.length, obj.springConstant);

    ret.pinned = obj.pinned;
    ret.rotationLocked = obj.rotationLocked;
    ret.id = obj.id;

    ret.objects = obj.objects.map((e) => {
      let arr = ballList.filter((p) => e == p.id);
      return arr[0];
    });

    return ret;
  }
}

/**
 * Factory for springs and sticks
 */
function TypeSetter() {
  /**
   * Creates either a spring or a stick
   * @param {String} type Specifies the type of the new item
   * @param {number} length The length of the item
   * @param {number} springConstant The spring constant
   * @return {Spring} Returns the item
   */
  this.createStickOrSpring = function(type, length, springConstant) {
    let item;
    if (type == 'spring') {
      item = new Spring(length, springConstant);
    } else if (type == 'stick') {
      const Stick = require('./stick');
      item = new Stick(length);
    }

    return item;
  };
}

module.exports = Spring;
