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
        if (ball1.collided(ball2)) {
            let pos1 = ball1.pos;
            let pos2 = ball2.pos;
            let r1 = ball1.r;
            let r2 = ball2.r;
            let kk = (ball1.k + ball2.k) / 2;
            let m1 = r1 * r1;
            let m2 = r2 * r2;
            let v1 = ball1.vel;
            let v2 = ball2.vel;
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
            let np1 = cp1.copy;
            let np2 = cp2.copy;
            let v1n = v1.copy;
            let angle = vec2_1.default.angleACW(new vec2_1.default(v1.x, v1.y), new vec2_1.default(np2.x - np1.x, np2.y - np1.y));
            v1n.rotate(angle);
            v1n.mult(Math.cos(angle));
            let v2n = v2.copy;
            angle = vec2_1.default.angleACW(new vec2_1.default(v2.x, v2.y), new vec2_1.default(np1.x - np2.x, np1.y - np2.y));
            v2n.rotate(angle);
            v2n.mult(Math.cos(angle));
            let v1p = v1.copy;
            angle = vec2_1.default.angleACW(new vec2_1.default(v1.x, v1.y), new vec2_1.default(np2.x - np1.x, np2.y - np1.y));
            v1p.rotate(-Math.PI / 2 + angle);
            v1p.mult(Math.sin(angle));
            let v2p = v2.copy;
            angle = vec2_1.default.angleACW(new vec2_1.default(v2.x, v2.y), new vec2_1.default(np1.x - np2.x, np1.y - np2.y));
            v2p.rotate(-Math.PI / 2 + angle);
            v2p.mult(Math.sin(angle));
            let u1n = vec2_1.default.mult(v1n, m1);
            u1n.add(vec2_1.default.mult(v2n, m2));
            u1n.mult(1 + kk);
            u1n.div(m1 + m2);
            u1n.sub(vec2_1.default.mult(v1n, kk));
            let u2n = vec2_1.default.mult(v1n, m1);
            u2n.add(vec2_1.default.mult(v2n, m2));
            u2n.mult(1 + kk);
            u2n.div(m1 + m2);
            u2n.sub(vec2_1.default.mult(v2n, kk));
            let dv1n = vec2_1.default.dist(u1n, v1n);
            let dv2n = vec2_1.default.dist(u2n, v2n);
            let p1 = new vec2_1.default(v1.x, v1.y);
            let p2 = new vec2_1.default(v2.x, v2.y);
            let rot = new vec2_1.default(np1.x - np2.x, np1.y - np2.y).heading;
            p1.rotate(-rot + Math.PI / 2);
            p2.rotate(-rot + Math.PI / 2);
            let vk = (m1 * (p1.x + ball1.ang * r1) +
                m2 * (p2.x - ball2.ang * r2)) / (m1 + m2);
            let dv1p = -dv1n * fc * Math.sign(p1.x - ball1.ang * r1 - vk);
            if (Math.abs(dv1p) > Math.abs(p1.x - ball1.ang * r1 - vk)) {
                dv1p = -p1.x + ball1.ang * r1 + vk;
            }
            let dv2p = -dv2n * fc * Math.sign(p2.x + ball2.ang * r2 - vk);
            if (Math.abs(dv2p) > Math.abs(p2.x + ball2.ang * r2 - vk)) {
                dv2p = -p2.x - ball2.ang * r2 + vk;
            }
            let dv1 = new vec2_1.default(dv1p + ball1.r * ball1.r * ball1.m * dv1p /
                (ball1.am + ball1.r * ball1.r * ball1.m), 0);
            let dv2 = new vec2_1.default(dv2p - ball2.r * ball2.r * ball2.m * dv2p /
                (ball2.am + ball2.r * ball2.r * ball2.m), 0);
            dv1.rotate(rot - Math.PI / 2);
            dv2.rotate(rot - Math.PI / 2);
            v1n = u1n;
            v2n = u2n;
            ball1.vel = vec2_1.default.add(v1n, v1p);
            ball2.vel = vec2_1.default.add(v2n, v2p);
            ball1.ang -= ball1.r * ball1.r * ball1.m * dv1p /
                ((ball1.am + ball1.r * ball1.r * ball1.m) * r1);
            ball2.ang += ball1.r * ball1.r * ball1.m * dv2p /
                ((ball2.am + ball2.r * ball2.r * ball2.m) * r2);
            ball1.vel.x += dv1.x;
            ball1.vel.y += dv1.y;
            ball2.vel.x += dv2.x;
            ball2.vel.y += dv2.y;
            ball1.lastPos = cp1;
            ball2.lastPos = cp2;
        }
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
module.exports = Body;

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
        let clonedSystem;
        if (precise) {
            clonedSystem = this.copy;
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
                    !this.balls[i].layer && !this.balls[j].layer) {
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
                let rel;
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
        for (let i = 0; i < this.resolution; i++) {
            let newPos = new vec2_1.default(pos.x, pos.y);
            newPos.add(vec2_1.default.mult(vec2_1.default.fromAngle((i / this.resolution) * Math.PI * 2), r));
            this.points.push(new ball_1.default(newPos, new vec2_1.default(0, 0), r * Math.sin(Math.PI / this.resolution), 0, 0, this.fc));
        }
        this.sides = [];
        for (let i = 0; i < this.resolution; i++) {
            let side = new stick_1.default(2 * r * Math.sin(Math.PI / this.resolution));
            side.attachObject(this.points[i]);
            side.attachObject(this.points[(i + 1) % this.resolution]);
            // if (i % 2 === 0) side.lockRotation();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFsbC50cyIsInNyYy9ib2R5LnRzIiwic3JjL2xpbmVzZWdtZW50LnRzIiwic3JjL3BoeXNpY3MudHMiLCJzcmMvc29mdGJhbGwudHMiLCJzcmMvc3ByaW5nLnRzIiwic3JjL3N0aWNrLnRzIiwic3JjL3ZlYzIudHMiLCJzcmMvd2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsaUNBQTBCO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFxQixJQUFJO0lBWXZCOzs7Ozs7Ozs7T0FTRztJQUNILFlBQVksR0FBUyxFQUFFLEdBQVMsRUFBRSxDQUFTLEVBQ3pDLENBQVMsRUFBRSxHQUFXLEVBQUUsRUFBVTtRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksR0FBRztZQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztZQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRWpDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRWxCLElBQUksR0FBRyxJQUFJLFNBQVM7WUFBRSxJQUFJ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QUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQUksSUFBSSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRS9CLElBQUksRUFBRSxHQUFHLElBQUksY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksRUFBRSxHQUFHLElBQUksY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksR0FBRyxHQUFHLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFFekQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ3BDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTVDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtnQkFDekQsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7YUFDcEM7WUFDRCxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Z0JBQ3pELElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQ3BDO1lBQ0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUk7Z0JBQzFELENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksR0FBRyxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJO2dCQUMx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QUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUQsT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDMUIsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFFUixJQUFJLElBQUksR0FBRyxjQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQzlDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0MsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNuQixFQUFFLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXhELElBQUksQ0FBQyxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNmO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksT0FBTyxFQUFFO1lBQzFCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNwQixJQUFJLEVBQUUsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsSUFBSSxFQUFFLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFakMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDWixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRVosR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVyQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFaEMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRS9DLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUMzQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQUUsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUUvRCxJQUFJLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVyQixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUViLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6QixJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQ2pDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDbEMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXZDLElBQUksSUFBSSxLQUFLLENBQUM7WUFDZCxJQUFJLElBQUksS0FBSyxDQUFDO1lBRWQsSUFBSSxHQUFHLEdBQUcsY0FBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVCLElBQUksR0FBRyxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1osRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVaLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFFZCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSCxtQkFBbUI7UUFDZixJQUFJLFFBQVEsR0FBdUIsRUFBRSxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFrQixFQUFFLElBQVksRUFBRSxFQUFFO2dCQUNsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTt3QkFBRSxPQUFPLElBQUksQ0FBQztpQkFDcEM7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxvQkFBb0IsR0FBRyxVQUFTLE9BQW9CLEVBQ3RELEdBQWdCLEVBQUUsVUFBeUI7Z0JBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRTt3QkFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxxQkFBVyxDQUFDLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNuRCxJQUFJLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxJQUFJLHFCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7NEJBQUUsT0FBTyxJQUFJLENBQUM7cUJBQ3pEO2lCQUNKO2dCQUNELE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztZQUNGLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUVqQixnQkFBZ0IsRUFBRSxPQUFPLEtBQUssRUFBRTtnQkFDNUIsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsSUFBSSxDQUFDLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7d0JBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUM7d0JBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2QsSUFBSSxPQUFPLEdBQ1AsSUFBSSxxQkFBVyxDQUFDLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN4QyxJQUFJLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQzFCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLElBQUksY0FBYyxHQUNkLENBQUMsSUFBSSxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7d0JBQzVDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUM1QixDQUFDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPO2dDQUN4QixjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7Z0NBQzdCLENBQUMsY0FBYyxHQUFHLENBQUM7b0NBQ2YsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3RDLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPO2dDQUN2QixjQUFjLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNoQyxvQkFBb0IsQ0FDaEIsSUFBSSxxQkFBVyxDQUFDLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3RCLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDL0IsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNO2dDQUNuQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU07Z0NBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU07Z0NBQ3BCLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTTs2QkFDYixDQUFDLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLENBQUM7NEJBQ0osT0FBTyxHQUFHLElBQUkscUJBQVcsQ0FDckIsSUFBSSxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDYixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2IsSUFBSSxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUMxQixHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoQyxjQUFjLEdBQUcsQ0FDYixJQUFJLGNBQUksQ0FDSixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDOUIsT0FBTyxDQUFDO3lCQUNoQjt3QkFDRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7d0JBQ2QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO3dCQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDbEM7d0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7eUJBQ2xDO3dCQUNELFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3BCLFNBQVMsZ0JBQWdCLENBQUM7cUJBQzdCO29CQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNqQyxJQUFJLENBQUMsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BELElBQUksQ0FBQyxHQUFHLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7NEJBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUM7NEJBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDZCxJQUFJLE9BQU8sR0FBRyxJQUFJLHFCQUFXLENBQ3pCLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNiLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsSUFBSSxjQUFjLEdBQUcsQ0FDakIsSUFBSSxjQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzlCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQzlCLE9BQU8sQ0FBQzs0QkFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQ0FDNUIsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsT0FBTztvQ0FDeEIsY0FBYyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO29DQUM3QixDQUFDLGNBQWMsR0FBRyxDQUFDO3dDQUNmLGNBQWMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUN0QyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsT0FBTztvQ0FDdkIsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQ0FDaEMsb0JBQW9CLENBQ2hCLE9BQU8sRUFDUCxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTTtvQ0FDMUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNO29DQUNkLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNO29DQUNwQixDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU07aUNBQ2IsQ0FBQyxFQUFFO2dDQUNSLENBQUMsRUFBRSxDQUFDO2dDQUNKLE9BQU8sR0FBRyxJQUFJLHFCQUFXLENBQ3JCLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNiLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDaEMsY0FBYyxHQUFHLENBQ2IsSUFBSSxjQUFJLENBQ0osT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUNBQzlCLE9BQU8sQ0FBQzs2QkFDaEI7NEJBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOzRCQUNkLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs0QkFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dDQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NkJBQ2xDOzRCQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzZCQUNsQzs0QkFDRCxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDOzRCQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwQixTQUFTLGdCQUFnQixDQUFDO3lCQUM3QjtxQkFDSjtpQkFDSjthQUNKO1NBQ0o7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7UUFFRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRWQsNENBQTRDO1FBQzVDLEtBQUssSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUN4QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsRUFBRSxJQUFJLElBQUksY0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQy9DLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEUsS0FBSyxJQUFJLEVBQUUsQ0FBQztTQUNmO1FBQ0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsS0FBYTtRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3RCLElBQUksS0FBSyxHQUFHLElBQUksY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksU0FBUztRQUNULElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDOUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLEtBQUssR0FBRyxjQUFJLENBQUMsUUFBUSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMs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QyxDQUFDLEVBQUU7Z0JBQy9CLElBQUksU0FBUyxDQUFDO2dCQUNkLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdCLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNILFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO2dCQUNELElBQUksU0FBUyxDQUFDO2dCQUNkLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdCLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNILFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO2dCQUNELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUMvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlCLENBQUM7Z0JBQ0YsSUFBSSxRQUFRLENB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Q0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN2RCxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDbEM7b0JBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDM0MsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BCO2FBQ0Y7WUFFRCx1QkFBdUI7WUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzFELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRDtxQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRDtnQkFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRDtxQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNqRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUU7d0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUM1RCxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO29CQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHO3dCQUNoRCxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxD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Q0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0MsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbEUsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxJQUFJLENB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QyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBTyxFQUFFLENBQU87UUFDdkIsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFPLEVBQUUsQ0FBUztRQUMxQixPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFPLEVBQUUsQ0FBUztRQUN6QixPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQVM7UUFDdEIsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFPLEVBQUUsQ0FBTyxFQUFFLENBQVM7UUFDbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFB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RyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRztvQkFDcEMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEdBQUc7Z0JBQ0osSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRztvQkFDOUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdEI7SUFDTCxDQUFDO0NBQ0o7QUE5RkQsdUJBOEZDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcblxuLyoqXG4gKiBBIGNsYXNzIHJlcHJlc2VudGluZyBhIGJhbGxcbiAqIEEgYmFsbCBpcyBhbiBvYmplY3QgaW4gdGhlIHBoeXNpY3MgZW5naW5lIHRoYXRcbiAqIGhhcyBhIHNoYXBlIG9mIGEgY2lyY2xlIGFuZCBpdCBpcyBhZmZlY3RlZCBieSBncmF2aXR5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhbGwge1xuICBwb3M6IFZlYzI7XG4gIGxhc3RQb3M6IFZlYzI7XG4gIHI6IG51bWJlcjtcbiAgZmM6IG51bWJlcjtcbiAgYW1jOiBudW1iZXI7XG4gIHJvdGF0aW9uOiBudW1iZXI7XG4gIGFuZzogbnVtYmVyO1xuICBrOiBudW1iZXI7XG4gIHZlbDogVmVjMjtcbiAgbGF5ZXI6IGFueTtcblxuICAvKipcbiAgICogQ3JldGUgYSBiYWxsXG4gICAqIFRoZSBtYXNzIG9mIHRoZSBiYWxsIGlzIGNhbGN1bGF0ZWQgZnJvbSBpdHMgcmFkaXVzXG4gICAqIEBwYXJhbSB7VmVjMn0gcG9zIFRoZSBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGVcbiAgICogQHBhcmFtIHtWZWMyfSB2ZWwgVGhlIHZlbG9jaXR5IG9mIHRoZSBjaXJjbGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHIgVGhlIHJhZGl1cyBvZiB0aGUgY2lyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IGsgQ29lZmZpY2llbnQgb2YgcmVzdGl0dXRpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IGFuZyBUaGUgYW5ndWxhciB2ZWxvY2l0eSBvZiB0aGUgYmFsbCAob3B0aW9uYWwpXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmYyBUaGUgZnJpY3Rpb24gY29lZmZpY2llbnQgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byAwLjQpXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwb3M6IFZlYzIsIHZlbDogVmVjMiwgcjogbnVtYmVyLFxuICAgIGs6IG51bWJlciwgYW5nOiBudW1iZXIsIGZjOiBudW1iZXIpIHtcbiAgICB0aGlzLnBvcyA9IHBvcy5jb3B5O1xuICAgIHRoaXMubGFzdFBvcyA9IHRoaXMucG9zLmNvcHk7XG4gICAgdGhpcy5yID0gcjtcbiAgICB0aGlzLmZjID0gMC40O1xuICAgIHRoaXMuYW1jID0gMiAvIDU7XG5cbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcblxuICAgIGlmIChhbmcpIHRoaXMuYW5nID0gYW5nO1xuICAgIGVsc2UgdGhpcy5hbmcgPSAwO1xuXG4gICAgaWYgKGZjIHx8IGZjID09PSAwKSB0aGlzLmZjID0gZmM7XG5cbiAgICBpZiAoaykgdGhpcy5rID0gaztcbiAgICBlbHNlIHRoaXMuayA9IDAuODtcblxuICAgIGlmICh2ZWwgIT0gdW5kZWZpbmVkKSB0aGlzLnZlbCA9IHZlbC5jb3B5O1xuICAgIGVsc2UgdGhpcy52ZWwgPSBuZXcgVmVjMigwLCAwKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbWFzcyBvZiB0aGUgYmFsbFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBtYXNzXG4gICAqL1xuICBnZXQgbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnIgKiB0aGlzLnIgKiBNYXRoLlBJO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbW9tZW50IG9mIGluZXJ0aWEgb2YgdGhlIGJhbGxcbiAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbW9tZW50IG9mIGluZXJ0aWFcbiAgICovXG4gIGdldCBhbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmFtYyAqIHRoaXMuciAqIHRoaXMuciAqIHRoaXMubTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBjb3B5IG9mIHRoZSBiYWxsIHRoYXQgaXMgbm90IGEgcmVmZXJlbmNlIHRvIGl0XG4gICAqIEByZXR1cm4ge0JhbGx9IFRoZSBjb3B5IG9mIHRoZSBiYWxsXG4gICAqL1xuICBnZXQgY29weSgpOiBCYWxsIHtcbiAgICBsZXQgcmV0ID1cbiAgICAgIG5ldyBCYWxsKHRoaXMucG9zLmNvcHksIHRoaXMudmVsLmNvcHksIHRoaXMuciwgdGhpcy5rLCB0aGlzLmFuZywgdGhpcy5mYyk7XG4gICAgcmV0Lmxhc3RQb3MgPSB0aGlzLmxhc3RQb3MuY29weTtcbiAgICByZXQucm90YXRpb24gPSB0aGlzLnJvdGF0aW9uO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIGJhbGwgYnkgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4IHggY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0geSB5IGNvb3JkaW5hdGVcbiAgICovXG4gIG1vdmUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLnBvcy54ICs9IHg7XG4gICAgdGhpcy5wb3MueSArPSB5O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0d28gYmFsbHMgYXJlIGNvbGxpZGluZyBvciBub3RcbiAgICogQHBhcmFtIHtCYWxsfSBiYWxsIHRoZSBvdGhlciBiYWxsXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhleSBjb2xpZHJlXG4gICAqL1xuICBjb2xsaWRlZChiYWxsOiBCYWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMucG9zLmRpc3QoYmFsbC5wb3MpIDwgKHRoaXMuciArIGJhbGwucikpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBmdW5jdGlvbiBmb3IgY29sbGlzaW9uIGJldHdlZW4gdHdvIGJhbGxzXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbDEgRmlyc3QgYmFsbFxuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwyIFNlY29uZCBiYWxsXG4gICAqL1xuICBzdGF0aWMgY29sbGlkZShiYWxsMTogQmFsbCwgYmFsbDI6IEJhbGwpIHtcbiAgICBpZiAoYmFsbDEuY29sbGlkZWQoYmFsbDIpKSB7XG4gICAgICBsZXQgcG9zMSA9IGJhbGwxLnBvcztcbiAgICAgIGxldCBwb3MyID0gYmFsbDIucG9zO1xuICAgICAgbGV0IHIxID0gYmFsbDEucjtcbiAgICAgIGxldCByMiA9IGJhbGwyLnI7XG4gICAgICBsZXQga2sgPSAoYmFsbDEuayArIGJhbGwyLmspIC8gMjtcbiAgICAgIGxldCBtMSA9IHIxICogcjE7XG4gICAgICBsZXQgbTIgPSByMiAqIHIyO1xuICAgICAgbGV0IHYxID0gYmFsbDEudmVsO1xuICAgICAgbGV0IHYyID0gYmFsbDIudmVsO1xuICAgICAgbGV0IGRpc3QgPSBWZWMyLmRpc3QocG9zMSwgcG9zMik7XG4gICAgICBsZXQgZmMgPSAoYmFsbDEuZmMgKyBiYWxsMi5mYykgLyAyO1xuXG4gICAgICBsZXQgY3AxID0gcG9zMS5jb3B5O1xuICAgICAgbGV0IGNwMiA9IHBvczIuY29weTtcbiAgICAgIGxldCB0b28gPSByMSArIHIyIC0gZGlzdDtcbiAgICAgIGxldCBkID0gVmVjMi5zdWIocG9zMSwgcG9zMik7XG4gICAgICBkLnNldE1hZygxKTtcbiAgICAgIGQubXVsdCh0b28gKiBtMiAvIChtMSArIG0yKSk7XG4gICAgICBjcDEuYWRkKGQpO1xuICAgICAgZC5zZXRNYWcoMSk7XG4gICAgICBkLm11bHQoLXRvbyAqIG0xIC8gKG0xICsgbTIpKTtcbiAgICAgIGNwMi5hZGQoZCk7XG5cbiAgICAgIGJhbGwxLnBvcyA9IGNwMTtcbiAgICAgIGJhbGwyLnBvcyA9IGNwMjtcbiAgICAgIGxldCBucDEgPSBjcDEuY29weTtcbiAgICAgIGxldCBucDIgPSBjcDIuY29weTtcblxuICAgICAgbGV0IHYxbiA9IHYxLmNvcHk7XG4gICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKG5ldyBWZWMyKHYxLngsIHYxLnkpLFxuICAgICAgICBuZXcgVmVjMihucDIueCAtIG5wMS54LCBucDIueSAtIG5wMS55KSk7XG4gICAgICB2MW4ucm90YXRlKGFuZ2xlKTtcbiAgICAgIHYxbi5tdWx0KE1hdGguY29zKGFuZ2xlKSk7XG4gICAgICBsZXQgdjJuID0gdjIuY29weTtcbiAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhuZXcgVmVjMih2Mi54LCB2Mi55KSxcbiAgICAgICAgbmV3IFZlYzIobnAxLnggLSBucDIueCwgbnAxLnkgLSBucDIueSkpO1xuICAgICAgdjJuLnJvdGF0ZShhbmdsZSk7XG4gICAgICB2Mm4ubXVsdChNYXRoLmNvcyhhbmdsZSkpO1xuXG4gICAgICBsZXQgdjFwID0gdjEuY29weTtcbiAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhuZXcgVmVjMih2MS54LCB2MS55KSxcbiAgICAgICAgbmV3IFZlYzIobnAyLnggLSBucDEueCwgbnAyLnkgLSBucDEueSkpO1xuICAgICAgdjFwLnJvdGF0ZSgtTWF0aC5QSSAvIDIgKyBhbmdsZSk7XG4gICAgICB2MXAubXVsdChNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgbGV0IHYycCA9IHYyLmNvcHk7XG4gICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1cobmV3IFZlYzIodjIueCwgdjIueSksXG4gICAgICAgIG5ldyBWZWMyKG5wMS54IC0gbnAyLngsIG5wMS55IC0gbnAyLnkpKTtcbiAgICAgIHYycC5yb3RhdGUoLU1hdGguUEkgLyAyICsgYW5nbGUpO1xuICAgICAgdjJwLm11bHQoTWF0aC5zaW4oYW5nbGUpKTtcblxuICAgICAgbGV0IHUxbiA9IFZlYzIubXVsdCh2MW4sIG0xKTtcbiAgICAgIHUxbi5hZGQoVmVjMi5tdWx0KHYybiwgbTIpKTtcbiAgICAgIHUxbi5tdWx0KDEgKyBrayk7XG4gICAgICB1MW4uZGl2KG0xICsgbTIpO1xuICAgICAgdTFuLnN1YihWZWMyLm11bHQodjFuLCBraykpO1xuXG4gICAgICBsZXQgdTJuID0gVmVjMi5tdWx0KHYxbiwgbTEpO1xuICAgICAgdTJuLmFkZChWZWMyLm11bHQodjJuLCBtMikpO1xuICAgICAgdTJuLm11bHQoMSArIGtrKTtcbiAgICAgIHUybi5kaXYobTEgKyBtMik7XG4gICAgICB1Mm4uc3ViKFZlYzIubXVsdCh2Mm4sIGtrKSk7XG5cbiAgICAgIGxldCBkdjFuID0gVmVjMi5kaXN0KHUxbiwgdjFuKTtcbiAgICAgIGxldCBkdjJuID0gVmVjMi5kaXN0KHUybiwgdjJuKTtcblxuICAgICAgbGV0IHAxID0gbmV3IFZlYzIodjEueCwgdjEueSk7XG4gICAgICBsZXQgcDIgPSBuZXcgVmVjMih2Mi54LCB2Mi55KTtcbiAgICAgIGxldCByb3QgPSBuZXcgVmVjMihucDEueCAtIG5wMi54LCBucDEueSAtIG5wMi55KS5oZWFkaW5nO1xuXG4gICAgICBwMS5yb3RhdGUoLXJvdCArIE1hdGguUEkgLyAyKTtcbiAgICAgIHAyLnJvdGF0ZSgtcm90ICsgTWF0aC5QSSAvIDIpO1xuICAgICAgbGV0IHZrID0gKG0xICogKHAxLnggKyBiYWxsMS5hbmcgKiByMSkgK1xuICAgICAgICBtMiAqIChwMi54IC0gYmFsbDIuYW5nICogcjIpKSAvIChtMSArIG0yKTtcblxuICAgICAgbGV0IGR2MXAgPSAtZHYxbiAqIGZjICogTWF0aC5zaWduKHAxLnggLSBiYWxsMS5hbmcgKiByMSAtIHZrKTtcbiAgICAgIGlmIChNYXRoLmFicyhkdjFwKSA+IE1hdGguYWJzKHAxLnggLSBiYWxsMS5hbmcgKiByMSAtIHZrKSkge1xuICAgICAgICBkdjFwID0gLXAxLnggKyBiYWxsMS5hbmcgKiByMSArIHZrO1xuICAgICAgfVxuICAgICAgbGV0IGR2MnAgPSAtZHYybiAqIGZjICogTWF0aC5zaWduKHAyLnggKyBiYWxsMi5hbmcgKiByMiAtIHZrKTtcbiAgICAgIGlmIChNYXRoLmFicyhkdjJwKSA+IE1hdGguYWJzKHAyLnggKyBiYWxsMi5hbmcgKiByMiAtIHZrKSkge1xuICAgICAgICBkdjJwID0gLXAyLnggLSBiYWxsMi5hbmcgKiByMiArIHZrO1xuICAgICAgfVxuICAgICAgbGV0IGR2MSA9IG5ldyBWZWMyKGR2MXAgKyBiYWxsMS5yICogYmFsbDEuciAqIGJhbGwxLm0gKiBkdjFwIC9cbiAgICAgICAgKGJhbGwxLmFtICsgYmFsbDEuciAqIGJhbGwxLnIgKiBiYWxsMS5tKSwgMCk7XG4gICAgICBsZXQgZHYyID0gbmV3IFZlYzIoZHYycCAtIGJhbGwyLnIgKiBiYWxsMi5yICogYmFsbDIubSAqIGR2MnAgL1xuICAgICAgICAoYmFsbDIuYW0gKyBiYWxsMi5yICogYmFsbDIuciAqIGJhbGwyLm0pLCAwKTtcbiAgICAgIGR2MS5yb3RhdGUocm90IC0gTWF0aC5QSSAvIDIpO1xuICAgICAgZHYyLnJvdGF0ZShyb3QgLSBNYXRoLlBJIC8gMik7XG5cbiAgICAgIHYxbiA9IHUxbjtcbiAgICAgIHYybiA9IHUybjtcblxuICAgICAgYmFsbDEudmVsID0gVmVjMi5hZGQodjFuLCB2MXApO1xuICAgICAgYmFsbDIudmVsID0gVmVjMi5hZGQodjJuLCB2MnApO1xuXG4gICAgICBiYWxsMS5hbmcgLT0gYmFsbDEuciAqIGJhbGwxLnIgKiBiYWxsMS5tICogZHYxcCAvXG4gICAgICAgICgoYmFsbDEuYW0gKyBiYWxsMS5yICogYmFsbDEuciAqIGJhbGwxLm0pICogcjEpO1xuICAgICAgYmFsbDIuYW5nICs9IGJhbGwxLnIgKiBiYWxsMS5yICogYmFsbDEubSAqIGR2MnAgL1xuICAgICAgICAoKGJhbGwyLmFtICsgYmFsbDIuciAqIGJhbGwyLnIgKiBiYWxsMi5tKSAqIHIyKTtcbiAgICAgIGJhbGwxLnZlbC54ICs9IGR2MS54O1xuICAgICAgYmFsbDEudmVsLnkgKz0gZHYxLnk7XG4gICAgICBiYWxsMi52ZWwueCArPSBkdjIueDtcbiAgICAgIGJhbGwyLnZlbC55ICs9IGR2Mi55O1xuXG4gICAgICBiYWxsMS5sYXN0UG9zID0gY3AxO1xuICAgICAgYmFsbDIubGFzdFBvcyA9IGNwMjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuaW1wb3J0IExpbmVTZWdtZW50IGZyb20gJy4vbGluZXNlZ21lbnQnO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIGJvZHlcbiAqIEJvZGllcyBhcmUgbW92YWJsZSBvYmplY3RzXG4gKiBhbmQgdGhleSBjb2xsaWRlIHdpdGggb3RoZXIgb2JqZWN0cyAoYmFsbHMpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvZHkge1xuICAgIHBvaW50czogQXJyYXk8VmVjMj47XG4gICAgbGFzdFBvczogVmVjMjtcbiAgICBwb3M6IFZlYzI7XG4gICAgZmM6IG51bWJlcjtcbiAgICByb3RhdGlvbjogbnVtYmVyO1xuICAgIGFuZzogbnVtYmVyO1xuICAgIGs6IG51bWJlcjtcbiAgICB2ZWw6IFZlYzI7XG4gICAgbTogbnVtYmVyO1xuICAgIGFtOiBudW1iZXI7XG4gICAgbGF5ZXI6IGFueTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBib2R5IGFuZCBjYWxjdWxhdGVzIGl0J3MgY2VudHJlIG9mIG1hc3MgKHBvc2l0aW9uKVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyBUaGUgcG9pbnRzIHRoYXQgbWFrZSB1cCB0aGUgYm9keVxuICAgICAqIEBwYXJhbSB7VmVjMn0gdmVsIFRoZSB2ZWxvY2l0eSBvZiB0aGUgYm9keVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBrIENvZWZmaWNpZW50IG9mIHJlc3RpdHV0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZyBBbmd1bGFyIHZlbG9jaXR5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZjIEZyaWN0aW9uIGNvZWZmaWNpZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9pbnRzOiBBcnJheTxWZWMyPiwgdmVsOiBWZWMyLFxuICAgICAgICBrOiBudW1iZXIsIGFuZzogbnVtYmVyLCBmYzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuXG4gICAgICAgIGxldCBwb2wgPSB0aGlzLnBvaW50cztcbiAgICAgICAgbGV0IHN1bTEgPSAwO1xuICAgICAgICBsZXQgc3VtMiA9IDA7XG4gICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXSxcbiAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDJdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgaWYgKHN1bTIgPCBzdW0xKSB7XG4gICAgICAgICAgICBsZXQgdGVtcCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHBvbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgdGVtcC5wdXNoKHBvbFtpXSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50cyA9IHRlbXA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBvc0FuZE1hc3MoKTtcbiAgICAgICAgdGhpcy5sYXN0UG9zID0gdGhpcy5wb3MuY29weTtcbiAgICAgICAgdGhpcy5mYyA9IDAuNDtcblxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gMDtcblxuICAgICAgICBpZiAoYW5nKSB0aGlzLmFuZyA9IGFuZztcbiAgICAgICAgZWxzZSB0aGlzLmFuZyA9IDA7XG5cbiAgICAgICAgaWYgKGZjIHx8IGZjID09PSAwKSB0aGlzLmZjID0gZmM7XG5cbiAgICAgICAgaWYgKGspIHRoaXMuayA9IGs7XG4gICAgICAgIGVsc2UgdGhpcy5rID0gMC44O1xuXG4gICAgICAgIGlmICh2ZWwgIT0gdW5kZWZpbmVkKSB0aGlzLnZlbCA9IHZlbC5jb3B5O1xuICAgICAgICBlbHNlIHRoaXMudmVsID0gbmV3IFZlYzIoMCwgMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgY29weSBvZiB0aGUgYm9keSB0aGF0IGlzIG5vdCBhIHJlZmVyZW5jZSB0byBpdFxuICAgICAqIEByZXR1cm4ge0JvZHl9IFRoZSBjb3B5IG9mIHRoZSBib2R5XG4gICAgICovXG4gICAgZ2V0IGNvcHkoKTogQm9keSB7XG4gICAgICAgIGxldCBwb2ludHNDb3B5ID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBvaW50c0NvcHkucHVzaChuZXcgVmVjMih0aGlzLnBvaW50c1tpXS54LCB0aGlzLnBvaW50c1tpXS55KSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJldCA9IG5ldyBCb2R5KHBvaW50c0NvcHksIHRoaXMudmVsLmNvcHksXG4gICAgICAgICAgICB0aGlzLmssIHRoaXMuYW5nLCB0aGlzLmZjKTtcbiAgICAgICAgcmV0LnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbjtcbiAgICAgICAgcmV0Lmxhc3RQb3MgPSB0aGlzLmxhc3RQb3MuY29weTtcbiAgICAgICAgcmV0LnBvcyA9IHRoaXMucG9zLmNvcHk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlcyB0aGUgYm9keSBieSB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcbiAgICAgKiBJdCBoYXMgdG8gbW92ZSBhbGwgdGhlIHBvaW50cyBvZiB0aGUgYm9keSBhbmRcbiAgICAgKiBhbHNvIHRoZSBjZW50cmUgb2YgbWFzcyAocG9zKSBvZiB0aGUgYm9keVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIG1vdmUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb3MueCArPSB4O1xuICAgICAgICB0aGlzLnBvcy55ICs9IHk7XG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHAueCArPSB4O1xuICAgICAgICAgICAgcC55ICs9IHk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRoYXQgZG9lcyB0aGUgY29sbGlzaW9uIGRldGVjdGlvbiBhbmRcbiAgICAgKiBjb2xsaXNpb24gYmVoYXZpb3IgYmV0d2VlbiB0aGUgYm9keSBhbmQgYmFsbFxuICAgICAqIEBwYXJhbSB7QmFsbH0gYmFsbCBUaGUgYmFsbCB0byBjb2xsaWRlIHdpdGggdGhlIGJvZHlcbiAgICAgKi9cbiAgICBjb2xsaWRlV2l0aEJhbGwoYmFsbDogQmFsbCkge1xuICAgICAgICBsZXQgaGVhZGluZzogbnVtYmVyO1xuICAgICAgICBsZXQgcmVsOiBudW1iZXI7XG4gICAgICAgIGxldCBjcDtcblxuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgcC54IC09IGJhbGwucG9zLng7XG4gICAgICAgICAgICBwLnkgLT0gYmFsbC5wb3MueTtcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA8PSBiYWxsLnIpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gcC5oZWFkaW5nICsgTWF0aC5QSTtcbiAgICAgICAgICAgICAgICByZWwgPSBwLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGxldCBtb3ZlID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgICAgICAgICAgbW92ZS5tdWx0KGJhbGwuciAtIHJlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKG1vdmUueCAqIC0xICogYmFsbC5tIC8gKHRoaXMubSArIGJhbGwubSksXG4gICAgICAgICAgICAgICAgICAgIG1vdmUueSAqIC0xICogYmFsbC5tIC8gKHRoaXMubSArIGJhbGwubSkpO1xuICAgICAgICAgICAgICAgIGJhbGwubW92ZShtb3ZlLnggKiAxICogdGhpcy5tIC8gKHRoaXMubSArIGJhbGwubSksXG4gICAgICAgICAgICAgICAgICAgIG1vdmUueSAqIDEgKiB0aGlzLm0gLyAodGhpcy5tICsgYmFsbC5tKSk7XG5cbiAgICAgICAgICAgICAgICBjcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcbiAgICAgICAgICAgICAgICBhLm11bHQoLTMwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAgPSBuZXcgVmVjMihwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgIGxldCBucCA9IG5ldyBWZWMyKHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50c1soaWR4ICsgMSkgJSB0aGlzLnBvaW50cy5sZW5ndGhdLnkpO1xuICAgICAgICAgICAgbGV0IGJwID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBWZWMyKG5wLnggLSBwLngsIG5wLnkgLSBwLnkpO1xuICAgICAgICAgICAgbGV0IGggPSBzaWRlLmhlYWRpbmc7XG4gICAgICAgICAgICBwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbnAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBicC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGxldCBkID0gYnAueSAtICgocC55ICsgbnAueSkgLyAyKTtcbiAgICAgICAgICAgIGlmIChkID49IC1iYWxsLnIgJiYgZCA8PSBiYWxsLnIgJiYgYnAueCA+PSBucC54ICYmIGJwLnggPD0gcC54KSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IGggLSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgICByZWwgPSBkO1xuXG4gICAgICAgICAgICAgICAgbGV0IG1vdmUgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcbiAgICAgICAgICAgICAgICBtb3ZlLm11bHQoYmFsbC5yIC0gcmVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUobW92ZS54ICogLTEgKiBiYWxsLm0gLyAodGhpcy5tICsgYmFsbC5tKSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZS55ICogLTEgKiBiYWxsLm0gLyAodGhpcy5tICsgYmFsbC5tKSk7XG4gICAgICAgICAgICAgICAgYmFsbC5tb3ZlKG1vdmUueCAqIDEgKiB0aGlzLm0gLyAodGhpcy5tICsgYmFsbC5tKSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZS55ICogMSAqIHRoaXMubSAvICh0aGlzLm0gKyBiYWxsLm0pKTtcblxuICAgICAgICAgICAgICAgIGNwID0gYmFsbC5wb3MuY29weTtcbiAgICAgICAgICAgICAgICBjcC5hZGQoVmVjMi5tdWx0KFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcgKyBNYXRoLlBJKSwgZCkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcbiAgICAgICAgICAgICAgICBhLm11bHQoLTMwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGhlYWRpbmcgPT09IDAgfHwgaGVhZGluZykge1xuICAgICAgICAgICAgbGV0IHYxID0gdGhpcy52ZWwuY29weTtcbiAgICAgICAgICAgIGxldCB2MiA9IGJhbGwudmVsLmNvcHk7XG4gICAgICAgICAgICBsZXQgYW5nMSA9IHRoaXMuYW5nO1xuICAgICAgICAgICAgbGV0IGFuZzIgPSBiYWxsLmFuZztcbiAgICAgICAgICAgIGxldCByMSA9IFZlYzIuc3ViKGNwLCB0aGlzLnBvcyk7XG4gICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihjcCwgYmFsbC5wb3MpO1xuICAgICAgICAgICAgbGV0IGFtMSA9IHRoaXMuYW07XG4gICAgICAgICAgICBsZXQgYW0yID0gYmFsbC5hbTtcbiAgICAgICAgICAgIGxldCBtMSA9IHRoaXMubTtcbiAgICAgICAgICAgIGxldCBtMiA9IGJhbGwubTtcbiAgICAgICAgICAgIGxldCBrID0gKHRoaXMuayArIGJhbGwuaykgLyAyO1xuICAgICAgICAgICAgbGV0IGZjID0gKHRoaXMuZmMgKyBiYWxsLmZjKSAvIDI7XG5cbiAgICAgICAgICAgIGxldCB2MXYgPSByMS5jb3B5O1xuICAgICAgICAgICAgbGV0IHYydiA9IHIyLmNvcHk7XG4gICAgICAgICAgICB2MXYucm90YXRlKE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHYydi5yb3RhdGUoLU1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHYxdi5tdWx0KGFuZzEpO1xuICAgICAgICAgICAgdjJ2Lm11bHQoYW5nMik7XG4gICAgICAgICAgICB2MXYuYWRkKHYxKTtcbiAgICAgICAgICAgIHYydi5hZGQodjIpO1xuXG4gICAgICAgICAgICB2MXYucm90YXRlKC1oZWFkaW5nKTtcbiAgICAgICAgICAgIHYydi5yb3RhdGUoLWhlYWRpbmcpO1xuXG4gICAgICAgICAgICBsZXQgZHYxdnggPSAoMSArIGspICogKG0xICogdjF2LnggKyBtMiAqIHYydi54KSAvXG4gICAgICAgICAgICAgICAgKG0xICsgbTIpIC0gKGsgKyAxKSAqIHYxdi54O1xuICAgICAgICAgICAgbGV0IGR2MnZ4ID0gKDEgKyBrKSAqIChtMSAqIHYxdi54ICsgbTIgKiB2MnYueCkgL1xuICAgICAgICAgICAgICAgIChtMSArIG0yKSAtIChrICsgMSkgKiB2MnYueDtcblxuICAgICAgICAgICAgbGV0IHZrID0gKHYxdi55ICogbTEgKyB2MnYueSAqIG0yKSAvIChtMSArIG0yKTtcblxuICAgICAgICAgICAgbGV0IGR2MXZ5ID0gLU1hdGguc2lnbih2MXYueSkgKiBmYyAqIGR2MXZ4O1xuICAgICAgICAgICAgbGV0IGR2MnZ5ID0gLU1hdGguc2lnbih2MnYueSkgKiBmYyAqIGR2MnZ4O1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHZrIC0gdjF2LnkpID4gTWF0aC5hYnMoZHYxdnkpKSBkdjF2eSA9IHZrIC0gdjF2Lnk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmsgLSB2MnYueSkgPiBNYXRoLmFicyhkdjJ2eSkpIGR2MnZ5ID0gdmsgLSB2MnYueTtcblxuICAgICAgICAgICAgbGV0IGR2MXYgPSBuZXcgVmVjMihkdjF2eCwgZHYxdnkpO1xuICAgICAgICAgICAgbGV0IGR2MnYgPSBuZXcgVmVjMihkdjJ2eCwgZHYydnkpO1xuICAgICAgICAgICAgZHYxdi5yb3RhdGUoaGVhZGluZyk7XG4gICAgICAgICAgICBkdjJ2LnJvdGF0ZShoZWFkaW5nKTtcblxuICAgICAgICAgICAgdjEuYWRkKGR2MXYpO1xuICAgICAgICAgICAgdjIuYWRkKGR2MnYpO1xuXG4gICAgICAgICAgICBkdjF2LnJvdGF0ZSgtcjEuaGVhZGluZyk7XG4gICAgICAgICAgICBkdjJ2LnJvdGF0ZSgtcjIuaGVhZGluZyk7XG5cbiAgICAgICAgICAgIGxldCBkYW5nMSA9IChkdjF2LnkgKiBtMSAqIHIxLmxlbmd0aCkgL1xuICAgICAgICAgICAgICAgIChhbTEgKyByMS5sZW5ndGggKiByMS5sZW5ndGggKiBtMSk7XG4gICAgICAgICAgICBsZXQgZGFuZzIgPSAtKGR2MnYueSAqIG0yICogcjIubGVuZ3RoKSAvXG4gICAgICAgICAgICAgICAgKGFtMiArIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIG0yKTtcblxuICAgICAgICAgICAgYW5nMSArPSBkYW5nMTtcbiAgICAgICAgICAgIGFuZzIgKz0gZGFuZzI7XG5cbiAgICAgICAgICAgIGxldCB2cDEgPSBWZWMyLmZyb21BbmdsZShyMS5oZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdnAxLm11bHQocjEubGVuZ3RoICogZGFuZzEpO1xuICAgICAgICAgICAgbGV0IHZwMiA9IFZlYzIuZnJvbUFuZ2xlKHIyLmhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2cDIubXVsdChyMi5sZW5ndGggKiBkYW5nMik7XG4gICAgICAgICAgICB2Mi5zdWIodnAyKTtcbiAgICAgICAgICAgIHYxLmFkZCh2cDEpO1xuXG4gICAgICAgICAgICB0aGlzLnZlbCA9IHYxO1xuICAgICAgICAgICAgYmFsbC52ZWwgPSB2MjtcblxuICAgICAgICAgICAgdGhpcy5hbmcgPSBhbmcxO1xuICAgICAgICAgICAgYmFsbC5hbmcgPSBhbmcyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbWFzcywgbW9tZW50IG9kIGludGVydGlhIGFuZFxuICAgICAqIHRoZSBjZW50cmUgb2YgbWFzcyBvZiB0aGUgYm9keVxuICAgICAqL1xuICAgIGNhbGN1bGF0ZVBvc0FuZE1hc3MoKSB7XG4gICAgICAgIGxldCBwb2xpZ29uczogQXJyYXk8QXJyYXk8VmVjMj4+ID0gW107XG4gICAgICAgIHBvbGlnb25zLnB1c2goW10pO1xuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBwb2xpZ29uc1swXS5wdXNoKG5ldyBWZWMyKHAueCwgcC55KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQ29uY2F2ZSkge1xuICAgICAgICAgICAgY29uc3QgaW5jbHVkZXMgPSAoYXJyOiBBcnJheTxudW1iZXI+LCBpdGVtOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldID09PSBpdGVtKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGludGVyc2VjdFdpdGhQb2xpZ29uID0gZnVuY3Rpb24oc2VnbWVudDogTGluZVNlZ21lbnQsXG4gICAgICAgICAgICAgICAgcG9sOiBBcnJheTxWZWMyPiwgZXhjZXB0aW9uczogQXJyYXk8bnVtYmVyPikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9sLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZXMoZXhjZXB0aW9ucywgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtpXS54LCBwb2xbaV0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChMaW5lU2VnbWVudC5pbnRlcnNlY3Qoc2VnbWVudCwgc2lkZSkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlO1xuXG4gICAgICAgICAgICBjaGVja0FsbFBvbGlnb25zOiB3aGlsZSAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9saWdvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvbCA9IHBvbGlnb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKGEsIGIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgayA9IGogKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbal0ueCwgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKS5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgMiAqIE1hdGguUEkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaiAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbaiAlIHBvbC5sZW5ndGhdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wsIFsocG9sLmxlbmd0aCAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wyLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKHBvbDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgY2hlY2tBbGxQb2xpZ29ucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IHBvbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbKGogKyAxKSAlIHBvbC5sZW5ndGhdLCBwb2xbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBWZWMyLnN1Yihwb2xbaiAtIDFdLCBwb2xbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIobmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIShhLmhlYWRpbmcgPiBiLmhlYWRpbmcgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKGogLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGo7IGwgPD0gazsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGs7IGwgPD0gaiArIHBvbC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wyLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zW2ldID0gcG9sMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKHBvbDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gcG9saWdvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgIHdoaWxlIChwb2wubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2goW3BvbFswXSwgcG9sWzFdLCBwb2xbMl1dKTtcbiAgICAgICAgICAgICAgICBwb2wuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1TdW0gPSAwO1xuICAgICAgICBsZXQgYW1TdW0gPSAwO1xuICAgICAgICBsZXQgcFN1bSA9IG5ldyBWZWMyKDAsIDApO1xuICAgICAgICBwb2xpZ29ucy5mb3JFYWNoKChwb2wpID0+IHtcbiAgICAgICAgICAgIGxldCBhID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFswXS54IC0gcG9sWzFdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMF0ueSAtIHBvbFsxXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYiA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMV0ueCAtIHBvbFsyXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzFdLnkgLSBwb2xbMl0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGMgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzJdLnggLSBwb2xbMF0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsyXS55IC0gcG9sWzBdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBzID0gKGEgKyBiICsgYykgLyAyO1xuICAgICAgICAgICAgbGV0IG0gPSBNYXRoLnNxcnQocyAqIChzIC0gYSkgKiAocyAtIGIpICogKHMgLSBjKSk7XG4gICAgICAgICAgICBtU3VtICs9IG07XG4gICAgICAgICAgICBwU3VtLnggKz0gbSAqIChwb2xbMF0ueCArIHBvbFsxXS54ICsgcG9sWzJdLngpIC8gMztcbiAgICAgICAgICAgIHBTdW0ueSArPSBtICogKHBvbFswXS55ICsgcG9sWzFdLnkgKyBwb2xbMl0ueSkgLyAzO1xuICAgICAgICB9KTtcbiAgICAgICAgcFN1bS5kaXYobVN1bSk7XG4gICAgICAgIHRoaXMucG9zID0gcFN1bTtcbiAgICAgICAgdGhpcy5tID0gbVN1bTtcblxuICAgICAgICAvLyBjYWxjdWxhdGluZyB0aGUgbW9tZW50IG9mIGluZXJ0aWEgZmluYWxseVxuICAgICAgICBmb3IgKGxldCBwb2wgb2YgcG9saWdvbnMpIHtcbiAgICAgICAgICAgIGxldCBhID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFswXS54IC0gcG9sWzFdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMF0ueSAtIHBvbFsxXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYiA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMV0ueCAtIHBvbFsyXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzFdLnkgLSBwb2xbMl0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGMgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzJdLnggLSBwb2xbMF0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsyXS55IC0gcG9sWzBdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCB3ID0gTWF0aC5tYXgoYSwgYiwgYyk7XG4gICAgICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMjtcbiAgICAgICAgICAgIGxldCBtID0gTWF0aC5zcXJ0KHMgKiAocyAtIGEpICogKHMgLSBiKSAqIChzIC0gYykpO1xuICAgICAgICAgICAgbGV0IGggPSAyICogbSAvIHc7XG4gICAgICAgICAgICBsZXQgd3BhcnRpYWwgPSBNYXRoLnNxcnQoTWF0aC5taW4oYSwgYywgYikgKiogMiAtIGggKiBoKTtcbiAgICAgICAgICAgIGxldCBhbSA9IGggKiB3ICogKGggKiBoICsgdyAqIHcpIC8gMjQ7XG4gICAgICAgICAgICBsZXQgZCA9IE1hdGguc3FydChoICogaCAvIDM2ICtcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnMod3BhcnRpYWwgLSB3IC8gMikgLyAzKSAqKiAyKTtcbiAgICAgICAgICAgIGFtIC09IGQgKiBkICogbTtcbiAgICAgICAgICAgIGFtICs9IG5ldyBWZWMyKChwb2xbMF0ueCArIHBvbFsxXS54ICsgcG9sWzJdLngpIC8gMyxcbiAgICAgICAgICAgICAgICAocG9sWzBdLnkgKyBwb2xbMV0ueSArIHBvbFsyXS55KSAvIDMpLmRpc3QodGhpcy5wb3MpICoqIDIgKiBtO1xuICAgICAgICAgICAgYW1TdW0gKz0gYW07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbSA9IGFtU3VtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgdGhlIGJvZHkgYXJvdW5kIGl0J3MgY2VudHJlIG9mIG1hc3MgYnkgYSBnaXZlbiBhbmdlXG4gICAgICogSGFzIHRvIGRvIHRoZSB0cmFuc2Zvcm1hdGlvbiBmb3IgYWxsIHRoZSBwb2ludHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgUm90YXRpb24gYW5nbGVcbiAgICAgKi9cbiAgICByb3RhdGUoYW5nbGU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBuZXcgVmVjMihwLngsIHAueSk7XG4gICAgICAgICAgICBwb2ludC5zdWIodGhpcy5wb3MpO1xuICAgICAgICAgICAgcG9pbnQucm90YXRlKGFuZ2xlKTtcbiAgICAgICAgICAgIHBvaW50LmFkZCh0aGlzLnBvcyk7XG4gICAgICAgICAgICBwLnggPSBwb2ludC54O1xuICAgICAgICAgICAgcC55ID0gcG9pbnQueTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gYW5nbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZHMgb3V0IGlmIHRoZSBib2R5IGlzIGNvbmNhdmUgb3Igbm90XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYm9keSBpcyBjb25jYXZlXG4gICAgICovXG4gICAgZ2V0IGlzQ29uY2F2ZSgpIHtcbiAgICAgICAgbGV0IHBvbCA9IHRoaXMucG9pbnRzO1xuICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSkpO1xuICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXSxcbiAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSkpO1xuICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvZXMgdGhlIGNvbGxpc2lvbiBhbGdvcml0aG0gYmV0d2VlbiB0d28gYm9kaWVzXG4gICAgICogQHBhcmFtIHtCb2R5fSBiMSBGaXJzdCBib2R5XG4gICAgICogQHBhcmFtIHtCb2R5fSBiMiBTZWNvbmQgYm9keVxuICAgICAqL1xuICAgIHN0YXRpYyBjb2xsaWRlKGIxOiBCb2R5LCBiMjogQm9keSkge1xuICAgICAgICBsZXQgbWF0Y2hlcyA9IDA7XG4gICAgICAgIGxldCBoZWFkaW5nID0gMDtcbiAgICAgICAgbGV0IGNwID0gbmV3IFZlYzIoMCwgMCk7XG4gICAgICAgIGxldCBjcHM6IEFycmF5PFZlYzI+ID0gW107XG4gICAgICAgIGxldCBpbnRlcnNlY3QgPSBmYWxzZTtcbiAgICAgICAgYjEucG9pbnRzLmZvckVhY2goKHAsIGlkeCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNpZGUxID0gbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHAueCwgcC55KSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgYjEucG9pbnRzWyhpZHggKyAxKSAlIGIxLnBvaW50cy5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgIGIxLnBvaW50c1soaWR4ICsgMSkgJSBiMS5wb2ludHMubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICBiMi5wb2ludHMuZm9yRWFjaCgocHAsIGlkeHgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2lkZTIgPSBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocHAueCwgcHAueSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgYjIucG9pbnRzWyhpZHh4ICsgMSkgJSBiMi5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgYjIucG9pbnRzWyhpZHh4ICsgMSkgJSBiMi5wb2ludHMubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgbGV0IHNlY3QgPSBMaW5lU2VnbWVudC5pbnRlcnNlY3Qoc2lkZTEsIHNpZGUyKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VjdCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzKys7XG4gICAgICAgICAgICAgICAgICAgIGNwLmFkZChzZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgY3BzLnB1c2goc2VjdCk7XG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaW50ZXJzZWN0KSByZXR1cm47XG4gICAgICAgIGNwLmRpdihtYXRjaGVzKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGguZmxvb3IobWF0Y2hlcyAvIDIpOyBpKyspIHtcbiAgICAgICAgICAgIGhlYWRpbmcgKz0gVmVjMi5zdWIoY3BzWzIgKiBpICsgMV0sIGNwc1syICogaV0pLmhlYWRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGluZyAvPSBtYXRjaGVzIC8gMjtcbiAgICAgICAgaGVhZGluZyArPSBNYXRoLlBJIC8gMjtcblxuICAgICAgICBsZXQgYSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuXG4gICAgICAgIGxldCBtb3ZlMU1pbiA9IDA7XG4gICAgICAgIGxldCBtb3ZlMU1heCA9IDA7XG4gICAgICAgIGxldCBtb3ZlMk1pbiA9IDA7XG4gICAgICAgIGxldCBtb3ZlMk1heCA9IDA7XG4gICAgICAgIGZvciAobGV0IHBvaW50IG9mIGIxLnBvaW50cykge1xuICAgICAgICAgICAgbW92ZTFNaW4gPSBNYXRoLm1pbihWZWMyLmRvdChhLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLCBtb3ZlMU1pbik7XG4gICAgICAgICAgICBtb3ZlMU1heCA9IE1hdGgubWF4KFZlYzIuZG90KGEsXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIobmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSksIGNwKSksIG1vdmUxTWF4KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBiMi5wb2ludHMpIHtcbiAgICAgICAgICAgIG1vdmUyTWluID0gTWF0aC5taW4oVmVjMi5kb3QoYSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSwgbW92ZTJNaW4pO1xuICAgICAgICAgICAgbW92ZTJNYXggPSBNYXRoLm1heChWZWMyLmRvdChhLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLCBtb3ZlMk1heCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE1hdGguYWJzKG1vdmUxTWluIC0gbW92ZTJNYXgpIDwgTWF0aC5hYnMobW92ZTJNaW4gLSBtb3ZlMU1heCkpIHtcbiAgICAgICAgICAgIGIxLm1vdmUoLWEueCAqIG1vdmUxTWluLCAtYS55ICogbW92ZTFNaW4pO1xuICAgICAgICAgICAgYjIubW92ZSgtYS54ICogbW92ZTJNYXgsIC1hLnkgKiBtb3ZlMk1heCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiMS5tb3ZlKC1hLnggKiBtb3ZlMU1heCwgLWEueSAqIG1vdmUxTWF4KTtcbiAgICAgICAgICAgIGIyLm1vdmUoLWEueCAqIG1vdmUyTWluLCAtYS55ICogbW92ZTJNaW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGsgPSAoYjEuayArIGIyLmspIC8gMjtcbiAgICAgICAgLy8gbGV0IHZlbDFwYXJyYWxlbCA9IFZlYzIuY3Jvc3MoYjEudmVsLCBhKTtcbiAgICAgICAgbGV0IHZlbDFwZXJwZW5kaWN1bGFyID0gVmVjMi5kb3QoYjEudmVsLCBhKTtcbiAgICAgICAgLy8gbGV0IHZlbDJwYXJyYWxlbCA9IFZlYzIuY3Jvc3MoYjIudmVsLCBhKTtcbiAgICAgICAgbGV0IHZlbDJwZXJwZW5kaWN1bGFyID0gVmVjMi5kb3QoYjIudmVsLCBhKTtcblxuICAgICAgICBsZXQgbmV3VmVsMVBlcnBlbmRpY3VsYXIgPSAoMSArIGspICogKChiMS5tICogdmVsMXBlcnBlbmRpY3VsYXIpICtcbiAgICAgICAgICAgIChiMi5tICogdmVsMnBlcnBlbmRpY3VsYXIpKSAvIChiMS5tICsgYjIubSkgLVxuICAgICAgICAgICAgKGsgKiB2ZWwxcGVycGVuZGljdWxhcik7XG4gICAgICAgIGxldCBuZXdWZWwyUGVycGVuZGljdWxhciA9ICgxICsgaykgKiAoKGIxLm0gKiB2ZWwxcGVycGVuZGljdWxhcikgK1xuICAgICAgICAgICAgKGIyLm0gKiB2ZWwycGVycGVuZGljdWxhcikpIC8gKGIxLm0gKyBiMi5tKSAtXG4gICAgICAgICAgICAoayAqIHZlbDJwZXJwZW5kaWN1bGFyKTtcblxuICAgICAgICBiMS52ZWwuYWRkKFZlYzIubXVsdChhLmNvcHksIG5ld1ZlbDFQZXJwZW5kaWN1bGFyIC0gdmVsMXBlcnBlbmRpY3VsYXIpKTtcbiAgICAgICAgYjIudmVsLmFkZChWZWMyLm11bHQoYS5jb3B5LCBuZXdWZWwyUGVycGVuZGljdWxhciAtIHZlbDJwZXJwZW5kaWN1bGFyKSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvZHk7XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNlZ21lbnQgb2YgYSBsaW5lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVTZWdtZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBhIFN0YXJ0aW5nIHBvaW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBiIEVuZGluZyBwb2ludFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhOiBWZWMyLCBwdWJsaWMgYjogVmVjMikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50XG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbGVuZ3RoXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVmVjMi5kaXN0KHRoaXMuYSwgdGhpcy5iKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmQgdGhlIGxpbmUgc2VnbWVudFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcCBUaGUgcG9pbnQgYXMgYSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkaXN0YW5jZVxuICAgICAqL1xuICAgIGRpc3RGcm9tUG9pbnQocDogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBlID0gVmVjMi5zdWIodGhpcy5hLCB0aGlzLmIpO1xuICAgICAgICBsZXQgQSA9IFZlYzIuc3ViKHAsIHRoaXMuYik7XG4gICAgICAgIGxldCBCID0gVmVjMi5zdWIocCwgdGhpcy5hKTtcbiAgICAgICAgbGV0IGEgPSBBLmxlbmd0aDtcbiAgICAgICAgbGV0IGIgPSBCLmxlbmd0aDtcbiAgICAgICAgbGV0IGMgPSBlLmxlbmd0aDtcbiAgICAgICAgaWYgKGMgPT09IDApIHJldHVybiBhO1xuICAgICAgICBsZXQgZ2FtbWEgPSBWZWMyLmFuZ2xlKEEsIEIpO1xuICAgICAgICBsZXQgYmV0aGEgPSBWZWMyLmFuZ2xlKEEsIGUpO1xuICAgICAgICBsZXQgYWxwaGEgPSBNYXRoLlBJIC0gZ2FtbWEgLSBiZXRoYTtcbiAgICAgICAgbGV0IGFyZWEgPSBNYXRoLnNpbihhbHBoYSkgKiBiICogYyAvIDI7XG4gICAgICAgIGxldCBtID0gMiAqIGFyZWEgLyBjO1xuICAgICAgICBpZiAoYWxwaGEgPiBNYXRoLlBJIC8gMikgcmV0dXJuIGI7XG4gICAgICAgIGlmIChiZXRoYSA+IE1hdGguUEkgLyAyKSByZXR1cm4gYTtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGlmIHRoZXkgaW50ZXJzZWN0IG9yIG5vdFxuICAgICAqIElmIHRoZXkgaW50ZXJzZWN0IGl0IHJldHVybnMgdGhlIGludGVyc2VjdGlvbiBwb2ludFxuICAgICAqIElmIHRoZXkgbm90IGl0IHJldHVybnMgdW5kZWZpbmVkXG4gICAgICogQHBhcmFtIHtMaW5lU2VnbWVudH0gc2VnbWVudDEgQSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtMaW5lU2VnbWVudH0gc2VnbWVudDIgT3RoZXIgc2VnbWVudFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IEludGVyc2V0aW9uIHBvaW50XG4gICAgICovXG4gICAgc3RhdGljIGludGVyc2VjdChzZWdtZW50MTogTGluZVNlZ21lbnQsIHNlZ21lbnQyOiBMaW5lU2VnbWVudCk6IFZlYzIge1xuICAgICAgICBsZXQgdjEgPSBWZWMyLnN1YihzZWdtZW50MS5iLCBzZWdtZW50MS5hKTtcbiAgICAgICAgbGV0IGExID0gdjEueSAvIHYxLng7XG4gICAgICAgIGxldCBjMSA9IHNlZ21lbnQxLmIueSAtIChzZWdtZW50MS5iLnggKiBhMSk7XG5cbiAgICAgICAgbGV0IHYyID0gVmVjMi5zdWIoc2VnbWVudDIuYiwgc2VnbWVudDIuYSk7XG4gICAgICAgIGxldCBhMiA9IHYyLnkgLyB2Mi54O1xuICAgICAgICBsZXQgYzIgPSBzZWdtZW50Mi5iLnkgLSAoc2VnbWVudDIuYi54ICogYTIpO1xuXG4gICAgICAgIGlmICh2MS54ID09PSAwICYmIHYyLnggIT09IDApIHtcbiAgICAgICAgICAgIGlmICgoc2VnbWVudDEuYS54ID49IHNlZ21lbnQyLmEueCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQxLmEueCA8PSBzZWdtZW50Mi5iLngpIHx8XG4gICAgICAgICAgICAgICAgKHNlZ21lbnQxLmEueCA8PSBzZWdtZW50Mi5hLnggJiZcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudDEuYS54ID49IHNlZ21lbnQyLmIueCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgaCA9IGEyICogc2VnbWVudDEuYS54ICsgYzI7XG4gICAgICAgICAgICAgICAgaWYgKChoID4gc2VnbWVudDEuYS55ICYmIGggPCBzZWdtZW50MS5iLnkpIHx8XG4gICAgICAgICAgICAgICAgICAgIChoIDwgc2VnbWVudDEuYS55ICYmIGggPiBzZWdtZW50MS5iLnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMihzZWdtZW50MS5hLngsIGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYyLnggPT09IDAgJiYgdjEueCAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKChzZWdtZW50Mi5hLnggPj0gc2VnbWVudDEuYS54ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudDIuYS54IDw9IHNlZ21lbnQxLmIueCkgfHxcbiAgICAgICAgICAgICAgICAoc2VnbWVudDIuYS54IDw9IHNlZ21lbnQxLmEueCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50Mi5hLnggPj0gc2VnbWVudDEuYi54KSkge1xuICAgICAgICAgICAgICAgIGxldCBoID0gYTEgKiBzZWdtZW50Mi5hLnggKyBjMTtcbiAgICAgICAgICAgICAgICBpZiAoKGggPiBzZWdtZW50Mi5hLnkgJiYgaCA8IHNlZ21lbnQyLmIueSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGggPCBzZWdtZW50Mi5hLnkgJiYgaCA+IHNlZ21lbnQyLmIueSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQyLmEueCwgaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodjEueCA9PT0gMCAmJiB2Mi54ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoc2VnbWVudDEuYS54ID09PSBzZWdtZW50Mi5hLngpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwxO1xuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50MS5hLnkgPCBzZWdtZW50MS5iLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwxID0gW3NlZ21lbnQxLmEueSwgc2VnbWVudDEuYi55XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYi55LCBzZWdtZW50MS5hLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwyO1xuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50Mi5hLnkgPCBzZWdtZW50Mi5iLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwyID0gW3NlZ21lbnQyLmEueSwgc2VnbWVudDIuYi55XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYi55LCBzZWdtZW50Mi5hLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSBbKGludGVydmFsMVswXSA+IGludGVydmFsMlswXSkgP1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDFbMF0gOiBpbnRlcnZhbDJbMF0sXG4gICAgICAgICAgICAgICAgKGludGVydmFsMVsxXSA8IGludGVydmFsMlsxXSkgP1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDFbMV0gOiBpbnRlcnZhbDJbMV0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWxbMF0gPD0gaW50ZXJ2YWxbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQxLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZXJ2YWwxO1xuICAgICAgICBpZiAoc2VnbWVudDEuYS54IDwgc2VnbWVudDEuYi54KSB7XG4gICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYS54LCBzZWdtZW50MS5iLnhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWwxID0gW3NlZ21lbnQxLmIueCwgc2VnbWVudDEuYS54XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwyO1xuICAgICAgICBpZiAoc2VnbWVudDIuYS54IDwgc2VnbWVudDIuYi54KSB7XG4gICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYS54LCBzZWdtZW50Mi5iLnhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWwyID0gW3NlZ21lbnQyLmIueCwgc2VnbWVudDIuYS54XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBbKGludGVydmFsMVswXSA+IGludGVydmFsMlswXSkgP1xuICAgICAgICAgICAgaW50ZXJ2YWwxWzBdIDogaW50ZXJ2YWwyWzBdLFxuICAgICAgICAoaW50ZXJ2YWwxWzFdIDwgaW50ZXJ2YWwyWzFdKSA/XG4gICAgICAgICAgICBpbnRlcnZhbDFbMV0gOiBpbnRlcnZhbDJbMV0sXG4gICAgICAgIF07XG4gICAgICAgIC8vIElmIHRoZXkgYXJlIHBhcnJhbGVsIHRoZSBvbmx5IHRpbWUgdGhleSBpbnRlcnNlY3QgaXMgd2hlbiBjMSA9PSBjMi5cbiAgICAgICAgaWYgKChhMSA9PT0gYTIpICYmIGMxID09PSBjMiAmJiBpbnRlcnZhbFswXSA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIsXG4gICAgICAgICAgICAgICAgKChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIpICogYTEgKyBjMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHggPSAoYzIgLSBjMSkgLyAoYTEgLSBhMik7XG4gICAgICAgIGlmICh4ID49IGludGVydmFsWzBdICYmIHggPD0gaW50ZXJ2YWxbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMih4LCB4ICogYTEgKyBjMSk7XG4gICAgICAgIH0gZWxzZSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuaW1wb3J0IFdhbGwgZnJvbSAnLi93YWxsJztcbmltcG9ydCBMaW5lU2VnbWVudCBmcm9tICcuL2xpbmVzZWdtZW50JztcbmltcG9ydCBTdGljayBmcm9tICcuL3N0aWNrJztcbmltcG9ydCBTcHJpbmcgZnJvbSAnLi9zcHJpbmcnO1xuaW1wb3J0IFNvZnRCYWxsIGZyb20gJy4vc29mdGJhbGwnO1xuaW1wb3J0IEJvZHkgZnJvbSAnLi9ib2R5JztcblxuLyoqXG4gKiBDbGFzcyB0aGF0IGNyZWF0ZXMgYSBuZXcgd29ybGQgYmEgdGhlIHBoeXNpY3MgZW5naW5lXG4gKi9cbmNsYXNzIFBoeXNpY3Mge1xuICBiYWxsczogQXJyYXk8QmFsbD47XG4gIGJvZGllczogQXJyYXk8Qm9keT47XG4gIGZpeGVkQmFsbHM6IEFycmF5PHt4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCB9PlxuICBzb2Z0QmFsbHM6IEFycmF5PFNvZnRCYWxsPjtcbiAgd2FsbHM6IEFycmF5PFdhbGw+O1xuICBib3VuZHM6IEFycmF5PG51bWJlcj47XG4gIHNwcmluZ3M6IEFycmF5PFNwcmluZz47XG4gIGFpckZyaWN0aW9uOiBudW1iZXI7XG4gIGdyYXZpdHk6IFZlYzI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgaW5pdGFsaXplIGEgbmV3IHdvcmxkXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmJhbGxzID0gW107XG4gICAgdGhpcy5ib2RpZXMgPSBbXTtcbiAgICB0aGlzLmZpeGVkQmFsbHMgPSBbXTtcbiAgICB0aGlzLnNvZnRCYWxscyA9IFtdO1xuXG4gICAgdGhpcy53YWxscyA9IFtdO1xuXG4gICAgdGhpcy5ib3VuZHMgPSBbXTtcblxuICAgIHRoaXMuc3ByaW5ncyA9IFtdO1xuXG4gICAgLy8gQWlyIGZyaWN0aW9uIGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICAvLyAwIC0gbm8gbW92ZW1lbnRcbiAgICAvLyAxIC0gbm8gZnJpY3Rpb25cbiAgICB0aGlzLmFpckZyaWN0aW9uID0gMTtcblxuICAgIHRoaXMuZ3Jhdml0eSA9IG5ldyBWZWMyKDAsIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdvcmxkIGJ5IGEgZ2l2ZW4gYW1vdW50IG9mIHRpbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHQgRWxhcHNlZCB0aW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcHJlY2lzZSBJZiB0aGlzIGlzIHRydWUsXG4gICAqIHRoZW4gdGhlIHNpbXVsYXRpb24gaXMgZ29pbmcgdG8gYmUgbW9yZSBwcmVjaXNlXG4gICAqL1xuICB1cGRhdGUodDogbnVtYmVyLCBwcmVjaXNlOiBib29sZWFuKSB7XG4gICAgLy8gRG8gdGhlIHNpbXVsYXRpb24gb24gdGhlIHJldmVyc2VkIHN5c3RlbVxuICAgIC8vIGlmIHRoZSBzaW11bGF0aW9uIGlzIGluIHByZWNpc2UgbW9kZVxuICAgIGxldCBjbG9uZWRTeXN0ZW06IFBoeXNpY3M7XG4gICAgaWYgKHByZWNpc2UpIHtcbiAgICAgIGNsb25lZFN5c3RlbSA9IHRoaXMuY29weTtcbiAgICAgIGNsb25lZFN5c3RlbS5ib2RpZXMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLmJhbGxzLnJldmVyc2UoKTtcbiAgICAgIGNsb25lZFN5c3RlbS51cGRhdGUodCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIEF0IGZpcnN0IG1vdmUgb2JqZXRzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBNb3ZlXG4gICAgICB0aGlzLmJhbGxzW2ldLmxhc3RQb3MgPSB0aGlzLmJhbGxzW2ldLnBvcy5jb3B5O1xuICAgICAgdGhpcy5iYWxsc1tpXS5wb3MuYWRkKFZlYzIubXVsdCh0aGlzLmJhbGxzW2ldLnZlbCwgdCkpO1xuXG4gICAgICAvLyBBbmd1bGFyIHZlbG9jaXR5XG4gICAgICB0aGlzLmJhbGxzW2ldLnJvdGF0aW9uICs9IHRoaXMuYmFsbHNbaV0uYW5nICogdDtcbiAgICAgIHRoaXMuYmFsbHNbaV0ucm90YXRpb24gJT0gKE1hdGguUEkgKiAyKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5ib2RpZXNbaV0ubGFzdFBvcyA9IHRoaXMuYm9kaWVzW2ldLnBvcy5jb3B5O1xuICAgICAgdGhpcy5ib2RpZXNbaV0ubW92ZSh0aGlzLmJvZGllc1tpXS52ZWwueCAqIHQsIHRoaXMuYm9kaWVzW2ldLnZlbC55ICogdCk7XG4gICAgICB0aGlzLmJvZGllc1tpXS5yb3RhdGUodGhpcy5ib2RpZXNbaV0uYW5nICogdCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHNwcmluZ3MgbXVsdGlwbGUgdGltZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnNwcmluZ3MpIHtcbiAgICAgICAgZWxlbWVudC51cGRhdGUodCAvIDMgLyAyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmFsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIEFwcGx5IGdyYXZpdHlcbiAgICAgIGlmICh0aGlzLmdyYXZpdHkpIHtcbiAgICAgICAgdGhpcy5iYWxsc1tpXS52ZWwuYWRkKFxuICAgICAgICAgIG5ldyBWZWMyKHRoaXMuZ3Jhdml0eS54ICogdCwgdGhpcy5ncmF2aXR5LnkgKiB0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvblxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy5iYWxscy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAodGhpcy5iYWxsc1tpXS5sYXllciAhPSB0aGlzLmJhbGxzW2pdLmxheWVyIHx8XG4gICAgICAgICAgIXRoaXMuYmFsbHNbaV0ubGF5ZXIgJiYgIXRoaXMuYmFsbHNbal0ubGF5ZXIpIHtcbiAgICAgICAgICBCYWxsLmNvbGxpZGUodGhpcy5iYWxsc1tpXSwgdGhpcy5iYWxsc1tqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29sbGlzaW9uIHdpdGggd2FsbHNcbiAgICAgIGZvciAobGV0IHdhbGwgb2YgdGhpcy53YWxscykge1xuICAgICAgICB3YWxsLmNvbGxpZGVXaXRoQmFsbCh0aGlzLmJhbGxzW2ldKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ29sbGlzaW9uIHdpdGggZml4ZWQgYmFsbHNcbiAgICAgIGZvciAobGV0IGIgb2YgdGhpcy5maXhlZEJhbGxzKSB7XG4gICAgICAgIGxldCBiYWxsID0gdGhpcy5iYWxsc1tpXTtcblxuICAgICAgICBsZXQgaGVhZGluZztcbiAgICAgICAgbGV0IHJlbDtcbiAgICAgICAgbGV0IHAgPSBuZXcgVmVjMihiLngsIGIueSk7XG4gICAgICAgIHAueCAtPSBiYWxsLnBvcy54O1xuICAgICAgICBwLnkgLT0gYmFsbC5wb3MueTtcbiAgICAgICAgcC5tdWx0KC0xKTtcbiAgICAgICAgaWYgKHAubGVuZ3RoIDw9IGJhbGwuciArIGIucikge1xuICAgICAgICAgIGhlYWRpbmcgPSBwLmhlYWRpbmc7XG4gICAgICAgICAgcmVsID0gcC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVhZGluZyA9PT0gMCB8fCBoZWFkaW5nKSB7XG4gICAgICAgICAgbGV0IHBvcyA9IG5ldyBWZWMyKGJhbGwucG9zLngsIGJhbGwucG9zLnkpO1xuICAgICAgICAgIGxldCB2ZWwgPSBuZXcgVmVjMihiYWxsLnZlbC54LCBiYWxsLnZlbC55KTtcbiAgICAgICAgICBwb3Mucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuICAgICAgICAgIHZlbC5yb3RhdGUoLWhlYWRpbmcgKyBNYXRoLlBJIC8gMik7XG5cbiAgICAgICAgICB2ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgIHBvcy55ICs9IGJhbGwuciArIGIuciAtIHJlbDtcbiAgICAgICAgICBsZXQgZHZ5ID0gdmVsLnkgKiAoMSArICgxIC8gYmFsbC5rKSk7XG4gICAgICAgICAgbGV0IGR2eCA9IE1hdGguYWJzKGR2eSkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgIE1hdGguc2lnbih2ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSAqIC0xO1xuICAgICAgICAgIGlmIChNYXRoLmFicyhkdngpID4gTWF0aC5hYnModmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgIGR2eCA9IC12ZWwueCArIGJhbGwuYW5nICogYmFsbC5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2ZWwueCArPSBkdnggLSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pO1xuICAgICAgICAgIGJhbGwuYW5nIC09IGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAoKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pICogYmFsbC5yKTtcbiAgICAgICAgICBwb3Mucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgdmVsLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgIGJhbGwucG9zLnggPSBwb3MueDtcbiAgICAgICAgICBiYWxsLnBvcy55ID0gcG9zLnk7XG4gICAgICAgICAgYmFsbC52ZWwueCA9IHZlbC54O1xuICAgICAgICAgIGJhbGwudmVsLnkgPSB2ZWwueTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBCb3VuY2Ugb2ZmIHRoZSBlZGdlc1xuICAgICAgaWYgKHRoaXMuYm91bmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMuYmFsbHNbaV0ucG9zLnggLSB0aGlzLmJhbGxzW2ldLnIgPCB0aGlzLmJvdW5kc1swXSkge1xuICAgICAgICAgIGxldCBiYWxsID0gdGhpcy5iYWxsc1tpXTtcbiAgICAgICAgICBiYWxsLnZlbC54ICo9IC1iYWxsLms7XG4gICAgICAgICAgYmFsbC5wb3MueCA9IHRoaXMuYm91bmRzWzFdICsgYmFsbC5yO1xuICAgICAgICAgIGxldCBkdnggPSBiYWxsLnZlbC54ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuICAgICAgICAgIGxldCBkdnkgPSBNYXRoLmFicyhkdngpICogYmFsbC5mYyAqXG4gICAgICAgICAgICBNYXRoLnNpZ24oYmFsbC52ZWwueSArIGJhbGwuYW5nICogYmFsbC5yKSAqIC0xO1xuICAgICAgICAgIGlmIChNYXRoLmFicyhkdnkpID4gTWF0aC5hYnMoYmFsbC52ZWwueSArIGJhbGwuYW5nICogYmFsbC5yKSkge1xuICAgICAgICAgICAgZHZ5ID0gLWJhbGwudmVsLnkgLSBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFsbC52ZWwueSArPSBkdnkgLSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnkgL1xuICAgICAgICAgICAgKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pO1xuICAgICAgICAgIGJhbGwuYW5nICs9IGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eSAvXG4gICAgICAgICAgICAoKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pICogYmFsbC5yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJhbGxzW2ldLnBvcy54ICsgdGhpcy5iYWxsc1tpXS5yID5cbiAgICAgICAgICAodGhpcy5ib3VuZHNbMF0gKyB0aGlzLmJvdW5kc1syXSkpIHtcbiAgICAgICAgICBsZXQgYmFsbCA9IHRoaXMuYmFsbHNbaV07XG4gICAgICAgICAgYmFsbC52ZWwueCAqPSAtYmFsbC5rO1xuICAgICAgICAgIGJhbGwucG9zLnggPSAodGhpcy5ib3VuZHNbMF0gKyB0aGlzLmJvdW5kc1syXSkgLSBiYWxsLnI7XG4gICAgICAgICAgbGV0IGR2eCA9IGJhbGwudmVsLnggKiAoMSArICgxIC8gYmFsbC5rKSk7XG4gICAgICAgICAgbGV0IGR2eSA9IE1hdGguYWJzKGR2eCkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgIE1hdGguc2lnbihiYWxsLnZlbC55IC0gYmFsbC5hbmcgKiBiYWxsLnIpICogLTE7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKGR2eSkgPiBNYXRoLmFicyhiYWxsLnZlbC55IC0gYmFsbC5hbmcgKiBiYWxsLnIpKSB7XG4gICAgICAgICAgICBkdnkgPSAtYmFsbC52ZWwueSArIGJhbGwuYW5nICogYmFsbC5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBiYWxsLnZlbC55ICs9IGR2eSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eSAvXG4gICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgYmFsbC5hbmcgLT0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ5IC9cbiAgICAgICAgICAgICgoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSkgKiBiYWxsLnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmJhbGxzW2ldLnBvcy55ICsgdGhpcy5iYWxsc1tpXS5yID5cbiAgICAgICAgICAodGhpcy5ib3VuZHNbMV0gKyB0aGlzLmJvdW5kc1szXSkpIHtcbiAgICAgICAgICBsZXQgYmFsbCA9IHRoaXMuYmFsbHNbaV07XG4gICAgICAgICAgYmFsbC52ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgIGJhbGwucG9zLnkgPSAodGhpcy5ib3VuZHNbMV0gKyB0aGlzLmJvdW5kc1szXSkgLSBiYWxsLnI7XG4gICAgICAgICAgbGV0IGR2eSA9IGJhbGwudmVsLnkgKiAoMSArICgxIC8gYmFsbC5rKSk7XG4gICAgICAgICAgbGV0IGR2eCA9IE1hdGguYWJzKGR2eSkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgIE1hdGguc2lnbihiYWxsLnZlbC54ICsgYmFsbC5hbmcgKiBiYWxsLnIpICogLTE7XG4gICAgICAgICAgaWYgKE1hdGguYWJzKGR2eCkgPiBNYXRoLmFicyhiYWxsLnZlbC54ICsgYmFsbC5hbmcgKiBiYWxsLnIpKSB7XG4gICAgICAgICAgICBkdnggPSAtYmFsbC52ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBiYWxsLnZlbC54ICs9IGR2eCAtIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgYmFsbC5hbmcgKz0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgICgoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSkgKiBiYWxsLnIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmFsbHNbaV0ucG9zLnkgLSB0aGlzLmJhbGxzW2ldLnIgPCB0aGlzLmJvdW5kc1sxXSkge1xuICAgICAgICAgIGxldCBiYWxsID0gdGhpcy5iYWxsc1tpXTtcbiAgICAgICAgICBiYWxsLnZlbC55ICo9IC1iYWxsLms7XG4gICAgICAgICAgYmFsbC5wb3MueSA9IHRoaXMuYm91bmRzWzFdICsgYmFsbC5yO1xuICAgICAgICAgIGxldCBkdnkgPSBiYWxsLnZlbC55ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuICAgICAgICAgIGxldCBkdnggPSBNYXRoLmFicyhkdnkpICogYmFsbC5mYyAqXG4gICAgICAgICAgICBNYXRoLnNpZ24oYmFsbC52ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSAqIC0xO1xuICAgICAgICAgIGlmIChNYXRoLmFicyhkdngpID4gTWF0aC5hYnMoYmFsbC52ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSkge1xuICAgICAgICAgICAgZHZ4ID0gLWJhbGwudmVsLnggKyBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFsbC52ZWwueCArPSBkdnggKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pO1xuICAgICAgICAgIGJhbGwuYW5nIC09IGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAoKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pICogYmFsbC5yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGJhbGwgb2YgdGhpcy5iYWxscykge1xuICAgICAgICBpZiAoYmFsbC5sYXllciAhPSB0aGlzLmJvZGllc1tpXS5sYXllciB8fFxuICAgICAgICAgICghYmFsbC5sYXllciAmJiAhdGhpcy5ib2RpZXNbaV0ubGF5ZXIpKSB7XG4gICAgICAgICAgdGhpcy5ib2RpZXNbaV0uY29sbGlkZVdpdGhCYWxsKGJhbGwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmJvZGllc1tpXS5sYXllciAhPSB0aGlzLmJvZGllc1tqXS5sYXllciB8fFxuICAgICAgICAgICghdGhpcy5ib2RpZXNbal0ubGF5ZXIgJiYgIXRoaXMuYm9kaWVzW2ldLmxheWVyKSkge1xuICAgICAgICAgIEJvZHkuY29sbGlkZSh0aGlzLmJvZGllc1tpXSwgdGhpcy5ib2RpZXNbal0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGdyYXZpdHlcbiAgICAgIGlmICh0aGlzLmdyYXZpdHkpIHtcbiAgICAgICAgdGhpcy5ib2RpZXNbaV0udmVsLmFkZChcbiAgICAgICAgICBuZXcgVmVjMih0aGlzLmdyYXZpdHkueCAqIHQsIHRoaXMuZ3Jhdml0eS55ICogdCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBzb2Z0IGJhbGxzXG4gICAgdGhpcy5zb2Z0QmFsbHMuZm9yRWFjaCgoc2IpID0+IHtcbiAgICAgIFNvZnRCYWxsLnVwZGF0ZVByZXNzdXJlQmFzZWRGb3JjZXMoc2IsIHQpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHNwcmluZ3MgYWdhaW4gbXVsdGlwbGUgdGltZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnNwcmluZ3MpIHtcbiAgICAgICAgZWxlbWVudC51cGRhdGUodCAvIDMgLyAyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcHBseSBhaXIgZnJpY3Rpb25cbiAgICB0aGlzLmJhbGxzLmZvckVhY2goKGIpID0+IHtcbiAgICAgIGIudmVsLm11bHQoTWF0aC5wb3codGhpcy5haXJGcmljdGlvbiwgdCkpO1xuICAgICAgYi5hbmcgKj0gKE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpKTtcbiAgICB9KTtcbiAgICB0aGlzLmJvZGllcy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICBiLnZlbC5tdWx0KE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpKTtcbiAgICAgIGIuYW5nICo9IChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBUaGVuIHRha2UgdGhlIGF2ZXJhZ2Ugb2YgdGhpcyBzeXN0ZW0gYW5kIHRoZSBvdGhlciBzeXN0ZW1cbiAgICAvLyBpZiBpbiBwcmVjaXNlIG1vZGVcbiAgICBpZiAocHJlY2lzZSkge1xuICAgICAgY2xvbmVkU3lzdGVtLmJvZGllcy5yZXZlcnNlKCk7XG4gICAgICBjbG9uZWRTeXN0ZW0uYmFsbHMucmV2ZXJzZSgpO1xuXG4gICAgICAvLyBUYWtlIHRoZSBhdmVyYWdlIG9mIHRoZSBiYWxsc1xuICAgICAgdGhpcy5iYWxscy5mb3JFYWNoKChiYWxsLCBpKSA9PiB7XG4gICAgICAgIGJhbGwubW92ZSgoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnBvcy54IC0gYmFsbC5wb3MueCkgKiAwLjUsXG4gICAgICAgICAgKGNsb25lZFN5c3RlbS5iYWxsc1tpXS5wb3MueSAtIGJhbGwucG9zLnkpICogMC41KTtcbiAgICAgICAgYmFsbC52ZWwuYWRkKG5ldyBWZWMyKChjbG9uZWRTeXN0ZW0uYmFsbHNbaV0udmVsLnggLSBiYWxsLnZlbC54KSAqIDAuNSxcbiAgICAgICAgICAoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnZlbC55IC0gYmFsbC52ZWwueSkgKiAwLjUpKTtcbiAgICAgICAgYmFsbC5yb3RhdGlvbiA9IChiYWxsLnJvdGF0aW9uICsgY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnJvdGF0aW9uKSAvIDI7XG4gICAgICAgIGJhbGwuYW5nID0gKGJhbGwuYW5nICsgY2xvbmVkU3lzdGVtLmJhbGxzW2ldLmFuZykgLyAyO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFRha2UgdGhlIGF2ZXJhZ2Ugb2YgdGhlIGJvZGllc1xuICAgICAgdGhpcy5ib2RpZXMuZm9yRWFjaCgoYm9keSwgaSkgPT4ge1xuICAgICAgICBsZXQgb3RoZXIgPSBjbG9uZWRTeXN0ZW0uYm9kaWVzW2ldO1xuICAgICAgICBib2R5Lm1vdmUoKG90aGVyLnBvcy54IC0gYm9keS5wb3MueCkgKiAwLjUsXG4gICAgICAgICAgKG90aGVyLnBvcy55IC0gYm9keS5wb3MueSkgKiAwLjUpO1xuICAgICAgICBib2R5LnZlbC5hZGQobmV3IFZlYzIoKG90aGVyLnZlbC54IC0gYm9keS52ZWwueCkgKiAwLjUsXG4gICAgICAgICAgKG90aGVyLnZlbC55IC0gYm9keS52ZWwueSkgKiAwLjUpKTtcbiAgICAgICAgYm9keS5yb3RhdGUoKG90aGVyLnJvdGF0aW9uIC0gYm9keS5yb3RhdGlvbikgLyAyKTtcbiAgICAgICAgYm9keS5hbmcgPSAoYm9keS5hbmcgKyBvdGhlci5hbmcpIC8gMjtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGlzIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtQaHlzaWNzfSBUaGUgY29weSBvZiB0aGlzIHN5c3RlbVxuICAgKi9cbiAgZ2V0IGNvcHkoKTogUGh5c2ljcyB7XG4gICAgbGV0IHJldCA9IG5ldyBQaHlzaWNzKCk7XG4gICAgcmV0LmJhbGxzID0gdGhpcy5nZXRDb3B5T2ZCYWxscygpO1xuICAgIHJldC5ib2RpZXMgPSB0aGlzLmdldENvcHlPZkJvZGllcygpO1xuICAgIHJldC5maXhlZEJhbGxzID0gdGhpcy5maXhlZEJhbGxzO1xuICAgIHJldC53YWxscyA9IHRoaXMud2FsbHM7XG4gICAgcmV0LmJvdW5kcyA9IHRoaXMuYm91bmRzO1xuICAgIHJldC5ncmF2aXR5ID0gdGhpcy5ncmF2aXR5O1xuXG4gICAgdGhpcy5zcHJpbmdzLmZvckVhY2goKHNwcmluZykgPT4ge1xuICAgICAgbGV0IFR5cGVPZlNwcmluZyA9IHNwcmluZy5jb25zdHJ1Y3RvciA9PSBTcHJpbmcgPyBTcHJpbmcgOiBTdGljaztcbiAgICAgIGxldCBjb3BpZWRTcHJpbmcgPSBuZXcgVHlwZU9mU3ByaW5nKHNwcmluZy5sZW5ndGgsXG4gICAgICAgIHNwcmluZy5zcHJpbmdDb25zdGFudCk7XG4gICAgICBjb3BpZWRTcHJpbmcucm90YXRpb25Mb2NrZWQgPSBzcHJpbmcucm90YXRpb25Mb2NrZWQ7XG4gICAgICBjb3BpZWRTcHJpbmcucGlubmVkID0gc3ByaW5nLnBpbm5lZDtcblxuICAgICAgc3ByaW5nLm9iamVjdHMuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICAgIGxldCBpZHggPSB0aGlzLmJhbGxzLmluZGV4T2Yob2JqKTtcbiAgICAgICAgaWYgKGlkeCAhPSAtMSkgY29waWVkU3ByaW5nLmF0dGFjaE9iamVjdChyZXQuYmFsbHNbaWR4XSk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlkeCA9IHRoaXMuYm9kaWVzLmluZGV4T2Yob2JqKTtcbiAgICAgICAgICBpZiAoaWR4ICE9IC0xKSBjb3BpZWRTcHJpbmcuYXR0YWNoT2JqZWN0KHJldC5ib2RpZXNbaWR4XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXQuc3ByaW5ncy5wdXNoKGNvcGllZFNwcmluZyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFpciBmcmljdGlvbi4gaGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgKiAwIC0gbm8gbW92ZW1lbnRcbiAgICogMSAtIG5vIGZyaWN0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhaXJGcmljdGlvbiBIYXMgdG8gYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAqL1xuICBzZXRBaXJGcmljdGlvbihhaXJGcmljdGlvbjogbnVtYmVyKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShhaXJGcmljdGlvbikpIHJldHVybjtcbiAgICB0aGlzLmFpckZyaWN0aW9uID0gYWlyRnJpY3Rpb247XG4gICAgaWYgKHRoaXMuYWlyRnJpY3Rpb24gPCAwKSB0aGlzLmFpckZyaWN0aW9uID0gMDtcbiAgICBpZiAodGhpcy5haXJGcmljdGlvbiA+IDEpIHRoaXMuYWlyRnJpY3Rpb24gPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGdyYXZpdHkgaW4gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7VmVjMn0gZGlyIFRoZSBhY2NlbGVyYXRpb24gdmVjdG9yIG9mIHRoZSBncmF2aXR5XG4gICAqL1xuICBzZXRHcmF2aXR5KGRpcjogVmVjMikge1xuICAgIHRoaXMuZ3Jhdml0eSA9IGRpci5jb3B5O1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBuZXcgYmFsbCB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtCYWxsfSBiYWxsIEJhbGwgdG8gYWRkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkQmFsbChiYWxsOiBCYWxsKSB7XG4gICAgdGhpcy5iYWxscy5wdXNoKGJhbGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBuZXcgYm9keSB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtCb2R5fSBib2R5IEJvZHkgdG8gYWRkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkQm9keShib2R5OiBCb2R5KSB7XG4gICAgdGhpcy5ib2RpZXMucHVzaChib2R5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IHNvZnQgYmFsbCB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtTb2Z0QmFsbH0gc29mdEJhbGwgU29mdEJhbGwgdG8gYmUgYWRkZWQgdG8gdGhlIHdvcmxkXG4gICAqL1xuICBhZGRTb2Z0QmFsbChzb2Z0QmFsbDogU29mdEJhbGwpIHtcbiAgICB0aGlzLmJhbGxzLnB1c2goLi4uc29mdEJhbGwucG9pbnRzKTtcbiAgICB0aGlzLnNwcmluZ3MucHVzaCguLi5zb2Z0QmFsbC5zaWRlcyk7XG5cbiAgICB0aGlzLnNvZnRCYWxscy5wdXNoKHNvZnRCYWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgcmVjdGFuZ3VsYXIgd2FsbCB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgcmVjdGFuZ3VsYXIgd2FsbFxuICAgKiBAcGFyYW0ge251bWJlcn0gdyB3aWR0aCBvZiB0aGUgcmVjdGFuZ3VsYXIgd2FsbFxuICAgKiBAcGFyYW0ge251bWJlcn0gaCBoZWlnaHQgb2YgdGhlIHJlY3Rhbmd1bGFyIHdhbGxcbiAgICovXG4gIGFkZFJlY3RXYWxsKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggLSB3IC8gMixcbiAgICAgIHkgLSBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCArIHcgLyAyLFxuICAgICAgeSAtIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4ICsgdyAvIDIsXG4gICAgICB5ICsgaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggLSB3IC8gMixcbiAgICAgIHkgKyBoIC8gMlxuICAgICkpO1xuICAgIHRoaXMud2FsbHMucHVzaChuZXcgV2FsbChwb2ludHMpKTtcbiAgICAvLyB0aGlzLmJvZGllcy5wdXNoKG5ldyBCb2R5KHBvaW50cywgbmV3IFZlYzIoMCwgMCksIDAuNSwgMCwgMC4zKSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIGEgbmV3IHdhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7V2FsbH0gd2FsbCBXYWxsIHRvIGFwcGVuZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZFdhbGwod2FsbDogV2FsbCkge1xuICAgIHRoaXMud2FsbHMucHVzaCh3YWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgZml4ZWQgYmFsbCB0byB0aGUgd29ybGRcbiAgICogQSBmaXhlZCBiYWxsIGlzIGltbW92YWJsZSBhbmQgb3RoZXIgb2JqZWN0cyBjb2xsaWRlIHdpdGggaXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBmaXhlZCBiYWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgZml4ZWQgYmFsbFxuICAgKiBAcGFyYW0ge251bWJlcn0gciByYWRpdXMgb2YgdGhlIGZpeGVkIGJhbGxcbiAgICovXG4gIGFkZEZpeGVkQmFsbCh4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyKSB7XG4gICAgdGhpcy5maXhlZEJhbGxzLnB1c2goe1xuICAgICAgeDogeCwgeTogeSwgcjogcixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IHNwcmluZyB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtTcHJpbmd9IHNwcmluZyBTcHJpbmcgdG8gYWRkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkU3ByaW5nKHNwcmluZzogU3ByaW5nKSB7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goc3ByaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzaXplIG9mIHRoZSB3b3JsZCAod2l0aG91dCB0aGlzIHRoZSB3b3JsZFxuICAgKiBkb2VzIG5vdCBoYXZlIGJvdW5kcylcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBjZW50cmUgb2YgdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudHJlIG9mIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0gdyBXaWR0aCBvZiB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGggSGVpZ2h0IG9mIHRoZSB3b3JsZFxuICAgKi9cbiAgc2V0Qm91bmRzKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIHRoaXMuYm91bmRzID0gW3gsIHksIHcsIGhdO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBmb3IgYW55IG9iamVjdCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSB0aGVuIHJldHVybnMgaXRcbiAgICogUmV0dXJuIGZhbHNlIGlmIG5vdGhpbmcgaXMgZm91bmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgKiBAcmV0dXJuIHtCYWxsfSBUaGUgZm91bmQgb2JqZWN0XG4gICAqL1xuICBnZXRPYmplY3RBdENvb3JkaW5hdGVzKHg6IG51bWJlciwgeTogbnVtYmVyKTogQmFsbCB7XG4gICAgbGV0IHJldCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgdiA9IG5ldyBWZWMyKHgsIHkpO1xuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCkgPT4ge1xuICAgICAgaWYgKGJhbGwucG9zLmRpc3QodikgPCBiYWxsLnIpIHJldCA9IGJhbGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGNvcGllcyBvZiBhbGwgYmFsbHMgaW4gdGhlIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtBcnJheTxCYWxsPn0gVGhlIGFycmF5IG9mIHRoZSBjb3BpZWQgYmFsbHNcbiAgICovXG4gIGdldENvcHlPZkJhbGxzKCk6IEFycmF5PEJhbGw+IHtcbiAgICBsZXQgcmV0OiBBcnJheTxCYWxsPiA9IFtdO1xuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmV0LnB1c2goaXRlbS5jb3B5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgY29waWVzIG9mIGFsbCBib2RpZXMgaW4gdGhlIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtBcnJheTxCb2R5Pn0gVGhlIGFycmF5IG9mIHRoZSBjb3BpZWQgYm9kaWVzXG4gICAqL1xuICBnZXRDb3B5T2ZCb2RpZXMoKTogQXJyYXk8Qm9keT4ge1xuICAgIGxldCByZXQ6IEFycmF5PEJvZHk+ID0gW107XG4gICAgdGhpcy5ib2RpZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmV0LnB1c2goaXRlbS5jb3B5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbmV4cG9ydCB7QmFsbH07XG5leHBvcnQge0JvZHl9O1xuZXhwb3J0IHtWZWMyfTtcbmV4cG9ydCB7V2FsbH07XG5leHBvcnQge0xpbmVTZWdtZW50fTtcbmV4cG9ydCB7U3ByaW5nfTtcbmV4cG9ydCB7U3RpY2t9O1xuZXhwb3J0IHtTb2Z0QmFsbH07XG5leHBvcnQge1BoeXNpY3N9O1xuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgU3RpY2sgZnJvbSAnLi9zdGljayc7XG5pbXBvcnQgTGluZVNlZ21lbnQgZnJvbSAnLi9saW5lc2VnbWVudCc7XG5pbXBvcnQgU3ByaW5nIGZyb20gJy4vc3ByaW5nJztcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzb2Z0Ym9keSBvYmplY3RcbiAqIFRoZXkgd29yayBsaWtlIGEgYmFsbCwgd2l0aCBwcmVzc3VyZSBpbnNpZGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29mdEJhbGwge1xuICAgIHBvaW50czogQXJyYXk8QmFsbD47XG4gICAgcHJlc3N1cmU6IG51bWJlcjtcbiAgICBmYzogbnVtYmVyO1xuICAgIHJlc29sdXRpb246IG51bWJlcjtcbiAgICByOiBudW1iZXI7XG4gICAgc2lkZXM6IEFycmF5PFNwcmluZz47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgU29mdEJhbGxcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvcyBUaGUgc3RhcnRpbmcgcG9zaXRpb24gb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIFRoZSByYWRpdXMgb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmVzc3VyZSBUaGUgXCJoYXJkbmVzc1wiIG9mIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVzb2x1dGlvbiBUaGUgbnVtYmVyIG9mIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIGJhbGxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IFZlYzIsIHI6IG51bWJlciwgcHJlc3N1cmU6IG51bWJlcixcbiAgICAgICAgZmM6IG51bWJlciwgcmVzb2x1dGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XG5cbiAgICAgICAgaWYgKGZjIHx8IGZjID09PSAwKSB0aGlzLmZjID0gZmM7XG4gICAgICAgIGVsc2UgdGhpcy5mYyA9IDAuNDtcblxuICAgICAgICB0aGlzLnByZXNzdXJlID0gcHJlc3N1cmU7XG5cbiAgICAgICAgaWYgKCFyZXNvbHV0aW9uKSB0aGlzLnJlc29sdXRpb24gPSAzMDtcbiAgICAgICAgZWxzZSB0aGlzLnJlc29sdXRpb24gPSByZXNvbHV0aW9uO1xuXG4gICAgICAgIHIgPSBNYXRoLmFicyhyKTtcbiAgICAgICAgdGhpcy5yID0gcjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzb2x1dGlvbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3UG9zID0gbmV3IFZlYzIocG9zLngsIHBvcy55KTtcbiAgICAgICAgICAgIG5ld1Bvcy5hZGQoVmVjMi5tdWx0KFxuICAgICAgICAgICAgICAgIFZlYzIuZnJvbUFuZ2xlKChpIC8gdGhpcy5yZXNvbHV0aW9uKSAqIE1hdGguUEkgKiAyKSwgcikpO1xuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaChuZXcgQmFsbChuZXdQb3MsIG5ldyBWZWMyKDAsIDApLFxuICAgICAgICAgICAgICAgIHIgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5yZXNvbHV0aW9uKSwgMCwgMCwgdGhpcy5mYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaWRlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzb2x1dGlvbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBTdGljaygyICogciAqIE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnJlc29sdXRpb24pKTtcbiAgICAgICAgICAgIHNpZGUuYXR0YWNoT2JqZWN0KHRoaXMucG9pbnRzW2ldKTtcbiAgICAgICAgICAgIHNpZGUuYXR0YWNoT2JqZWN0KHRoaXMucG9pbnRzWyhpICsgMSkgJSB0aGlzLnJlc29sdXRpb25dKTtcbiAgICAgICAgICAgIC8vIGlmIChpICUgMiA9PT0gMCkgc2lkZS5sb2NrUm90YXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuc2lkZXMucHVzaChzaWRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByZXNzdXJlLWJhc2VkIGZvcmNlcyBpbiB0aGUgc29mdCBiYWxsXG4gICAgICogQHBhcmFtIHtTb2Z0QmFsbH0gc29mdEJhbGwgVGhlIHNvZnQgYmFsbCB0byB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICBzdGF0aWMgdXBkYXRlUHJlc3N1cmVCYXNlZEZvcmNlcyhzb2Z0QmFsbDogU29mdEJhbGwsIHQ6IG51bWJlcikge1xuICAgICAgICBsZXQgcG9saWdvbnM6IEFycmF5PEFycmF5PFZlYzI+PiA9IFtdO1xuICAgICAgICBwb2xpZ29ucy5wdXNoKFtdKTtcbiAgICAgICAgc29mdEJhbGwucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHBvbGlnb25zWzBdLnB1c2gobmV3IFZlYzIocC5wb3MueCwgcC5wb3MueSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoKGZ1bmN0aW9uKHBvbCkge1xuICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pKTtcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KShwb2xpZ29uc1swXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGVzID0gKGFycjogQXJyYXk8bnVtYmVyPiwgaXRlbTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gaXRlbSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3RXaXRoUG9saWdvbiA9IGZ1bmN0aW9uKHNlZ21lbnQ6IExpbmVTZWdtZW50LFxuICAgICAgICAgICAgICAgIHBvbDogQXJyYXk8VmVjMj4sIGV4Y2VwdGlvbnM6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVzKGV4Y2VwdGlvbnMsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaV0ueCwgcG9sW2ldLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTGluZVNlZ21lbnQuaW50ZXJzZWN0KHNlZ21lbnQsIHNpZGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgICAgY2hlY2tBbGxQb2xpZ29uczogd2hpbGUgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbGlnb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2pdLngsIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgVmVjMihuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSkuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghKGEuaGVhZGluZyA+IGIuaGVhZGluZyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2ogJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2ogJSBwb2wubGVuZ3RoXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKHBvbC5sZW5ndGggLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gajsgbCA8PSBrOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBwb2wubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5zdWIocG9sWyhqICsgMSkgJSBwb2wubGVuZ3RoXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW2ogLSAxXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coYSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbCwgWyhqIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBjaGVja0FsbFBvbGlnb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IHBvbGlnb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgcG9sID0gcG9saWdvbnNbaV07XG4gICAgICAgICAgICB3aGlsZSAocG9sLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKFtwb2xbMF0sIHBvbFsxXSwgcG9sWzJdXSk7XG4gICAgICAgICAgICAgICAgcG9sLnNwbGljZSgxLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtU3VtID0gMDtcbiAgICAgICAgcG9saWdvbnMuZm9yRWFjaCgocG9sKSA9PiB7XG4gICAgICAgICAgICBsZXQgYSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMF0ueCAtIHBvbFsxXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzBdLnkgLSBwb2xbMV0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGIgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzFdLnggLSBwb2xbMl0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsxXS55IC0gcG9sWzJdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBjID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsyXS54IC0gcG9sWzBdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMl0ueSAtIHBvbFswXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMjtcbiAgICAgICAgICAgIGxldCBtID0gTWF0aC5zcXJ0KHMgKiAocyAtIGEpICogKHMgLSBiKSAqIChzIC0gYykpO1xuICAgICAgICAgICAgbVN1bSArPSBtO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgb3ZlclByZXNzdXJlID0gc29mdEJhbGwucHJlc3N1cmUgKlxuICAgICAgICAgICAgKChzb2Z0QmFsbC5yICogc29mdEJhbGwuciAqIE1hdGguUEkpIC8gbVN1bSlcbiAgICAgICAgICAgIC0gc29mdEJhbGwucHJlc3N1cmU7XG4gICAgICAgIHNvZnRCYWxsLnNpZGVzLmZvckVhY2goKHNpZGUpID0+IHtcbiAgICAgICAgICAgIGxldCBmb3JjZSA9IFZlYzIuc3ViKHNpZGUub2JqZWN0c1swXS5wb3MsIHNpZGUub2JqZWN0c1sxXS5wb3MpO1xuICAgICAgICAgICAgZm9yY2UubXVsdChvdmVyUHJlc3N1cmUpO1xuICAgICAgICAgICAgZm9yY2Uucm90YXRlKE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIGZvcmNlLm11bHQodCk7XG4gICAgICAgICAgICBzaWRlLm9iamVjdHNbMF0udmVsLmFkZChWZWMyLmRpdihmb3JjZSwgc2lkZS5vYmplY3RzWzBdLm0pKTtcbiAgICAgICAgICAgIHNpZGUub2JqZWN0c1sxXS52ZWwuYWRkKFZlYzIuZGl2KGZvcmNlLCBzaWRlLm9iamVjdHNbMV0ubSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHN0cmluZ1xuICogVGhleSBhY3QgbGlrZSBzcHJpbmdzIGluIHJlYWwgbGlmZVxuICogWW91IGNhbiBhdHRhY2ggb3RoZXIgb2JqZWN0cyB0byB0aGUgZW5kcyBvZiB0aGVtXG4gKiBUaGV5IGRvIG5vdCBjb2xsaWRlIHdpdGggb3RoZXIgb2JqZWN0IG5laXRoZXIgd2l0aCBlYWNoIG90aGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcmluZyB7XG4gICAgbGVuZ3RoOiBudW1iZXI7XG4gICAgc3ByaW5nQ29uc3RhbnQ6IG51bWJlcjtcbiAgICBwaW5uZWQ6IGFueTtcbiAgICBvYmplY3RzOiBBcnJheTxhbnk+O1xuICAgIHJvdGF0aW9uTG9ja2VkOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNwcmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggVGhlIHVuc3RyZWNoZWQgbGVuZ3RoIG9mIHRoZSBzcHJpbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3ByaW5nQ29uc3RhbnQgU3ByaW5nIGNvbnN0YW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGVuZ3RoOiBudW1iZXIsIHNwcmluZ0NvbnN0YW50OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSBzcHJpbmdDb25zdGFudDtcbiAgICAgICAgdGhpcy5waW5uZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vYmplY3RzID0gW107XG4gICAgICAgIHRoaXMucm90YXRpb25Mb2NrZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaW5zIG9uZSBzaWRlIG9mIHRoZSB0aGUgc3ByaW5nIHRvIGEgZ2l2ZW4gY29vcmRpbmF0ZSBpbiBzcGFjZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHBpbkhlcmUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5waW5uZWQgPSB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBwaW5uZWQgdGFnIGZyb20gdGhlIHNwcmluZ1xuICAgICAqIFlvdSBjYW4gbm93IGF0dGFjaCBpdCB0byBhbm90aGVyIG9iamVjdFxuICAgICAqL1xuICAgIHVucGluKCkge1xuICAgICAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIG9uZSBlbmQgb2YgdGhlIHNwcmluZyB0byBhbiBvYmplY3QgKGVnLiBCYWxsKVxuICAgICAqIEBwYXJhbSB7YW55fSBvYmplY3QgVGhlIG9iamVjdCB0aGF0IHRoZSBzcHJpbmcgaXMgZ2V0dGluZyBhdHRhY2hlZCB0b1xuICAgICAqL1xuICAgIGF0dGFjaE9iamVjdChvYmplY3Q6IGFueSkge1xuICAgICAgICBsZXQgb2IgPSB0aGlzLm9iamVjdHM7XG4gICAgICAgIG9iLnB1c2gob2JqZWN0KTtcbiAgICAgICAgaWYgKG9iLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5waW5uZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgIG9iID0gW29iW29iLmxlbmd0aCAtIDJdLCBvYltvYi5sZW5ndGggLSAxXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2NrcyB0aGUgb2JqZWN0cyBhdHRhY2hlZCB0byB0aGUgZW5kcyBvZiB0aGUgc3ByaW5nXG4gICAgICogdG8gbm90IHJvdGF0ZSBhcm91bmQgdGhlIGF0dGFjaCBwb2ludFxuICAgICAqL1xuICAgIGxvY2tSb3RhdGlvbigpIHtcbiAgICAgICAgdGhpcy5yb3RhdGlvbkxvY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVsZWFzZXMgdGhlIG9iamVjdHMgYXR0YWNoZWQgdG8gdGhlIGVuZHMgb2YgdGhlIHNwcmluZ1xuICAgICAqIHRvIHJvdGF0ZSBhcm91bmQgdGhlIGF0dGFjaCBwb2ludFxuICAgICAqL1xuICAgIHVubG9ja1JvdGF0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdGF0aW9uTG9ja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc3ByaW5nIGJheSB0aGUgZWxhcHNlZCB0aW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgRWxhcHNlZCB0aW1lXG4gICAgICovXG4gICAgdXBkYXRlKHQ6IG51bWJlcikge1xuICAgICAgICBsZXQgcDE7XG4gICAgICAgIGxldCBwMjtcbiAgICAgICAgaWYgKHRoaXMucGlubmVkICYmIHRoaXMub2JqZWN0c1swXSkge1xuICAgICAgICAgICAgcDIgPSB0aGlzLnBpbm5lZDtcbiAgICAgICAgICAgIHAxID0gdGhpcy5vYmplY3RzWzBdO1xuICAgICAgICAgICAgbGV0IGRpc3QgPSBuZXcgVmVjMihwMi54IC0gcDEucG9zLngsIHAyLnkgLSBwMS5wb3MueSk7XG4gICAgICAgICAgICBsZXQgZGwgPSBkaXN0Lmxlbmd0aCAtIHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoZGwgKiB0aGlzLnNwcmluZ0NvbnN0YW50ICogdCAvIChwMS5tKSk7XG4gICAgICAgICAgICBwMS52ZWwueCArPSBkaXN0Lng7XG4gICAgICAgICAgICBwMS52ZWwueSArPSBkaXN0Lnk7XG5cbiAgICAgICAgICAgIGxldCB2ID0gcDEudmVsO1xuICAgICAgICAgICAgdi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGlvbkxvY2tlZCkge1xuICAgICAgICAgICAgICAgIGxldCBzID0gbmV3IFZlYzIocDIueCwgcDIueSk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMS5tICsgcDEuYW07XG4gICAgICAgICAgICAgICAgbGV0IGFuZyA9IChwMS5hbSAqIHAxLmFuZyAtIHIyLmxlbmd0aCAqIHAxLm0gKiAodi55KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdi55ID0gLWFuZyAqIHIyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHYucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vYmplY3RzWzBdICYmIHRoaXMub2JqZWN0c1sxXSkge1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBwMiA9IHRoaXMub2JqZWN0c1sxXTtcbiAgICAgICAgICAgIGxldCBkaXN0ID0gVmVjMi5zdWIocDEucG9zLCBwMi5wb3MpO1xuICAgICAgICAgICAgbGV0IGRsID0gZGlzdC5sZW5ndGggLSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIGRpc3Quc2V0TWFnKDEpO1xuICAgICAgICAgICAgZGlzdC5tdWx0KGRsICogdGhpcy5zcHJpbmdDb25zdGFudCAqIHQpO1xuICAgICAgICAgICAgcDIudmVsLmFkZChWZWMyLmRpdihkaXN0LCBwMi5tKSk7XG4gICAgICAgICAgICBwMS52ZWwuYWRkKFZlYzIuZGl2KGRpc3QsIC1wMS5tKSk7XG5cbiAgICAgICAgICAgIGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICAgICAgICBsZXQgdjEgPSBwMS52ZWw7XG4gICAgICAgICAgICBsZXQgdjIgPSBwMi52ZWw7XG4gICAgICAgICAgICB2MS5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgVmVjMihwMS5wb3MueCAqIHAxLm0gKyBwMi5wb3MueCAqIHAyLm0sXG4gICAgICAgICAgICAgICAgICAgIHAxLnBvcy55ICogcDEubSArIHAyLnBvcy55ICogcDIubSk7XG4gICAgICAgICAgICAgICAgcy5kaXYocDEubSArIHAyLm0pO1xuICAgICAgICAgICAgICAgIGxldCByMSA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDIucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMS5sZW5ndGggKiByMS5sZW5ndGggKiBwMS5tICsgcDEuYW0gK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMi5tICsgcDIuYW07XG4gICAgICAgICAgICAgICAgbGV0IHN2ID0gKHYxLnkgLSB2Mi55KSAqIHIyLmxlbmd0aCAvXG4gICAgICAgICAgICAgICAgICAgIChyMS5sZW5ndGggKyByMi5sZW5ndGgpICsgdjIueTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nID0gKHAxLmFtICogcDEuYW5nICsgcDIuYW0gKiBwMi5hbmcgLVxuICAgICAgICAgICAgICAgICAgICByMS5sZW5ndGggKiBwMS5tICogKHYxLnkgLSBzdikgK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiBwMi5tICogKHYyLnkgLSBzdikpIC8gKGFtKTtcblxuICAgICAgICAgICAgICAgIHYxLnkgPSAtYW5nICogcjEubGVuZ3RoICsgc3Y7XG4gICAgICAgICAgICAgICAgdjIueSA9ICthbmcgKiByMi5sZW5ndGggKyBzdjtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgICAgICBwMi5hbmcgPSBhbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHYxLnJvdGF0ZShkaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuaW1wb3J0IFNwcmluZyBmcm9tICcuL3NwcmluZyc7XG5cbi8qKlxuICogU3RpY2sgY2xhc3MgZm9yIHRoZSBwaHlzaWNzIGVuZ2luZVxuICogU3RpY2tzIGFyZSBub3Qgc3RyZWNoYWJsZSBvYmplY3RzIHRoYXQgZG8gbm90IGNvbGxpZGVcbiAqIHdpdGggb3RoZXIgb2JqZWN0cyBidXQgdGhleSBjYW4gaG9sZCBvdGhlciBvYmplY3RzIG9uIHRoZWlyIGVuZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RpY2sgZXh0ZW5kcyBTcHJpbmcge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzdGlja1xuICAgICAqIEBwYXJhbSB7bnViZXJ9IGxlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSBzdGlja1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGxlbmd0aCwgMCk7XG4gICAgICAgIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHN0aWNrIHRyb3VnaCBhbiBlbGFwc2VkIHRpbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICB1cGRhdGUodDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBwMTtcbiAgICAgICAgbGV0IHAyO1xuICAgICAgICBpZiAodGhpcy5waW5uZWQgJiYgdGhpcy5vYmplY3RzWzBdKSB7XG4gICAgICAgICAgICBwMiA9IHRoaXMucGlubmVkO1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBsZXQgZGlzdCA9IG5ldyBWZWMyKHAyLnggLSBwMS5wb3MueCwgcDIueSAtIHAxLnBvcy55KTtcbiAgICAgICAgICAgIGRpc3Quc2V0TWFnKDEpO1xuICAgICAgICAgICAgZGlzdC5tdWx0KC10aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICBwMS5tb3ZlKC1wMS5wb3MueCArIHAyLnggKyBkaXN0LngsIC1wMS5wb3MueSArIHAyLnkgKyBkaXN0LnkpO1xuXG4gICAgICAgICAgICBsZXQgdiA9IHAxLnZlbDtcbiAgICAgICAgICAgIHYucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdi54ID0gMDtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAyLngsIHAyLnkpO1xuICAgICAgICAgICAgICAgIGxldCByMiA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgICAgICAgICAgbGV0IGFtID0gcjIubGVuZ3RoICogcjIubGVuZ3RoICogcDEubSArIHAxLmFtO1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgLSByMi5sZW5ndGggKiBwMS5tICogKHYueSkpIC8gKGFtKTtcblxuICAgICAgICAgICAgICAgIHYueSA9IC1hbmcgKiByMi5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBwMS5hbmcgPSBhbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHYucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vYmplY3RzWzBdICYmIHRoaXMub2JqZWN0c1sxXSkge1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBwMiA9IHRoaXMub2JqZWN0c1sxXTtcblxuICAgICAgICAgICAgbGV0IGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICAgICAgICBsZXQgZGwgPSB0aGlzLmxlbmd0aCAtIGRpc3QubGVuZ3RoO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBsZXQgbW92ZTEgPSBWZWMyLm11bHQoZGlzdCwgZGwgKiAocDIubSkgLyAoKHAxLm0pICsgKHAyLm0pKSk7XG4gICAgICAgICAgICBsZXQgbW92ZTIgPSBWZWMyLm11bHQoZGlzdCwgLWRsICogKHAxLm0pIC8gKChwMS5tKSArIChwMi5tKSkpO1xuICAgICAgICAgICAgcDEubW92ZShtb3ZlMS54LCBtb3ZlMS55KTtcbiAgICAgICAgICAgIHAyLm1vdmUobW92ZTIueCwgbW92ZTIueSk7XG5cbiAgICAgICAgICAgIGxldCB2MSA9IHAxLnZlbDtcbiAgICAgICAgICAgIGxldCB2MiA9IHAyLnZlbDtcbiAgICAgICAgICAgIHYxLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIHYyLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIHYxLnggPSB2Mi54ID0gKHAxLm0gKiB2MS54ICsgcDIubSAqIHYyLngpIC8gKChwMS5tKSArIChwMi5tKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgVmVjMihwMS5wb3MueCAqIHAxLm0gKyBwMi5wb3MueCAqIHAyLm0sXG4gICAgICAgICAgICAgICAgICAgIHAxLnBvcy55ICogcDEubSArIHAyLnBvcy55ICogcDIubSk7XG4gICAgICAgICAgICAgICAgcy5kaXYocDEubSArIHAyLm0pO1xuICAgICAgICAgICAgICAgIGxldCByMSA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDIucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMS5sZW5ndGggKiByMS5sZW5ndGggKiBwMS5tICsgcDEuYW0gK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMi5tICsgcDIuYW07XG4gICAgICAgICAgICAgICAgbGV0IHN2ID0gKHYxLnkgLSB2Mi55KSAqIHIyLmxlbmd0aCAvXG4gICAgICAgICAgICAgICAgICAgIChyMS5sZW5ndGggKyByMi5sZW5ndGgpICsgdjIueTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nID0gKHAxLmFtICogcDEuYW5nICsgcDIuYW0gKiBwMi5hbmcgLVxuICAgICAgICAgICAgICAgICAgICByMS5sZW5ndGggKiBwMS5tICogKHYxLnkgLSBzdikgK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiBwMi5tICogKHYyLnkgLSBzdikpIC8gKGFtKTtcblxuICAgICAgICAgICAgICAgIHYxLnkgPSAtYW5nICogcjEubGVuZ3RoICsgc3Y7XG4gICAgICAgICAgICAgICAgdjIueSA9ICthbmcgKiByMi5sZW5ndGggKyBzdjtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgICAgICBwMi5hbmcgPSBhbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHYxLnJvdGF0ZShkaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBldmVyeSBhbmdsZSBpcyBjb3VudGVyY2xvY2t3aXNlIChhbnRpY2xvY2t3aXNlKVxuLyoqIENsYXNzIHJlcHJlc2VudGluZyBhIDJkIHZlY3Rvci4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlYzIge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IHZhbHVlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBjb3B5IG9mIHRoZSB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNvcHkuXG4gICAgICovXG4gICAgZ2V0IGNvcHkoKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBsZW5ndGguXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3RvciBzcXVhcmVkLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGxlbmd0aCBzcXVhcmVkLlxuICAgICAqL1xuICAgIGdldCBzcWxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaGVhZGluZyBvZiB0aGUgdmVjdG9yIGNvbXBhcmVkIHRvICgxLCAwKS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBhbmdsZSBiZXR3ZWVuICgxLCAwKVxuICAgICAqIGFuZCB0aGUgdmVjdG9yIGluIGFudGljbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAgICAqL1xuICAgIGdldCBoZWFkaW5nKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnggPT09IDAgJiYgdGhpcy55ID09PSAwKSByZXR1cm4gMDtcbiAgICAgICAgaWYgKHRoaXMueCA9PT0gMCkgcmV0dXJuIHRoaXMueSA+IDAgPyBNYXRoLlBJIC8gMiA6IDEuNSAqIE1hdGguUEk7XG4gICAgICAgIGlmICh0aGlzLnkgPT09IDApIHJldHVybiB0aGlzLnggPiAwID8gMCA6IE1hdGguUEk7XG4gICAgICAgIGxldCB2ID0gVmVjMi5ub3JtYWxpemVkKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy54ID4gMCAmJiB0aGlzLnkgPiAwKSByZXR1cm4gTWF0aC5hc2luKHYueSk7XG4gICAgICAgIGlmICh0aGlzLnggPCAwICYmIHRoaXMueSA+IDApIHJldHVybiBNYXRoLmFzaW4oLXYueCkgKyBNYXRoLlBJIC8gMjtcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgJiYgdGhpcy55IDwgMCkgcmV0dXJuIE1hdGguYXNpbigtdi55KSArIE1hdGguUEk7XG4gICAgICAgIGlmICh0aGlzLnggPiAwICYmIHRoaXMueSA8IDApIHJldHVybiBNYXRoLmFzaW4odi54KSArIDEuNSAqIE1hdGguUEk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYW5vdGhlciB2ZWN0b3IgdG8gdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBUaGUgb3RoZXIgdmVjdG9yLlxuICAgICAqL1xuICAgIGFkZChhOiBWZWMyKSB7XG4gICAgICAgIHRoaXMueCArPSBhLng7XG4gICAgICAgIHRoaXMueSArPSBhLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIGFub3RoZXIgdmVjdG9yIGZyb20gdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBUaGUgb3RoZXIgdmVjdG9yLlxuICAgICAqL1xuICAgIHN1YihhOiBWZWMyKSB7XG4gICAgICAgIHRoaXMueCAtPSBhLng7XG4gICAgICAgIHRoaXMueSAtPSBhLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHNjYWxhci5cbiAgICAgKi9cbiAgICBtdWx0KHg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggKj0geDtcbiAgICAgICAgdGhpcy55ICo9IHg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGl2aWRlcyB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHNjYWxhci5cbiAgICAgKi9cbiAgICBkaXYoeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCAvPSB4O1xuICAgICAgICB0aGlzLnkgLz0geDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaW5lYXJyeSBpbnRlcnBvbGF0ZXMgdGhlIHZlY3RvciBpbnRvIHRoZSBvdGhlciB2ZWN0b3IgYnkgc2NhbGFyIHguXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdGhlciAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIGxlcnAob3RoZXI6IFZlYzIsIHg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggKz0gKG90aGVyLnggLSB0aGlzLngpICogeDtcbiAgICAgICAgdGhpcy55ICs9IChvdGhlci55IC0gdGhpcy55KSAqIHg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB2ZWN0b3IgYW5kIHRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogVmVjdG9ycyBhcmUgcmVwcmVzZW50aW5nIHBvaW50cyBoZXJlLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gb3RoZXIgLSBUaGUgb3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBkaXN0KG90aGVyOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChuZXcgVmVjMih0aGlzLnggLSBvdGhlci54LCB0aGlzLnkgLSBvdGhlci55KSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGwgLSBUaGUgbmV3IGxlbmd0aCB2YWx1ZS5cbiAgICAgKi9cbiAgICBzZXRNYWcobDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm11bHQobCAvIHRoaXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgdGhlIHZlY3RvciBhbnRpY2xvY2t3aXNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFJvdGF0aW9uIGFuZ2xlLlxuICAgICAqL1xuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgIGxldCBoID0gdGhpcy5oZWFkaW5nO1xuICAgICAgICBsZXQgdiA9IFZlYzIuZnJvbUFuZ2xlKGFuZ2xlICsgaCk7XG4gICAgICAgIHYubXVsdCh0aGlzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMueCA9IHYueDtcbiAgICAgICAgdGhpcy55ID0gdi55O1xuICAgIH1cblxuXG4gICAgLy8gU3RhdGljIGZ1bmN0aW9uczpcbiAgICAvKipcbiAgICAgKiBBZGQgdHdvIHZlY3RvcnMgdG9nZXRoZXIuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gVmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgc3VtIG9mIHRoZSB2ZWN0b3JzLlxuICAgICAqL1xuICAgIHN0YXRpYyBhZGQoYTogVmVjMiwgYjogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoYS54ICsgYi54LCBhLnkgKyBiLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gYW5vdGhlci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBzdWJ0cmFjdGlvbiBvZiB0aGUgdmVjdG9ycy5cbiAgICAgKi9cbiAgICBzdGF0aWMgc3ViKGE6IFZlYzIsIGI6IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKGEueCAtIGIueCwgYS55IC0gYi55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBseSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gdiAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFNjYWxhci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgbXVsdGlwbGllZCB2ZWN0b3IuXG4gICAgICovXG4gICAgc3RhdGljIG11bHQodjogVmVjMiwgeDogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih2LnggKiB4LCB2LnkgKiB4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGUgdGhlIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHYgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBTY2FsYXIuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGRpdmlkZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBkaXYodjogVmVjMiwgeDogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih2LnggLyB4LCB2LnkgLyB4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSB1bml0IHZlY3RvciBmcm9tIGFuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhIC0gVGhlIGFuZ2xlLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBjcmVhdGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFuZ2xlKGE6IG51bWJlcik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoTWF0aC5jb3MoYSksIE1hdGguc2luKGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaW5lYXJyeSBpbnRlcnBvbGF0ZXMgYSB2ZWN0b3IgaW50byBhbm90aGVyIHZlY3RvciBieSBzY2FsYXIgeC5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBjcmVhdGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgbGVycChhOiBWZWMyLCBiOiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIuYWRkKGEsIFZlYzIubXVsdChWZWMyLnN1YihiLCBhKSwgeCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZGlzdChhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIuc3ViKGEsIGIpLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRvdCBwcm9kdWN0IG9mIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGRvdChhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgY3Jvc3MgcHJvZHVjdCBvZiB0aGVtLlxuICAgICAqL1xuICAgIHN0YXRpYyBjcm9zcyhhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueSAtIGEueSAqIGIueDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBBbmdsZSBiZXR3ZWVuIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGFuZ2xlKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlYzIuZG90KGEsIGIpIC8gTWF0aC5zcXJ0KGEuc3FsZW5ndGggKiBiLnNxbGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBhbmdsZSBiZXR3ZWVuIHR3byB2ZWN0b3JzIGJ1dCBpbiB0aGUgYW50aWNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBBbmdsZSBiZXR3ZWVuIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGFuZ2xlQUNXKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICBsZXQgYWggPSBhLmhlYWRpbmc7XG4gICAgICAgIGxldCBiaCA9IGIuaGVhZGluZztcbiAgICAgICAgbGV0IGFuZ2xlID0gYmggLSBhaDtcbiAgICAgICAgcmV0dXJuIGFuZ2xlIDwgMCA/IDIgKiBNYXRoLlBJICsgYW5nbGUgOiBhbmdsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSB2ZWN0b3Igd2l0aCB0aGUgc2FtZSBoZWFkaW5nIHdpdGggdGhlIGlucHV0IHZlY3RvclxuICAgICAqIGJ1dCB3aXRoIGxlbmd0aCA9IDEuXG4gICAgICogQHBhcmFtIHtWZWMyfSB2IC0gQSB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVmVjdG9yIHdpdGggbGVuZ3RoID0gMC5cbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsaXplZCh2OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIGxldCBsID0gdi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBsID09PSAwID8gdiA6IG5ldyBWZWMyKHYueCAvIGwsIHYueSAvIGwpO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuXG4vKiogQ2xhc3MgcmVwcmVzZW50aW5nIGEgd2FsbFxuICogV2FsbHMgYXJlIG9iamVjdHMgdGhhdCBhcmUgaW1tb3ZhYmxlICBhbmQgdGhleSBhcmUgcmlnaWRcbiAqIEl0IGNhbiBiZSBjb252ZXggb3IgY29uY2F2ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSB3YWxsXG4gICAgICogQHBhcmFtIHtBcnJheTxWZWMyPn0gcG9pbnRzIEFycmF5IG9mIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIHdhbGxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9pbnRzOiBBcnJheTxWZWMyPikge1xuICAgICAgICBsZXQgcG9sID0gdGhpcy5wb2ludHM7XG4gICAgICAgIGxldCBzdW0xID0gMDtcbiAgICAgICAgbGV0IHN1bTIgPSAwO1xuICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSkpO1xuICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgcG9sW2ldKSwgVmVjMi5zdWIocG9sW2kgLSAxXSwgcG9sW2ldKSk7XG4gICAgICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSkpO1xuICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIGlmIChzdW0yID4gc3VtMSkgcmV0dXJuO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcG9sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB0ZW1wLnB1c2gocG9sW2ldKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gdGVtcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIGZvciBjb2xsaXNpb24gZGV0ZWN0aW9uIGFuZCBiZWhhdmlvciBiZXR3ZWVuIGJhbGxzIGFuZCB3YWxsc1xuICAgICAqIEBwYXJhbSB7QmFsbH0gYmFsbCBUaGUgYmFsbCB0aGF0IGlzIGNoZWNrZWQgaWYgaXQgY29sbGlkZXMgd2l0aCB0aGUgd2FsbFxuICAgICAqL1xuICAgIGNvbGxpZGVXaXRoQmFsbChiYWxsOiBCYWxsKSB7XG4gICAgICAgIGxldCBoZWFkaW5nOiBudW1iZXI7XG4gICAgICAgIGxldCByZWw6IG51bWJlcjtcblxuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgcC54IC09IGJhbGwucG9zLng7XG4gICAgICAgICAgICBwLnkgLT0gYmFsbC5wb3MueTtcbiAgICAgICAgICAgIHAubXVsdCgtMSk7XG4gICAgICAgICAgICBpZiAocC5sZW5ndGggPD0gYmFsbC5yKSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IHAuaGVhZGluZztcbiAgICAgICAgICAgICAgICByZWwgPSBwLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAgPSBuZXcgVmVjMihwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgIGxldCBucCA9IG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50c1soaWR4ICsgMSkgJSB0aGlzLnBvaW50cy5sZW5ndGhdLnkpO1xuICAgICAgICAgICAgbGV0IGJwID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBWZWMyKG5wLnggLSBwLngsIG5wLnkgLSBwLnkpO1xuICAgICAgICAgICAgbGV0IGggPSBzaWRlLmhlYWRpbmc7XG4gICAgICAgICAgICBwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbnAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBicC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGxldCBkID0gYnAueSAtICgocC55ICsgbnAueSkgLyAyKTtcbiAgICAgICAgICAgIGlmIChkID49IC1iYWxsLnIgJiYgZCA8PSBiYWxsLnIgJiYgYnAueCA+PSBucC54ICYmIGJwLnggPD0gcC54KSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IGggLSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgICByZWwgPSBkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaGVhZGluZyA9PT0gMCB8fCBoZWFkaW5nKSB7XG4gICAgICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgICBsZXQgdmVsID0gbmV3IFZlYzIoYmFsbC52ZWwueCwgYmFsbC52ZWwueSk7XG4gICAgICAgICAgICBwb3Mucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdmVsLnJvdGF0ZSgtaGVhZGluZyArIE1hdGguUEkgLyAyKTtcblxuICAgICAgICAgICAgdmVsLnkgKj0gLWJhbGwuaztcbiAgICAgICAgICAgIHBvcy55ICs9IGJhbGwuciAtIHJlbDtcbiAgICAgICAgICAgIGxldCBkdnkgPSB2ZWwueSAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICAgIGxldCBkdnggPVxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGR2eSkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgICAgICBNYXRoLnNpZ24odmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkdngpID4gTWF0aC5hYnModmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgICAgICBkdnggPSAtdmVsLnggKyBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZlbC54ICs9XG4gICAgICAgICAgICAgICAgZHZ4IC0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgICBiYWxsLmFuZyAtPVxuICAgICAgICAgICAgICAgIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgICAgICBwb3Mucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2ZWwucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICBiYWxsLnBvcy54ID0gcG9zLng7XG4gICAgICAgICAgICBiYWxsLnBvcy55ID0gcG9zLnk7XG4gICAgICAgICAgICBiYWxsLnZlbC54ID0gdmVsLng7XG4gICAgICAgICAgICBiYWxsLnZlbC55ID0gdmVsLnk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
