(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BallPhysics = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
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
        if (ang)
            this.ang = ang;
        else
            this.ang = 0;
        if (fc || fc === 0)
            this.fc = fc;
        if (k)
            this.k = k;
        else
            this.k = 0.8;
        if (vel != undefined)
            this.vel = vel.copy;
        else
            this.vel = new vec2_1.default(0, 0);
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
     * Get a copy of the ball that is not a reference to it
     * @return {Ball} The copy of the ball
     */
    get copy() {
        let ret = new Ball(this.pos.copy, this.vel.copy, this.r, this.k, this.ang, this.fc);
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
     * Checks if two balls are colliding or not
     * @param {Ball} ball the other ball
     * @return {boolean} True if they colidre
     */
    collided(ball) {
        if (this.pos.dist(ball.pos) < (this.r + ball.r))
            return true;
        else
            return false;
    }
    /**
     * Static function for collision between two balls
     * @param {Ball} ball1 First ball
     * @param {Ball} ball2 Second ball
     */
    static collide(ball1, ball2) {
        if (!ball1.collided(ball2))
            return;
        let pos1 = ball1.pos;
        let pos2 = ball2.pos;
        let r1 = ball1.r;
        let r2 = ball2.r;
        let k = (ball1.k + ball2.k) / 2;
        let m1 = ball1.m;
        let m2 = ball2.m;
        let dist = vec2_1.default.dist(pos1, pos2);
        let fc = (ball1.fc + ball2.fc) / 2;
        let cp1 = pos1.copy;
        let cp2 = pos2.copy;
        let too = r1 + r2 - dist;
        let d = vec2_1.default.sub(pos1, pos2);
        d.setMag(1);
        d.mult(too * m2 / (m1 + m2));
        cp1.add(d);
        d.setMag(1);
        d.mult(-too * m1 / (m1 + m2));
        cp2.add(d);
        ball1.pos = cp1;
        ball2.pos = cp2;
        if (vec2_1.default.dot(d, vec2_1.default.sub(ball1.vel, ball2.vel)) < 0)
            return;
        d.setMag(1);
        let vel1Parralel = vec2_1.default.cross(d, ball1.vel);
        let vel2Parralel = vec2_1.default.cross(d, ball2.vel);
        let vel1Perpendicular = vec2_1.default.dot(d, ball1.vel);
        let vel2Perpendicular = vec2_1.default.dot(d, ball2.vel);
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
        ball1.vel = vec2_1.default.mult(d, u1Perpendicular);
        ball2.vel = vec2_1.default.mult(d, u2Perpendicular);
        let deltav1Perpendicular = u1Perpendicular - vel1Perpendicular;
        let deltav2Perpendicular = u2Perpendicular - vel2Perpendicular;
        let deltaAng1 = -(Math.sign(tovCommon1)) *
            (deltav1Perpendicular * fc) / (ball1.amc * r1);
        let deltaAng2 = (Math.sign(tovCommon2)) *
            (deltav2Perpendicular * fc) / (ball2.amc * r2);
        if (deltaAng1 / maxDeltaAng1 > 1)
            deltaAng1 = maxDeltaAng1;
        if (deltaAng2 / maxDeltaAng2 > 1)
            deltaAng2 = maxDeltaAng2;
        ball1.ang -= deltaAng1;
        ball2.ang += deltaAng2;
        let u1Parralel = vel1Parralel;
        let u2Parralel = vel2Parralel;
        d.rotate(Math.PI / 2);
        ball1.vel.add(vec2_1.default.mult(d, u1Parralel));
        ball2.vel.add(vec2_1.default.mult(d, u2Parralel));
    }
}
exports.default = Ball;

},{"./vec2":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
const linesegment_1 = require("./linesegment");
/**
 * Class representing a body
 * Bodies are movable objects
 * and they collide with other objects (balls)
 */
class Body {
    /**
     * Creates a body and calculates it's centre of mass (position)
     * @param {Array} points The points that make up the body
     * @param {Vec2} vel The velocity of the body
     * @param {number} k Coefficient of restitution
     * @param {number} ang Angular velocity
     * @param {number} fc Friction coefficient
     */
    constructor(points, vel, k, ang, fc) {
        this.points = points;
        let pol = this.points;
        let sum1 = 0;
        let sum2 = 0;
        let angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[1], pol[0]), vec2_1.default.sub(pol[pol.length - 1], pol[0]));
        sum1 += angle;
        sum2 += Math.PI * 2 - angle;
        for (let i = 1; i < pol.length - 1; i++) {
            angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[(i + 1) % pol.length], pol[i]), vec2_1.default.sub(pol[i - 1], pol[i]));
            sum1 += angle;
            sum2 += Math.PI * 2 - angle;
        }
        angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[0], pol[pol.length - 1]), vec2_1.default.sub(pol[pol.length - 2], pol[pol.length - 1]));
        sum1 += angle;
        sum2 += Math.PI * 2 - angle;
        if (sum2 < sum1) {
            let temp = [];
            for (let i = pol.length - 1; i >= 0; i--)
                temp.push(pol[i]);
            this.points = temp;
        }
        this.calculatePosAndMass();
        this.lastPos = this.pos.copy;
        this.fc = 0.4;
        this.rotation = 0;
        if (ang)
            this.ang = ang;
        else
            this.ang = 0;
        if (fc || fc === 0)
            this.fc = fc;
        if (k)
            this.k = k;
        else
            this.k = 0.8;
        if (vel != undefined)
            this.vel = vel.copy;
        else
            this.vel = new vec2_1.default(0, 0);
    }
    /**
     * Get a copy of the body that is not a reference to it
     * @return {Body} The copy of the body
     */
    get copy() {
        let pointsCopy = [];
        for (let i = 0; i < this.points.length; i++) {
            pointsCopy.push(new vec2_1.default(this.points[i].x, this.points[i].y));
        }
        let ret = new Body(pointsCopy, this.vel.copy, this.k, this.ang, this.fc);
        ret.rotation = this.rotation;
        ret.lastPos = this.lastPos.copy;
        ret.pos = this.pos.copy;
        return ret;
    }
    /**
     * Moves the body by the given coordinates
     * It has to move all the points of the body and
     * also the centre of mass (pos) of the body
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     */
    move(x, y) {
        this.pos.x += x;
        this.pos.y += y;
        this.points.forEach((p) => {
            p.x += x;
            p.y += y;
        });
    }
    /**
     * Function that does the collision detection and
     * collision behavior between the body and ball
     * @param {Ball} ball The ball to collide with the body
     */
    collideWithBall(ball) {
        let heading;
        let rel;
        let cp;
        this.points.forEach((point, idx) => {
            let p = new vec2_1.default(point.x, point.y);
            p.x -= ball.pos.x;
            p.y -= ball.pos.y;
            if (p.length <= ball.r) {
                heading = p.heading + Math.PI;
                rel = p.length;
                let move = vec2_1.default.fromAngle(heading);
                move.mult(ball.r - rel);
                this.move(move.x * -1 * ball.m / (this.m + ball.m), move.y * -1 * ball.m / (this.m + ball.m));
                ball.move(move.x * 1 * this.m / (this.m + ball.m), move.y * 1 * this.m / (this.m + ball.m));
                cp = new vec2_1.default(point.x, point.y);
                let a = vec2_1.default.fromAngle(heading);
                a.mult(-30);
            }
            p = new vec2_1.default(point.x, point.y);
            let np = new vec2_1.default(this.points[(idx + 1) % this.points.length].x, this.points[(idx + 1) % this.points.length].y);
            let bp = new vec2_1.default(ball.pos.x, ball.pos.y);
            let side = new vec2_1.default(np.x - p.x, np.y - p.y);
            let h = side.heading;
            p.rotate(-h + Math.PI);
            np.rotate(-h + Math.PI);
            bp.rotate(-h + Math.PI);
            let d = bp.y - ((p.y + np.y) / 2);
            if (d >= -ball.r && d <= ball.r && bp.x >= np.x && bp.x <= p.x) {
                heading = h - Math.PI / 2;
                rel = d;
                let move = vec2_1.default.fromAngle(heading);
                move.mult(ball.r - rel);
                this.move(move.x * -1 * ball.m / (this.m + ball.m), move.y * -1 * ball.m / (this.m + ball.m));
                ball.move(move.x * 1 * this.m / (this.m + ball.m), move.y * 1 * this.m / (this.m + ball.m));
                cp = ball.pos.copy;
                cp.add(vec2_1.default.mult(vec2_1.default.fromAngle(heading + Math.PI), d));
                let a = vec2_1.default.fromAngle(heading);
                a.mult(-30);
            }
        });
        if (heading === 0 || heading) {
            let v1 = this.vel.copy;
            let v2 = ball.vel.copy;
            let ang1 = this.ang;
            let ang2 = ball.ang;
            let r1 = vec2_1.default.sub(cp, this.pos);
            let r2 = vec2_1.default.sub(cp, ball.pos);
            let am1 = this.am;
            let am2 = ball.am;
            let m1 = this.m;
            let m2 = ball.m;
            let k = (this.k + ball.k) / 2;
            let fc = (this.fc + ball.fc) / 2;
            let v1v = r1.copy;
            let v2v = r2.copy;
            v1v.rotate(Math.PI / 2);
            v2v.rotate(-Math.PI / 2);
            v1v.mult(ang1);
            v2v.mult(ang2);
            v1v.add(v1);
            v2v.add(v2);
            v1v.rotate(-heading);
            v2v.rotate(-heading);
            let dv1vx = (1 + k) * (m1 * v1v.x + m2 * v2v.x) /
                (m1 + m2) - (k + 1) * v1v.x;
            let dv2vx = (1 + k) * (m1 * v1v.x + m2 * v2v.x) /
                (m1 + m2) - (k + 1) * v2v.x;
            let vk = (v1v.y * m1 + v2v.y * m2) / (m1 + m2);
            let dv1vy = -Math.sign(v1v.y) * fc * dv1vx;
            let dv2vy = -Math.sign(v2v.y) * fc * dv2vx;
            if (Math.abs(vk - v1v.y) > Math.abs(dv1vy))
                dv1vy = vk - v1v.y;
            if (Math.abs(vk - v2v.y) > Math.abs(dv2vy))
                dv2vy = vk - v2v.y;
            let dv1v = new vec2_1.default(dv1vx, dv1vy);
            let dv2v = new vec2_1.default(dv2vx, dv2vy);
            dv1v.rotate(heading);
            dv2v.rotate(heading);
            v1.add(dv1v);
            v2.add(dv2v);
            dv1v.rotate(-r1.heading);
            dv2v.rotate(-r2.heading);
            let dang1 = (dv1v.y * m1 * r1.length) /
                (am1 + r1.length * r1.length * m1);
            let dang2 = -(dv2v.y * m2 * r2.length) /
                (am2 + r2.length * r2.length * m2);
            ang1 += dang1;
            ang2 += dang2;
            let vp1 = vec2_1.default.fromAngle(r1.heading - Math.PI / 2);
            vp1.mult(r1.length * dang1);
            let vp2 = vec2_1.default.fromAngle(r2.heading - Math.PI / 2);
            vp2.mult(r2.length * dang2);
            v2.sub(vp2);
            v1.add(vp1);
            this.vel = v1;
            ball.vel = v2;
            this.ang = ang1;
            ball.ang = ang2;
        }
    }
    /**
     * Calculates the mass, moment od intertia and
     * the centre of mass of the body
     */
    calculatePosAndMass() {
        let poligons = [];
        poligons.push([]);
        this.points.forEach((p) => {
            poligons[0].push(new vec2_1.default(p.x, p.y));
        });
        if (this.isConcave) {
            const includes = (arr, item) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === item)
                        return true;
                }
                return false;
            };
            const intersectWithPoligon = function (segment, pol, exceptions) {
                for (let i = 0; i < pol.length; i++) {
                    if (!includes(exceptions, i)) {
                        let side = new linesegment_1.default(new vec2_1.default(pol[i].x, pol[i].y), new vec2_1.default(pol[(i + 1) % pol.length].x, pol[(i + 1) % pol.length].y));
                        if (linesegment_1.default.intersect(segment, side))
                            return true;
                    }
                }
                return false;
            };
            let found = true;
            checkAllPoligons: while (found) {
                found = false;
                for (let i = 0; i < poligons.length; i++) {
                    let pol = poligons[i];
                    let a = vec2_1.default.sub(pol[1], pol[0]);
                    let b = vec2_1.default.sub(pol[pol.length - 1], pol[0]);
                    let angle = vec2_1.default.angleACW(a, b);
                    if (angle > Math.PI) {
                        found = true;
                        let j = 0;
                        let k = j + 2;
                        let newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                        let newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y)).heading;
                        while (!(a.heading > b.heading ?
                            ((newSideHeading > a.heading &&
                                newSideHeading < 2 * Math.PI) ||
                                (newSideHeading > 0 &&
                                    newSideHeading < b.heading)) :
                            (newSideHeading > a.heading &&
                                newSideHeading < b.heading)) ||
                            intersectWithPoligon(new linesegment_1.default(new vec2_1.default(pol[j % pol.length].x, pol[j % pol.length].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y)), pol, [(pol.length - 1) % pol.length,
                                j % pol.length,
                                (k - 1) % pol.length,
                                k % pol.length,
                            ])) {
                            k++;
                            newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                            newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y))
                                .heading;
                        }
                        let pol1 = [];
                        let pol2 = [];
                        for (let l = j; l <= k; l++) {
                            pol1.push(pol[l % pol.length]);
                        }
                        for (let l = k; l <= j + pol.length; l++) {
                            pol2.push(pol[l % pol.length]);
                        }
                        poligons[i] = pol1;
                        poligons.push(pol2);
                        continue checkAllPoligons;
                    }
                    for (let j = 1; j < pol.length; j++) {
                        let a = vec2_1.default.sub(pol[(j + 1) % pol.length], pol[j]);
                        let b = vec2_1.default.sub(pol[j - 1], pol[j]);
                        let angle = vec2_1.default.angleACW(a, b);
                        if (angle > Math.PI) {
                            found = true;
                            let k = j + 2;
                            let newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                            let newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y))
                                .heading;
                            while (!(a.heading > b.heading ?
                                ((newSideHeading > a.heading &&
                                    newSideHeading < 2 * Math.PI) ||
                                    (newSideHeading > 0 &&
                                        newSideHeading < b.heading)) :
                                (newSideHeading > a.heading &&
                                    newSideHeading < b.heading)) ||
                                intersectWithPoligon(newSide, pol, [(j - 1) % pol.length,
                                    j % pol.length,
                                    (k - 1) % pol.length,
                                    k % pol.length,
                                ])) {
                                k++;
                                newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                                newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y))
                                    .heading;
                            }
                            let pol1 = [];
                            let pol2 = [];
                            for (let l = j; l <= k; l++) {
                                pol1.push(pol[l % pol.length]);
                            }
                            for (let l = k; l <= j + pol.length; l++) {
                                pol2.push(pol[l % pol.length]);
                            }
                            poligons[i] = pol1;
                            poligons.push(pol2);
                            continue checkAllPoligons;
                        }
                    }
                }
            }
        }
        for (let i = poligons.length - 1; i >= 0; i--) {
            let pol = poligons[i];
            while (pol.length > 3) {
                poligons.push([pol[0], pol[1], pol[2]]);
                pol.splice(1, 1);
            }
        }
        let mSum = 0;
        let amSum = 0;
        let pSum = new vec2_1.default(0, 0);
        poligons.forEach((pol) => {
            let a = Math.sqrt(Math.pow(pol[0].x - pol[1].x, 2) +
                Math.pow(pol[0].y - pol[1].y, 2));
            let b = Math.sqrt(Math.pow(pol[1].x - pol[2].x, 2) +
                Math.pow(pol[1].y - pol[2].y, 2));
            let c = Math.sqrt(Math.pow(pol[2].x - pol[0].x, 2) +
                Math.pow(pol[2].y - pol[0].y, 2));
            let s = (a + b + c) / 2;
            let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            mSum += m;
            pSum.x += m * (pol[0].x + pol[1].x + pol[2].x) / 3;
            pSum.y += m * (pol[0].y + pol[1].y + pol[2].y) / 3;
        });
        pSum.div(mSum);
        this.pos = pSum;
        this.m = mSum;
        // calculating the moment of inertia finally
        for (let pol of poligons) {
            let a = Math.sqrt(Math.pow(pol[0].x - pol[1].x, 2) +
                Math.pow(pol[0].y - pol[1].y, 2));
            let b = Math.sqrt(Math.pow(pol[1].x - pol[2].x, 2) +
                Math.pow(pol[1].y - pol[2].y, 2));
            let c = Math.sqrt(Math.pow(pol[2].x - pol[0].x, 2) +
                Math.pow(pol[2].y - pol[0].y, 2));
            let w = Math.max(a, b, c);
            let s = (a + b + c) / 2;
            let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            let h = 2 * m / w;
            let wpartial = Math.sqrt(Math.min(a, c, b) ** 2 - h * h);
            let am = h * w * (h * h + w * w) / 24;
            let d = Math.sqrt(h * h / 36 +
                (Math.abs(wpartial - w / 2) / 3) ** 2);
            am -= d * d * m;
            am += new vec2_1.default((pol[0].x + pol[1].x + pol[2].x) / 3, (pol[0].y + pol[1].y + pol[2].y) / 3).dist(this.pos) ** 2 * m;
            amSum += am;
        }
        this.am = amSum;
    }
    /**
     * Rotates the body around it's centre of mass by a given ange
     * Has to do the transformation for all the points
     * @param {number} angle Rotation angle
     */
    rotate(angle) {
        this.points.forEach((p) => {
            let point = new vec2_1.default(p.x, p.y);
            point.sub(this.pos);
            point.rotate(angle);
            point.add(this.pos);
            p.x = point.x;
            p.y = point.y;
        });
        this.rotation += angle;
    }
    /**
     * Finds out if the body is concave or not
     * @return {Boolean} True if the body is concave
     */
    get isConcave() {
        let pol = this.points;
        let angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[1], pol[0]), vec2_1.default.sub(pol[pol.length - 1], pol[0]));
        if (angle > Math.PI)
            return true;
        for (let i = 1; i < pol.length - 1; i++) {
            angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[(i + 1) % pol.length], pol[i]), vec2_1.default.sub(pol[i - 1], pol[i]));
            if (angle > Math.PI)
                return true;
        }
        angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[0], pol[pol.length - 1]), vec2_1.default.sub(pol[pol.length - 2], pol[pol.length - 1]));
        if (angle > Math.PI)
            return true;
        return false;
    }
    /**
     * Does the collision algorithm between two bodies
     * @param {Body} b1 First body
     * @param {Body} b2 Second body
     */
    static collide(b1, b2) {
        let matches = 0;
        let heading = 0;
        let cp = new vec2_1.default(0, 0);
        let cps = [];
        let intersect = false;
        b1.points.forEach((p, idx) => {
            let side1 = new linesegment_1.default(new vec2_1.default(p.x, p.y), new vec2_1.default(b1.points[(idx + 1) % b1.points.length].x, b1.points[(idx + 1) % b1.points.length].y));
            b2.points.forEach((pp, idxx) => {
                let side2 = new linesegment_1.default(new vec2_1.default(pp.x, pp.y), new vec2_1.default(b2.points[(idxx + 1) % b2.points.length].x, b2.points[(idxx + 1) % b2.points.length].y));
                let sect = linesegment_1.default.intersect(side1, side2);
                if (sect) {
                    matches++;
                    cp.add(sect);
                    cps.push(sect);
                    intersect = true;
                }
            });
        });
        if (!intersect)
            return;
        cp.div(matches);
        for (let i = 0; i < Math.floor(matches / 2); i++) {
            heading += vec2_1.default.sub(cps[2 * i + 1], cps[2 * i]).heading;
        }
        heading /= matches / 2;
        heading += Math.PI / 2;
        let a = vec2_1.default.fromAngle(heading);
        let move1Min = 0;
        let move1Max = 0;
        let move2Min = 0;
        let move2Max = 0;
        for (let point of b1.points) {
            move1Min = Math.min(vec2_1.default.dot(a, vec2_1.default.sub(new vec2_1.default(point.x, point.y), cp)), move1Min);
            move1Max = Math.max(vec2_1.default.dot(a, vec2_1.default.sub(new vec2_1.default(point.x, point.y), cp)), move1Max);
        }
        for (let point of b2.points) {
            move2Min = Math.min(vec2_1.default.dot(a, vec2_1.default.sub(new vec2_1.default(point.x, point.y), cp)), move2Min);
            move2Max = Math.max(vec2_1.default.dot(a, vec2_1.default.sub(new vec2_1.default(point.x, point.y), cp)), move2Max);
        }
        if (Math.abs(move1Min - move2Max) < Math.abs(move2Min - move1Max)) {
            b1.move(-a.x * move1Min, -a.y * move1Min);
            b2.move(-a.x * move2Max, -a.y * move2Max);
        }
        else {
            b1.move(-a.x * move1Max, -a.y * move1Max);
            b2.move(-a.x * move2Min, -a.y * move2Min);
        }
        let k = (b1.k + b2.k) / 2;
        // let vel1parralel = Vec2.cross(b1.vel, a);
        let vel1perpendicular = vec2_1.default.dot(b1.vel, a);
        // let vel2parralel = Vec2.cross(b2.vel, a);
        let vel2perpendicular = vec2_1.default.dot(b2.vel, a);
        let newVel1Perpendicular = (1 + k) * ((b1.m * vel1perpendicular) +
            (b2.m * vel2perpendicular)) / (b1.m + b2.m) -
            (k * vel1perpendicular);
        let newVel2Perpendicular = (1 + k) * ((b1.m * vel1perpendicular) +
            (b2.m * vel2perpendicular)) / (b1.m + b2.m) -
            (k * vel2perpendicular);
        b1.vel.add(vec2_1.default.mult(a.copy, newVel1Perpendicular - vel1perpendicular));
        b2.vel.add(vec2_1.default.mult(a.copy, newVel2Perpendicular - vel2perpendicular));
    }
}
exports.default = Body;

},{"./linesegment":3,"./vec2":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
/**
 * Class representing a segment of a line
 */
class LineSegment {
    /**
     * Create a segment
     * @param {Vec2} a Starting point
     * @param {Vec2} b Ending point
     */
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    /**
     * Get the length of the segment
     * @return {number} The length
     */
    get length() {
        return vec2_1.default.dist(this.a, this.b);
    }
    /**
     * Get the distance between a point and the line segment
     * @param {Vec2} p The point as a vector
     * @return {number} The distance
     */
    distFromPoint(p) {
        let e = vec2_1.default.sub(this.a, this.b);
        let A = vec2_1.default.sub(p, this.b);
        let B = vec2_1.default.sub(p, this.a);
        let a = A.length;
        let b = B.length;
        let c = e.length;
        if (c === 0)
            return a;
        let gamma = vec2_1.default.angle(A, B);
        let betha = vec2_1.default.angle(A, e);
        let alpha = Math.PI - gamma - betha;
        let area = Math.sin(alpha) * b * c / 2;
        let m = 2 * area / c;
        if (alpha > Math.PI / 2)
            return b;
        if (betha > Math.PI / 2)
            return a;
        return m;
    }
    /**
     * Get if they intersect or not
     * If they intersect it returns the intersection point
     * If they not it returns undefined
     * @param {LineSegment} segment1 A segment
     * @param {LineSegment} segment2 Other segment
     * @return {Vec2} Intersetion point
     */
    static intersect(segment1, segment2) {
        let v1 = vec2_1.default.sub(segment1.b, segment1.a);
        let a1 = v1.y / v1.x;
        let c1 = segment1.b.y - (segment1.b.x * a1);
        let v2 = vec2_1.default.sub(segment2.b, segment2.a);
        let a2 = v2.y / v2.x;
        let c2 = segment2.b.y - (segment2.b.x * a2);
        if (v1.x === 0 && v2.x !== 0) {
            if ((segment1.a.x >= segment2.a.x &&
                segment1.a.x <= segment2.b.x) ||
                (segment1.a.x <= segment2.a.x &&
                    segment1.a.x >= segment2.b.x)) {
                let h = a2 * segment1.a.x + c2;
                if ((h > segment1.a.y && h < segment1.b.y) ||
                    (h < segment1.a.y && h > segment1.b.y)) {
                    return new vec2_1.default(segment1.a.x, h);
                }
            }
            return undefined;
        }
        if (v2.x === 0 && v1.x !== 0) {
            if ((segment2.a.x >= segment1.a.x &&
                segment2.a.x <= segment1.b.x) ||
                (segment2.a.x <= segment1.a.x &&
                    segment2.a.x >= segment1.b.x)) {
                let h = a1 * segment2.a.x + c1;
                if ((h > segment2.a.y && h < segment2.b.y) ||
                    (h < segment2.a.y && h > segment2.b.y)) {
                    return new vec2_1.default(segment2.a.x, h);
                }
            }
            return undefined;
        }
        if (v1.x === 0 && v2.x === 0) {
            if (segment1.a.x === segment2.a.x) {
                let interval1;
                if (segment1.a.y < segment1.b.y) {
                    interval1 = [segment1.a.y, segment1.b.y];
                }
                else {
                    interval1 = [segment1.b.y, segment1.a.y];
                }
                let interval2;
                if (segment2.a.y < segment2.b.y) {
                    interval2 = [segment2.a.y, segment2.b.y];
                }
                else {
                    interval2 = [segment2.b.y, segment2.a.y];
                }
                let interval = [(interval1[0] > interval2[0]) ?
                        interval1[0] : interval2[0],
                    (interval1[1] < interval2[1]) ?
                        interval1[1] : interval2[1],
                ];
                if (interval[0] <= interval[1]) {
                    return new vec2_1.default(segment1.a.x, (interval[0] + interval[1]) / 2);
                }
            }
            return undefined;
        }
        let interval1;
        if (segment1.a.x < segment1.b.x) {
            interval1 = [segment1.a.x, segment1.b.x];
        }
        else {
            interval1 = [segment1.b.x, segment1.a.x];
        }
        let interval2;
        if (segment2.a.x < segment2.b.x) {
            interval2 = [segment2.a.x, segment2.b.x];
        }
        else {
            interval2 = [segment2.b.x, segment2.a.x];
        }
        let interval = [(interval1[0] > interval2[0]) ?
                interval1[0] : interval2[0],
            (interval1[1] < interval2[1]) ?
                interval1[1] : interval2[1],
        ];
        // If they are parralel the only time they intersect is when c1 == c2.
        if ((a1 === a2) && c1 === c2 && interval[0] <= interval[1]) {
            return new vec2_1.default((interval[0] + interval[1]) / 2, ((interval[0] + interval[1]) / 2) * a1 + c1);
        }
        let x = (c2 - c1) / (a1 - a2);
        if (x >= interval[0] && x <= interval[1]) {
            return new vec2_1.default(x, x * a1 + c1);
        }
        else
            return undefined;
    }
}
exports.default = LineSegment;

},{"./vec2":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
exports.Vec2 = vec2_1.default;
const ball_1 = require("./ball");
exports.Ball = ball_1.default;
const wall_1 = require("./wall");
exports.Wall = wall_1.default;
const linesegment_1 = require("./linesegment");
exports.LineSegment = linesegment_1.default;
const stick_1 = require("./stick");
exports.Stick = stick_1.default;
const spring_1 = require("./spring");
exports.Spring = spring_1.default;
const softball_1 = require("./softball");
exports.SoftBall = softball_1.default;
const body_1 = require("./body");
exports.Body = body_1.default;
/**
 * Class that creates a new world ba the physics engine
 */
class Physics {
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
        this.gravity = new vec2_1.default(0, 0);
    }
    /**
     * Updates the world by a given amount of time
     * @param {number} t Elapsed time
     * @param {boolean} precise If this is true,
     * then the simulation is going to be more precise
     */
    update(t, precise) {
        // Do the simulation on the reversed system
        // if the simulation is in precise mode
        let clonedSystem = precise ? this.copy : new Physics();
        if (precise) {
            clonedSystem.bodies.reverse();
            clonedSystem.balls.reverse();
            clonedSystem.update(t, false);
        }
        // At first move objets
        for (let i = 0; i < this.balls.length; i++) {
            // Move
            this.balls[i].lastPos = this.balls[i].pos.copy;
            this.balls[i].pos.add(vec2_1.default.mult(this.balls[i].vel, t));
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
                this.balls[i].vel.add(new vec2_1.default(this.gravity.x * t, this.gravity.y * t));
            }
            // Collision
            for (let j = i + 1; j < this.balls.length; j++) {
                if (this.balls[i].layer != this.balls[j].layer ||
                    (!this.balls[i].layer && !this.balls[j].layer)) {
                    ball_1.default.collide(this.balls[i], this.balls[j]);
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
                let p = new vec2_1.default(b.x, b.y);
                p.x -= ball.pos.x;
                p.y -= ball.pos.y;
                p.mult(-1);
                if (p.length <= ball.r + b.r) {
                    heading = p.heading;
                    rel = p.length;
                }
                if (heading === 0 || heading) {
                    let pos = new vec2_1.default(ball.pos.x, ball.pos.y);
                    let vel = new vec2_1.default(ball.vel.x, ball.vel.y);
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
                }
                else if (this.balls[i].pos.x + this.balls[i].r >
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
                }
                else if (this.balls[i].pos.y - this.balls[i].r < this.bounds[1]) {
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
                    body_1.default.collide(this.bodies[i], this.bodies[j]);
                }
            }
            // Apply gravity
            if (this.gravity) {
                this.bodies[i].vel.add(new vec2_1.default(this.gravity.x * t, this.gravity.y * t));
            }
        }
        // Update soft balls
        this.softBalls.forEach((sb) => {
            softball_1.default.updatePressureBasedForces(sb, t);
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
                ball.move((clonedSystem.balls[i].pos.x - ball.pos.x) * 0.5, (clonedSystem.balls[i].pos.y - ball.pos.y) * 0.5);
                ball.vel.add(new vec2_1.default((clonedSystem.balls[i].vel.x - ball.vel.x) * 0.5, (clonedSystem.balls[i].vel.y - ball.vel.y) * 0.5));
                ball.rotation = (ball.rotation + clonedSystem.balls[i].rotation) / 2;
                ball.ang = (ball.ang + clonedSystem.balls[i].ang) / 2;
            });
            // Take the average of the bodies
            this.bodies.forEach((body, i) => {
                let other = clonedSystem.bodies[i];
                body.move((other.pos.x - body.pos.x) * 0.5, (other.pos.y - body.pos.y) * 0.5);
                body.vel.add(new vec2_1.default((other.vel.x - body.vel.x) * 0.5, (other.vel.y - body.vel.y) * 0.5));
                body.rotate((other.rotation - body.rotation) / 2);
                body.ang = (body.ang + other.ang) / 2;
            });
        }
    }
    /**
     * Returns a copy of this system
     * @return {Physics} The copy of this system
     */
    get copy() {
        let ret = new Physics();
        ret.balls = this.getCopyOfBalls();
        ret.bodies = this.getCopyOfBodies();
        ret.fixedBalls = this.fixedBalls;
        ret.walls = this.walls;
        ret.bounds = this.bounds;
        ret.gravity = this.gravity;
        this.springs.forEach((spring) => {
            let TypeOfSpring = spring.constructor == spring_1.default ? spring_1.default : stick_1.default;
            let copiedSpring = new TypeOfSpring(spring.length, spring.springConstant);
            copiedSpring.rotationLocked = spring.rotationLocked;
            copiedSpring.pinned = spring.pinned;
            spring.objects.forEach((obj) => {
                let idx = this.balls.indexOf(obj);
                if (idx != -1)
                    copiedSpring.attachObject(ret.balls[idx]);
                else {
                    idx = this.bodies.indexOf(obj);
                    if (idx != -1)
                        copiedSpring.attachObject(ret.bodies[idx]);
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
    setAirFriction(airFriction) {
        if (!isFinite(airFriction))
            return;
        this.airFriction = airFriction;
        if (this.airFriction < 0)
            this.airFriction = 0;
        if (this.airFriction > 1)
            this.airFriction = 1;
    }
    /**
     * Sets the gravity in the world
     * @param {Vec2} dir The acceleration vector of the gravity
     */
    setGravity(dir) {
        this.gravity = dir.copy;
    }
    /**
     * Appends a new ball to the world
     * @param {Ball} ball Ball to add to the world
     */
    addBall(ball) {
        this.balls.push(ball);
    }
    /**
     * Appends a new body to the world
     * @param {Body} body Body to add to the world
     */
    addBody(body) {
        this.bodies.push(body);
    }
    /**
     * Appends a new soft ball to the world
     * @param {SoftBall} softBall SoftBall to be added to the world
     */
    addSoftBall(softBall) {
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
    addRectWall(x, y, w, h) {
        let points = [];
        points.push(new vec2_1.default(x - w / 2, y - h / 2));
        points.push(new vec2_1.default(x + w / 2, y - h / 2));
        points.push(new vec2_1.default(x + w / 2, y + h / 2));
        points.push(new vec2_1.default(x - w / 2, y + h / 2));
        this.walls.push(new wall_1.default(points));
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
    addRectBody(x, y, w, h, fc, k) {
        let points = [];
        points.push(new vec2_1.default(x - w / 2, y - h / 2));
        points.push(new vec2_1.default(x + w / 2, y - h / 2));
        points.push(new vec2_1.default(x + w / 2, y + h / 2));
        points.push(new vec2_1.default(x - w / 2, y + h / 2));
        this.bodies.push(new body_1.default(points, new vec2_1.default(0, 0), 0.5, 0, 0.3));
    }
    /**
     * Append a new wall to the world
     * @param {Wall} wall Wall to append to the world
     */
    addWall(wall) {
        this.walls.push(wall);
    }
    /**
     * Appends a fixed ball to the world
     * A fixed ball is immovable and other objects collide with it
     * @param {number} x x coordinate of the fixed ball
     * @param {number} y y coordinate of the fixed ball
     * @param {number} r radius of the fixed ball
     */
    addFixedBall(x, y, r) {
        this.fixedBalls.push({
            x: x, y: y, r: r,
        });
    }
    /**
     * Appends a new spring to the world
     * @param {Spring} spring Spring to add to the world
     */
    addSpring(spring) {
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
    setBounds(x, y, w, h) {
        this.bounds = [x, y, w, h];
    }
    /**
     * Search for any object at the given coordinate then returns it
     * Return false if nothing is found
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @return {Ball} The found object
     */
    getObjectAtCoordinates(x, y) {
        let ret = undefined;
        let v = new vec2_1.default(x, y);
        this.balls.forEach((ball) => {
            if (ball.pos.dist(v) < ball.r)
                ret = ball;
        });
        return ret;
    }
    /**
     * Returns an array of copies of all balls in the system
     * @return {Array<Ball>} The array of the copied balls
     */
    getCopyOfBalls() {
        let ret = [];
        this.balls.forEach((item) => {
            ret.push(item.copy);
        });
        return ret;
    }
    /**
     * Returns an array of copies of all bodies in the system
     * @return {Array<Body>} The array of the copied bodies
     */
    getCopyOfBodies() {
        let ret = [];
        this.bodies.forEach((item) => {
            ret.push(item.copy);
        });
        return ret;
    }
}
exports.Physics = Physics;

},{"./ball":1,"./body":2,"./linesegment":3,"./softball":5,"./spring":6,"./stick":7,"./vec2":8,"./wall":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
const ball_1 = require("./ball");
const stick_1 = require("./stick");
const linesegment_1 = require("./linesegment");
/**
 * Class representing a softbody object
 * They work like a ball, with pressure inside
 */
class SoftBall {
    /**
     * Creates a SoftBall
     * @param {Vec2} pos The starting position of the soft ball
     * @param {number} r The radius of the soft ball
     * @param {number} pressure The "hardness" of the soft ball
     * @param {number} fc Friction coefficient
     * @param {number} resolution The number of points that make up the ball
     */
    constructor(pos, r, pressure, fc, resolution) {
        this.points = [];
        if (fc || fc === 0)
            this.fc = fc;
        else
            this.fc = 0.4;
        this.pressure = pressure;
        if (!resolution)
            this.resolution = 30;
        else
            this.resolution = resolution;
        r = Math.abs(r);
        this.r = r;
        let layerNuber = Math.random();
        for (let i = 0; i < this.resolution; i++) {
            let newPos = new vec2_1.default(pos.x, pos.y);
            newPos.add(vec2_1.default.mult(vec2_1.default.fromAngle((i / this.resolution) * Math.PI * 2), r));
            this.points.push(new ball_1.default(newPos, new vec2_1.default(0, 0), r * Math.sin(Math.PI / this.resolution), 0, 0, this.fc));
            this.points[this.points.length - 1].layer = layerNuber;
        }
        this.sides = [];
        for (let i = 0; i < this.resolution; i++) {
            let side = new stick_1.default(2 * r * Math.sin(Math.PI / this.resolution));
            side.attachObject(this.points[i]);
            side.attachObject(this.points[(i + 1) % this.resolution]);
            if (i % 2 === 0)
                side.lockRotation();
            this.sides.push(side);
        }
    }
    /**
     * Updates the pressure-based forces in the soft ball
     * @param {SoftBall} softBall The soft ball to update
     * @param {number} t Elapsed time
     */
    static updatePressureBasedForces(softBall, t) {
        let poligons = [];
        poligons.push([]);
        softBall.points.forEach((p) => {
            poligons[0].push(new vec2_1.default(p.pos.x, p.pos.y));
        });
        if ((function (pol) {
            let angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[1], pol[0]), vec2_1.default.sub(pol[pol.length - 1], pol[0]));
            if (angle > Math.PI)
                return true;
            for (let i = 1; i < pol.length - 1; i++) {
                angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[(i + 1) % pol.length], pol[i]), vec2_1.default.sub(pol[i - 1], pol[i]));
                if (angle > Math.PI)
                    return true;
            }
            angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[0], pol[pol.length - 1]), vec2_1.default.sub(pol[pol.length - 2], pol[pol.length - 1]));
            if (angle > Math.PI)
                return true;
            return false;
        })(poligons[0])) {
            const includes = (arr, item) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === item)
                        return true;
                }
                return false;
            };
            const intersectWithPoligon = function (segment, pol, exceptions) {
                for (let i = 0; i < pol.length; i++) {
                    if (!includes(exceptions, i)) {
                        let side = new linesegment_1.default(new vec2_1.default(pol[i].x, pol[i].y), new vec2_1.default(pol[(i + 1) % pol.length].x, pol[(i + 1) % pol.length].y));
                        if (linesegment_1.default.intersect(segment, side))
                            return true;
                    }
                }
                return false;
            };
            let found = true;
            checkAllPoligons: while (found) {
                found = false;
                for (let i = 0; i < poligons.length; i++) {
                    let pol = poligons[i];
                    let a = vec2_1.default.sub(pol[1], pol[0]);
                    let b = vec2_1.default.sub(pol[pol.length - 1], pol[0]);
                    let angle = vec2_1.default.angleACW(a, b);
                    if (angle > Math.PI) {
                        found = true;
                        let j = 0;
                        let k = j + 2;
                        let newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                        let newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y)).heading;
                        while (!(a.heading > b.heading ?
                            ((newSideHeading > a.heading &&
                                newSideHeading < 2 * Math.PI) ||
                                (newSideHeading > 0 &&
                                    newSideHeading < b.heading)) :
                            (newSideHeading > a.heading &&
                                newSideHeading < b.heading)) ||
                            intersectWithPoligon(new linesegment_1.default(new vec2_1.default(pol[j % pol.length].x, pol[j % pol.length].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y)), pol, [(pol.length - 1) % pol.length,
                                j % pol.length,
                                (k - 1) % pol.length,
                                k % pol.length,
                            ])) {
                            k++;
                            newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                            newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y))
                                .heading;
                        }
                        let pol1 = [];
                        let pol2 = [];
                        for (let l = j; l <= k; l++) {
                            pol1.push(pol[l % pol.length]);
                        }
                        for (let l = k; l <= j + pol.length; l++) {
                            pol2.push(pol[l % pol.length]);
                        }
                        poligons[i] = pol1;
                        poligons.push(pol2);
                        continue checkAllPoligons;
                    }
                    for (let j = 1; j < pol.length; j++) {
                        let a = vec2_1.default.sub(pol[(j + 1) % pol.length], pol[j]);
                        let b = vec2_1.default.sub(pol[j - 1], pol[j]);
                        let angle = vec2_1.default.angleACW(a, b);
                        if (angle > Math.PI) {
                            found = true;
                            let k = j + 2;
                            let newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                            let newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y))
                                .heading;
                            while (!(a.heading > b.heading ?
                                ((newSideHeading > a.heading &&
                                    newSideHeading < 2 * Math.PI) ||
                                    (newSideHeading > 0 &&
                                        newSideHeading < b.heading)) :
                                (newSideHeading > a.heading &&
                                    newSideHeading < b.heading)) ||
                                intersectWithPoligon(newSide, pol, [(j - 1) % pol.length,
                                    j % pol.length,
                                    (k - 1) % pol.length,
                                    k % pol.length,
                                ])) {
                                k++;
                                newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                                newSideHeading = (new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y))
                                    .heading;
                            }
                            let pol1 = [];
                            let pol2 = [];
                            for (let l = j; l <= k; l++) {
                                pol1.push(pol[l % pol.length]);
                            }
                            for (let l = k; l <= j + pol.length; l++) {
                                pol2.push(pol[l % pol.length]);
                            }
                            poligons[i] = pol1;
                            poligons.push(pol2);
                            continue checkAllPoligons;
                        }
                    }
                }
            }
        }
        for (let i = poligons.length - 1; i >= 0; i--) {
            let pol = poligons[i];
            while (pol.length > 3) {
                poligons.push([pol[0], pol[1], pol[2]]);
                pol.splice(1, 1);
            }
        }
        let mSum = 0;
        poligons.forEach((pol) => {
            let a = Math.sqrt(Math.pow(pol[0].x - pol[1].x, 2) +
                Math.pow(pol[0].y - pol[1].y, 2));
            let b = Math.sqrt(Math.pow(pol[1].x - pol[2].x, 2) +
                Math.pow(pol[1].y - pol[2].y, 2));
            let c = Math.sqrt(Math.pow(pol[2].x - pol[0].x, 2) +
                Math.pow(pol[2].y - pol[0].y, 2));
            let s = (a + b + c) / 2;
            let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            mSum += m;
        });
        let overPressure = softBall.pressure *
            ((softBall.r * softBall.r * Math.PI) / mSum)
            - softBall.pressure;
        softBall.sides.forEach((side) => {
            let force = vec2_1.default.sub(side.objects[0].pos, side.objects[1].pos);
            force.mult(overPressure);
            force.rotate(Math.PI / 2);
            force.mult(t);
            side.objects[0].vel.add(vec2_1.default.div(force, side.objects[0].m));
            side.objects[1].vel.add(vec2_1.default.div(force, side.objects[1].m));
        });
    }
}
exports.default = SoftBall;

},{"./ball":1,"./linesegment":3,"./stick":7,"./vec2":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
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
            let dist = new vec2_1.default(p2.x - p1.pos.x, p2.y - p1.pos.y);
            let dl = dist.length - this.length;
            dist.setMag(1);
            dist.mult(dl * this.springConstant * t / (p1.m));
            p1.vel.x += dist.x;
            p1.vel.y += dist.y;
            let v = p1.vel;
            v.rotate(-dist.heading);
            if (this.rotationLocked) {
                let s = new vec2_1.default(p2.x, p2.y);
                let r2 = vec2_1.default.sub(p1.pos, s);
                let am = r2.length * r2.length * p1.m + p1.am;
                let ang = (p1.am * p1.ang - r2.length * p1.m * (v.y)) / (am);
                v.y = -ang * r2.length;
                p1.ang = ang;
            }
            v.rotate(dist.heading);
        }
        else if (this.objects[0] && this.objects[1]) {
            p1 = this.objects[0];
            p2 = this.objects[1];
            let dist = vec2_1.default.sub(p1.pos, p2.pos);
            let dl = dist.length - this.length;
            dist.setMag(1);
            dist.mult(dl * this.springConstant * t);
            p2.vel.add(vec2_1.default.div(dist, p2.m));
            p1.vel.add(vec2_1.default.div(dist, -p1.m));
            dist = vec2_1.default.sub(p1.pos, p2.pos);
            let v1 = p1.vel;
            let v2 = p2.vel;
            v1.rotate(-dist.heading);
            v2.rotate(-dist.heading);
            if (this.rotationLocked) {
                let s = new vec2_1.default(p1.pos.x * p1.m + p2.pos.x * p2.m, p1.pos.y * p1.m + p2.pos.y * p2.m);
                s.div(p1.m + p2.m);
                let r1 = vec2_1.default.sub(p1.pos, s);
                let r2 = vec2_1.default.sub(p2.pos, s);
                let am = r1.length * r1.length * p1.m + p1.am +
                    r2.length * r2.length * p2.m + p2.am;
                let sv = (v1.y - v2.y) * r2.length /
                    (r1.length + r2.length) + v2.y;
                let ang = (p1.am * p1.ang + p2.am * p2.ang -
                    r1.length * p1.m * (v1.y - sv) +
                    r2.length * p2.m * (v2.y - sv)) / (am);
                v1.y = -ang * r1.length + sv;
                v2.y = +ang * r2.length + sv;
                p1.ang = ang;
                p2.ang = ang;
            }
            v1.rotate(dist.heading);
            v2.rotate(dist.heading);
        }
    }
}
exports.default = Spring;

},{"./vec2":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
const spring_1 = require("./spring");
/**
 * Stick class for the physics engine
 * Sticks are not strechable objects that do not collide
 * with other objects but they can hold other objects on their ends
 */
class Stick extends spring_1.default {
    /**
     * Creates a stick
     * @param {nuber} length The length of the stick
     */
    constructor(length) {
        super(length, 0);
        this.springConstant = 0;
    }
    /**
     * Updates the stick trough an elapsed time
     * @param {number} t Elapsed time
     */
    update(t) {
        let p1;
        let p2;
        if (this.pinned && this.objects[0]) {
            p2 = this.pinned;
            p1 = this.objects[0];
            let dist = new vec2_1.default(p2.x - p1.pos.x, p2.y - p1.pos.y);
            dist.setMag(1);
            dist.mult(-this.length);
            p1.move(-p1.pos.x + p2.x + dist.x, -p1.pos.y + p2.y + dist.y);
            let v = p1.vel;
            v.rotate(-dist.heading);
            v.x = 0;
            if (this.rotationLocked) {
                let s = new vec2_1.default(p2.x, p2.y);
                let r2 = vec2_1.default.sub(p1.pos, s);
                let am = r2.length * r2.length * p1.m + p1.am;
                let ang = (p1.am * p1.ang - r2.length * p1.m * (v.y)) / (am);
                v.y = -ang * r2.length;
                p1.ang = ang;
            }
            v.rotate(dist.heading);
        }
        else if (this.objects[0] && this.objects[1]) {
            p1 = this.objects[0];
            p2 = this.objects[1];
            let dist = vec2_1.default.sub(p1.pos, p2.pos);
            let dl = this.length - dist.length;
            dist.setMag(1);
            let move1 = vec2_1.default.mult(dist, dl * (p2.m) / ((p1.m) + (p2.m)));
            let move2 = vec2_1.default.mult(dist, -dl * (p1.m) / ((p1.m) + (p2.m)));
            p1.move(move1.x, move1.y);
            p2.move(move2.x, move2.y);
            let v1 = p1.vel;
            let v2 = p2.vel;
            v1.rotate(-dist.heading);
            v2.rotate(-dist.heading);
            v1.x = v2.x = (p1.m * v1.x + p2.m * v2.x) / ((p1.m) + (p2.m));
            if (this.rotationLocked) {
                let s = new vec2_1.default(p1.pos.x * p1.m + p2.pos.x * p2.m, p1.pos.y * p1.m + p2.pos.y * p2.m);
                s.div(p1.m + p2.m);
                let r1 = vec2_1.default.sub(p1.pos, s);
                let r2 = vec2_1.default.sub(p2.pos, s);
                let am = r1.length * r1.length * p1.m + p1.am +
                    r2.length * r2.length * p2.m + p2.am;
                let sv = (v1.y - v2.y) * r2.length /
                    (r1.length + r2.length) + v2.y;
                let ang = (p1.am * p1.ang + p2.am * p2.ang -
                    r1.length * p1.m * (v1.y - sv) +
                    r2.length * p2.m * (v2.y - sv)) / (am);
                v1.y = -ang * r1.length + sv;
                v2.y = +ang * r2.length + sv;
                p1.ang = ang;
                p2.ang = ang;
            }
            v1.rotate(dist.heading);
            v2.rotate(dist.heading);
        }
    }
}
exports.default = Stick;

},{"./spring":6,"./vec2":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// every angle is counterclockwise (anticlockwise)
/** Class representing a 2d vector. */
class Vec2 {
    /**
     * Create a vector.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Get a copy of the vector.
     * @return {Vec2} The copy.
     */
    get copy() {
        return new Vec2(this.x, this.y);
    }
    /**
     * Get the length of the vector.
     * @return {number} The length.
     */
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Get the length of the vector squared.
     * @return {number} The length squared.
     */
    get sqlength() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Get the heading of the vector compared to (1, 0).
     * @return {number} The angle between (1, 0)
     * and the vector in anticlockwise direction.
     */
    get heading() {
        if (this.x === 0 && this.y === 0)
            return 0;
        if (this.x === 0)
            return this.y > 0 ? Math.PI / 2 : 1.5 * Math.PI;
        if (this.y === 0)
            return this.x > 0 ? 0 : Math.PI;
        let v = Vec2.normalized(this);
        if (this.x > 0 && this.y > 0)
            return Math.asin(v.y);
        if (this.x < 0 && this.y > 0)
            return Math.asin(-v.x) + Math.PI / 2;
        if (this.x < 0 && this.y < 0)
            return Math.asin(-v.y) + Math.PI;
        if (this.x > 0 && this.y < 0)
            return Math.asin(v.x) + 1.5 * Math.PI;
        return 0;
    }
    /**
     * Adds another vector to the vector.
     * @param {Vec2} a - The other vector.
     */
    add(a) {
        this.x += a.x;
        this.y += a.y;
    }
    /**
     * Subtracts another vector from the vector.
     * @param {Vec2} a - The other vector.
     */
    sub(a) {
        this.x -= a.x;
        this.y -= a.y;
    }
    /**
     * Multiplies the vector by a scalar.
     * @param {number} x - The scalar.
     */
    mult(x) {
        this.x *= x;
        this.y *= x;
    }
    /**
     * Divides the vector by a scalar.
     * @param {number} x - The scalar.
     */
    div(x) {
        this.x /= x;
        this.y /= x;
    }
    /**
     * Linearry interpolates the vector into the other vector by scalar x.
     * @param {Vec2} other - The other vector.
     * @param {number} x - The scalar.
     */
    lerp(other, x) {
        this.x += (other.x - this.x) * x;
        this.y += (other.y - this.y) * x;
    }
    /**
     * Get the distance between the vector and the other vector.
     * Vectors are representing points here.
     * @param {Vec2} other - The other vector.
     * @return {number} The distance between them.
     */
    dist(other) {
        return (new Vec2(this.x - other.x, this.y - other.y)).length;
    }
    /**
     * Set the length of the vector.
     * @param {number} l - The new length value.
     */
    setMag(l) {
        if (this.length === 0)
            return;
        this.mult(l / this.length);
    }
    /**
     * Rotate the vector anticlockwise.
     * @param {number} angle - Rotation angle.
     */
    rotate(angle) {
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
    static add(a, b) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }
    /**
     * Subtracts one vector from another.
     * @param {Vec2} a - Vector.
     * @param {Vec2} b - Other vector.
     * @return {Vec2} The subtraction of the vectors.
     */
    static sub(a, b) {
        return new Vec2(a.x - b.x, a.y - b.y);
    }
    /**
     * Multiply the vector by a scalar.
     * @param {Vec2} v - Vector.
     * @param {number} x - Scalar.
     * @return {Vec2} The multiplied vector.
     */
    static mult(v, x) {
        return new Vec2(v.x * x, v.y * x);
    }
    /**
     * Divide the vector by a scalar.
     * @param {Vec2} v - Vector.
     * @param {number} x - Scalar.
     * @return {Vec2} The divided vector.
     */
    static div(v, x) {
        return new Vec2(v.x / x, v.y / x);
    }
    /**
     * Create a unit vector from an angle.
     * @param {number} a - The angle.
     * @return {Vec2} The created vector.
     */
    static fromAngle(a) {
        return new Vec2(Math.cos(a), Math.sin(a));
    }
    /**
     * Linearry interpolates a vector into another vector by scalar x.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector.
     * @param {number} x - The scalar.
     * @return {Vec2} The created vector.
     */
    static lerp(a, b, x) {
        return Vec2.add(a, Vec2.mult(Vec2.sub(b, a), x));
    }
    /**
     * Get the distance between vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} The distance between them.
     */
    static dist(a, b) {
        return Vec2.sub(a, b).length;
    }
    /**
     * Get the dot product of two vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} The dot product of them.
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    /**
     * Get the cross product of two vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} The cross product of them.
     */
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    /**
     * Get the angle between two vectors.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} Angle between them.
     */
    static angle(a, b) {
        return Math.acos(Vec2.dot(a, b) / Math.sqrt(a.sqlength * b.sqlength));
    }
    /**
     * Get the angle between two vectors but in the anticlockwise direction.
     * @param {Vec2} a - A vector.
     * @param {Vec2} b - Other vector
     * @return {number} Angle between them.
     */
    static angleACW(a, b) {
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
    static normalized(v) {
        let l = v.length;
        return l === 0 ? v : new Vec2(v.x / l, v.y / l);
    }
}
exports.default = Vec2;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
/** Class representing a wall
 * Walls are objects that are immovable  and they are rigid
 * It can be convex or concave
 */
class Wall {
    /**
     * Create a wall
     * @param {Array<Vec2>} points Array of points that make up the wall
     */
    constructor(points) {
        this.points = points;
        let pol = this.points;
        let sum1 = 0;
        let sum2 = 0;
        let angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[1], pol[0]), vec2_1.default.sub(pol[pol.length - 1], pol[0]));
        sum1 += angle;
        sum2 += Math.PI * 2 - angle;
        for (let i = 1; i < pol.length - 1; i++) {
            angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[(i + 1) % pol.length], pol[i]), vec2_1.default.sub(pol[i - 1], pol[i]));
            sum1 += angle;
            sum2 += Math.PI * 2 - angle;
        }
        angle = vec2_1.default.angleACW(vec2_1.default.sub(pol[0], pol[pol.length - 1]), vec2_1.default.sub(pol[pol.length - 2], pol[pol.length - 1]));
        sum1 += angle;
        sum2 += Math.PI * 2 - angle;
        if (sum2 > sum1)
            return;
        else {
            let temp = [];
            for (let i = pol.length - 1; i >= 0; i--)
                temp.push(pol[i]);
            this.points = temp;
        }
    }
    /**
     * Function for collision detection and behavior between balls and walls
     * @param {Ball} ball The ball that is checked if it collides with the wall
     */
    collideWithBall(ball) {
        let heading;
        let rel;
        this.points.forEach((point, idx) => {
            let p = new vec2_1.default(point.x, point.y);
            p.x -= ball.pos.x;
            p.y -= ball.pos.y;
            p.mult(-1);
            if (p.length <= ball.r) {
                heading = p.heading;
                rel = p.length;
            }
            p = new vec2_1.default(point.x, point.y);
            let np = new vec2_1.default(this.points[(idx + 1) % this.points.length].x, this.points[(idx + 1) % this.points.length].y);
            let bp = new vec2_1.default(ball.pos.x, ball.pos.y);
            let side = new vec2_1.default(np.x - p.x, np.y - p.y);
            let h = side.heading;
            p.rotate(-h + Math.PI);
            np.rotate(-h + Math.PI);
            bp.rotate(-h + Math.PI);
            let d = bp.y - ((p.y + np.y) / 2);
            if (d >= -ball.r && d <= ball.r && bp.x >= np.x && bp.x <= p.x) {
                heading = h - Math.PI / 2;
                rel = d;
            }
        });
        if (heading === 0 || heading) {
            let pos = new vec2_1.default(ball.pos.x, ball.pos.y);
            let vel = new vec2_1.default(ball.vel.x, ball.vel.y);
            pos.rotate(-heading + Math.PI / 2);
            vel.rotate(-heading + Math.PI / 2);
            vel.y *= -ball.k;
            pos.y += ball.r - rel;
            let dvy = vel.y * (1 + (1 / ball.k));
            let dvx = Math.abs(dvy) * ball.fc *
                Math.sign(vel.x - ball.ang * ball.r) * -1;
            if (Math.abs(dvx) > Math.abs(vel.x - ball.ang * ball.r)) {
                dvx = -vel.x + ball.ang * ball.r;
            }
            vel.x +=
                dvx - ball.r * ball.r * ball.m * dvx /
                    (ball.am + ball.r * ball.r * ball.m);
            ball.ang -=
                ball.r * ball.r * ball.m * dvx /
                    ((ball.am + ball.r * ball.r * ball.m) * ball.r);
            pos.rotate(heading - Math.PI / 2);
            vel.rotate(heading - Math.PI / 2);
            ball.pos.x = pos.x;
            ball.pos.y = pos.y;
            ball.vel.x = vel.x;
            ball.vel.y = vel.y;
        }
    }
}
exports.default = Wall;

},{"./vec2":8}]},{},[4])(4)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFsbC50cyIsInNyYy9ib2R5LnRzIiwic3JjL2xpbmVzZWdtZW50LnRzIiwic3JjL3BoeXNpY3MudHMiLCJzcmMvc29mdGJhbGwudHMiLCJzcmMvc3ByaW5nLnRzIiwic3JjL3N0aWNrLnRzIiwic3JjL3ZlYzIudHMiLCJzcmMvd2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsaUNBQTBCO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFxQixJQUFJO0lBWXZCOzs7Ozs7Ozs7T0FTRztJQUNILFlBQVksR0FBUyxFQUFFLEdBQVMsRUFBRSxDQUFTLEVBQ3pDLENBQVMsRUFBRSxHQUFXLEVBQUUsRUFBVTtRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksR0FBRztZQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztZQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRWpDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRWxCLElBQUksR0FBRyxJQUFJLFNBQVM7WUFBRSxJQUFJ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QUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLEVBQUUsR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxFQUFFLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNyQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUQsT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDMUIsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFFUixJQUFJLElBQUksR0FBRyxjQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQzlDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0MsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNuQixFQUFFLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXhELElBQUksQ0FBQyxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNmO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksT0FBTyxFQUFFO1lBQzFCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNwQixJQUFJLEVBQUUsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsSUFBSSxFQUFFLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFakMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDWixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRVosR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVyQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFaEMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRS9DLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUMzQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQUUsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUUvRCxJQUFJLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVyQixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUViLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6QixJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDbEMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXZDLElBQUksSUFBSSxLQUFLLENBQUM7WUFDZCxJQUFJLElBQUksS0FBSyxDQUFDO1lBRWQsSUFBSSxHQUFHLEdBQUcsY0FBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVCLElBQUksR0FBRyxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1osRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVaLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFFZCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSCxtQkFBbUI7UUFDZixJQUFJLFFBQVEsR0FBdUIsRUFBRSxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFrQixFQUFFLElBQVksRUFBRSxFQUFFO2dCQUNsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTt3QkFBRSxPQUFPLElBQUksQ0FBQztpQkFDcEM7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxvQkFBb0IsR0FBRyxVQUFTLE9BQW9CLEVBQ3RELEdBQWdCLEVBQUUsVUFBeUI7Z0JBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRTt3QkFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxxQkFBVyxDQUFDLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNuRCxJQUFJLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxJQUFJLHFCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7NEJBQUUsT0FBTyxJQUFJLENBQUM7cUJBQ3pEO2lCQUNKO2dCQUNELE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztZQUNGLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUVqQixnQkFBZ0IsRUFBRSxPQUFPLEtBQUssRUFBRTtnQkFDNUIsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsSUFBSSxDQUFDLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7d0JBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUM7d0JBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2QsSUFBSSxPQUFPLEdBQ1AsSUFBSSxxQkFBVyxDQUFDLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN4QyxJQUFJLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQzFCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLElBQUksY0FBYyxHQUNkLENBQUMsSUFBSSxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQzVDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUM1QixDQUFDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPO2dDQUN4QixjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0NBQzdCLENBQUMsY0FBYyxHQUFHLENBQUM7b0NBQ2YsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3RDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPO2dDQUN2QixjQUFjLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNoQyxvQkFBb0IsQ0FDaEIsSUFBSSxxQkFBVyxDQUFDLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3RCLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDL0IsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNO2dDQUNuQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU07Z0NBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU07Z0NBQ3BCLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTTs2QkFDYixDQUFDLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLENBQUM7NEJBQ0osT0FBTyxHQUFHLElBQUkscUJBQVcsQ0FDckIsSUFBSSxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDYixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2IsSUFBSSxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUMxQixHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoQyxjQUFjLEdBQUcsQ0FDYixJQUFJLGNBQUksQ0FDSixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDOUIsT0FBTyxDQUFDO3lCQUNoQjt3QkFDRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7d0JBQ2QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO3dCQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDbEM7d0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7eUJBQ2xDO3dCQUNELFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3BCLFNBQVMsZ0JBQWdCLENBQUM7cUJBQzdCO29CQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNqQyxJQUFJLENBQUMsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BELElBQUksQ0FBQyxHQUFHLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7NEJBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUM7NEJBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDZCxJQUFJLE9BQU8sR0FBRyxJQUFJLHFCQUFXLENBQ3pCLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNiLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsSUFBSSxjQUFjLEdBQUcsQ0FDakIsSUFBSSxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzlCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQzlCLE9BQU8sQ0FBQzs0QkFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQ0FDNUIsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsT0FBTztvQ0FDeEIsY0FBYyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO29DQUM3QixDQUFDLGNBQWMsR0FBRyxDQUFDO3dDQUNmLGNBQWMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUN0QyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsT0FBTztvQ0FDdkIsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQ0FDaEMsb0JBQW9CLENBQ2hCLE9BQU8sRUFDUCxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTTtvQ0FDMUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNO29DQUNkLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNO29DQUNwQixDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU07aUNBQ2IsQ0FBQyxFQUFFO2dDQUNSLENBQUMsRUFBRSxDQUFDO2dDQUNKLE9BQU8sR0FBRyxJQUFJLHFCQUFXLENBQ3JCLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNiLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDaEMsY0FBYyxHQUFHLENBQ2IsSUFBSSxjQUFJLENBQ0osT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUNBQzlCLE9BQU8sQ0FBQzs2QkFDaEI7NEJBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOzRCQUNkLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs0QkFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dDQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NkJBQ2xDOzRCQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzZCQUNsQzs0QkFDRCxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDOzRCQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwQixTQUFTLGdCQUFnQixDQUFDO3lCQUM3QjtxQkFDSjtpQkFDSjthQUNKO1NBQ0o7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7UUFFRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRWQsNENBQTRDO1FBQzVDLEtBQUssSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUN4QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsRUFBRSxJQUFJLElBQUksY0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQy9DLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEUsS0FBSyxJQUFJLEVBQUUsQ0FBQztTQUNmO1FBQ0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsS0FBYTtRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3RCLElBQUksS0FBSyxHQUFHLElBQUksY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksU0FBUztRQUNULElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDOUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLEtBQUssR0FBRyxjQUFJLENBQUMsUUFBUSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFDcEQsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFD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TUFBTSxFQUFFO1lBQ3pCLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUMxQixjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekQsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQzFCLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxjQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUU7WUFDL0QsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQzdDO2FBQU07WUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7U0FDN0M7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SyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDMUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO3dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDNUQsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztvQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDaEQsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25EO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO3dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDNUQsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztvQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDaEQsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25EO2dCQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO3dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDNUQsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztvQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDaEQsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25EO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUks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QyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzlCLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFDeEMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUNwRCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxJQUFJO1FBQ04sSUFBSSxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QixHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNsQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNwQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDakMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM5QixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxDQUFDLGVBQUssQ0FBQztZQUNqRSxJQUFJLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUMvQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekIsWUFBWSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1lBQ3BELFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUVwQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUFFLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNwRDtvQkFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDM0Q7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxjQUFjLENBQUMsV0FBbUI7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFBRSxPQUFPO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDO1lBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsVUFBVSxDQUFDLEdBQVM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPLENBQUMsSUFBVTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTyxDQUFDLElBQVU7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFdBQVcsQ0FBQyxRQUFrQjtRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEMsbUVBQW1FO0lBQ3JFLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILFdBQVcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFFLENBQVM7UUFDM0UsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLGNBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPLENBQUMsSUFBVTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNuQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxNQUFjO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxzQkFBc0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QyxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxjQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsY0FBYztRQUNaLElBQUksR0FBRyxHQUFnQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWU7UUFDYixJQUFJLEdBQUcsR0FBZ0IsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FDRjtBQVVPLDBCQUFPOzs7OztBQ3JnQmYsaUNBQTBCO0FBQzFCLGlDQUEwQjtBQUMxQixtQ0FBNEI7QUFDNUIsK0NBQXdDO0FBR3hDOzs7R0FHRztBQUNILE1BQXFCLFFBQVE7SUFRekI7Ozs7Ozs7T0FPRztJQUNILFlBQVksR0FBUyxFQUFFLENBQVMsRUFBRSxRQUFnQixFQUM5QyxFQUFVLEVBQUUsVUFBa0I7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7WUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7WUFDNUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFFbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxDQUFDLFVBQVU7WUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7WUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFbEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFWCxJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUNoQixjQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsTUFBTSxFQUFFLElBQUksY0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDNUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7U0FDMUQ7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLElBQUksR0FBRyxJQUFJLGVBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMs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QUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDcEI7U0FDSjtRQUVELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFH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O0lBQzdDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxPQUFPO1FBQ1AsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNsRSxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuRSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQy9ELElBQUksSUFB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LENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQU8sRUFBRSxDQUFTO1FBQzFCLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQU8sRUFBRSxDQUFTO1FBQ3pCLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBUztRQUN0QixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQU8sRUFBRSxDQUFPLEVBQUUsQ0FBUztRQUNuQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQU8sRUFBRSxDQUFPO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxHQUFH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QztZQUN6QyxJQUFJLENBQUMsR0FBRztnQkFDSixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHO29CQUM5QixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN0QjtJQUNMLENBQUM7Q0FDSjtBQTlGRCx1QkE4RkMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgYmFsbFxuICogQSBiYWxsIGlzIGFuIG9iamVjdCBpbiB0aGUgcGh5c2ljcyBlbmdpbmUgdGhhdFxuICogaGFzIGEgc2hhcGUgb2YgYSBjaXJjbGUgYW5kIGl0IGlzIGFmZmVjdGVkIGJ5IGdyYXZpdHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFsbCB7XG4gIHBvczogVmVjMjtcbiAgbGFzdFBvczogVmVjMjtcbiAgcjogbnVtYmVyO1xuICBmYzogbnVtYmVyO1xuICBhbWM6IG51bWJlcjtcbiAgcm90YXRpb246IG51bWJlcjtcbiAgYW5nOiBudW1iZXI7XG4gIGs6IG51bWJlcjtcbiAgdmVsOiBWZWMyO1xuICBsYXllcjogYW55O1xuXG4gIC8qKlxuICAgKiBDcmV0ZSBhIGJhbGxcbiAgICogVGhlIG1hc3Mgb2YgdGhlIGJhbGwgaXMgY2FsY3VsYXRlZCBmcm9tIGl0cyByYWRpdXNcbiAgICogQHBhcmFtIHtWZWMyfSBwb3MgVGhlIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZVxuICAgKiBAcGFyYW0ge1ZlYzJ9IHZlbCBUaGUgdmVsb2NpdHkgb2YgdGhlIGNpcmNsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gciBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gayBDb2VmZmljaWVudCBvZiByZXN0aXR1dGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nIFRoZSBhbmd1bGFyIHZlbG9jaXR5IG9mIHRoZSBiYWxsIChvcHRpb25hbClcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZjIFRoZSBmcmljdGlvbiBjb2VmZmljaWVudCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIDAuNClcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBvczogVmVjMiwgdmVsOiBWZWMyLCByOiBudW1iZXIsXG4gICAgazogbnVtYmVyLCBhbmc6IG51bWJlciwgZmM6IG51bWJlcikge1xuICAgIHRoaXMucG9zID0gcG9zLmNvcHk7XG4gICAgdGhpcy5sYXN0UG9zID0gdGhpcy5wb3MuY29weTtcbiAgICB0aGlzLnIgPSByO1xuICAgIHRoaXMuZmMgPSAwLjQ7XG4gICAgdGhpcy5hbWMgPSAyIC8gNTtcblxuICAgIHRoaXMucm90YXRpb24gPSAwO1xuXG4gICAgaWYgKGFuZykgdGhpcy5hbmcgPSBhbmc7XG4gICAgZWxzZSB0aGlzLmFuZyA9IDA7XG5cbiAgICBpZiAoZmMgfHwgZmMgPT09IDApIHRoaXMuZmMgPSBmYztcblxuICAgIGlmIChrKSB0aGlzLmsgPSBrO1xuICAgIGVsc2UgdGhpcy5rID0gMC44O1xuXG4gICAgaWYgKHZlbCAhPSB1bmRlZmluZWQpIHRoaXMudmVsID0gdmVsLmNvcHk7XG4gICAgZWxzZSB0aGlzLnZlbCA9IG5ldyBWZWMyKDAsIDApO1xuICB9XG5cblxuICAvKipcbiAgICogR2V0IHRoZSBtYXNzIG9mIHRoZSBiYWxsXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIG1hc3NcbiAgICovXG4gIGdldCBtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuciAqIHRoaXMuciAqIE1hdGguUEk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtb21lbnQgb2YgaW5lcnRpYSBvZiB0aGUgYmFsbFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBtb21lbnQgb2YgaW5lcnRpYVxuICAgKi9cbiAgZ2V0IGFtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuYW1jICogdGhpcy5yICogdGhpcy5yICogdGhpcy5tO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgdGhlIGJhbGwgdGhhdCBpcyBub3QgYSByZWZlcmVuY2UgdG8gaXRcbiAgICogQHJldHVybiB7QmFsbH0gVGhlIGNvcHkgb2YgdGhlIGJhbGxcbiAgICovXG4gIGdldCBjb3B5KCk6IEJhbGwge1xuICAgIGxldCByZXQgPVxuICAgICAgbmV3IEJhbGwodGhpcy5wb3MuY29weSwgdGhpcy52ZWwuY29weSwgdGhpcy5yLCB0aGlzLmssIHRoaXMuYW5nLCB0aGlzLmZjKTtcbiAgICByZXQubGFzdFBvcyA9IHRoaXMubGFzdFBvcy5jb3B5O1xuICAgIHJldC5yb3RhdGlvbiA9IHRoaXMucm90YXRpb247XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgYmFsbCBieSB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgKi9cbiAgbW92ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMucG9zLnggKz0geDtcbiAgICB0aGlzLnBvcy55ICs9IHk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHR3byBiYWxscyBhcmUgY29sbGlkaW5nIG9yIG5vdFxuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwgdGhlIG90aGVyIGJhbGxcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGV5IGNvbGlkcmVcbiAgICovXG4gIGNvbGxpZGVkKGJhbGw6IEJhbGwpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5wb3MuZGlzdChiYWxsLnBvcykgPCAodGhpcy5yICsgYmFsbC5yKSkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIGZ1bmN0aW9uIGZvciBjb2xsaXNpb24gYmV0d2VlbiB0d28gYmFsbHNcbiAgICogQHBhcmFtIHtCYWxsfSBiYWxsMSBGaXJzdCBiYWxsXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbDIgU2Vjb25kIGJhbGxcbiAgICovXG4gIHN0YXRpYyBjb2xsaWRlKGJhbGwxOiBCYWxsLCBiYWxsMjogQmFsbCkge1xuICAgIGlmICghYmFsbDEuY29sbGlkZWQoYmFsbDIpKSByZXR1cm47XG5cbiAgICBsZXQgcG9zMSA9IGJhbGwxLnBvcztcbiAgICBsZXQgcG9zMiA9IGJhbGwyLnBvcztcbiAgICBsZXQgcjEgPSBiYWxsMS5yO1xuICAgIGxldCByMiA9IGJhbGwyLnI7XG4gICAgbGV0IGsgPSAoYmFsbDEuayArIGJhbGwyLmspIC8gMjtcbiAgICBsZXQgbTEgPSBiYWxsMS5tO1xuICAgIGxldCBtMiA9IGJhbGwyLm07XG4gICAgbGV0IGRpc3QgPSBWZWMyLmRpc3QocG9zMSwgcG9zMik7XG4gICAgbGV0IGZjID0gKGJhbGwxLmZjICsgYmFsbDIuZmMpIC8gMjtcblxuICAgIGxldCBjcDEgPSBwb3MxLmNvcHk7XG4gICAgbGV0IGNwMiA9IHBvczIuY29weTtcbiAgICBsZXQgdG9vID0gcjEgKyByMiAtIGRpc3Q7XG4gICAgbGV0IGQgPSBWZWMyLnN1Yihwb3MxLCBwb3MyKTtcbiAgICBkLnNldE1hZygxKTtcbiAgICBkLm11bHQodG9vICogbTIgLyAobTEgKyBtMikpO1xuICAgIGNwMS5hZGQoZCk7XG4gICAgZC5zZXRNYWcoMSk7XG4gICAgZC5tdWx0KC10b28gKiBtMSAvIChtMSArIG0yKSk7XG4gICAgY3AyLmFkZChkKTtcbiAgICBiYWxsMS5wb3MgPSBjcDE7XG4gICAgYmFsbDIucG9zID0gY3AyO1xuXG4gICAgaWYgKFZlYzIuZG90KGQsIFZlYzIuc3ViKGJhbGwxLnZlbCwgYmFsbDIudmVsKSkgPCAwKSByZXR1cm47XG5cbiAgICBkLnNldE1hZygxKTtcbiAgICBsZXQgdmVsMVBhcnJhbGVsID0gVmVjMi5jcm9zcyhkLCBiYWxsMS52ZWwpO1xuICAgIGxldCB2ZWwyUGFycmFsZWwgPSBWZWMyLmNyb3NzKGQsIGJhbGwyLnZlbCk7XG4gICAgbGV0IHZlbDFQZXJwZW5kaWN1bGFyID0gVmVjMi5kb3QoZCwgYmFsbDEudmVsKTtcbiAgICBsZXQgdmVsMlBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChkLCBiYWxsMi52ZWwpO1xuXG4gICAgbGV0IHZrMSA9IHIxICogYmFsbDEuYW5nO1xuICAgIGxldCB2azIgPSByMiAqIGJhbGwyLmFuZztcblxuICAgIGxldCB2ZWwxSW5Qb3MgPSB2ZWwxUGFycmFsZWwgLSB2azE7XG4gICAgbGV0IHZlbDJJblBvcyA9IHZlbDJQYXJyYWxlbCArIHZrMjtcbiAgICBsZXQgdkNvbW1vbiA9ICgodmVsMUluUG9zICogYmFsbDEuYW0pICtcbiAgICAgICh2ZWwySW5Qb3MgKiBiYWxsMi5hbSkpIC8gKGJhbGwxLmFtICsgYmFsbDIuYW0pO1xuICAgIGxldCB0b3ZDb21tb24xID0gdkNvbW1vbiAtIHZlbDFJblBvcztcbiAgICBsZXQgdG92Q29tbW9uMiA9IHZDb21tb24gLSB2ZWwySW5Qb3M7XG4gICAgbGV0IG1heERlbHRhQW5nMSA9IHRvdkNvbW1vbjEgLyByMTtcbiAgICBsZXQgbWF4RGVsdGFBbmcyID0gdG92Q29tbW9uMiAvIHIyO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBuZXcgcGVycGVuZGljdWxhciB2ZWxvY2l0aWVzXG4gICAgbGV0IHUxUGVycGVuZGljdWxhciA9ICgoMSArIGspICpcbiAgICAgICgobTEgKiB2ZWwxUGVycGVuZGljdWxhciArIG0yICogdmVsMlBlcnBlbmRpY3VsYXIpIC8gKG0xICsgbTIpKSkgLVxuICAgICAgKGsgKiB2ZWwxUGVycGVuZGljdWxhcik7XG4gICAgbGV0IHUyUGVycGVuZGljdWxhciA9ICgoMSArIGspICpcbiAgICAgICgobTEgKiB2ZWwxUGVycGVuZGljdWxhciArIG0yICogdmVsMlBlcnBlbmRpY3VsYXIpIC8gKG0xICsgbTIpKSkgLVxuICAgICAgKGsgKiB2ZWwyUGVycGVuZGljdWxhcik7XG5cbiAgICBiYWxsMS52ZWwgPSBWZWMyLm11bHQoZCwgdTFQZXJwZW5kaWN1bGFyKTtcbiAgICBiYWxsMi52ZWwgPSBWZWMyLm11bHQoZCwgdTJQZXJwZW5kaWN1bGFyKTtcblxuICAgIGxldCBkZWx0YXYxUGVycGVuZGljdWxhciA9IHUxUGVycGVuZGljdWxhciAtIHZlbDFQZXJwZW5kaWN1bGFyO1xuICAgIGxldCBkZWx0YXYyUGVycGVuZGljdWxhciA9IHUyUGVycGVuZGljdWxhciAtIHZlbDJQZXJwZW5kaWN1bGFyO1xuXG4gICAgbGV0IGRlbHRhQW5nMSA9IC0oTWF0aC5zaWduKHRvdkNvbW1vbjEpKSAqXG4gICAgICAoZGVsdGF2MVBlcnBlbmRpY3VsYXIgKiBmYykgLyAoYmFsbDEuYW1jICogcjEpO1xuICAgIGxldCBkZWx0YUFuZzIgPSAoTWF0aC5zaWduKHRvdkNvbW1vbjIpKSAqXG4gICAgICAoZGVsdGF2MlBlcnBlbmRpY3VsYXIgKiBmYykgLyAoYmFsbDIuYW1jICogcjIpO1xuXG4gICAgaWYgKGRlbHRhQW5nMSAvIG1heERlbHRhQW5nMSA+IDEpIGRlbHRhQW5nMSA9IG1heERlbHRhQW5nMTtcbiAgICBpZiAoZGVsdGFBbmcyIC8gbWF4RGVsdGFBbmcyID4gMSkgZGVsdGFBbmcyID0gbWF4RGVsdGFBbmcyO1xuXG4gICAgYmFsbDEuYW5nIC09IGRlbHRhQW5nMTtcbiAgICBiYWxsMi5hbmcgKz0gZGVsdGFBbmcyO1xuXG4gICAgbGV0IHUxUGFycmFsZWwgPSB2ZWwxUGFycmFsZWw7XG4gICAgbGV0IHUyUGFycmFsZWwgPSB2ZWwyUGFycmFsZWw7XG5cbiAgICBkLnJvdGF0ZShNYXRoLlBJIC8gMik7XG4gICAgYmFsbDEudmVsLmFkZChWZWMyLm11bHQoZCwgdTFQYXJyYWxlbCkpO1xuICAgIGJhbGwyLnZlbC5hZGQoVmVjMi5tdWx0KGQsIHUyUGFycmFsZWwpKTtcbiAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgTGluZVNlZ21lbnQgZnJvbSAnLi9saW5lc2VnbWVudCc7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgYm9keVxuICogQm9kaWVzIGFyZSBtb3ZhYmxlIG9iamVjdHNcbiAqIGFuZCB0aGV5IGNvbGxpZGUgd2l0aCBvdGhlciBvYmplY3RzIChiYWxscylcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSB7XG4gICAgcG9pbnRzOiBBcnJheTxWZWMyPjtcbiAgICBsYXN0UG9zOiBWZWMyO1xuICAgIHBvczogVmVjMjtcbiAgICBmYzogbnVtYmVyO1xuICAgIHJvdGF0aW9uOiBudW1iZXI7XG4gICAgYW5nOiBudW1iZXI7XG4gICAgazogbnVtYmVyO1xuICAgIHZlbDogVmVjMjtcbiAgICBtOiBudW1iZXI7XG4gICAgYW06IG51bWJlcjtcbiAgICBsYXllcjogYW55O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGJvZHkgYW5kIGNhbGN1bGF0ZXMgaXQncyBjZW50cmUgb2YgbWFzcyAocG9zaXRpb24pXG4gICAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIFRoZSBwb2ludHMgdGhhdCBtYWtlIHVwIHRoZSBib2R5XG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWwgVGhlIHZlbG9jaXR5IG9mIHRoZSBib2R5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGsgQ29lZmZpY2llbnQgb2YgcmVzdGl0dXRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nIEFuZ3VsYXIgdmVsb2NpdHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb2ludHM6IEFycmF5PFZlYzI+LCB2ZWw6IFZlYzIsXG4gICAgICAgIGs6IG51bWJlciwgYW5nOiBudW1iZXIsIGZjOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XG5cbiAgICAgICAgbGV0IHBvbCA9IHRoaXMucG9pbnRzO1xuICAgICAgICBsZXQgc3VtMSA9IDA7XG4gICAgICAgIGxldCBzdW0yID0gMDtcbiAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pKTtcbiAgICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvbC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgIHBvbFtpXSksIFZlYzIuc3ViKHBvbFtpIC0gMV0sIHBvbFtpXSkpO1xuICAgICAgICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgfVxuICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzBdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pKTtcbiAgICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICBpZiAoc3VtMiA8IHN1bTEpIHtcbiAgICAgICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcG9sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB0ZW1wLnB1c2gocG9sW2ldKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gdGVtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUG9zQW5kTWFzcygpO1xuICAgICAgICB0aGlzLmxhc3RQb3MgPSB0aGlzLnBvcy5jb3B5O1xuICAgICAgICB0aGlzLmZjID0gMC40O1xuXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xuXG4gICAgICAgIGlmIChhbmcpIHRoaXMuYW5nID0gYW5nO1xuICAgICAgICBlbHNlIHRoaXMuYW5nID0gMDtcblxuICAgICAgICBpZiAoZmMgfHwgZmMgPT09IDApIHRoaXMuZmMgPSBmYztcblxuICAgICAgICBpZiAoaykgdGhpcy5rID0gaztcbiAgICAgICAgZWxzZSB0aGlzLmsgPSAwLjg7XG5cbiAgICAgICAgaWYgKHZlbCAhPSB1bmRlZmluZWQpIHRoaXMudmVsID0gdmVsLmNvcHk7XG4gICAgICAgIGVsc2UgdGhpcy52ZWwgPSBuZXcgVmVjMigwLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBjb3B5IG9mIHRoZSBib2R5IHRoYXQgaXMgbm90IGEgcmVmZXJlbmNlIHRvIGl0XG4gICAgICogQHJldHVybiB7Qm9keX0gVGhlIGNvcHkgb2YgdGhlIGJvZHlcbiAgICAgKi9cbiAgICBnZXQgY29weSgpOiBCb2R5IHtcbiAgICAgICAgbGV0IHBvaW50c0NvcHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcG9pbnRzQ29weS5wdXNoKG5ldyBWZWMyKHRoaXMucG9pbnRzW2ldLngsIHRoaXMucG9pbnRzW2ldLnkpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0ID0gbmV3IEJvZHkocG9pbnRzQ29weSwgdGhpcy52ZWwuY29weSxcbiAgICAgICAgICAgIHRoaXMuaywgdGhpcy5hbmcsIHRoaXMuZmMpO1xuICAgICAgICByZXQucm90YXRpb24gPSB0aGlzLnJvdGF0aW9uO1xuICAgICAgICByZXQubGFzdFBvcyA9IHRoaXMubGFzdFBvcy5jb3B5O1xuICAgICAgICByZXQucG9zID0gdGhpcy5wb3MuY29weTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vdmVzIHRoZSBib2R5IGJ5IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuICAgICAqIEl0IGhhcyB0byBtb3ZlIGFsbCB0aGUgcG9pbnRzIG9mIHRoZSBib2R5IGFuZFxuICAgICAqIGFsc28gdGhlIGNlbnRyZSBvZiBtYXNzIChwb3MpIG9mIHRoZSBib2R5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAgICovXG4gICAgbW92ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvcy54ICs9IHg7XG4gICAgICAgIHRoaXMucG9zLnkgKz0geTtcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgcC54ICs9IHg7XG4gICAgICAgICAgICBwLnkgKz0geTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdGhhdCBkb2VzIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uIGFuZFxuICAgICAqIGNvbGxpc2lvbiBiZWhhdmlvciBiZXR3ZWVuIHRoZSBib2R5IGFuZCBiYWxsXG4gICAgICogQHBhcmFtIHtCYWxsfSBiYWxsIFRoZSBiYWxsIHRvIGNvbGxpZGUgd2l0aCB0aGUgYm9keVxuICAgICAqL1xuICAgIGNvbGxpZGVXaXRoQmFsbChiYWxsOiBCYWxsKSB7XG4gICAgICAgIGxldCBoZWFkaW5nOiBudW1iZXI7XG4gICAgICAgIGxldCByZWw6IG51bWJlcjtcbiAgICAgICAgbGV0IGNwO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBwLnggLT0gYmFsbC5wb3MueDtcbiAgICAgICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICAgICAgaWYgKHAubGVuZ3RoIDw9IGJhbGwucikge1xuICAgICAgICAgICAgICAgIGhlYWRpbmcgPSBwLmhlYWRpbmcgKyBNYXRoLlBJO1xuICAgICAgICAgICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgbGV0IG1vdmUgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcbiAgICAgICAgICAgICAgICBtb3ZlLm11bHQoYmFsbC5yIC0gcmVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUobW92ZS54ICogLTEgKiBiYWxsLm0gLyAodGhpcy5tICsgYmFsbC5tKSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZS55ICogLTEgKiBiYWxsLm0gLyAodGhpcy5tICsgYmFsbC5tKSk7XG4gICAgICAgICAgICAgICAgYmFsbC5tb3ZlKG1vdmUueCAqIDEgKiB0aGlzLm0gLyAodGhpcy5tICsgYmFsbC5tKSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZS55ICogMSAqIHRoaXMubSAvICh0aGlzLm0gKyBiYWxsLm0pKTtcblxuICAgICAgICAgICAgICAgIGNwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIGEubXVsdCgtMzApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgbGV0IG5wID0gbmV3IFZlYzIodGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueSk7XG4gICAgICAgICAgICBsZXQgYnAgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFZlYzIobnAueCAtIHAueCwgbnAueSAtIHAueSk7XG4gICAgICAgICAgICBsZXQgaCA9IHNpZGUuaGVhZGluZztcbiAgICAgICAgICAgIHAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBucC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGJwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbGV0IGQgPSBicC55IC0gKChwLnkgKyBucC55KSAvIDIpO1xuICAgICAgICAgICAgaWYgKGQgPj0gLWJhbGwuciAmJiBkIDw9IGJhbGwuciAmJiBicC54ID49IG5wLnggJiYgYnAueCA8PSBwLngpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gaCAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHJlbCA9IGQ7XG5cbiAgICAgICAgICAgICAgICBsZXQgbW92ZSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIG1vdmUubXVsdChiYWxsLnIgLSByZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZShtb3ZlLnggKiAtMSAqIGJhbGwubSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnkgKiAtMSAqIGJhbGwubSAvICh0aGlzLm0gKyBiYWxsLm0pKTtcbiAgICAgICAgICAgICAgICBiYWxsLm1vdmUobW92ZS54ICogMSAqIHRoaXMubSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnkgKiAxICogdGhpcy5tIC8gKHRoaXMubSArIGJhbGwubSkpO1xuXG4gICAgICAgICAgICAgICAgY3AgPSBiYWxsLnBvcy5jb3B5O1xuICAgICAgICAgICAgICAgIGNwLmFkZChWZWMyLm11bHQoVmVjMi5mcm9tQW5nbGUoaGVhZGluZyArIE1hdGguUEkpLCBkKSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIGEubXVsdCgtMzApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaGVhZGluZyA9PT0gMCB8fCBoZWFkaW5nKSB7XG4gICAgICAgICAgICBsZXQgdjEgPSB0aGlzLnZlbC5jb3B5O1xuICAgICAgICAgICAgbGV0IHYyID0gYmFsbC52ZWwuY29weTtcbiAgICAgICAgICAgIGxldCBhbmcxID0gdGhpcy5hbmc7XG4gICAgICAgICAgICBsZXQgYW5nMiA9IGJhbGwuYW5nO1xuICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIoY3AsIHRoaXMucG9zKTtcbiAgICAgICAgICAgIGxldCByMiA9IFZlYzIuc3ViKGNwLCBiYWxsLnBvcyk7XG4gICAgICAgICAgICBsZXQgYW0xID0gdGhpcy5hbTtcbiAgICAgICAgICAgIGxldCBhbTIgPSBiYWxsLmFtO1xuICAgICAgICAgICAgbGV0IG0xID0gdGhpcy5tO1xuICAgICAgICAgICAgbGV0IG0yID0gYmFsbC5tO1xuICAgICAgICAgICAgbGV0IGsgPSAodGhpcy5rICsgYmFsbC5rKSAvIDI7XG4gICAgICAgICAgICBsZXQgZmMgPSAodGhpcy5mYyArIGJhbGwuZmMpIC8gMjtcblxuICAgICAgICAgICAgbGV0IHYxdiA9IHIxLmNvcHk7XG4gICAgICAgICAgICBsZXQgdjJ2ID0gcjIuY29weTtcbiAgICAgICAgICAgIHYxdi5yb3RhdGUoTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdjJ2LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdjF2Lm11bHQoYW5nMSk7XG4gICAgICAgICAgICB2MnYubXVsdChhbmcyKTtcbiAgICAgICAgICAgIHYxdi5hZGQodjEpO1xuICAgICAgICAgICAgdjJ2LmFkZCh2Mik7XG5cbiAgICAgICAgICAgIHYxdi5yb3RhdGUoLWhlYWRpbmcpO1xuICAgICAgICAgICAgdjJ2LnJvdGF0ZSgtaGVhZGluZyk7XG5cbiAgICAgICAgICAgIGxldCBkdjF2eCA9ICgxICsgaykgKiAobTEgKiB2MXYueCArIG0yICogdjJ2LngpIC9cbiAgICAgICAgICAgICAgICAobTEgKyBtMikgLSAoayArIDEpICogdjF2Lng7XG4gICAgICAgICAgICBsZXQgZHYydnggPSAoMSArIGspICogKG0xICogdjF2LnggKyBtMiAqIHYydi54KSAvXG4gICAgICAgICAgICAgICAgKG0xICsgbTIpIC0gKGsgKyAxKSAqIHYydi54O1xuXG4gICAgICAgICAgICBsZXQgdmsgPSAodjF2LnkgKiBtMSArIHYydi55ICogbTIpIC8gKG0xICsgbTIpO1xuXG4gICAgICAgICAgICBsZXQgZHYxdnkgPSAtTWF0aC5zaWduKHYxdi55KSAqIGZjICogZHYxdng7XG4gICAgICAgICAgICBsZXQgZHYydnkgPSAtTWF0aC5zaWduKHYydi55KSAqIGZjICogZHYydng7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmsgLSB2MXYueSkgPiBNYXRoLmFicyhkdjF2eSkpIGR2MXZ5ID0gdmsgLSB2MXYueTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2ayAtIHYydi55KSA+IE1hdGguYWJzKGR2MnZ5KSkgZHYydnkgPSB2ayAtIHYydi55O1xuXG4gICAgICAgICAgICBsZXQgZHYxdiA9IG5ldyBWZWMyKGR2MXZ4LCBkdjF2eSk7XG4gICAgICAgICAgICBsZXQgZHYydiA9IG5ldyBWZWMyKGR2MnZ4LCBkdjJ2eSk7XG4gICAgICAgICAgICBkdjF2LnJvdGF0ZShoZWFkaW5nKTtcbiAgICAgICAgICAgIGR2MnYucm90YXRlKGhlYWRpbmcpO1xuXG4gICAgICAgICAgICB2MS5hZGQoZHYxdik7XG4gICAgICAgICAgICB2Mi5hZGQoZHYydik7XG5cbiAgICAgICAgICAgIGR2MXYucm90YXRlKC1yMS5oZWFkaW5nKTtcbiAgICAgICAgICAgIGR2MnYucm90YXRlKC1yMi5oZWFkaW5nKTtcblxuICAgICAgICAgICAgbGV0IGRhbmcxID0gKGR2MXYueSAqIG0xICogcjEubGVuZ3RoKSAvXG4gICAgICAgICAgICAgICAgKGFtMSArIHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIG0xKTtcbiAgICAgICAgICAgIGxldCBkYW5nMiA9IC0oZHYydi55ICogbTIgKiByMi5sZW5ndGgpIC9cbiAgICAgICAgICAgICAgICAoYW0yICsgcjIubGVuZ3RoICogcjIubGVuZ3RoICogbTIpO1xuXG4gICAgICAgICAgICBhbmcxICs9IGRhbmcxO1xuICAgICAgICAgICAgYW5nMiArPSBkYW5nMjtcblxuICAgICAgICAgICAgbGV0IHZwMSA9IFZlYzIuZnJvbUFuZ2xlKHIxLmhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2cDEubXVsdChyMS5sZW5ndGggKiBkYW5nMSk7XG4gICAgICAgICAgICBsZXQgdnAyID0gVmVjMi5mcm9tQW5nbGUocjIuaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHZwMi5tdWx0KHIyLmxlbmd0aCAqIGRhbmcyKTtcbiAgICAgICAgICAgIHYyLnN1Yih2cDIpO1xuICAgICAgICAgICAgdjEuYWRkKHZwMSk7XG5cbiAgICAgICAgICAgIHRoaXMudmVsID0gdjE7XG4gICAgICAgICAgICBiYWxsLnZlbCA9IHYyO1xuXG4gICAgICAgICAgICB0aGlzLmFuZyA9IGFuZzE7XG4gICAgICAgICAgICBiYWxsLmFuZyA9IGFuZzI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtYXNzLCBtb21lbnQgb2QgaW50ZXJ0aWEgYW5kXG4gICAgICogdGhlIGNlbnRyZSBvZiBtYXNzIG9mIHRoZSBib2R5XG4gICAgICovXG4gICAgY2FsY3VsYXRlUG9zQW5kTWFzcygpIHtcbiAgICAgICAgbGV0IHBvbGlnb25zOiBBcnJheTxBcnJheTxWZWMyPj4gPSBbXTtcbiAgICAgICAgcG9saWdvbnMucHVzaChbXSk7XG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHBvbGlnb25zWzBdLnB1c2gobmV3IFZlYzIocC54LCBwLnkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNDb25jYXZlKSB7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlcyA9IChhcnI6IEFycmF5PG51bWJlcj4sIGl0ZW06IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0gPT09IGl0ZW0pIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgaW50ZXJzZWN0V2l0aFBvbGlnb24gPSBmdW5jdGlvbihzZWdtZW50OiBMaW5lU2VnbWVudCxcbiAgICAgICAgICAgICAgICBwb2w6IEFycmF5PFZlYzI+LCBleGNlcHRpb25zOiBBcnJheTxudW1iZXI+KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2wubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmNsdWRlcyhleGNlcHRpb25zLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpZGUgPSBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2ldLngsIHBvbFtpXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKExpbmVTZWdtZW50LmludGVyc2VjdChzZWdtZW50LCBzaWRlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGNoZWNrQWxsUG9saWdvbnM6IHdoaWxlIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2xpZ29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcG9sID0gcG9saWdvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coYSwgYik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtqXS54LCBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGVIZWFkaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3IFZlYzIobmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIShhLmhlYWRpbmcgPiBiLmhlYWRpbmcgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RXaXRoUG9saWdvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtqICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqICUgcG9sLmxlbmd0aF0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbCwgWyhwb2wubGVuZ3RoIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGsgLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wxID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGo7IGwgPD0gazsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMS5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGs7IGwgPD0gaiArIHBvbC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDIucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zW2ldID0gcG9sMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2gocG9sMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBjaGVja0FsbFBvbGlnb25zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgcG9sLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsoaiArIDEpICUgcG9sLmxlbmd0aF0sIHBvbFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IFZlYzIuc3ViKHBvbFtqIC0gMV0sIHBvbFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKGEsIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgayA9IGogKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghKGEuaGVhZGluZyA+IGIuaGVhZGluZyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgMiAqIE1hdGguUEkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RXaXRoUG9saWdvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wsIFsoaiAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGsgLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wxID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gajsgbCA8PSBrOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMS5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDIucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2gocG9sMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgY2hlY2tBbGxQb2xpZ29ucztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSBwb2xpZ29ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgbGV0IHBvbCA9IHBvbGlnb25zW2ldO1xuICAgICAgICAgICAgd2hpbGUgKHBvbC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChbcG9sWzBdLCBwb2xbMV0sIHBvbFsyXV0pO1xuICAgICAgICAgICAgICAgIHBvbC5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbVN1bSA9IDA7XG4gICAgICAgIGxldCBhbVN1bSA9IDA7XG4gICAgICAgIGxldCBwU3VtID0gbmV3IFZlYzIoMCwgMCk7XG4gICAgICAgIHBvbGlnb25zLmZvckVhY2goKHBvbCkgPT4ge1xuICAgICAgICAgICAgbGV0IGEgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzBdLnggLSBwb2xbMV0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFswXS55IC0gcG9sWzFdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBiID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsxXS54IC0gcG9sWzJdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMV0ueSAtIHBvbFsyXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYyA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMl0ueCAtIHBvbFswXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzJdLnkgLSBwb2xbMF0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IHMgPSAoYSArIGIgKyBjKSAvIDI7XG4gICAgICAgICAgICBsZXQgbSA9IE1hdGguc3FydChzICogKHMgLSBhKSAqIChzIC0gYikgKiAocyAtIGMpKTtcbiAgICAgICAgICAgIG1TdW0gKz0gbTtcbiAgICAgICAgICAgIHBTdW0ueCArPSBtICogKHBvbFswXS54ICsgcG9sWzFdLnggKyBwb2xbMl0ueCkgLyAzO1xuICAgICAgICAgICAgcFN1bS55ICs9IG0gKiAocG9sWzBdLnkgKyBwb2xbMV0ueSArIHBvbFsyXS55KSAvIDM7XG4gICAgICAgIH0pO1xuICAgICAgICBwU3VtLmRpdihtU3VtKTtcbiAgICAgICAgdGhpcy5wb3MgPSBwU3VtO1xuICAgICAgICB0aGlzLm0gPSBtU3VtO1xuXG4gICAgICAgIC8vIGNhbGN1bGF0aW5nIHRoZSBtb21lbnQgb2YgaW5lcnRpYSBmaW5hbGx5XG4gICAgICAgIGZvciAobGV0IHBvbCBvZiBwb2xpZ29ucykge1xuICAgICAgICAgICAgbGV0IGEgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzBdLnggLSBwb2xbMV0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFswXS55IC0gcG9sWzFdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBiID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsxXS54IC0gcG9sWzJdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMV0ueSAtIHBvbFsyXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYyA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMl0ueCAtIHBvbFswXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzJdLnkgLSBwb2xbMF0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IHcgPSBNYXRoLm1heChhLCBiLCBjKTtcbiAgICAgICAgICAgIGxldCBzID0gKGEgKyBiICsgYykgLyAyO1xuICAgICAgICAgICAgbGV0IG0gPSBNYXRoLnNxcnQocyAqIChzIC0gYSkgKiAocyAtIGIpICogKHMgLSBjKSk7XG4gICAgICAgICAgICBsZXQgaCA9IDIgKiBtIC8gdztcbiAgICAgICAgICAgIGxldCB3cGFydGlhbCA9IE1hdGguc3FydChNYXRoLm1pbihhLCBjLCBiKSAqKiAyIC0gaCAqIGgpO1xuICAgICAgICAgICAgbGV0IGFtID0gaCAqIHcgKiAoaCAqIGggKyB3ICogdykgLyAyNDtcbiAgICAgICAgICAgIGxldCBkID0gTWF0aC5zcXJ0KGggKiBoIC8gMzYgK1xuICAgICAgICAgICAgICAgIChNYXRoLmFicyh3cGFydGlhbCAtIHcgLyAyKSAvIDMpICoqIDIpO1xuICAgICAgICAgICAgYW0gLT0gZCAqIGQgKiBtO1xuICAgICAgICAgICAgYW0gKz0gbmV3IFZlYzIoKHBvbFswXS54ICsgcG9sWzFdLnggKyBwb2xbMl0ueCkgLyAzLFxuICAgICAgICAgICAgICAgIChwb2xbMF0ueSArIHBvbFsxXS55ICsgcG9sWzJdLnkpIC8gMykuZGlzdCh0aGlzLnBvcykgKiogMiAqIG07XG4gICAgICAgICAgICBhbVN1bSArPSBhbTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFtID0gYW1TdW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgYm9keSBhcm91bmQgaXQncyBjZW50cmUgb2YgbWFzcyBieSBhIGdpdmVuIGFuZ2VcbiAgICAgKiBIYXMgdG8gZG8gdGhlIHRyYW5zZm9ybWF0aW9uIGZvciBhbGwgdGhlIHBvaW50c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSBSb3RhdGlvbiBhbmdsZVxuICAgICAqL1xuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGxldCBwb2ludCA9IG5ldyBWZWMyKHAueCwgcC55KTtcbiAgICAgICAgICAgIHBvaW50LnN1Yih0aGlzLnBvcyk7XG4gICAgICAgICAgICBwb2ludC5yb3RhdGUoYW5nbGUpO1xuICAgICAgICAgICAgcG9pbnQuYWRkKHRoaXMucG9zKTtcbiAgICAgICAgICAgIHAueCA9IHBvaW50Lng7XG4gICAgICAgICAgICBwLnkgPSBwb2ludC55O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiArPSBhbmdsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBvdXQgaWYgdGhlIGJvZHkgaXMgY29uY2F2ZSBvciBub3RcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSBib2R5IGlzIGNvbmNhdmVcbiAgICAgKi9cbiAgICBnZXQgaXNDb25jYXZlKCkge1xuICAgICAgICBsZXQgcG9sID0gdGhpcy5wb2ludHM7XG4gICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvbC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgIHBvbFtpXSksIFZlYzIuc3ViKHBvbFtpIC0gMV0sIHBvbFtpXSkpO1xuICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDJdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyB0aGUgY29sbGlzaW9uIGFsZ29yaXRobSBiZXR3ZWVuIHR3byBib2RpZXNcbiAgICAgKiBAcGFyYW0ge0JvZHl9IGIxIEZpcnN0IGJvZHlcbiAgICAgKiBAcGFyYW0ge0JvZHl9IGIyIFNlY29uZCBib2R5XG4gICAgICovXG4gICAgc3RhdGljIGNvbGxpZGUoYjE6IEJvZHksIGIyOiBCb2R5KSB7XG4gICAgICAgIGxldCBtYXRjaGVzID0gMDtcbiAgICAgICAgbGV0IGhlYWRpbmcgPSAwO1xuICAgICAgICBsZXQgY3AgPSBuZXcgVmVjMigwLCAwKTtcbiAgICAgICAgbGV0IGNwczogQXJyYXk8VmVjMj4gPSBbXTtcbiAgICAgICAgbGV0IGludGVyc2VjdCA9IGZhbHNlO1xuICAgICAgICBiMS5wb2ludHMuZm9yRWFjaCgocCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2lkZTEgPSBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocC54LCBwLnkpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICBiMS5wb2ludHNbKGlkeCArIDEpICUgYjEucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgYjEucG9pbnRzWyhpZHggKyAxKSAlIGIxLnBvaW50cy5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgIGIyLnBvaW50cy5mb3JFYWNoKChwcCwgaWR4eCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaWRlMiA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwcC54LCBwcC55KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICBiMi5wb2ludHNbKGlkeHggKyAxKSAlIGIyLnBvaW50cy5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICBiMi5wb2ludHNbKGlkeHggKyAxKSAlIGIyLnBvaW50cy5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICBsZXQgc2VjdCA9IExpbmVTZWdtZW50LmludGVyc2VjdChzaWRlMSwgc2lkZTIpO1xuICAgICAgICAgICAgICAgIGlmIChzZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMrKztcbiAgICAgICAgICAgICAgICAgICAgY3AuYWRkKHNlY3QpO1xuICAgICAgICAgICAgICAgICAgICBjcHMucHVzaChzZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFpbnRlcnNlY3QpIHJldHVybjtcbiAgICAgICAgY3AuZGl2KG1hdGNoZXMpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5mbG9vcihtYXRjaGVzIC8gMik7IGkrKykge1xuICAgICAgICAgICAgaGVhZGluZyArPSBWZWMyLnN1YihjcHNbMiAqIGkgKyAxXSwgY3BzWzIgKiBpXSkuaGVhZGluZztcbiAgICAgICAgfVxuICAgICAgICBoZWFkaW5nIC89IG1hdGNoZXMgLyAyO1xuICAgICAgICBoZWFkaW5nICs9IE1hdGguUEkgLyAyO1xuXG4gICAgICAgIGxldCBhID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG5cbiAgICAgICAgbGV0IG1vdmUxTWluID0gMDtcbiAgICAgICAgbGV0IG1vdmUxTWF4ID0gMDtcbiAgICAgICAgbGV0IG1vdmUyTWluID0gMDtcbiAgICAgICAgbGV0IG1vdmUyTWF4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgYjEucG9pbnRzKSB7XG4gICAgICAgICAgICBtb3ZlMU1pbiA9IE1hdGgubWluKFZlYzIuZG90KGEsXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIobmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSksIGNwKSksIG1vdmUxTWluKTtcbiAgICAgICAgICAgIG1vdmUxTWF4ID0gTWF0aC5tYXgoVmVjMi5kb3QoYSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSwgbW92ZTFNYXgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHBvaW50IG9mIGIyLnBvaW50cykge1xuICAgICAgICAgICAgbW92ZTJNaW4gPSBNYXRoLm1pbihWZWMyLmRvdChhLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLCBtb3ZlMk1pbik7XG4gICAgICAgICAgICBtb3ZlMk1heCA9IE1hdGgubWF4KFZlYzIuZG90KGEsXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIobmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSksIGNwKSksIG1vdmUyTWF4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTWF0aC5hYnMobW92ZTFNaW4gLSBtb3ZlMk1heCkgPCBNYXRoLmFicyhtb3ZlMk1pbiAtIG1vdmUxTWF4KSkge1xuICAgICAgICAgICAgYjEubW92ZSgtYS54ICogbW92ZTFNaW4sIC1hLnkgKiBtb3ZlMU1pbik7XG4gICAgICAgICAgICBiMi5tb3ZlKC1hLnggKiBtb3ZlMk1heCwgLWEueSAqIG1vdmUyTWF4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGIxLm1vdmUoLWEueCAqIG1vdmUxTWF4LCAtYS55ICogbW92ZTFNYXgpO1xuICAgICAgICAgICAgYjIubW92ZSgtYS54ICogbW92ZTJNaW4sIC1hLnkgKiBtb3ZlMk1pbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgayA9IChiMS5rICsgYjIuaykgLyAyO1xuICAgICAgICAvLyBsZXQgdmVsMXBhcnJhbGVsID0gVmVjMi5jcm9zcyhiMS52ZWwsIGEpO1xuICAgICAgICBsZXQgdmVsMXBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChiMS52ZWwsIGEpO1xuICAgICAgICAvLyBsZXQgdmVsMnBhcnJhbGVsID0gVmVjMi5jcm9zcyhiMi52ZWwsIGEpO1xuICAgICAgICBsZXQgdmVsMnBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChiMi52ZWwsIGEpO1xuXG4gICAgICAgIGxldCBuZXdWZWwxUGVycGVuZGljdWxhciA9ICgxICsgaykgKiAoKGIxLm0gKiB2ZWwxcGVycGVuZGljdWxhcikgK1xuICAgICAgICAgICAgKGIyLm0gKiB2ZWwycGVycGVuZGljdWxhcikpIC8gKGIxLm0gKyBiMi5tKSAtXG4gICAgICAgICAgICAoayAqIHZlbDFwZXJwZW5kaWN1bGFyKTtcbiAgICAgICAgbGV0IG5ld1ZlbDJQZXJwZW5kaWN1bGFyID0gKDEgKyBrKSAqICgoYjEubSAqIHZlbDFwZXJwZW5kaWN1bGFyKSArXG4gICAgICAgICAgICAoYjIubSAqIHZlbDJwZXJwZW5kaWN1bGFyKSkgLyAoYjEubSArIGIyLm0pIC1cbiAgICAgICAgICAgIChrICogdmVsMnBlcnBlbmRpY3VsYXIpO1xuXG4gICAgICAgIGIxLnZlbC5hZGQoVmVjMi5tdWx0KGEuY29weSwgbmV3VmVsMVBlcnBlbmRpY3VsYXIgLSB2ZWwxcGVycGVuZGljdWxhcikpO1xuICAgICAgICBiMi52ZWwuYWRkKFZlYzIubXVsdChhLmNvcHksIG5ld1ZlbDJQZXJwZW5kaWN1bGFyIC0gdmVsMnBlcnBlbmRpY3VsYXIpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNlZ21lbnQgb2YgYSBsaW5lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVTZWdtZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBhIFN0YXJ0aW5nIHBvaW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBiIEVuZGluZyBwb2ludFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhOiBWZWMyLCBwdWJsaWMgYjogVmVjMikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50XG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbGVuZ3RoXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVmVjMi5kaXN0KHRoaXMuYSwgdGhpcy5iKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmQgdGhlIGxpbmUgc2VnbWVudFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcCBUaGUgcG9pbnQgYXMgYSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkaXN0YW5jZVxuICAgICAqL1xuICAgIGRpc3RGcm9tUG9pbnQocDogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBlID0gVmVjMi5zdWIodGhpcy5hLCB0aGlzLmIpO1xuICAgICAgICBsZXQgQSA9IFZlYzIuc3ViKHAsIHRoaXMuYik7XG4gICAgICAgIGxldCBCID0gVmVjMi5zdWIocCwgdGhpcy5hKTtcbiAgICAgICAgbGV0IGEgPSBBLmxlbmd0aDtcbiAgICAgICAgbGV0IGIgPSBCLmxlbmd0aDtcbiAgICAgICAgbGV0IGMgPSBlLmxlbmd0aDtcbiAgICAgICAgaWYgKGMgPT09IDApIHJldHVybiBhO1xuICAgICAgICBsZXQgZ2FtbWEgPSBWZWMyLmFuZ2xlKEEsIEIpO1xuICAgICAgICBsZXQgYmV0aGEgPSBWZWMyLmFuZ2xlKEEsIGUpO1xuICAgICAgICBsZXQgYWxwaGEgPSBNYXRoLlBJIC0gZ2FtbWEgLSBiZXRoYTtcbiAgICAgICAgbGV0IGFyZWEgPSBNYXRoLnNpbihhbHBoYSkgKiBiICogYyAvIDI7XG4gICAgICAgIGxldCBtID0gMiAqIGFyZWEgLyBjO1xuICAgICAgICBpZiAoYWxwaGEgPiBNYXRoLlBJIC8gMikgcmV0dXJuIGI7XG4gICAgICAgIGlmIChiZXRoYSA+IE1hdGguUEkgLyAyKSByZXR1cm4gYTtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGlmIHRoZXkgaW50ZXJzZWN0IG9yIG5vdFxuICAgICAqIElmIHRoZXkgaW50ZXJzZWN0IGl0IHJldHVybnMgdGhlIGludGVyc2VjdGlvbiBwb2ludFxuICAgICAqIElmIHRoZXkgbm90IGl0IHJldHVybnMgdW5kZWZpbmVkXG4gICAgICogQHBhcmFtIHtMaW5lU2VnbWVudH0gc2VnbWVudDEgQSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtMaW5lU2VnbWVudH0gc2VnbWVudDIgT3RoZXIgc2VnbWVudFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IEludGVyc2V0aW9uIHBvaW50XG4gICAgICovXG4gICAgc3RhdGljIGludGVyc2VjdChzZWdtZW50MTogTGluZVNlZ21lbnQsIHNlZ21lbnQyOiBMaW5lU2VnbWVudCk6IFZlYzIge1xuICAgICAgICBsZXQgdjEgPSBWZWMyLnN1YihzZWdtZW50MS5iLCBzZWdtZW50MS5hKTtcbiAgICAgICAgbGV0IGExID0gdjEueSAvIHYxLng7XG4gICAgICAgIGxldCBjMSA9IHNlZ21lbnQxLmIueSAtIChzZWdtZW50MS5iLnggKiBhMSk7XG5cbiAgICAgICAgbGV0IHYyID0gVmVjMi5zdWIoc2VnbWVudDIuYiwgc2VnbWVudDIuYSk7XG4gICAgICAgIGxldCBhMiA9IHYyLnkgLyB2Mi54O1xuICAgICAgICBsZXQgYzIgPSBzZWdtZW50Mi5iLnkgLSAoc2VnbWVudDIuYi54ICogYTIpO1xuXG4gICAgICAgIGlmICh2MS54ID09PSAwICYmIHYyLnggIT09IDApIHtcbiAgICAgICAgICAgIGlmICgoc2VnbWVudDEuYS54ID49IHNlZ21lbnQyLmEueCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQxLmEueCA8PSBzZWdtZW50Mi5iLngpIHx8XG4gICAgICAgICAgICAgICAgKHNlZ21lbnQxLmEueCA8PSBzZWdtZW50Mi5hLnggJiZcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudDEuYS54ID49IHNlZ21lbnQyLmIueCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgaCA9IGEyICogc2VnbWVudDEuYS54ICsgYzI7XG4gICAgICAgICAgICAgICAgaWYgKChoID4gc2VnbWVudDEuYS55ICYmIGggPCBzZWdtZW50MS5iLnkpIHx8XG4gICAgICAgICAgICAgICAgICAgIChoIDwgc2VnbWVudDEuYS55ICYmIGggPiBzZWdtZW50MS5iLnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMihzZWdtZW50MS5hLngsIGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYyLnggPT09IDAgJiYgdjEueCAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKChzZWdtZW50Mi5hLnggPj0gc2VnbWVudDEuYS54ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudDIuYS54IDw9IHNlZ21lbnQxLmIueCkgfHxcbiAgICAgICAgICAgICAgICAoc2VnbWVudDIuYS54IDw9IHNlZ21lbnQxLmEueCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50Mi5hLnggPj0gc2VnbWVudDEuYi54KSkge1xuICAgICAgICAgICAgICAgIGxldCBoID0gYTEgKiBzZWdtZW50Mi5hLnggKyBjMTtcbiAgICAgICAgICAgICAgICBpZiAoKGggPiBzZWdtZW50Mi5hLnkgJiYgaCA8IHNlZ21lbnQyLmIueSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGggPCBzZWdtZW50Mi5hLnkgJiYgaCA+IHNlZ21lbnQyLmIueSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQyLmEueCwgaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodjEueCA9PT0gMCAmJiB2Mi54ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoc2VnbWVudDEuYS54ID09PSBzZWdtZW50Mi5hLngpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwxO1xuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50MS5hLnkgPCBzZWdtZW50MS5iLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwxID0gW3NlZ21lbnQxLmEueSwgc2VnbWVudDEuYi55XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYi55LCBzZWdtZW50MS5hLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwyO1xuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50Mi5hLnkgPCBzZWdtZW50Mi5iLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwyID0gW3NlZ21lbnQyLmEueSwgc2VnbWVudDIuYi55XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYi55LCBzZWdtZW50Mi5hLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSBbKGludGVydmFsMVswXSA+IGludGVydmFsMlswXSkgP1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDFbMF0gOiBpbnRlcnZhbDJbMF0sXG4gICAgICAgICAgICAgICAgKGludGVydmFsMVsxXSA8IGludGVydmFsMlsxXSkgP1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDFbMV0gOiBpbnRlcnZhbDJbMV0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWxbMF0gPD0gaW50ZXJ2YWxbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQxLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZXJ2YWwxO1xuICAgICAgICBpZiAoc2VnbWVudDEuYS54IDwgc2VnbWVudDEuYi54KSB7XG4gICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYS54LCBzZWdtZW50MS5iLnhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWwxID0gW3NlZ21lbnQxLmIueCwgc2VnbWVudDEuYS54XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwyO1xuICAgICAgICBpZiAoc2VnbWVudDIuYS54IDwgc2VnbWVudDIuYi54KSB7XG4gICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYS54LCBzZWdtZW50Mi5iLnhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWwyID0gW3NlZ21lbnQyLmIueCwgc2VnbWVudDIuYS54XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBbKGludGVydmFsMVswXSA+IGludGVydmFsMlswXSkgP1xuICAgICAgICAgICAgaW50ZXJ2YWwxWzBdIDogaW50ZXJ2YWwyWzBdLFxuICAgICAgICAoaW50ZXJ2YWwxWzFdIDwgaW50ZXJ2YWwyWzFdKSA/XG4gICAgICAgICAgICBpbnRlcnZhbDFbMV0gOiBpbnRlcnZhbDJbMV0sXG4gICAgICAgIF07XG4gICAgICAgIC8vIElmIHRoZXkgYXJlIHBhcnJhbGVsIHRoZSBvbmx5IHRpbWUgdGhleSBpbnRlcnNlY3QgaXMgd2hlbiBjMSA9PSBjMi5cbiAgICAgICAgaWYgKChhMSA9PT0gYTIpICYmIGMxID09PSBjMiAmJiBpbnRlcnZhbFswXSA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIsXG4gICAgICAgICAgICAgICAgKChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIpICogYTEgKyBjMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHggPSAoYzIgLSBjMSkgLyAoYTEgLSBhMik7XG4gICAgICAgIGlmICh4ID49IGludGVydmFsWzBdICYmIHggPD0gaW50ZXJ2YWxbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMih4LCB4ICogYTEgKyBjMSk7XG4gICAgICAgIH0gZWxzZSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuaW1wb3J0IFdhbGwgZnJvbSAnLi93YWxsJztcbmltcG9ydCBMaW5lU2VnbWVudCBmcm9tICcuL2xpbmVzZWdtZW50JztcbmltcG9ydCBTdGljayBmcm9tICcuL3N0aWNrJztcbmltcG9ydCBTcHJpbmcgZnJvbSAnLi9zcHJpbmcnO1xuaW1wb3J0IFNvZnRCYWxsIGZyb20gJy4vc29mdGJhbGwnO1xuaW1wb3J0IEJvZHkgZnJvbSAnLi9ib2R5JztcblxuLyoqXG4gKiBDbGFzcyB0aGF0IGNyZWF0ZXMgYSBuZXcgd29ybGQgYmEgdGhlIHBoeXNpY3MgZW5naW5lXG4gKi9cbmNsYXNzIFBoeXNpY3Mge1xuICBiYWxsczogQXJyYXk8QmFsbD47XG4gIGJvZGllczogQXJyYXk8Qm9keT47XG4gIGZpeGVkQmFsbHM6IEFycmF5PHt4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCB9PlxuICBzb2Z0QmFsbHM6IEFycmF5PFNvZnRCYWxsPjtcbiAgd2FsbHM6IEFycmF5PFdhbGw+O1xuICBib3VuZHM6IEFycmF5PG51bWJlcj47XG4gIHNwcmluZ3M6IEFycmF5PFNwcmluZz47XG4gIGFpckZyaWN0aW9uOiBudW1iZXI7XG4gIGdyYXZpdHk6IFZlYzI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgaW5pdGFsaXplIGEgbmV3IHdvcmxkXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJhbGxzID0gW107XG4gICAgdGhpcy5ib2RpZXMgPSBbXTtcbiAgICB0aGlzLmZpeGVkQmFsbHMgPSBbXTtcbiAgICB0aGlzLnNvZnRCYWxscyA9IFtdO1xuXG4gICAgdGhpcy53YWxscyA9IFtdO1xuXG4gICAgdGhpcy5ib3VuZHMgPSBbXTtcblxuICAgIHRoaXMuc3ByaW5ncyA9IFtdO1xuXG4gICAgLy8gQWlyIGZyaWN0aW9uIGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAvLyAwIC0gbm8gbW92ZW1lbnRcbiAgICAvLyAxIC0gbm8gZnJpY3Rpb25cbiAgICB0aGlzLmFpckZyaWN0aW9uID0gMTtcblxuICAgIHRoaXMuZ3Jhdml0eSA9IG5ldyBWZWMyKDAsIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdvcmxkIGJ5IGEgZ2l2ZW4gYW1vdW50IG9mIHRpbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHQgRWxhcHNlZCB0aW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcHJlY2lzZSBJZiB0aGlzIGlzIHRydWUsXG4gICAqIHRoZW4gdGhlIHNpbXVsYXRpb24gaXMgZ29pbmcgdG8gYmUgbW9yZSBwcmVjaXNlXG4gICAqL1xuICB1cGRhdGUodDogbnVtYmVyLCBwcmVjaXNlOiBib29sZWFuKSB7XG4gICAgLy8gRG8gdGhlIHNpbXVsYXRpb24gb24gdGhlIHJldmVyc2VkIHN5c3RlbVxuICAgIC8vIGlmIHRoZSBzaW11bGF0aW9uIGlzIGluIHByZWNpc2UgbW9kZVxuICAgIGxldCBjbG9uZWRTeXN0ZW06IFBoeXNpY3MgPSBwcmVjaXNlID8gdGhpcy5jb3B5IDogbmV3IFBoeXNpY3MoKTtcbiAgICBpZiAocHJlY2lzZSkge1xuICAgICAgY2xvbmVkU3lzdGVtLmJvZGllcy5yZXZlcnNlKCk7XG4gICAgICBjbG9uZWRTeXN0ZW0uYmFsbHMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLnVwZGF0ZSh0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8gQXQgZmlyc3QgbW92ZSBvYmpldHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmFsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIE1vdmVcbiAgICAgIHRoaXMuYmFsbHNbaV0ubGFzdFBvcyA9IHRoaXMuYmFsbHNbaV0ucG9zLmNvcHk7XG4gICAgICB0aGlzLmJhbGxzW2ldLnBvcy5hZGQoVmVjMi5tdWx0KHRoaXMuYmFsbHNbaV0udmVsLCB0KSk7XG5cbiAgICAgIC8vIEFuZ3VsYXIgdmVsb2NpdHlcbiAgICAgIHRoaXMuYmFsbHNbaV0ucm90YXRpb24gKz0gdGhpcy5iYWxsc1tpXS5hbmcgKiB0O1xuICAgICAgdGhpcy5iYWxsc1tpXS5yb3RhdGlvbiAlPSAoTWF0aC5QSSAqIDIpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJvZGllc1tpXS5sYXN0UG9zID0gdGhpcy5ib2RpZXNbaV0ucG9zLmNvcHk7XG4gICAgICB0aGlzLmJvZGllc1tpXS5tb3ZlKHRoaXMuYm9kaWVzW2ldLnZlbC54ICogdCwgdGhpcy5ib2RpZXNbaV0udmVsLnkgKiB0KTtcbiAgICAgIHRoaXMuYm9kaWVzW2ldLnJvdGF0ZSh0aGlzLmJvZGllc1tpXS5hbmcgKiB0KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgc3ByaW5ncyBtdWx0aXBsZSB0aW1lc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuc3ByaW5ncykge1xuICAgICAgICBlbGVtZW50LnVwZGF0ZSh0IC8gMyAvIDIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5iYWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gQXBwbHkgZ3Jhdml0eVxuICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xuICAgICAgICB0aGlzLmJhbGxzW2ldLnZlbC5hZGQoXG4gICAgICAgICAgbmV3IFZlYzIodGhpcy5ncmF2aXR5LnggKiB0LCB0aGlzLmdyYXZpdHkueSAqIHQpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ29sbGlzaW9uXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLmJhbGxzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmJhbGxzW2ldLmxheWVyICE9IHRoaXMuYmFsbHNbal0ubGF5ZXIgfHxcbiAgICAgICAgICAoIXRoaXMuYmFsbHNbaV0ubGF5ZXIgJiYgIXRoaXMuYmFsbHNbal0ubGF5ZXIpKSB7XG4gICAgICAgICAgQmFsbC5jb2xsaWRlKHRoaXMuYmFsbHNbaV0sIHRoaXMuYmFsbHNbal0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvbiB3aXRoIHdhbGxzXG4gICAgICBmb3IgKGxldCB3YWxsIG9mIHRoaXMud2FsbHMpIHtcbiAgICAgICAgd2FsbC5jb2xsaWRlV2l0aEJhbGwodGhpcy5iYWxsc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvbiB3aXRoIGZpeGVkIGJhbGxzXG4gICAgICBmb3IgKGxldCBiIG9mIHRoaXMuZml4ZWRCYWxscykge1xuICAgICAgICBsZXQgYmFsbCA9IHRoaXMuYmFsbHNbaV07XG5cbiAgICAgICAgbGV0IGhlYWRpbmc7XG4gICAgICAgIGxldCByZWwgPSAwO1xuICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKGIueCwgYi55KTtcbiAgICAgICAgcC54IC09IGJhbGwucG9zLng7XG4gICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICBwLm11bHQoLTEpO1xuICAgICAgICBpZiAocC5sZW5ndGggPD0gYmFsbC5yICsgYi5yKSB7XG4gICAgICAgICAgaGVhZGluZyA9IHAuaGVhZGluZztcbiAgICAgICAgICByZWwgPSBwLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoZWFkaW5nID09PSAwIHx8IGhlYWRpbmcpIHtcbiAgICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgbGV0IHZlbCA9IG5ldyBWZWMyKGJhbGwudmVsLngsIGJhbGwudmVsLnkpO1xuICAgICAgICAgIHBvcy5yb3RhdGUoLWhlYWRpbmcgKyBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgdmVsLnJvdGF0ZSgtaGVhZGluZyArIE1hdGguUEkgLyAyKTtcblxuICAgICAgICAgIHZlbC55ICo9IC1iYWxsLms7XG4gICAgICAgICAgcG9zLnkgKz0gYmFsbC5yICsgYi5yIC0gcmVsO1xuICAgICAgICAgIGxldCBkdnkgPSB2ZWwueSAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICBsZXQgZHZ4ID0gTWF0aC5hYnMoZHZ5KSAqIGJhbGwuZmMgKlxuICAgICAgICAgICAgTWF0aC5zaWduKHZlbC54IC0gYmFsbC5hbmcgKiBiYWxsLnIpICogLTE7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKGR2eCkgPiBNYXRoLmFicyh2ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSkge1xuICAgICAgICAgICAgZHZ4ID0gLXZlbC54ICsgYmFsbC5hbmcgKiBiYWxsLnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZlbC54ICs9IGR2eCAtIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgYmFsbC5hbmcgLT0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgICgoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSkgKiBiYWxsLnIpO1xuICAgICAgICAgIHBvcy5yb3RhdGUoaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICB2ZWwucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgYmFsbC5wb3MueCA9IHBvcy54O1xuICAgICAgICAgIGJhbGwucG9zLnkgPSBwb3MueTtcbiAgICAgICAgICBiYWxsLnZlbC54ID0gdmVsLng7XG4gICAgICAgICAgYmFsbC52ZWwueSA9IHZlbC55O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJvdW5jZSBvZmYgdGhlIGVkZ2VzXG4gICAgICBpZiAodGhpcy5ib3VuZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAodGhpcy5iYWxsc1tpXS5wb3MueCAtIHRoaXMuYmFsbHNbaV0uciA8IHRoaXMuYm91bmRzWzBdKSB7XG4gICAgICAgICAgbGV0IGJhbGwgPSB0aGlzLmJhbGxzW2ldO1xuICAgICAgICAgIGJhbGwudmVsLnggKj0gLWJhbGwuaztcbiAgICAgICAgICBiYWxsLnBvcy54ID0gdGhpcy5ib3VuZHNbMV0gKyBiYWxsLnI7XG4gICAgICAgICAgbGV0IGR2eCA9IGJhbGwudmVsLnggKiAoMSArICgxIC8gYmFsbC5rKSk7XG4gICAgICAgICAgbGV0IGR2eSA9IE1hdGguYWJzKGR2eCkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgIE1hdGguc2lnbihiYWxsLnZlbC55ICsgYmFsbC5hbmcgKiBiYWxsLnIpICogLTE7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKGR2eSkgPiBNYXRoLmFicyhiYWxsLnZlbC55ICsgYmFsbC5hbmcgKiBiYWxsLnIpKSB7XG4gICAgICAgICAgICBkdnkgPSAtYmFsbC52ZWwueSAtIGJhbGwuYW5nICogYmFsbC5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBiYWxsLnZlbC55ICs9IGR2eSAtIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eSAvXG4gICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgYmFsbC5hbmcgKz0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ5IC9cbiAgICAgICAgICAgICgoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSkgKiBiYWxsLnIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmFsbHNbaV0ucG9zLnggKyB0aGlzLmJhbGxzW2ldLnIgPlxuICAgICAgICAgICh0aGlzLmJvdW5kc1swXSArIHRoaXMuYm91bmRzWzJdKSkge1xuICAgICAgICAgIGxldCBiYWxsID0gdGhpcy5iYWxsc1tpXTtcbiAgICAgICAgICBiYWxsLnZlbC54ICo9IC1iYWxsLms7XG4gICAgICAgICAgYmFsbC5wb3MueCA9ICh0aGlzLmJvdW5kc1swXSArIHRoaXMuYm91bmRzWzJdKSAtIGJhbGwucjtcbiAgICAgICAgICBsZXQgZHZ4ID0gYmFsbC52ZWwueCAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICBsZXQgZHZ5ID0gTWF0aC5hYnMoZHZ4KSAqIGJhbGwuZmMgKlxuICAgICAgICAgICAgTWF0aC5zaWduKGJhbGwudmVsLnkgLSBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoZHZ5KSA+IE1hdGguYWJzKGJhbGwudmVsLnkgLSBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgIGR2eSA9IC1iYWxsLnZlbC55ICsgYmFsbC5hbmcgKiBiYWxsLnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJhbGwudmVsLnkgKz0gZHZ5ICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ5IC9cbiAgICAgICAgICAgIChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKTtcbiAgICAgICAgICBiYWxsLmFuZyAtPSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnkgL1xuICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYmFsbHNbaV0ucG9zLnkgKyB0aGlzLmJhbGxzW2ldLnIgPlxuICAgICAgICAgICh0aGlzLmJvdW5kc1sxXSArIHRoaXMuYm91bmRzWzNdKSkge1xuICAgICAgICAgIGxldCBiYWxsID0gdGhpcy5iYWxsc1tpXTtcbiAgICAgICAgICBiYWxsLnZlbC55ICo9IC1iYWxsLms7XG4gICAgICAgICAgYmFsbC5wb3MueSA9ICh0aGlzLmJvdW5kc1sxXSArIHRoaXMuYm91bmRzWzNdKSAtIGJhbGwucjtcbiAgICAgICAgICBsZXQgZHZ5ID0gYmFsbC52ZWwueSAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICBsZXQgZHZ4ID0gTWF0aC5hYnMoZHZ5KSAqIGJhbGwuZmMgKlxuICAgICAgICAgICAgTWF0aC5zaWduKGJhbGwudmVsLnggKyBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoZHZ4KSA+IE1hdGguYWJzKGJhbGwudmVsLnggKyBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgIGR2eCA9IC1iYWxsLnZlbC54IC0gYmFsbC5hbmcgKiBiYWxsLnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJhbGwudmVsLnggKz0gZHZ4IC0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgIChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKTtcbiAgICAgICAgICBiYWxsLmFuZyArPSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5iYWxsc1tpXS5wb3MueSAtIHRoaXMuYmFsbHNbaV0uciA8IHRoaXMuYm91bmRzWzFdKSB7XG4gICAgICAgICAgbGV0IGJhbGwgPSB0aGlzLmJhbGxzW2ldO1xuICAgICAgICAgIGJhbGwudmVsLnkgKj0gLWJhbGwuaztcbiAgICAgICAgICBiYWxsLnBvcy55ID0gdGhpcy5ib3VuZHNbMV0gKyBiYWxsLnI7XG4gICAgICAgICAgbGV0IGR2eSA9IGJhbGwudmVsLnkgKiAoMSArICgxIC8gYmFsbC5rKSk7XG4gICAgICAgICAgbGV0IGR2eCA9IE1hdGguYWJzKGR2eSkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgIE1hdGguc2lnbihiYWxsLnZlbC54IC0gYmFsbC5hbmcgKiBiYWxsLnIpICogLTE7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKGR2eCkgPiBNYXRoLmFicyhiYWxsLnZlbC54IC0gYmFsbC5hbmcgKiBiYWxsLnIpKSB7XG4gICAgICAgICAgICBkdnggPSAtYmFsbC52ZWwueCArIGJhbGwuYW5nICogYmFsbC5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBiYWxsLnZlbC54ICs9IGR2eCArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgYmFsbC5hbmcgLT0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgICgoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSkgKiBiYWxsLnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgYmFsbCBvZiB0aGlzLmJhbGxzKSB7XG4gICAgICAgIGlmIChiYWxsLmxheWVyICE9IHRoaXMuYm9kaWVzW2ldLmxheWVyIHx8XG4gICAgICAgICAgKCFiYWxsLmxheWVyICYmICF0aGlzLmJvZGllc1tpXS5sYXllcikpIHtcbiAgICAgICAgICB0aGlzLmJvZGllc1tpXS5jb2xsaWRlV2l0aEJhbGwoYmFsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYm9kaWVzW2ldLmxheWVyICE9IHRoaXMuYm9kaWVzW2pdLmxheWVyIHx8XG4gICAgICAgICAgKCF0aGlzLmJvZGllc1tqXS5sYXllciAmJiAhdGhpcy5ib2RpZXNbaV0ubGF5ZXIpKSB7XG4gICAgICAgICAgQm9keS5jb2xsaWRlKHRoaXMuYm9kaWVzW2ldLCB0aGlzLmJvZGllc1tqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgZ3Jhdml0eVxuICAgICAgaWYgKHRoaXMuZ3Jhdml0eSkge1xuICAgICAgICB0aGlzLmJvZGllc1tpXS52ZWwuYWRkKFxuICAgICAgICAgIG5ldyBWZWMyKHRoaXMuZ3Jhdml0eS54ICogdCwgdGhpcy5ncmF2aXR5LnkgKiB0KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHNvZnQgYmFsbHNcbiAgICB0aGlzLnNvZnRCYWxscy5mb3JFYWNoKChzYikgPT4ge1xuICAgICAgU29mdEJhbGwudXBkYXRlUHJlc3N1cmVCYXNlZEZvcmNlcyhzYiwgdCk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3ByaW5ncyBhZ2FpbiBtdWx0aXBsZSB0aW1lc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuc3ByaW5ncykge1xuICAgICAgICBlbGVtZW50LnVwZGF0ZSh0IC8gMyAvIDIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFwcGx5IGFpciBmcmljdGlvblxuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgYi52ZWwubXVsdChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgICBiLmFuZyAqPSAoTWF0aC5wb3codGhpcy5haXJGcmljdGlvbiwgdCkpO1xuICAgIH0pO1xuICAgIHRoaXMuYm9kaWVzLmZvckVhY2goKGIpID0+IHtcbiAgICAgIGIudmVsLm11bHQoTWF0aC5wb3codGhpcy5haXJGcmljdGlvbiwgdCkpO1xuICAgICAgYi5hbmcgKj0gKE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpKTtcbiAgICB9KTtcblxuICAgIC8vIFRoZW4gdGFrZSB0aGUgYXZlcmFnZSBvZiB0aGlzIHN5c3RlbSBhbmQgdGhlIG90aGVyIHN5c3RlbVxuICAgIC8vIGlmIGluIHByZWNpc2UgbW9kZVxuICAgIGlmIChwcmVjaXNlKSB7XG4gICAgICBjbG9uZWRTeXN0ZW0uYm9kaWVzLnJldmVyc2UoKTtcbiAgICAgIGNsb25lZFN5c3RlbS5iYWxscy5yZXZlcnNlKCk7XG5cbiAgICAgIC8vIFRha2UgdGhlIGF2ZXJhZ2Ugb2YgdGhlIGJhbGxzXG4gICAgICB0aGlzLmJhbGxzLmZvckVhY2goKGJhbGwsIGkpID0+IHtcbiAgICAgICAgYmFsbC5tb3ZlKChjbG9uZWRTeXN0ZW0uYmFsbHNbaV0ucG9zLnggLSBiYWxsLnBvcy54KSAqIDAuNSxcbiAgICAgICAgICAoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnBvcy55IC0gYmFsbC5wb3MueSkgKiAwLjUpO1xuICAgICAgICBiYWxsLnZlbC5hZGQobmV3IFZlYzIoKGNsb25lZFN5c3RlbS5iYWxsc1tpXS52ZWwueCAtIGJhbGwudmVsLngpICogMC41LFxuICAgICAgICAgIChjbG9uZWRTeXN0ZW0uYmFsbHNbaV0udmVsLnkgLSBiYWxsLnZlbC55KSAqIDAuNSkpO1xuICAgICAgICBiYWxsLnJvdGF0aW9uID0gKGJhbGwucm90YXRpb24gKyBjbG9uZWRTeXN0ZW0uYmFsbHNbaV0ucm90YXRpb24pIC8gMjtcbiAgICAgICAgYmFsbC5hbmcgPSAoYmFsbC5hbmcgKyBjbG9uZWRTeXN0ZW0uYmFsbHNbaV0uYW5nKSAvIDI7XG4gICAgICB9KTtcblxuICAgICAgLy8gVGFrZSB0aGUgYXZlcmFnZSBvZiB0aGUgYm9kaWVzXG4gICAgICB0aGlzLmJvZGllcy5mb3JFYWNoKChib2R5LCBpKSA9PiB7XG4gICAgICAgIGxldCBvdGhlciA9IGNsb25lZFN5c3RlbS5ib2RpZXNbaV07XG4gICAgICAgIGJvZHkubW92ZSgob3RoZXIucG9zLnggLSBib2R5LnBvcy54KSAqIDAuNSxcbiAgICAgICAgICAob3RoZXIucG9zLnkgLSBib2R5LnBvcy55KSAqIDAuNSk7XG4gICAgICAgIGJvZHkudmVsLmFkZChuZXcgVmVjMigob3RoZXIudmVsLnggLSBib2R5LnZlbC54KSAqIDAuNSxcbiAgICAgICAgICAob3RoZXIudmVsLnkgLSBib2R5LnZlbC55KSAqIDAuNSkpO1xuICAgICAgICBib2R5LnJvdGF0ZSgob3RoZXIucm90YXRpb24gLSBib2R5LnJvdGF0aW9uKSAvIDIpO1xuICAgICAgICBib2R5LmFuZyA9IChib2R5LmFuZyArIG90aGVyLmFuZykgLyAyO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb3B5IG9mIHRoaXMgc3lzdGVtXG4gICAqIEByZXR1cm4ge1BoeXNpY3N9IFRoZSBjb3B5IG9mIHRoaXMgc3lzdGVtXG4gICAqL1xuICBnZXQgY29weSgpOiBQaHlzaWNzIHtcbiAgICBsZXQgcmV0ID0gbmV3IFBoeXNpY3MoKTtcbiAgICByZXQuYmFsbHMgPSB0aGlzLmdldENvcHlPZkJhbGxzKCk7XG4gICAgcmV0LmJvZGllcyA9IHRoaXMuZ2V0Q29weU9mQm9kaWVzKCk7XG4gICAgcmV0LmZpeGVkQmFsbHMgPSB0aGlzLmZpeGVkQmFsbHM7XG4gICAgcmV0LndhbGxzID0gdGhpcy53YWxscztcbiAgICByZXQuYm91bmRzID0gdGhpcy5ib3VuZHM7XG4gICAgcmV0LmdyYXZpdHkgPSB0aGlzLmdyYXZpdHk7XG5cbiAgICB0aGlzLnNwcmluZ3MuZm9yRWFjaCgoc3ByaW5nKSA9PiB7XG4gICAgICBsZXQgVHlwZU9mU3ByaW5nID0gc3ByaW5nLmNvbnN0cnVjdG9yID09IFNwcmluZyA/IFNwcmluZyA6IFN0aWNrO1xuICAgICAgbGV0IGNvcGllZFNwcmluZyA9IG5ldyBUeXBlT2ZTcHJpbmcoc3ByaW5nLmxlbmd0aCxcbiAgICAgICAgc3ByaW5nLnNwcmluZ0NvbnN0YW50KTtcbiAgICAgIGNvcGllZFNwcmluZy5yb3RhdGlvbkxvY2tlZCA9IHNwcmluZy5yb3RhdGlvbkxvY2tlZDtcbiAgICAgIGNvcGllZFNwcmluZy5waW5uZWQgPSBzcHJpbmcucGlubmVkO1xuXG4gICAgICBzcHJpbmcub2JqZWN0cy5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgICAgbGV0IGlkeCA9IHRoaXMuYmFsbHMuaW5kZXhPZihvYmopO1xuICAgICAgICBpZiAoaWR4ICE9IC0xKSBjb3BpZWRTcHJpbmcuYXR0YWNoT2JqZWN0KHJldC5iYWxsc1tpZHhdKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWR4ID0gdGhpcy5ib2RpZXMuaW5kZXhPZihvYmopO1xuICAgICAgICAgIGlmIChpZHggIT0gLTEpIGNvcGllZFNwcmluZy5hdHRhY2hPYmplY3QocmV0LmJvZGllc1tpZHhdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldC5zcHJpbmdzLnB1c2goY29waWVkU3ByaW5nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQWlyIGZyaWN0aW9uLiBoYXMgdG8gYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAqIDAgLSBubyBtb3ZlbWVudFxuICAgKiAxIC0gbm8gZnJpY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IGFpckZyaWN0aW9uIEhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICovXG4gIHNldEFpckZyaWN0aW9uKGFpckZyaWN0aW9uOiBudW1iZXIpIHtcbiAgICBpZiAoIWlzRmluaXRlKGFpckZyaWN0aW9uKSkgcmV0dXJuO1xuICAgIHRoaXMuYWlyRnJpY3Rpb24gPSBhaXJGcmljdGlvbjtcbiAgICBpZiAodGhpcy5haXJGcmljdGlvbiA8IDApIHRoaXMuYWlyRnJpY3Rpb24gPSAwO1xuICAgIGlmICh0aGlzLmFpckZyaWN0aW9uID4gMSkgdGhpcy5haXJGcmljdGlvbiA9IDE7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZ3Jhdml0eSBpbiB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtWZWMyfSBkaXIgVGhlIGFjY2VsZXJhdGlvbiB2ZWN0b3Igb2YgdGhlIGdyYXZpdHlcbiAgICovXG4gIHNldEdyYXZpdHkoZGlyOiBWZWMyKSB7XG4gICAgdGhpcy5ncmF2aXR5ID0gZGlyLmNvcHk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBiYWxsIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwgQmFsbCB0byBhZGQgdG8gdGhlIHdvcmxkXG4gICAqL1xuICBhZGRCYWxsKGJhbGw6IEJhbGwpIHtcbiAgICB0aGlzLmJhbGxzLnB1c2goYmFsbCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBib2R5IHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge0JvZHl9IGJvZHkgQm9keSB0byBhZGQgdG8gdGhlIHdvcmxkXG4gICAqL1xuICBhZGRCb2R5KGJvZHk6IEJvZHkpIHtcbiAgICB0aGlzLmJvZGllcy5wdXNoKGJvZHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBuZXcgc29mdCBiYWxsIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge1NvZnRCYWxsfSBzb2Z0QmFsbCBTb2Z0QmFsbCB0byBiZSBhZGRlZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZFNvZnRCYWxsKHNvZnRCYWxsOiBTb2Z0QmFsbCkge1xuICAgIHRoaXMuYmFsbHMucHVzaCguLi5zb2Z0QmFsbC5wb2ludHMpO1xuICAgIHRoaXMuc3ByaW5ncy5wdXNoKC4uLnNvZnRCYWxsLnNpZGVzKTtcblxuICAgIHRoaXMuc29mdEJhbGxzLnB1c2goc29mdEJhbGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSByZWN0YW5ndWxhciB3YWxsIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIHdhbGxcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IHdpZHRoIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoIGhlaWdodCBvZiB0aGUgcmVjdGFuZ3VsYXIgd2FsbFxuICAgKi9cbiAgYWRkUmVjdFdhbGwoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCAtIHcgLyAyLFxuICAgICAgeSAtIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4ICsgdyAvIDIsXG4gICAgICB5IC0gaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggKyB3IC8gMixcbiAgICAgIHkgKyBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCAtIHcgLyAyLFxuICAgICAgeSArIGggLyAyXG4gICAgKSk7XG4gICAgdGhpcy53YWxscy5wdXNoKG5ldyBXYWxsKHBvaW50cykpO1xuICAgIC8vIHRoaXMuYm9kaWVzLnB1c2gobmV3IEJvZHkocG9pbnRzLCBuZXcgVmVjMigwLCAwKSwgMC41LCAwLCAwLjMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgcmVjdGFuZ3VsYXIgYm9keSB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgcmVjdGFuZ3VsYXIgYm9keVxuICAgKiBAcGFyYW0ge251bWJlcn0gdyB3aWR0aCBvZiB0aGUgcmVjdGFuZ3VsYXIgYm9keVxuICAgKiBAcGFyYW0ge251bWJlcn0gaCBoZWlnaHQgb2YgdGhlIHJlY3Rhbmd1bGFyIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZjIGZyaWN0aW9uIGNvZWZmaWNpZW50IG9mIHRoZSBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBrIGNvZWZmaWNpZW50IG9mIHJlc3RpdHV0aW9uIG9mIHRoZSBib2R5XG4gICAqL1xuICBhZGRSZWN0Qm9keSh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIsIGZjOiBudW1iZXIsIGs6IG51bWJlcikge1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggLSB3IC8gMixcbiAgICAgIHkgLSBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCArIHcgLyAyLFxuICAgICAgeSAtIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4ICsgdyAvIDIsXG4gICAgICB5ICsgaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggLSB3IC8gMixcbiAgICAgIHkgKyBoIC8gMlxuICAgICkpO1xuICAgIHRoaXMuYm9kaWVzLnB1c2gobmV3IEJvZHkocG9pbnRzLCBuZXcgVmVjMigwLCAwKSwgMC41LCAwLCAwLjMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmQgYSBuZXcgd2FsbCB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtXYWxsfSB3YWxsIFdhbGwgdG8gYXBwZW5kIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkV2FsbCh3YWxsOiBXYWxsKSB7XG4gICAgdGhpcy53YWxscy5wdXNoKHdhbGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBmaXhlZCBiYWxsIHRvIHRoZSB3b3JsZFxuICAgKiBBIGZpeGVkIGJhbGwgaXMgaW1tb3ZhYmxlIGFuZCBvdGhlciBvYmplY3RzIGNvbGxpZGUgd2l0aCBpdFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIGZpeGVkIGJhbGxcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSBmaXhlZCBiYWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByIHJhZGl1cyBvZiB0aGUgZml4ZWQgYmFsbFxuICAgKi9cbiAgYWRkRml4ZWRCYWxsKHg6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIpIHtcbiAgICB0aGlzLmZpeGVkQmFsbHMucHVzaCh7XG4gICAgICB4OiB4LCB5OiB5LCByOiByLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBuZXcgc3ByaW5nIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge1NwcmluZ30gc3ByaW5nIFNwcmluZyB0byBhZGQgdG8gdGhlIHdvcmxkXG4gICAqL1xuICBhZGRTcHJpbmcoc3ByaW5nOiBTcHJpbmcpIHtcbiAgICB0aGlzLnNwcmluZ3MucHVzaChzcHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNpemUgb2YgdGhlIHdvcmxkICh3aXRob3V0IHRoaXMgdGhlIHdvcmxkXG4gICAqIGRvZXMgbm90IGhhdmUgYm91bmRzKVxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRyZSBvZiB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSBjZW50cmUgb2YgdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IFdpZHRoIG9mIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0gaCBIZWlnaHQgb2YgdGhlIHdvcmxkXG4gICAqL1xuICBzZXRCb3VuZHMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgdGhpcy5ib3VuZHMgPSBbeCwgeSwgdywgaF07XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIGZvciBhbnkgb2JqZWN0IGF0IHRoZSBnaXZlbiBjb29yZGluYXRlIHRoZW4gcmV0dXJucyBpdFxuICAgKiBSZXR1cm4gZmFsc2UgaWYgbm90aGluZyBpcyBmb3VuZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAqIEByZXR1cm4ge0JhbGx9IFRoZSBmb3VuZCBvYmplY3RcbiAgICovXG4gIGdldE9iamVjdEF0Q29vcmRpbmF0ZXMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBCYWxsIHtcbiAgICBsZXQgcmV0ID0gdW5kZWZpbmVkO1xuICAgIGxldCB2ID0gbmV3IFZlYzIoeCwgeSk7XG4gICAgdGhpcy5iYWxscy5mb3JFYWNoKChiYWxsKSA9PiB7XG4gICAgICBpZiAoYmFsbC5wb3MuZGlzdCh2KSA8IGJhbGwucikgcmV0ID0gYmFsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgY29waWVzIG9mIGFsbCBiYWxscyBpbiB0aGUgc3lzdGVtXG4gICAqIEByZXR1cm4ge0FycmF5PEJhbGw+fSBUaGUgYXJyYXkgb2YgdGhlIGNvcGllZCBiYWxsc1xuICAgKi9cbiAgZ2V0Q29weU9mQmFsbHMoKTogQXJyYXk8QmFsbD4ge1xuICAgIGxldCByZXQ6IEFycmF5PEJhbGw+ID0gW107XG4gICAgdGhpcy5iYWxscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByZXQucHVzaChpdGVtLmNvcHkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBjb3BpZXMgb2YgYWxsIGJvZGllcyBpbiB0aGUgc3lzdGVtXG4gICAqIEByZXR1cm4ge0FycmF5PEJvZHk+fSBUaGUgYXJyYXkgb2YgdGhlIGNvcGllZCBib2RpZXNcbiAgICovXG4gIGdldENvcHlPZkJvZGllcygpOiBBcnJheTxCb2R5PiB7XG4gICAgbGV0IHJldDogQXJyYXk8Qm9keT4gPSBbXTtcbiAgICB0aGlzLmJvZGllcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByZXQucHVzaChpdGVtLmNvcHkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuZXhwb3J0IHtCYWxsfTtcbmV4cG9ydCB7Qm9keX07XG5leHBvcnQge1ZlYzJ9O1xuZXhwb3J0IHtXYWxsfTtcbmV4cG9ydCB7TGluZVNlZ21lbnR9O1xuZXhwb3J0IHtTcHJpbmd9O1xuZXhwb3J0IHtTdGlja307XG5leHBvcnQge1NvZnRCYWxsfTtcbmV4cG9ydCB7UGh5c2ljc307XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuaW1wb3J0IEJhbGwgZnJvbSAnLi9iYWxsJztcbmltcG9ydCBTdGljayBmcm9tICcuL3N0aWNrJztcbmltcG9ydCBMaW5lU2VnbWVudCBmcm9tICcuL2xpbmVzZWdtZW50JztcbmltcG9ydCBTcHJpbmcgZnJvbSAnLi9zcHJpbmcnO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNvZnRib2R5IG9iamVjdFxuICogVGhleSB3b3JrIGxpa2UgYSBiYWxsLCB3aXRoIHByZXNzdXJlIGluc2lkZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2Z0QmFsbCB7XG4gICAgcG9pbnRzOiBBcnJheTxCYWxsPjtcbiAgICBwcmVzc3VyZTogbnVtYmVyO1xuICAgIGZjOiBudW1iZXI7XG4gICAgcmVzb2x1dGlvbjogbnVtYmVyO1xuICAgIHI6IG51bWJlcjtcbiAgICBzaWRlczogQXJyYXk8U3ByaW5nPjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBTb2Z0QmFsbFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9zIFRoZSBzdGFydGluZyBwb3NpdGlvbiBvZiB0aGUgc29mdCBiYWxsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgVGhlIHJhZGl1cyBvZiB0aGUgc29mdCBiYWxsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXNzdXJlIFRoZSBcImhhcmRuZXNzXCIgb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYyBGcmljdGlvbiBjb2VmZmljaWVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXNvbHV0aW9uIFRoZSBudW1iZXIgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCB0aGUgYmFsbFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvczogVmVjMiwgcjogbnVtYmVyLCBwcmVzc3VyZTogbnVtYmVyLFxuICAgICAgICBmYzogbnVtYmVyLCByZXNvbHV0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcblxuICAgICAgICBpZiAoZmMgfHwgZmMgPT09IDApIHRoaXMuZmMgPSBmYztcbiAgICAgICAgZWxzZSB0aGlzLmZjID0gMC40O1xuXG4gICAgICAgIHRoaXMucHJlc3N1cmUgPSBwcmVzc3VyZTtcblxuICAgICAgICBpZiAoIXJlc29sdXRpb24pIHRoaXMucmVzb2x1dGlvbiA9IDMwO1xuICAgICAgICBlbHNlIHRoaXMucmVzb2x1dGlvbiA9IHJlc29sdXRpb247XG5cbiAgICAgICAgciA9IE1hdGguYWJzKHIpO1xuICAgICAgICB0aGlzLnIgPSByO1xuXG4gICAgICAgIGxldCBsYXllck51YmVyOiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXNvbHV0aW9uOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdQb3MgPSBuZXcgVmVjMihwb3MueCwgcG9zLnkpO1xuICAgICAgICAgICAgbmV3UG9zLmFkZChWZWMyLm11bHQoXG4gICAgICAgICAgICAgICAgVmVjMi5mcm9tQW5nbGUoKGkgLyB0aGlzLnJlc29sdXRpb24pICogTWF0aC5QSSAqIDIpLCByKSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKG5ldyBCYWxsKG5ld1BvcywgbmV3IFZlYzIoMCwgMCksXG4gICAgICAgICAgICAgICAgciAqIE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnJlc29sdXRpb24pLCAwLCAwLCB0aGlzLmZjKSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXS5sYXllciA9IGxheWVyTnViZXI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNpZGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXNvbHV0aW9uOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFN0aWNrKDIgKiByICogTWF0aC5zaW4oTWF0aC5QSSAvIHRoaXMucmVzb2x1dGlvbikpO1xuICAgICAgICAgICAgc2lkZS5hdHRhY2hPYmplY3QodGhpcy5wb2ludHNbaV0pO1xuICAgICAgICAgICAgc2lkZS5hdHRhY2hPYmplY3QodGhpcy5wb2ludHNbKGkgKyAxKSAlIHRoaXMucmVzb2x1dGlvbl0pO1xuICAgICAgICAgICAgaWYgKGkgJSAyID09PSAwKSBzaWRlLmxvY2tSb3RhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5zaWRlcy5wdXNoKHNpZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcHJlc3N1cmUtYmFzZWQgZm9yY2VzIGluIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge1NvZnRCYWxsfSBzb2Z0QmFsbCBUaGUgc29mdCBiYWxsIHRvIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgICAqL1xuICAgIHN0YXRpYyB1cGRhdGVQcmVzc3VyZUJhc2VkRm9yY2VzKHNvZnRCYWxsOiBTb2Z0QmFsbCwgdDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBwb2xpZ29uczogQXJyYXk8QXJyYXk8VmVjMj4+ID0gW107XG4gICAgICAgIHBvbGlnb25zLnB1c2goW10pO1xuICAgICAgICBzb2Z0QmFsbC5wb2ludHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgcG9saWdvbnNbMF0ucHVzaChuZXcgVmVjMihwLnBvcy54LCBwLnBvcy55KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgoZnVuY3Rpb24ocG9sKSB7XG4gICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pKTtcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgICAgIHBvbFtpXSksIFZlYzIuc3ViKHBvbFtpIC0gMV0sIHBvbFtpXSkpO1xuICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSkpO1xuICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pKHBvbGlnb25zWzBdKSkge1xuICAgICAgICAgICAgY29uc3QgaW5jbHVkZXMgPSAoYXJyOiBBcnJheTxudW1iZXI+LCBpdGVtOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldID09PSBpdGVtKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGludGVyc2VjdFdpdGhQb2xpZ29uID0gZnVuY3Rpb24oc2VnbWVudDogTGluZVNlZ21lbnQsXG4gICAgICAgICAgICAgICAgcG9sOiBBcnJheTxWZWMyPiwgZXhjZXB0aW9uczogQXJyYXk8bnVtYmVyPikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9sLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZXMoZXhjZXB0aW9ucywgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtpXS54LCBwb2xbaV0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChMaW5lU2VnbWVudC5pbnRlcnNlY3Qoc2VnbWVudCwgc2lkZSkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlO1xuXG4gICAgICAgICAgICBjaGVja0FsbFBvbGlnb25zOiB3aGlsZSAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9saWdvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvbCA9IHBvbGlnb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKGEsIGIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgayA9IGogKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbal0ueCwgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKS5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgMiAqIE1hdGguUEkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaiAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbaiAlIHBvbC5sZW5ndGhdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wsIFsocG9sLmxlbmd0aCAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wyLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKHBvbDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgY2hlY2tBbGxQb2xpZ29ucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IHBvbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbKGogKyAxKSAlIHBvbC5sZW5ndGhdLCBwb2xbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBWZWMyLnN1Yihwb2xbaiAtIDFdLCBwb2xbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIobmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIShhLmhlYWRpbmcgPiBiLmhlYWRpbmcgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKGogLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGo7IGwgPD0gazsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGs7IGwgPD0gaiArIHBvbC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wyLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zW2ldID0gcG9sMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKHBvbDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gcG9saWdvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgIHdoaWxlIChwb2wubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2goW3BvbFswXSwgcG9sWzFdLCBwb2xbMl1dKTtcbiAgICAgICAgICAgICAgICBwb2wuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1TdW0gPSAwO1xuICAgICAgICBwb2xpZ29ucy5mb3JFYWNoKChwb2wpID0+IHtcbiAgICAgICAgICAgIGxldCBhID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFswXS54IC0gcG9sWzFdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMF0ueSAtIHBvbFsxXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYiA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMV0ueCAtIHBvbFsyXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzFdLnkgLSBwb2xbMl0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGMgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzJdLnggLSBwb2xbMF0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsyXS55IC0gcG9sWzBdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBzID0gKGEgKyBiICsgYykgLyAyO1xuICAgICAgICAgICAgbGV0IG0gPSBNYXRoLnNxcnQocyAqIChzIC0gYSkgKiAocyAtIGIpICogKHMgLSBjKSk7XG4gICAgICAgICAgICBtU3VtICs9IG07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBvdmVyUHJlc3N1cmUgPSBzb2Z0QmFsbC5wcmVzc3VyZSAqXG4gICAgICAgICAgICAoKHNvZnRCYWxsLnIgKiBzb2Z0QmFsbC5yICogTWF0aC5QSSkgLyBtU3VtKVxuICAgICAgICAgICAgLSBzb2Z0QmFsbC5wcmVzc3VyZTtcbiAgICAgICAgc29mdEJhbGwuc2lkZXMuZm9yRWFjaCgoc2lkZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGZvcmNlID0gVmVjMi5zdWIoc2lkZS5vYmplY3RzWzBdLnBvcywgc2lkZS5vYmplY3RzWzFdLnBvcyk7XG4gICAgICAgICAgICBmb3JjZS5tdWx0KG92ZXJQcmVzc3VyZSk7XG4gICAgICAgICAgICBmb3JjZS5yb3RhdGUoTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgZm9yY2UubXVsdCh0KTtcbiAgICAgICAgICAgIHNpZGUub2JqZWN0c1swXS52ZWwuYWRkKFZlYzIuZGl2KGZvcmNlLCBzaWRlLm9iamVjdHNbMF0ubSkpO1xuICAgICAgICAgICAgc2lkZS5vYmplY3RzWzFdLnZlbC5hZGQoVmVjMi5kaXYoZm9yY2UsIHNpZGUub2JqZWN0c1sxXS5tKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc3RyaW5nXG4gKiBUaGV5IGFjdCBsaWtlIHNwcmluZ3MgaW4gcmVhbCBsaWZlXG4gKiBZb3UgY2FuIGF0dGFjaCBvdGhlciBvYmplY3RzIHRvIHRoZSBlbmRzIG9mIHRoZW1cbiAqIFRoZXkgZG8gbm90IGNvbGxpZGUgd2l0aCBvdGhlciBvYmplY3QgbmVpdGhlciB3aXRoIGVhY2ggb3RoZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaW5nIHtcbiAgICBsZW5ndGg6IG51bWJlcjtcbiAgICBzcHJpbmdDb25zdGFudDogbnVtYmVyO1xuICAgIHBpbm5lZDogYW55O1xuICAgIG9iamVjdHM6IEFycmF5PGFueT47XG4gICAgcm90YXRpb25Mb2NrZWQ6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgc3ByaW5nXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBUaGUgdW5zdHJlY2hlZCBsZW5ndGggb2YgdGhlIHNwcmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcHJpbmdDb25zdGFudCBTcHJpbmcgY29uc3RhbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihsZW5ndGg6IG51bWJlciwgc3ByaW5nQ29uc3RhbnQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5zcHJpbmdDb25zdGFudCA9IHNwcmluZ0NvbnN0YW50O1xuICAgICAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbkxvY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpbnMgb25lIHNpZGUgb2YgdGhlIHRoZSBzcHJpbmcgdG8gYSBnaXZlbiBjb29yZGluYXRlIGluIHNwYWNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAgICovXG4gICAgcGluSGVyZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBpbm5lZCA9IHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHBpbm5lZCB0YWcgZnJvbSB0aGUgc3ByaW5nXG4gICAgICogWW91IGNhbiBub3cgYXR0YWNoIGl0IHRvIGFub3RoZXIgb2JqZWN0XG4gICAgICovXG4gICAgdW5waW4oKSB7XG4gICAgICAgIHRoaXMucGlubmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgb25lIGVuZCBvZiB0aGUgc3ByaW5nIHRvIGFuIG9iamVjdCAoZWcuIEJhbGwpXG4gICAgICogQHBhcmFtIHthbnl9IG9iamVjdCBUaGUgb2JqZWN0IHRoYXQgdGhlIHNwcmluZyBpcyBnZXR0aW5nIGF0dGFjaGVkIHRvXG4gICAgICovXG4gICAgYXR0YWNoT2JqZWN0KG9iamVjdDogYW55KSB7XG4gICAgICAgIGxldCBvYiA9IHRoaXMub2JqZWN0cztcbiAgICAgICAgb2IucHVzaChvYmplY3QpO1xuICAgICAgICBpZiAob2IubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgb2IgPSBbb2Jbb2IubGVuZ3RoIC0gMl0sIG9iW29iLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2tzIHRoZSBvYmplY3RzIGF0dGFjaGVkIHRvIHRoZSBlbmRzIG9mIHRoZSBzcHJpbmdcbiAgICAgKiB0byBub3Qgcm90YXRlIGFyb3VuZCB0aGUgYXR0YWNoIHBvaW50XG4gICAgICovXG4gICAgbG9ja1JvdGF0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdGF0aW9uTG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWxlYXNlcyB0aGUgb2JqZWN0cyBhdHRhY2hlZCB0byB0aGUgZW5kcyBvZiB0aGUgc3ByaW5nXG4gICAgICogdG8gcm90YXRlIGFyb3VuZCB0aGUgYXR0YWNoIHBvaW50XG4gICAgICovXG4gICAgdW5sb2NrUm90YXRpb24oKSB7XG4gICAgICAgIHRoaXMucm90YXRpb25Mb2NrZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBzcHJpbmcgYmF5IHRoZSBlbGFwc2VkIHRpbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICB1cGRhdGUodDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBwMTtcbiAgICAgICAgbGV0IHAyO1xuICAgICAgICBpZiAodGhpcy5waW5uZWQgJiYgdGhpcy5vYmplY3RzWzBdKSB7XG4gICAgICAgICAgICBwMiA9IHRoaXMucGlubmVkO1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBsZXQgZGlzdCA9IG5ldyBWZWMyKHAyLnggLSBwMS5wb3MueCwgcDIueSAtIHAxLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBkbCA9IGRpc3QubGVuZ3RoIC0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICBkaXN0LnNldE1hZygxKTtcbiAgICAgICAgICAgIGRpc3QubXVsdChkbCAqIHRoaXMuc3ByaW5nQ29uc3RhbnQgKiB0IC8gKHAxLm0pKTtcbiAgICAgICAgICAgIHAxLnZlbC54ICs9IGRpc3QueDtcbiAgICAgICAgICAgIHAxLnZlbC55ICs9IGRpc3QueTtcblxuICAgICAgICAgICAgbGV0IHYgPSBwMS52ZWw7XG4gICAgICAgICAgICB2LnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgVmVjMihwMi54LCBwMi55KTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMS5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAxLm0gKyBwMS5hbTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nID0gKHAxLmFtICogcDEuYW5nIC0gcjIubGVuZ3RoICogcDEubSAqICh2LnkpKSAvIChhbSk7XG5cbiAgICAgICAgICAgICAgICB2LnkgPSAtYW5nICogcjIubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9iamVjdHNbMF0gJiYgdGhpcy5vYmplY3RzWzFdKSB7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIHAyID0gdGhpcy5vYmplY3RzWzFdO1xuICAgICAgICAgICAgbGV0IGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICAgICAgICBsZXQgZGwgPSBkaXN0Lmxlbmd0aCAtIHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoZGwgKiB0aGlzLnNwcmluZ0NvbnN0YW50ICogdCk7XG4gICAgICAgICAgICBwMi52ZWwuYWRkKFZlYzIuZGl2KGRpc3QsIHAyLm0pKTtcbiAgICAgICAgICAgIHAxLnZlbC5hZGQoVmVjMi5kaXYoZGlzdCwgLXAxLm0pKTtcblxuICAgICAgICAgICAgZGlzdCA9IFZlYzIuc3ViKHAxLnBvcywgcDIucG9zKTtcbiAgICAgICAgICAgIGxldCB2MSA9IHAxLnZlbDtcbiAgICAgICAgICAgIGxldCB2MiA9IHAyLnZlbDtcbiAgICAgICAgICAgIHYxLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIHYyLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAxLnBvcy54ICogcDEubSArIHAyLnBvcy54ICogcDIubSxcbiAgICAgICAgICAgICAgICAgICAgcDEucG9zLnkgKiBwMS5tICsgcDIucG9zLnkgKiBwMi5tKTtcbiAgICAgICAgICAgICAgICBzLmRpdihwMS5tICsgcDIubSk7XG4gICAgICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMi5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIHAxLm0gKyBwMS5hbSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAyLm0gKyBwMi5hbTtcbiAgICAgICAgICAgICAgICBsZXQgc3YgPSAodjEueSAtIHYyLnkpICogcjIubGVuZ3RoIC9cbiAgICAgICAgICAgICAgICAgICAgKHIxLmxlbmd0aCArIHIyLmxlbmd0aCkgKyB2Mi55O1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgKyBwMi5hbSAqIHAyLmFuZyAtXG4gICAgICAgICAgICAgICAgICAgIHIxLmxlbmd0aCAqIHAxLm0gKiAodjEueSAtIHN2KSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHAyLm0gKiAodjIueSAtIHN2KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdjEueSA9IC1hbmcgKiByMS5sZW5ndGggKyBzdjtcbiAgICAgICAgICAgICAgICB2Mi55ID0gK2FuZyAqIHIyLmxlbmd0aCArIHN2O1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgICAgIHAyLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdjEucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgU3ByaW5nIGZyb20gJy4vc3ByaW5nJztcblxuLyoqXG4gKiBTdGljayBjbGFzcyBmb3IgdGhlIHBoeXNpY3MgZW5naW5lXG4gKiBTdGlja3MgYXJlIG5vdCBzdHJlY2hhYmxlIG9iamVjdHMgdGhhdCBkbyBub3QgY29sbGlkZVxuICogd2l0aCBvdGhlciBvYmplY3RzIGJ1dCB0aGV5IGNhbiBob2xkIG90aGVyIG9iamVjdHMgb24gdGhlaXIgZW5kc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGljayBleHRlbmRzIFNwcmluZyB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHN0aWNrXG4gICAgICogQHBhcmFtIHtudWJlcn0gbGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHN0aWNrXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIobGVuZ3RoLCAwKTtcbiAgICAgICAgdGhpcy5zcHJpbmdDb25zdGFudCA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc3RpY2sgdHJvdWdoIGFuIGVsYXBzZWQgdGltZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgICAqL1xuICAgIHVwZGF0ZSh0OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHAxO1xuICAgICAgICBsZXQgcDI7XG4gICAgICAgIGlmICh0aGlzLnBpbm5lZCAmJiB0aGlzLm9iamVjdHNbMF0pIHtcbiAgICAgICAgICAgIHAyID0gdGhpcy5waW5uZWQ7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIGxldCBkaXN0ID0gbmV3IFZlYzIocDIueCAtIHAxLnBvcy54LCBwMi55IC0gcDEucG9zLnkpO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoLXRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgIHAxLm1vdmUoLXAxLnBvcy54ICsgcDIueCArIGRpc3QueCwgLXAxLnBvcy55ICsgcDIueSArIGRpc3QueSk7XG5cbiAgICAgICAgICAgIGxldCB2ID0gcDEudmVsO1xuICAgICAgICAgICAgdi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2LnggPSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGlvbkxvY2tlZCkge1xuICAgICAgICAgICAgICAgIGxldCBzID0gbmV3IFZlYzIocDIueCwgcDIueSk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMS5tICsgcDEuYW07XG4gICAgICAgICAgICAgICAgbGV0IGFuZyA9IChwMS5hbSAqIHAxLmFuZyAtIHIyLmxlbmd0aCAqIHAxLm0gKiAodi55KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdi55ID0gLWFuZyAqIHIyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9iamVjdHNbMF0gJiYgdGhpcy5vYmplY3RzWzFdKSB7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIHAyID0gdGhpcy5vYmplY3RzWzFdO1xuXG4gICAgICAgICAgICBsZXQgZGlzdCA9IFZlYzIuc3ViKHAxLnBvcywgcDIucG9zKTtcbiAgICAgICAgICAgIGxldCBkbCA9IHRoaXMubGVuZ3RoIC0gZGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBkaXN0LnNldE1hZygxKTtcbiAgICAgICAgICAgIGxldCBtb3ZlMSA9IFZlYzIubXVsdChkaXN0LCBkbCAqIChwMi5tKSAvICgocDEubSkgKyAocDIubSkpKTtcbiAgICAgICAgICAgIGxldCBtb3ZlMiA9IFZlYzIubXVsdChkaXN0LCAtZGwgKiAocDEubSkgLyAoKHAxLm0pICsgKHAyLm0pKSk7XG4gICAgICAgICAgICBwMS5tb3ZlKG1vdmUxLngsIG1vdmUxLnkpO1xuICAgICAgICAgICAgcDIubW92ZShtb3ZlMi54LCBtb3ZlMi55KTtcblxuICAgICAgICAgICAgbGV0IHYxID0gcDEudmVsO1xuICAgICAgICAgICAgbGV0IHYyID0gcDIudmVsO1xuICAgICAgICAgICAgdjEucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjEueCA9IHYyLnggPSAocDEubSAqIHYxLnggKyBwMi5tICogdjIueCkgLyAoKHAxLm0pICsgKHAyLm0pKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAxLnBvcy54ICogcDEubSArIHAyLnBvcy54ICogcDIubSxcbiAgICAgICAgICAgICAgICAgICAgcDEucG9zLnkgKiBwMS5tICsgcDIucG9zLnkgKiBwMi5tKTtcbiAgICAgICAgICAgICAgICBzLmRpdihwMS5tICsgcDIubSk7XG4gICAgICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMi5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIHAxLm0gKyBwMS5hbSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAyLm0gKyBwMi5hbTtcbiAgICAgICAgICAgICAgICBsZXQgc3YgPSAodjEueSAtIHYyLnkpICogcjIubGVuZ3RoIC9cbiAgICAgICAgICAgICAgICAgICAgKHIxLmxlbmd0aCArIHIyLmxlbmd0aCkgKyB2Mi55O1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgKyBwMi5hbSAqIHAyLmFuZyAtXG4gICAgICAgICAgICAgICAgICAgIHIxLmxlbmd0aCAqIHAxLm0gKiAodjEueSAtIHN2KSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHAyLm0gKiAodjIueSAtIHN2KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdjEueSA9IC1hbmcgKiByMS5sZW5ndGggKyBzdjtcbiAgICAgICAgICAgICAgICB2Mi55ID0gK2FuZyAqIHIyLmxlbmd0aCArIHN2O1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgICAgIHAyLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdjEucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIGV2ZXJ5IGFuZ2xlIGlzIGNvdW50ZXJjbG9ja3dpc2UgKGFudGljbG9ja3dpc2UpXG4vKiogQ2xhc3MgcmVwcmVzZW50aW5nIGEgMmQgdmVjdG9yLiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMiB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgdmFsdWUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGNvcHkgb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgY29weS5cbiAgICAgKi9cbiAgICBnZXQgY29weSgpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGxlbmd0aC5cbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yIHNxdWFyZWQuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbGVuZ3RoIHNxdWFyZWQuXG4gICAgICovXG4gICAgZ2V0IHNxbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBoZWFkaW5nIG9mIHRoZSB2ZWN0b3IgY29tcGFyZWQgdG8gKDEsIDApLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGFuZ2xlIGJldHdlZW4gKDEsIDApXG4gICAgICogYW5kIHRoZSB2ZWN0b3IgaW4gYW50aWNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICovXG4gICAgZ2V0IGhlYWRpbmcoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMueCA9PT0gMCAmJiB0aGlzLnkgPT09IDApIHJldHVybiAwO1xuICAgICAgICBpZiAodGhpcy54ID09PSAwKSByZXR1cm4gdGhpcy55ID4gMCA/IE1hdGguUEkgLyAyIDogMS41ICogTWF0aC5QSTtcbiAgICAgICAgaWYgKHRoaXMueSA9PT0gMCkgcmV0dXJuIHRoaXMueCA+IDAgPyAwIDogTWF0aC5QSTtcbiAgICAgICAgbGV0IHYgPSBWZWMyLm5vcm1hbGl6ZWQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnggPiAwICYmIHRoaXMueSA+IDApIHJldHVybiBNYXRoLmFzaW4odi55KTtcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgJiYgdGhpcy55ID4gMCkgcmV0dXJuIE1hdGguYXNpbigtdi54KSArIE1hdGguUEkgLyAyO1xuICAgICAgICBpZiAodGhpcy54IDwgMCAmJiB0aGlzLnkgPCAwKSByZXR1cm4gTWF0aC5hc2luKC12LnkpICsgTWF0aC5QSTtcbiAgICAgICAgaWYgKHRoaXMueCA+IDAgJiYgdGhpcy55IDwgMCkgcmV0dXJuIE1hdGguYXNpbih2LngpICsgMS41ICogTWF0aC5QSTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhbm90aGVyIHZlY3RvciB0byB0aGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICovXG4gICAgYWRkKGE6IFZlYzIpIHtcbiAgICAgICAgdGhpcy54ICs9IGEueDtcbiAgICAgICAgdGhpcy55ICs9IGEueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgYW5vdGhlciB2ZWN0b3IgZnJvbSB0aGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICovXG4gICAgc3ViKGE6IFZlYzIpIHtcbiAgICAgICAgdGhpcy54IC09IGEueDtcbiAgICAgICAgdGhpcy55IC09IGEueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIG11bHQoeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCAqPSB4O1xuICAgICAgICB0aGlzLnkgKj0geDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIGRpdih4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54IC89IHg7XG4gICAgICAgIHRoaXMueSAvPSB4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpbmVhcnJ5IGludGVycG9sYXRlcyB0aGUgdmVjdG9yIGludG8gdGhlIG90aGVyIHZlY3RvciBieSBzY2FsYXIgeC5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG90aGVyIC0gVGhlIG90aGVyIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBzY2FsYXIuXG4gICAgICovXG4gICAgbGVycChvdGhlcjogVmVjMiwgeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCArPSAob3RoZXIueCAtIHRoaXMueCkgKiB4O1xuICAgICAgICB0aGlzLnkgKz0gKG90aGVyLnkgLSB0aGlzLnkpICogeDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHZlY3RvciBhbmQgdGhlIG90aGVyIHZlY3Rvci5cbiAgICAgKiBWZWN0b3JzIGFyZSByZXByZXNlbnRpbmcgcG9pbnRzIGhlcmUuXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdGhlciAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtLlxuICAgICAqL1xuICAgIGRpc3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKG5ldyBWZWMyKHRoaXMueCAtIG90aGVyLngsIHRoaXMueSAtIG90aGVyLnkpKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbCAtIFRoZSBuZXcgbGVuZ3RoIHZhbHVlLlxuICAgICAqL1xuICAgIHNldE1hZyhsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMubXVsdChsIC8gdGhpcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJvdGF0ZSB0aGUgdmVjdG9yIGFudGljbG9ja3dpc2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gUm90YXRpb24gYW5nbGUuXG4gICAgICovXG4gICAgcm90YXRlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGggPSB0aGlzLmhlYWRpbmc7XG4gICAgICAgIGxldCB2ID0gVmVjMi5mcm9tQW5nbGUoYW5nbGUgKyBoKTtcbiAgICAgICAgdi5tdWx0KHRoaXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgfVxuXG5cbiAgICAvLyBTdGF0aWMgZnVuY3Rpb25zOlxuICAgIC8qKlxuICAgICAqIEFkZCB0d28gdmVjdG9ycyB0b2dldGhlci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBzdW0gb2YgdGhlIHZlY3RvcnMuXG4gICAgICovXG4gICAgc3RhdGljIGFkZChhOiBWZWMyLCBiOiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihhLnggKyBiLngsIGEueSArIGIueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSBhbm90aGVyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIHN1YnRyYWN0aW9uIG9mIHRoZSB2ZWN0b3JzLlxuICAgICAqL1xuICAgIHN0YXRpYyBzdWIoYTogVmVjMiwgYjogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoYS54IC0gYi54LCBhLnkgLSBiLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtWZWMyfSB2IC0gVmVjdG9yLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gU2NhbGFyLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBtdWx0aXBsaWVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdCh2OiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHYueCAqIHgsIHYueSAqIHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpdmlkZSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gdiAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFNjYWxhci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgZGl2aWRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgc3RhdGljIGRpdih2OiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHYueCAvIHgsIHYueSAvIHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHVuaXQgdmVjdG9yIGZyb20gYW4gYW5nbGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSBUaGUgYW5nbGUuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNyZWF0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tQW5nbGUoYTogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpbmVhcnJ5IGludGVycG9sYXRlcyBhIHZlY3RvciBpbnRvIGFub3RoZXIgdmVjdG9yIGJ5IHNjYWxhciB4LlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBzY2FsYXIuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNyZWF0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBsZXJwKGE6IFZlYzIsIGI6IFZlYzIsIHg6IG51bWJlcik6IFZlYzIge1xuICAgICAgICByZXR1cm4gVmVjMi5hZGQoYSwgVmVjMi5tdWx0KFZlYzIuc3ViKGIsIGEpLCB4KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtLlxuICAgICAqL1xuICAgIHN0YXRpYyBkaXN0KGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVmVjMi5zdWIoYSwgYikubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZG90KGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBjcm9zcyBwcm9kdWN0IG9mIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGNyb3NzKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gYS54ICogYi55IC0gYS55ICogYi54O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgYW5nbGUgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEFuZ2xlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGUoYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjMi5kb3QoYSwgYikgLyBNYXRoLnNxcnQoYS5zcWxlbmd0aCAqIGIuc3FsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIHZlY3RvcnMgYnV0IGluIHRoZSBhbnRpY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEFuZ2xlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGVBQ1coYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBhaCA9IGEuaGVhZGluZztcbiAgICAgICAgbGV0IGJoID0gYi5oZWFkaW5nO1xuICAgICAgICBsZXQgYW5nbGUgPSBiaCAtIGFoO1xuICAgICAgICByZXR1cm4gYW5nbGUgPCAwID8gMiAqIE1hdGguUEkgKyBhbmdsZSA6IGFuZ2xlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIHZlY3RvciB3aXRoIHRoZSBzYW1lIGhlYWRpbmcgd2l0aCB0aGUgaW5wdXQgdmVjdG9yXG4gICAgICogYnV0IHdpdGggbGVuZ3RoID0gMS5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHYgLSBBIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBWZWN0b3Igd2l0aCBsZW5ndGggPSAwLlxuICAgICAqL1xuICAgIHN0YXRpYyBub3JtYWxpemVkKHY6IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgbGV0IGwgPSB2Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGwgPT09IDAgPyB2IDogbmV3IFZlYzIodi54IC8gbCwgdi55IC8gbCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5cbi8qKiBDbGFzcyByZXByZXNlbnRpbmcgYSB3YWxsXG4gKiBXYWxscyBhcmUgb2JqZWN0cyB0aGF0IGFyZSBpbW1vdmFibGUgIGFuZCB0aGV5IGFyZSByaWdpZFxuICogSXQgY2FuIGJlIGNvbnZleCBvciBjb25jYXZlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGwge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHdhbGxcbiAgICAgKiBAcGFyYW0ge0FycmF5PFZlYzI+fSBwb2ludHMgQXJyYXkgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCB0aGUgd2FsbFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb2ludHM6IEFycmF5PFZlYzI+KSB7XG4gICAgICAgIGxldCBwb2wgPSB0aGlzLnBvaW50cztcbiAgICAgICAgbGV0IHN1bTEgPSAwO1xuICAgICAgICBsZXQgc3VtMiA9IDA7XG4gICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXSxcbiAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDJdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgaWYgKHN1bTIgPiBzdW0xKSByZXR1cm47XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwb2wubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHRlbXAucHVzaChwb2xbaV0pO1xuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gZm9yIGNvbGxpc2lvbiBkZXRlY3Rpb24gYW5kIGJlaGF2aW9yIGJldHdlZW4gYmFsbHMgYW5kIHdhbGxzXG4gICAgICogQHBhcmFtIHtCYWxsfSBiYWxsIFRoZSBiYWxsIHRoYXQgaXMgY2hlY2tlZCBpZiBpdCBjb2xsaWRlcyB3aXRoIHRoZSB3YWxsXG4gICAgICovXG4gICAgY29sbGlkZVdpdGhCYWxsKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGhlYWRpbmc6IG51bWJlcjtcbiAgICAgICAgbGV0IHJlbDogbnVtYmVyO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBwLnggLT0gYmFsbC5wb3MueDtcbiAgICAgICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICAgICAgcC5tdWx0KC0xKTtcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA8PSBiYWxsLnIpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gcC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgbGV0IG5wID0gbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueSk7XG4gICAgICAgICAgICBsZXQgYnAgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFZlYzIobnAueCAtIHAueCwgbnAueSAtIHAueSk7XG4gICAgICAgICAgICBsZXQgaCA9IHNpZGUuaGVhZGluZztcbiAgICAgICAgICAgIHAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBucC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGJwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbGV0IGQgPSBicC55IC0gKChwLnkgKyBucC55KSAvIDIpO1xuICAgICAgICAgICAgaWYgKGQgPj0gLWJhbGwuciAmJiBkIDw9IGJhbGwuciAmJiBicC54ID49IG5wLnggJiYgYnAueCA8PSBwLngpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gaCAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHJlbCA9IGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChoZWFkaW5nID09PSAwIHx8IGhlYWRpbmcpIHtcbiAgICAgICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCB2ZWwgPSBuZXcgVmVjMihiYWxsLnZlbC54LCBiYWxsLnZlbC55KTtcbiAgICAgICAgICAgIHBvcy5yb3RhdGUoLWhlYWRpbmcgKyBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2ZWwucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuXG4gICAgICAgICAgICB2ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgICAgcG9zLnkgKz0gYmFsbC5yIC0gcmVsO1xuICAgICAgICAgICAgbGV0IGR2eSA9IHZlbC55ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuICAgICAgICAgICAgbGV0IGR2eCA9XG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZHZ5KSAqIGJhbGwuZmMgKlxuICAgICAgICAgICAgICAgIE1hdGguc2lnbih2ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSAqIC0xO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGR2eCkgPiBNYXRoLmFicyh2ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSkge1xuICAgICAgICAgICAgICAgIGR2eCA9IC12ZWwueCArIGJhbGwuYW5nICogYmFsbC5yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmVsLnggKz1cbiAgICAgICAgICAgICAgICBkdnggLSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgICAgIChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKTtcbiAgICAgICAgICAgIGJhbGwuYW5nIC09XG4gICAgICAgICAgICAgICAgYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgICAgICAoKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pICogYmFsbC5yKTtcbiAgICAgICAgICAgIHBvcy5yb3RhdGUoaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHZlbC5yb3RhdGUoaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIGJhbGwucG9zLnggPSBwb3MueDtcbiAgICAgICAgICAgIGJhbGwucG9zLnkgPSBwb3MueTtcbiAgICAgICAgICAgIGJhbGwudmVsLnggPSB2ZWwueDtcbiAgICAgICAgICAgIGJhbGwudmVsLnkgPSB2ZWwueTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
