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
        deltaAng1 *= (ball1.amc) / (ball1.amc + 1);
        deltaAng2 *= (ball2.amc) / (ball2.amc + 1);
        ball1.ang -= deltaAng1;
        ball2.ang += deltaAng2;
        let u1Parralel = vel1Parralel + (deltaAng1 * r1);
        let u2Parralel = vel2Parralel + (deltaAng2 * r2);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFsbC50cyIsInNyYy9ib2R5LnRzIiwic3JjL2xpbmVzZWdtZW50LnRzIiwic3JjL3BoeXNpY3MudHMiLCJzcmMvc29mdGJhbGwudHMiLCJzcmMvc3ByaW5nLnRzIiwic3JjL3N0aWNrLnRzIiwic3JjL3ZlYzIudHMiLCJzcmMvd2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsaUNBQTBCO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFxQixJQUFJO0lBWXZCOzs7Ozs7Ozs7T0FTRztJQUNILFlBQVksR0FBUyxFQUFFLEdBQVMsRUFBRSxDQUFTLEVBQ3pDLENBQVMsRUFBRSxHQUFXLEVBQUUsRUFBVTtRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksR0FBRztZQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztZQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRWpDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRWxCLElBQUksR0FBRyxJQUFJLFNBQVM7WUFBRSxJQUFJ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QUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRWhDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUUvQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDM0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFBRSxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFL0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFD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SSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVkLDRDQUE0QztRQUM1QyxLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtZQUN0QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxH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LENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBcUIsRUFBRSxRQUFxQjtRQUN6RCxJQUFJLEVBQUUsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FB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QUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMvQixJQUFJLFNBQVMsQ0FBQztnQkFDZCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDSCxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLFNBQVMsQ0FBQztnQkFDZCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDSCxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFD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QUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN2RCxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDbEM7b0JBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDM0MsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BCO2FBQ0Y7WUFFRCx1QkFBdUI7WUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzFELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRDtxQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRDtnQkFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ2hELENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuRDtxQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNqRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUU7d0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUM1RCxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7cUJBQ3ZDO29CQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FB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TixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLE9BQU87UUFDUCxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2xFLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxJ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c291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5cbi8qKlxuICogQSBjbGFzcyByZXByZXNlbnRpbmcgYSBiYWxsXG4gKiBBIGJhbGwgaXMgYW4gb2JqZWN0IGluIHRoZSBwaHlzaWNzIGVuZ2luZSB0aGF0XG4gKiBoYXMgYSBzaGFwZSBvZiBhIGNpcmNsZSBhbmQgaXQgaXMgYWZmZWN0ZWQgYnkgZ3Jhdml0eVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYWxsIHtcbiAgcG9zOiBWZWMyO1xuICBsYXN0UG9zOiBWZWMyO1xuICByOiBudW1iZXI7XG4gIGZjOiBudW1iZXI7XG4gIGFtYzogbnVtYmVyO1xuICByb3RhdGlvbjogbnVtYmVyO1xuICBhbmc6IG51bWJlcjtcbiAgazogbnVtYmVyO1xuICB2ZWw6IFZlYzI7XG4gIGxheWVyOiBhbnk7XG5cbiAgLyoqXG4gICAqIENyZXRlIGEgYmFsbFxuICAgKiBUaGUgbWFzcyBvZiB0aGUgYmFsbCBpcyBjYWxjdWxhdGVkIGZyb20gaXRzIHJhZGl1c1xuICAgKiBAcGFyYW0ge1ZlYzJ9IHBvcyBUaGUgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXG4gICAqIEBwYXJhbSB7VmVjMn0gdmVsIFRoZSB2ZWxvY2l0eSBvZiB0aGUgY2lyY2xlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBrIENvZWZmaWNpZW50IG9mIHJlc3RpdHV0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmcgVGhlIGFuZ3VsYXIgdmVsb2NpdHkgb2YgdGhlIGJhbGwgKG9wdGlvbmFsKVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmMgVGhlIGZyaWN0aW9uIGNvZWZmaWNpZW50IChvcHRpb25hbCwgZGVmYXVsdHMgdG8gMC40KVxuICAgKi9cbiAgY29uc3RydWN0b3IocG9zOiBWZWMyLCB2ZWw6IFZlYzIsIHI6IG51bWJlcixcbiAgICBrOiBudW1iZXIsIGFuZzogbnVtYmVyLCBmYzogbnVtYmVyKSB7XG4gICAgdGhpcy5wb3MgPSBwb3MuY29weTtcbiAgICB0aGlzLmxhc3RQb3MgPSB0aGlzLnBvcy5jb3B5O1xuICAgIHRoaXMuciA9IHI7XG4gICAgdGhpcy5mYyA9IDAuNDtcbiAgICB0aGlzLmFtYyA9IDIgLyA1O1xuXG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XG5cbiAgICBpZiAoYW5nKSB0aGlzLmFuZyA9IGFuZztcbiAgICBlbHNlIHRoaXMuYW5nID0gMDtcblxuICAgIGlmIChmYyB8fCBmYyA9PT0gMCkgdGhpcy5mYyA9IGZjO1xuXG4gICAgaWYgKGspIHRoaXMuayA9IGs7XG4gICAgZWxzZSB0aGlzLmsgPSAwLjg7XG5cbiAgICBpZiAodmVsICE9IHVuZGVmaW5lZCkgdGhpcy52ZWwgPSB2ZWwuY29weTtcbiAgICBlbHNlIHRoaXMudmVsID0gbmV3IFZlYzIoMCwgMCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG1hc3Mgb2YgdGhlIGJhbGxcbiAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbWFzc1xuICAgKi9cbiAgZ2V0IG0oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5yICogdGhpcy5yICogTWF0aC5QSTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG1vbWVudCBvZiBpbmVydGlhIG9mIHRoZSBiYWxsXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIG1vbWVudCBvZiBpbmVydGlhXG4gICAqL1xuICBnZXQgYW0oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5hbWMgKiB0aGlzLnIgKiB0aGlzLnIgKiB0aGlzLm07XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgY29weSBvZiB0aGUgYmFsbCB0aGF0IGlzIG5vdCBhIHJlZmVyZW5jZSB0byBpdFxuICAgKiBAcmV0dXJuIHtCYWxsfSBUaGUgY29weSBvZiB0aGUgYmFsbFxuICAgKi9cbiAgZ2V0IGNvcHkoKTogQmFsbCB7XG4gICAgbGV0IHJldCA9XG4gICAgICBuZXcgQmFsbCh0aGlzLnBvcy5jb3B5LCB0aGlzLnZlbC5jb3B5LCB0aGlzLnIsIHRoaXMuaywgdGhpcy5hbmcsIHRoaXMuZmMpO1xuICAgIHJldC5sYXN0UG9zID0gdGhpcy5sYXN0UG9zLmNvcHk7XG4gICAgcmV0LnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbjtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBiYWxsIGJ5IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAqL1xuICBtb3ZlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy5wb3MueCArPSB4O1xuICAgIHRoaXMucG9zLnkgKz0geTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdHdvIGJhbGxzIGFyZSBjb2xsaWRpbmcgb3Igbm90XG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbCB0aGUgb3RoZXIgYmFsbFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZXkgY29saWRyZVxuICAgKi9cbiAgY29sbGlkZWQoYmFsbDogQmFsbCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnBvcy5kaXN0KGJhbGwucG9zKSA8ICh0aGlzLnIgKyBiYWxsLnIpKSByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGF0aWMgZnVuY3Rpb24gZm9yIGNvbGxpc2lvbiBiZXR3ZWVuIHR3byBiYWxsc1xuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwxIEZpcnN0IGJhbGxcbiAgICogQHBhcmFtIHtCYWxsfSBiYWxsMiBTZWNvbmQgYmFsbFxuICAgKi9cbiAgc3RhdGljIGNvbGxpZGUoYmFsbDE6IEJhbGwsIGJhbGwyOiBCYWxsKSB7XG4gICAgaWYgKCFiYWxsMS5jb2xsaWRlZChiYWxsMikpIHJldHVybjtcblxuICAgIGxldCBwb3MxID0gYmFsbDEucG9zO1xuICAgIGxldCBwb3MyID0gYmFsbDIucG9zO1xuICAgIGxldCByMSA9IGJhbGwxLnI7XG4gICAgbGV0IHIyID0gYmFsbDIucjtcbiAgICBsZXQgayA9IChiYWxsMS5rICsgYmFsbDIuaykgLyAyO1xuICAgIGxldCBtMSA9IGJhbGwxLm07XG4gICAgbGV0IG0yID0gYmFsbDIubTtcbiAgICBsZXQgZGlzdCA9IFZlYzIuZGlzdChwb3MxLCBwb3MyKTtcbiAgICBsZXQgZmMgPSAoYmFsbDEuZmMgKyBiYWxsMi5mYykgLyAyO1xuXG4gICAgbGV0IGNwMSA9IHBvczEuY29weTtcbiAgICBsZXQgY3AyID0gcG9zMi5jb3B5O1xuICAgIGxldCB0b28gPSByMSArIHIyIC0gZGlzdDtcbiAgICBsZXQgZCA9IFZlYzIuc3ViKHBvczEsIHBvczIpO1xuICAgIGQuc2V0TWFnKDEpO1xuICAgIGQubXVsdCh0b28gKiBtMiAvIChtMSArIG0yKSk7XG4gICAgY3AxLmFkZChkKTtcbiAgICBkLnNldE1hZygxKTtcbiAgICBkLm11bHQoLXRvbyAqIG0xIC8gKG0xICsgbTIpKTtcbiAgICBjcDIuYWRkKGQpO1xuICAgIGJhbGwxLnBvcyA9IGNwMTtcbiAgICBiYWxsMi5wb3MgPSBjcDI7XG5cbiAgICBpZiAoVmVjMi5kb3QoZCwgVmVjMi5zdWIoYmFsbDEudmVsLCBiYWxsMi52ZWwpKSA8IDApIHJldHVybjtcblxuICAgIGQuc2V0TWFnKDEpO1xuICAgIGxldCB2ZWwxUGFycmFsZWwgPSBWZWMyLmNyb3NzKGQsIGJhbGwxLnZlbCk7XG4gICAgbGV0IHZlbDJQYXJyYWxlbCA9IFZlYzIuY3Jvc3MoZCwgYmFsbDIudmVsKTtcbiAgICBsZXQgdmVsMVBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChkLCBiYWxsMS52ZWwpO1xuICAgIGxldCB2ZWwyUGVycGVuZGljdWxhciA9IFZlYzIuZG90KGQsIGJhbGwyLnZlbCk7XG5cbiAgICBsZXQgdmsxID0gcjEgKiBiYWxsMS5hbmc7XG4gICAgbGV0IHZrMiA9IHIyICogYmFsbDIuYW5nO1xuXG4gICAgbGV0IHZlbDFJblBvcyA9IHZlbDFQYXJyYWxlbCAtIHZrMTtcbiAgICBsZXQgdmVsMkluUG9zID0gdmVsMlBhcnJhbGVsICsgdmsyO1xuICAgIGxldCB2Q29tbW9uID0gKCh2ZWwxSW5Qb3MgKiBiYWxsMS5hbSkgK1xuICAgICAgKHZlbDJJblBvcyAqIGJhbGwyLmFtKSkgLyAoYmFsbDEuYW0gKyBiYWxsMi5hbSk7XG4gICAgbGV0IHRvdkNvbW1vbjEgPSB2Q29tbW9uIC0gdmVsMUluUG9zO1xuICAgIGxldCB0b3ZDb21tb24yID0gdkNvbW1vbiAtIHZlbDJJblBvcztcbiAgICBsZXQgbWF4RGVsdGFBbmcxID0gdG92Q29tbW9uMSAvIHIxO1xuICAgIGxldCBtYXhEZWx0YUFuZzIgPSB0b3ZDb21tb24yIC8gcjI7XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIG5ldyBwZXJwZW5kaWN1bGFyIHZlbG9jaXRpZXNcbiAgICBsZXQgdTFQZXJwZW5kaWN1bGFyID0gKCgxICsgaykgKlxuICAgICAgKChtMSAqIHZlbDFQZXJwZW5kaWN1bGFyICsgbTIgKiB2ZWwyUGVycGVuZGljdWxhcikgLyAobTEgKyBtMikpKSAtXG4gICAgICAoayAqIHZlbDFQZXJwZW5kaWN1bGFyKTtcbiAgICBsZXQgdTJQZXJwZW5kaWN1bGFyID0gKCgxICsgaykgKlxuICAgICAgKChtMSAqIHZlbDFQZXJwZW5kaWN1bGFyICsgbTIgKiB2ZWwyUGVycGVuZGljdWxhcikgLyAobTEgKyBtMikpKSAtXG4gICAgICAoayAqIHZlbDJQZXJwZW5kaWN1bGFyKTtcblxuICAgIGJhbGwxLnZlbCA9IFZlYzIubXVsdChkLCB1MVBlcnBlbmRpY3VsYXIpO1xuICAgIGJhbGwyLnZlbCA9IFZlYzIubXVsdChkLCB1MlBlcnBlbmRpY3VsYXIpO1xuXG4gICAgbGV0IGRlbHRhdjFQZXJwZW5kaWN1bGFyID0gdTFQZXJwZW5kaWN1bGFyIC0gdmVsMVBlcnBlbmRpY3VsYXI7XG4gICAgbGV0IGRlbHRhdjJQZXJwZW5kaWN1bGFyID0gdTJQZXJwZW5kaWN1bGFyIC0gdmVsMlBlcnBlbmRpY3VsYXI7XG5cbiAgICBsZXQgZGVsdGFBbmcxID0gLShNYXRoLnNpZ24odG92Q29tbW9uMSkpICpcbiAgICAgIChkZWx0YXYxUGVycGVuZGljdWxhciAqIGZjKSAvIChiYWxsMS5hbWMgKiByMSk7XG4gICAgbGV0IGRlbHRhQW5nMiA9IChNYXRoLnNpZ24odG92Q29tbW9uMikpICpcbiAgICAgIChkZWx0YXYyUGVycGVuZGljdWxhciAqIGZjKSAvIChiYWxsMi5hbWMgKiByMik7XG5cbiAgICBpZiAoZGVsdGFBbmcxIC8gbWF4RGVsdGFBbmcxID4gMSkgZGVsdGFBbmcxID0gbWF4RGVsdGFBbmcxO1xuICAgIGlmIChkZWx0YUFuZzIgLyBtYXhEZWx0YUFuZzIgPiAxKSBkZWx0YUFuZzIgPSBtYXhEZWx0YUFuZzI7XG5cbiAgICBkZWx0YUFuZzEgKj0gKGJhbGwxLmFtYykgLyAoYmFsbDEuYW1jICsgMSk7XG4gICAgZGVsdGFBbmcyICo9IChiYWxsMi5hbWMpIC8gKGJhbGwyLmFtYyArIDEpO1xuXG4gICAgYmFsbDEuYW5nIC09IGRlbHRhQW5nMTtcbiAgICBiYWxsMi5hbmcgKz0gZGVsdGFBbmcyO1xuXG4gICAgbGV0IHUxUGFycmFsZWwgPSB2ZWwxUGFycmFsZWwgKyAoZGVsdGFBbmcxICogcjEpO1xuICAgIGxldCB1MlBhcnJhbGVsID0gdmVsMlBhcnJhbGVsICsgKGRlbHRhQW5nMiAqIHIyKTtcblxuICAgIGQucm90YXRlKE1hdGguUEkgLyAyKTtcbiAgICBiYWxsMS52ZWwuYWRkKFZlYzIubXVsdChkLCB1MVBhcnJhbGVsKSk7XG4gICAgYmFsbDIudmVsLmFkZChWZWMyLm11bHQoZCwgdTJQYXJyYWxlbCkpO1xuICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuaW1wb3J0IEJhbGwgZnJvbSAnLi9iYWxsJztcbmltcG9ydCBMaW5lU2VnbWVudCBmcm9tICcuL2xpbmVzZWdtZW50JztcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBib2R5XG4gKiBCb2RpZXMgYXJlIG1vdmFibGUgb2JqZWN0c1xuICogYW5kIHRoZXkgY29sbGlkZSB3aXRoIG90aGVyIG9iamVjdHMgKGJhbGxzKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IHtcbiAgICBwb2ludHM6IEFycmF5PFZlYzI+O1xuICAgIGxhc3RQb3M6IFZlYzI7XG4gICAgcG9zOiBWZWMyO1xuICAgIGZjOiBudW1iZXI7XG4gICAgcm90YXRpb246IG51bWJlcjtcbiAgICBhbmc6IG51bWJlcjtcbiAgICBrOiBudW1iZXI7XG4gICAgdmVsOiBWZWMyO1xuICAgIG06IG51bWJlcjtcbiAgICBhbTogbnVtYmVyO1xuICAgIGxheWVyOiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgYm9keSBhbmQgY2FsY3VsYXRlcyBpdCdzIGNlbnRyZSBvZiBtYXNzIChwb3NpdGlvbilcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgVGhlIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIGJvZHlcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlbCBUaGUgdmVsb2NpdHkgb2YgdGhlIGJvZHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gayBDb2VmZmljaWVudCBvZiByZXN0aXR1dGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmcgQW5ndWxhciB2ZWxvY2l0eVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYyBGcmljdGlvbiBjb2VmZmljaWVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvaW50czogQXJyYXk8VmVjMj4sIHZlbDogVmVjMixcbiAgICAgICAgazogbnVtYmVyLCBhbmc6IG51bWJlciwgZmM6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcblxuICAgICAgICBsZXQgcG9sID0gdGhpcy5wb2ludHM7XG4gICAgICAgIGxldCBzdW0xID0gMDtcbiAgICAgICAgbGV0IHN1bTIgPSAwO1xuICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSkpO1xuICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgcG9sW2ldKSwgVmVjMi5zdWIocG9sW2kgLSAxXSwgcG9sW2ldKSk7XG4gICAgICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSkpO1xuICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIGlmIChzdW0yIDwgc3VtMSkge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwb2wubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHRlbXAucHVzaChwb2xbaV0pO1xuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSB0ZW1wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NBbmRNYXNzKCk7XG4gICAgICAgIHRoaXMubGFzdFBvcyA9IHRoaXMucG9zLmNvcHk7XG4gICAgICAgIHRoaXMuZmMgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XG5cbiAgICAgICAgaWYgKGFuZykgdGhpcy5hbmcgPSBhbmc7XG4gICAgICAgIGVsc2UgdGhpcy5hbmcgPSAwO1xuXG4gICAgICAgIGlmIChmYyB8fCBmYyA9PT0gMCkgdGhpcy5mYyA9IGZjO1xuXG4gICAgICAgIGlmIChrKSB0aGlzLmsgPSBrO1xuICAgICAgICBlbHNlIHRoaXMuayA9IDAuODtcblxuICAgICAgICBpZiAodmVsICE9IHVuZGVmaW5lZCkgdGhpcy52ZWwgPSB2ZWwuY29weTtcbiAgICAgICAgZWxzZSB0aGlzLnZlbCA9IG5ldyBWZWMyKDAsIDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGNvcHkgb2YgdGhlIGJvZHkgdGhhdCBpcyBub3QgYSByZWZlcmVuY2UgdG8gaXRcbiAgICAgKiBAcmV0dXJuIHtCb2R5fSBUaGUgY29weSBvZiB0aGUgYm9keVxuICAgICAqL1xuICAgIGdldCBjb3B5KCk6IEJvZHkge1xuICAgICAgICBsZXQgcG9pbnRzQ29weSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwb2ludHNDb3B5LnB1c2gobmV3IFZlYzIodGhpcy5wb2ludHNbaV0ueCwgdGhpcy5wb2ludHNbaV0ueSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXQgPSBuZXcgQm9keShwb2ludHNDb3B5LCB0aGlzLnZlbC5jb3B5LFxuICAgICAgICAgICAgdGhpcy5rLCB0aGlzLmFuZywgdGhpcy5mYyk7XG4gICAgICAgIHJldC5yb3RhdGlvbiA9IHRoaXMucm90YXRpb247XG4gICAgICAgIHJldC5sYXN0UG9zID0gdGhpcy5sYXN0UG9zLmNvcHk7XG4gICAgICAgIHJldC5wb3MgPSB0aGlzLnBvcy5jb3B5O1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZXMgdGhlIGJvZHkgYnkgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG4gICAgICogSXQgaGFzIHRvIG1vdmUgYWxsIHRoZSBwb2ludHMgb2YgdGhlIGJvZHkgYW5kXG4gICAgICogYWxzbyB0aGUgY2VudHJlIG9mIG1hc3MgKHBvcykgb2YgdGhlIGJvZHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB5IGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBtb3ZlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9zLnggKz0geDtcbiAgICAgICAgdGhpcy5wb3MueSArPSB5O1xuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBwLnggKz0geDtcbiAgICAgICAgICAgIHAueSArPSB5O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGRvZXMgdGhlIGNvbGxpc2lvbiBkZXRlY3Rpb24gYW5kXG4gICAgICogY29sbGlzaW9uIGJlaGF2aW9yIGJldHdlZW4gdGhlIGJvZHkgYW5kIGJhbGxcbiAgICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwgVGhlIGJhbGwgdG8gY29sbGlkZSB3aXRoIHRoZSBib2R5XG4gICAgICovXG4gICAgY29sbGlkZVdpdGhCYWxsKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGhlYWRpbmc6IG51bWJlcjtcbiAgICAgICAgbGV0IHJlbDogbnVtYmVyO1xuICAgICAgICBsZXQgY3A7XG5cbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQsIGlkeCkgPT4ge1xuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMihwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgIHAueCAtPSBiYWxsLnBvcy54O1xuICAgICAgICAgICAgcC55IC09IGJhbGwucG9zLnk7XG4gICAgICAgICAgICBpZiAocC5sZW5ndGggPD0gYmFsbC5yKSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IHAuaGVhZGluZyArIE1hdGguUEk7XG4gICAgICAgICAgICAgICAgcmVsID0gcC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBsZXQgbW92ZSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIG1vdmUubXVsdChiYWxsLnIgLSByZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZShtb3ZlLnggKiAtMSAqIGJhbGwubSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnkgKiAtMSAqIGJhbGwubSAvICh0aGlzLm0gKyBiYWxsLm0pKTtcbiAgICAgICAgICAgICAgICBiYWxsLm1vdmUobW92ZS54ICogMSAqIHRoaXMubSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnkgKiAxICogdGhpcy5tIC8gKHRoaXMubSArIGJhbGwubSkpO1xuXG4gICAgICAgICAgICAgICAgY3AgPSBuZXcgVmVjMihwb2ludC54LCBwb2ludC55KTtcblxuICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgICAgICAgICAgYS5tdWx0KC0zMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBsZXQgbnAgPSBuZXcgVmVjMih0aGlzLnBvaW50c1soaWR4ICsgMSkgJSB0aGlzLnBvaW50cy5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS55KTtcbiAgICAgICAgICAgIGxldCBicCA9IG5ldyBWZWMyKGJhbGwucG9zLngsIGJhbGwucG9zLnkpO1xuICAgICAgICAgICAgbGV0IHNpZGUgPSBuZXcgVmVjMihucC54IC0gcC54LCBucC55IC0gcC55KTtcbiAgICAgICAgICAgIGxldCBoID0gc2lkZS5oZWFkaW5nO1xuICAgICAgICAgICAgcC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIG5wLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgYnAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBsZXQgZCA9IGJwLnkgLSAoKHAueSArIG5wLnkpIC8gMik7XG4gICAgICAgICAgICBpZiAoZCA+PSAtYmFsbC5yICYmIGQgPD0gYmFsbC5yICYmIGJwLnggPj0gbnAueCAmJiBicC54IDw9IHAueCkge1xuICAgICAgICAgICAgICAgIGhlYWRpbmcgPSBoIC0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICAgICAgcmVsID0gZDtcblxuICAgICAgICAgICAgICAgIGxldCBtb3ZlID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgICAgICAgICAgbW92ZS5tdWx0KGJhbGwuciAtIHJlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKG1vdmUueCAqIC0xICogYmFsbC5tIC8gKHRoaXMubSArIGJhbGwubSksXG4gICAgICAgICAgICAgICAgICAgIG1vdmUueSAqIC0xICogYmFsbC5tIC8gKHRoaXMubSArIGJhbGwubSkpO1xuICAgICAgICAgICAgICAgIGJhbGwubW92ZShtb3ZlLnggKiAxICogdGhpcy5tIC8gKHRoaXMubSArIGJhbGwubSksXG4gICAgICAgICAgICAgICAgICAgIG1vdmUueSAqIDEgKiB0aGlzLm0gLyAodGhpcy5tICsgYmFsbC5tKSk7XG5cbiAgICAgICAgICAgICAgICBjcCA9IGJhbGwucG9zLmNvcHk7XG4gICAgICAgICAgICAgICAgY3AuYWRkKFZlYzIubXVsdChWZWMyLmZyb21BbmdsZShoZWFkaW5nICsgTWF0aC5QSSksIGQpKTtcblxuICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgICAgICAgICAgYS5tdWx0KC0zMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChoZWFkaW5nID09PSAwIHx8IGhlYWRpbmcpIHtcbiAgICAgICAgICAgIGxldCB2MSA9IHRoaXMudmVsLmNvcHk7XG4gICAgICAgICAgICBsZXQgdjIgPSBiYWxsLnZlbC5jb3B5O1xuICAgICAgICAgICAgbGV0IGFuZzEgPSB0aGlzLmFuZztcbiAgICAgICAgICAgIGxldCBhbmcyID0gYmFsbC5hbmc7XG4gICAgICAgICAgICBsZXQgcjEgPSBWZWMyLnN1YihjcCwgdGhpcy5wb3MpO1xuICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIoY3AsIGJhbGwucG9zKTtcbiAgICAgICAgICAgIGxldCBhbTEgPSB0aGlzLmFtO1xuICAgICAgICAgICAgbGV0IGFtMiA9IGJhbGwuYW07XG4gICAgICAgICAgICBsZXQgbTEgPSB0aGlzLm07XG4gICAgICAgICAgICBsZXQgbTIgPSBiYWxsLm07XG4gICAgICAgICAgICBsZXQgayA9ICh0aGlzLmsgKyBiYWxsLmspIC8gMjtcbiAgICAgICAgICAgIGxldCBmYyA9ICh0aGlzLmZjICsgYmFsbC5mYykgLyAyO1xuXG4gICAgICAgICAgICBsZXQgdjF2ID0gcjEuY29weTtcbiAgICAgICAgICAgIGxldCB2MnYgPSByMi5jb3B5O1xuICAgICAgICAgICAgdjF2LnJvdGF0ZShNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2MnYucm90YXRlKC1NYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2MXYubXVsdChhbmcxKTtcbiAgICAgICAgICAgIHYydi5tdWx0KGFuZzIpO1xuICAgICAgICAgICAgdjF2LmFkZCh2MSk7XG4gICAgICAgICAgICB2MnYuYWRkKHYyKTtcblxuICAgICAgICAgICAgdjF2LnJvdGF0ZSgtaGVhZGluZyk7XG4gICAgICAgICAgICB2MnYucm90YXRlKC1oZWFkaW5nKTtcblxuICAgICAgICAgICAgbGV0IGR2MXZ4ID0gKDEgKyBrKSAqIChtMSAqIHYxdi54ICsgbTIgKiB2MnYueCkgL1xuICAgICAgICAgICAgICAgIChtMSArIG0yKSAtIChrICsgMSkgKiB2MXYueDtcbiAgICAgICAgICAgIGxldCBkdjJ2eCA9ICgxICsgaykgKiAobTEgKiB2MXYueCArIG0yICogdjJ2LngpIC9cbiAgICAgICAgICAgICAgICAobTEgKyBtMikgLSAoayArIDEpICogdjJ2Lng7XG5cbiAgICAgICAgICAgIGxldCB2ayA9ICh2MXYueSAqIG0xICsgdjJ2LnkgKiBtMikgLyAobTEgKyBtMik7XG5cbiAgICAgICAgICAgIGxldCBkdjF2eSA9IC1NYXRoLnNpZ24odjF2LnkpICogZmMgKiBkdjF2eDtcbiAgICAgICAgICAgIGxldCBkdjJ2eSA9IC1NYXRoLnNpZ24odjJ2LnkpICogZmMgKiBkdjJ2eDtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2ayAtIHYxdi55KSA+IE1hdGguYWJzKGR2MXZ5KSkgZHYxdnkgPSB2ayAtIHYxdi55O1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHZrIC0gdjJ2LnkpID4gTWF0aC5hYnMoZHYydnkpKSBkdjJ2eSA9IHZrIC0gdjJ2Lnk7XG5cbiAgICAgICAgICAgIGxldCBkdjF2ID0gbmV3IFZlYzIoZHYxdngsIGR2MXZ5KTtcbiAgICAgICAgICAgIGxldCBkdjJ2ID0gbmV3IFZlYzIoZHYydngsIGR2MnZ5KTtcbiAgICAgICAgICAgIGR2MXYucm90YXRlKGhlYWRpbmcpO1xuICAgICAgICAgICAgZHYydi5yb3RhdGUoaGVhZGluZyk7XG5cbiAgICAgICAgICAgIHYxLmFkZChkdjF2KTtcbiAgICAgICAgICAgIHYyLmFkZChkdjJ2KTtcblxuICAgICAgICAgICAgZHYxdi5yb3RhdGUoLXIxLmhlYWRpbmcpO1xuICAgICAgICAgICAgZHYydi5yb3RhdGUoLXIyLmhlYWRpbmcpO1xuXG4gICAgICAgICAgICBsZXQgZGFuZzEgPSAoZHYxdi55ICogbTEgKiByMS5sZW5ndGgpIC9cbiAgICAgICAgICAgICAgICAoYW0xICsgcjEubGVuZ3RoICogcjEubGVuZ3RoICogbTEpO1xuICAgICAgICAgICAgbGV0IGRhbmcyID0gLShkdjJ2LnkgKiBtMiAqIHIyLmxlbmd0aCkgL1xuICAgICAgICAgICAgICAgIChhbTIgKyByMi5sZW5ndGggKiByMi5sZW5ndGggKiBtMik7XG5cbiAgICAgICAgICAgIGFuZzEgKz0gZGFuZzE7XG4gICAgICAgICAgICBhbmcyICs9IGRhbmcyO1xuXG4gICAgICAgICAgICBsZXQgdnAxID0gVmVjMi5mcm9tQW5nbGUocjEuaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHZwMS5tdWx0KHIxLmxlbmd0aCAqIGRhbmcxKTtcbiAgICAgICAgICAgIGxldCB2cDIgPSBWZWMyLmZyb21BbmdsZShyMi5oZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdnAyLm11bHQocjIubGVuZ3RoICogZGFuZzIpO1xuICAgICAgICAgICAgdjIuc3ViKHZwMik7XG4gICAgICAgICAgICB2MS5hZGQodnAxKTtcblxuICAgICAgICAgICAgdGhpcy52ZWwgPSB2MTtcbiAgICAgICAgICAgIGJhbGwudmVsID0gdjI7XG5cbiAgICAgICAgICAgIHRoaXMuYW5nID0gYW5nMTtcbiAgICAgICAgICAgIGJhbGwuYW5nID0gYW5nMjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIG1hc3MsIG1vbWVudCBvZCBpbnRlcnRpYSBhbmRcbiAgICAgKiB0aGUgY2VudHJlIG9mIG1hc3Mgb2YgdGhlIGJvZHlcbiAgICAgKi9cbiAgICBjYWxjdWxhdGVQb3NBbmRNYXNzKCkge1xuICAgICAgICBsZXQgcG9saWdvbnM6IEFycmF5PEFycmF5PFZlYzI+PiA9IFtdO1xuICAgICAgICBwb2xpZ29ucy5wdXNoKFtdKTtcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgcG9saWdvbnNbMF0ucHVzaChuZXcgVmVjMihwLngsIHAueSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pc0NvbmNhdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGVzID0gKGFycjogQXJyYXk8bnVtYmVyPiwgaXRlbTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gaXRlbSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3RXaXRoUG9saWdvbiA9IGZ1bmN0aW9uKHNlZ21lbnQ6IExpbmVTZWdtZW50LFxuICAgICAgICAgICAgICAgIHBvbDogQXJyYXk8VmVjMj4sIGV4Y2VwdGlvbnM6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVzKGV4Y2VwdGlvbnMsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaV0ueCwgcG9sW2ldLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTGluZVNlZ21lbnQuaW50ZXJzZWN0KHNlZ21lbnQsIHNpZGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgICAgY2hlY2tBbGxQb2xpZ29uczogd2hpbGUgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbGlnb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2pdLngsIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgVmVjMihuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSkuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghKGEuaGVhZGluZyA+IGIuaGVhZGluZyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2ogJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2ogJSBwb2wubGVuZ3RoXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKHBvbC5sZW5ndGggLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gajsgbCA8PSBrOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBwb2wubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5zdWIocG9sWyhqICsgMSkgJSBwb2wubGVuZ3RoXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW2ogLSAxXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coYSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbCwgWyhqIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBjaGVja0FsbFBvbGlnb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IHBvbGlnb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgcG9sID0gcG9saWdvbnNbaV07XG4gICAgICAgICAgICB3aGlsZSAocG9sLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKFtwb2xbMF0sIHBvbFsxXSwgcG9sWzJdXSk7XG4gICAgICAgICAgICAgICAgcG9sLnNwbGljZSgxLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtU3VtID0gMDtcbiAgICAgICAgbGV0IGFtU3VtID0gMDtcbiAgICAgICAgbGV0IHBTdW0gPSBuZXcgVmVjMigwLCAwKTtcbiAgICAgICAgcG9saWdvbnMuZm9yRWFjaCgocG9sKSA9PiB7XG4gICAgICAgICAgICBsZXQgYSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMF0ueCAtIHBvbFsxXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzBdLnkgLSBwb2xbMV0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGIgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzFdLnggLSBwb2xbMl0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsxXS55IC0gcG9sWzJdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBjID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsyXS54IC0gcG9sWzBdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMl0ueSAtIHBvbFswXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMjtcbiAgICAgICAgICAgIGxldCBtID0gTWF0aC5zcXJ0KHMgKiAocyAtIGEpICogKHMgLSBiKSAqIChzIC0gYykpO1xuICAgICAgICAgICAgbVN1bSArPSBtO1xuICAgICAgICAgICAgcFN1bS54ICs9IG0gKiAocG9sWzBdLnggKyBwb2xbMV0ueCArIHBvbFsyXS54KSAvIDM7XG4gICAgICAgICAgICBwU3VtLnkgKz0gbSAqIChwb2xbMF0ueSArIHBvbFsxXS55ICsgcG9sWzJdLnkpIC8gMztcbiAgICAgICAgfSk7XG4gICAgICAgIHBTdW0uZGl2KG1TdW0pO1xuICAgICAgICB0aGlzLnBvcyA9IHBTdW07XG4gICAgICAgIHRoaXMubSA9IG1TdW07XG5cbiAgICAgICAgLy8gY2FsY3VsYXRpbmcgdGhlIG1vbWVudCBvZiBpbmVydGlhIGZpbmFsbHlcbiAgICAgICAgZm9yIChsZXQgcG9sIG9mIHBvbGlnb25zKSB7XG4gICAgICAgICAgICBsZXQgYSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMF0ueCAtIHBvbFsxXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzBdLnkgLSBwb2xbMV0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGIgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzFdLnggLSBwb2xbMl0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsxXS55IC0gcG9sWzJdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBjID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsyXS54IC0gcG9sWzBdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMl0ueSAtIHBvbFswXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgdyA9IE1hdGgubWF4KGEsIGIsIGMpO1xuICAgICAgICAgICAgbGV0IHMgPSAoYSArIGIgKyBjKSAvIDI7XG4gICAgICAgICAgICBsZXQgbSA9IE1hdGguc3FydChzICogKHMgLSBhKSAqIChzIC0gYikgKiAocyAtIGMpKTtcbiAgICAgICAgICAgIGxldCBoID0gMiAqIG0gLyB3O1xuICAgICAgICAgICAgbGV0IHdwYXJ0aWFsID0gTWF0aC5zcXJ0KE1hdGgubWluKGEsIGMsIGIpICoqIDIgLSBoICogaCk7XG4gICAgICAgICAgICBsZXQgYW0gPSBoICogdyAqIChoICogaCArIHcgKiB3KSAvIDI0O1xuICAgICAgICAgICAgbGV0IGQgPSBNYXRoLnNxcnQoaCAqIGggLyAzNiArXG4gICAgICAgICAgICAgICAgKE1hdGguYWJzKHdwYXJ0aWFsIC0gdyAvIDIpIC8gMykgKiogMik7XG4gICAgICAgICAgICBhbSAtPSBkICogZCAqIG07XG4gICAgICAgICAgICBhbSArPSBuZXcgVmVjMigocG9sWzBdLnggKyBwb2xbMV0ueCArIHBvbFsyXS54KSAvIDMsXG4gICAgICAgICAgICAgICAgKHBvbFswXS55ICsgcG9sWzFdLnkgKyBwb2xbMl0ueSkgLyAzKS5kaXN0KHRoaXMucG9zKSAqKiAyICogbTtcbiAgICAgICAgICAgIGFtU3VtICs9IGFtO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW0gPSBhbVN1bTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIHRoZSBib2R5IGFyb3VuZCBpdCdzIGNlbnRyZSBvZiBtYXNzIGJ5IGEgZ2l2ZW4gYW5nZVxuICAgICAqIEhhcyB0byBkbyB0aGUgdHJhbnNmb3JtYXRpb24gZm9yIGFsbCB0aGUgcG9pbnRzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIFJvdGF0aW9uIGFuZ2xlXG4gICAgICovXG4gICAgcm90YXRlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gbmV3IFZlYzIocC54LCBwLnkpO1xuICAgICAgICAgICAgcG9pbnQuc3ViKHRoaXMucG9zKTtcbiAgICAgICAgICAgIHBvaW50LnJvdGF0ZShhbmdsZSk7XG4gICAgICAgICAgICBwb2ludC5hZGQodGhpcy5wb3MpO1xuICAgICAgICAgICAgcC54ID0gcG9pbnQueDtcbiAgICAgICAgICAgIHAueSA9IHBvaW50Lnk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IGFuZ2xlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmRzIG91dCBpZiB0aGUgYm9keSBpcyBjb25jYXZlIG9yIG5vdFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgdGhlIGJvZHkgaXMgY29uY2F2ZVxuICAgICAqL1xuICAgIGdldCBpc0NvbmNhdmUoKSB7XG4gICAgICAgIGxldCBwb2wgPSB0aGlzLnBvaW50cztcbiAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pKTtcbiAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkgcmV0dXJuIHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgcG9sW2ldKSwgVmVjMi5zdWIocG9sW2kgLSAxXSwgcG9sW2ldKSk7XG4gICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzBdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pKTtcbiAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSBjb2xsaXNpb24gYWxnb3JpdGhtIGJldHdlZW4gdHdvIGJvZGllc1xuICAgICAqIEBwYXJhbSB7Qm9keX0gYjEgRmlyc3QgYm9keVxuICAgICAqIEBwYXJhbSB7Qm9keX0gYjIgU2Vjb25kIGJvZHlcbiAgICAgKi9cbiAgICBzdGF0aWMgY29sbGlkZShiMTogQm9keSwgYjI6IEJvZHkpIHtcbiAgICAgICAgbGV0IG1hdGNoZXMgPSAwO1xuICAgICAgICBsZXQgaGVhZGluZyA9IDA7XG4gICAgICAgIGxldCBjcCA9IG5ldyBWZWMyKDAsIDApO1xuICAgICAgICBsZXQgY3BzOiBBcnJheTxWZWMyPiA9IFtdO1xuICAgICAgICBsZXQgaW50ZXJzZWN0ID0gZmFsc2U7XG4gICAgICAgIGIxLnBvaW50cy5mb3JFYWNoKChwLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGxldCBzaWRlMSA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwLngsIHAueSksXG4gICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgIGIxLnBvaW50c1soaWR4ICsgMSkgJSBiMS5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICBiMS5wb2ludHNbKGlkeCArIDEpICUgYjEucG9pbnRzLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgYjIucG9pbnRzLmZvckVhY2goKHBwLCBpZHh4KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHNpZGUyID0gbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBwLngsIHBwLnkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgICAgIGIyLnBvaW50c1soaWR4eCArIDEpICUgYjIucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGIyLnBvaW50c1soaWR4eCArIDEpICUgYjIucG9pbnRzLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgIGxldCBzZWN0ID0gTGluZVNlZ21lbnQuaW50ZXJzZWN0KHNpZGUxLCBzaWRlMik7XG4gICAgICAgICAgICAgICAgaWYgKHNlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcysrO1xuICAgICAgICAgICAgICAgICAgICBjcC5hZGQoc2VjdCk7XG4gICAgICAgICAgICAgICAgICAgIGNwcy5wdXNoKHNlY3QpO1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWludGVyc2VjdCkgcmV0dXJuO1xuICAgICAgICBjcC5kaXYobWF0Y2hlcyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKG1hdGNoZXMgLyAyKTsgaSsrKSB7XG4gICAgICAgICAgICBoZWFkaW5nICs9IFZlYzIuc3ViKGNwc1syICogaSArIDFdLCBjcHNbMiAqIGldKS5oZWFkaW5nO1xuICAgICAgICB9XG4gICAgICAgIGhlYWRpbmcgLz0gbWF0Y2hlcyAvIDI7XG4gICAgICAgIGhlYWRpbmcgKz0gTWF0aC5QSSAvIDI7XG5cbiAgICAgICAgbGV0IGEgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcblxuICAgICAgICBsZXQgbW92ZTFNaW4gPSAwO1xuICAgICAgICBsZXQgbW92ZTFNYXggPSAwO1xuICAgICAgICBsZXQgbW92ZTJNaW4gPSAwO1xuICAgICAgICBsZXQgbW92ZTJNYXggPSAwO1xuICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBiMS5wb2ludHMpIHtcbiAgICAgICAgICAgIG1vdmUxTWluID0gTWF0aC5taW4oVmVjMi5kb3QoYSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSwgbW92ZTFNaW4pO1xuICAgICAgICAgICAgbW92ZTFNYXggPSBNYXRoLm1heChWZWMyLmRvdChhLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLCBtb3ZlMU1heCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgYjIucG9pbnRzKSB7XG4gICAgICAgICAgICBtb3ZlMk1pbiA9IE1hdGgubWluKFZlYzIuZG90KGEsXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIobmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSksIGNwKSksIG1vdmUyTWluKTtcbiAgICAgICAgICAgIG1vdmUyTWF4ID0gTWF0aC5tYXgoVmVjMi5kb3QoYSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSwgbW92ZTJNYXgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChNYXRoLmFicyhtb3ZlMU1pbiAtIG1vdmUyTWF4KSA8IE1hdGguYWJzKG1vdmUyTWluIC0gbW92ZTFNYXgpKSB7XG4gICAgICAgICAgICBiMS5tb3ZlKC1hLnggKiBtb3ZlMU1pbiwgLWEueSAqIG1vdmUxTWluKTtcbiAgICAgICAgICAgIGIyLm1vdmUoLWEueCAqIG1vdmUyTWF4LCAtYS55ICogbW92ZTJNYXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYjEubW92ZSgtYS54ICogbW92ZTFNYXgsIC1hLnkgKiBtb3ZlMU1heCk7XG4gICAgICAgICAgICBiMi5tb3ZlKC1hLnggKiBtb3ZlMk1pbiwgLWEueSAqIG1vdmUyTWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrID0gKGIxLmsgKyBiMi5rKSAvIDI7XG4gICAgICAgIC8vIGxldCB2ZWwxcGFycmFsZWwgPSBWZWMyLmNyb3NzKGIxLnZlbCwgYSk7XG4gICAgICAgIGxldCB2ZWwxcGVycGVuZGljdWxhciA9IFZlYzIuZG90KGIxLnZlbCwgYSk7XG4gICAgICAgIC8vIGxldCB2ZWwycGFycmFsZWwgPSBWZWMyLmNyb3NzKGIyLnZlbCwgYSk7XG4gICAgICAgIGxldCB2ZWwycGVycGVuZGljdWxhciA9IFZlYzIuZG90KGIyLnZlbCwgYSk7XG5cbiAgICAgICAgbGV0IG5ld1ZlbDFQZXJwZW5kaWN1bGFyID0gKDEgKyBrKSAqICgoYjEubSAqIHZlbDFwZXJwZW5kaWN1bGFyKSArXG4gICAgICAgICAgICAoYjIubSAqIHZlbDJwZXJwZW5kaWN1bGFyKSkgLyAoYjEubSArIGIyLm0pIC1cbiAgICAgICAgICAgIChrICogdmVsMXBlcnBlbmRpY3VsYXIpO1xuICAgICAgICBsZXQgbmV3VmVsMlBlcnBlbmRpY3VsYXIgPSAoMSArIGspICogKChiMS5tICogdmVsMXBlcnBlbmRpY3VsYXIpICtcbiAgICAgICAgICAgIChiMi5tICogdmVsMnBlcnBlbmRpY3VsYXIpKSAvIChiMS5tICsgYjIubSkgLVxuICAgICAgICAgICAgKGsgKiB2ZWwycGVycGVuZGljdWxhcik7XG5cbiAgICAgICAgYjEudmVsLmFkZChWZWMyLm11bHQoYS5jb3B5LCBuZXdWZWwxUGVycGVuZGljdWxhciAtIHZlbDFwZXJwZW5kaWN1bGFyKSk7XG4gICAgICAgIGIyLnZlbC5hZGQoVmVjMi5tdWx0KGEuY29weSwgbmV3VmVsMlBlcnBlbmRpY3VsYXIgLSB2ZWwycGVycGVuZGljdWxhcikpO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc2VnbWVudCBvZiBhIGxpbmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZVNlZ21lbnQge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHNlZ21lbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgU3RhcnRpbmcgcG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgRW5kaW5nIHBvaW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIGE6IFZlYzIsIHB1YmxpYyBiOiBWZWMyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBsZW5ndGhcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBWZWMyLmRpc3QodGhpcy5hLCB0aGlzLmIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiBhIHBvaW50IGFuZCB0aGUgbGluZSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBwIFRoZSBwb2ludCBhcyBhIHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlXG4gICAgICovXG4gICAgZGlzdEZyb21Qb2ludChwOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGUgPSBWZWMyLnN1Yih0aGlzLmEsIHRoaXMuYik7XG4gICAgICAgIGxldCBBID0gVmVjMi5zdWIocCwgdGhpcy5iKTtcbiAgICAgICAgbGV0IEIgPSBWZWMyLnN1YihwLCB0aGlzLmEpO1xuICAgICAgICBsZXQgYSA9IEEubGVuZ3RoO1xuICAgICAgICBsZXQgYiA9IEIubGVuZ3RoO1xuICAgICAgICBsZXQgYyA9IGUubGVuZ3RoO1xuICAgICAgICBpZiAoYyA9PT0gMCkgcmV0dXJuIGE7XG4gICAgICAgIGxldCBnYW1tYSA9IFZlYzIuYW5nbGUoQSwgQik7XG4gICAgICAgIGxldCBiZXRoYSA9IFZlYzIuYW5nbGUoQSwgZSk7XG4gICAgICAgIGxldCBhbHBoYSA9IE1hdGguUEkgLSBnYW1tYSAtIGJldGhhO1xuICAgICAgICBsZXQgYXJlYSA9IE1hdGguc2luKGFscGhhKSAqIGIgKiBjIC8gMjtcbiAgICAgICAgbGV0IG0gPSAyICogYXJlYSAvIGM7XG4gICAgICAgIGlmIChhbHBoYSA+IE1hdGguUEkgLyAyKSByZXR1cm4gYjtcbiAgICAgICAgaWYgKGJldGhhID4gTWF0aC5QSSAvIDIpIHJldHVybiBhO1xuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgaWYgdGhleSBpbnRlcnNlY3Qgb3Igbm90XG4gICAgICogSWYgdGhleSBpbnRlcnNlY3QgaXQgcmV0dXJucyB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XG4gICAgICogSWYgdGhleSBub3QgaXQgcmV0dXJucyB1bmRlZmluZWRcbiAgICAgKiBAcGFyYW0ge0xpbmVTZWdtZW50fSBzZWdtZW50MSBBIHNlZ21lbnRcbiAgICAgKiBAcGFyYW0ge0xpbmVTZWdtZW50fSBzZWdtZW50MiBPdGhlciBzZWdtZW50XG4gICAgICogQHJldHVybiB7VmVjMn0gSW50ZXJzZXRpb24gcG9pbnRcbiAgICAgKi9cbiAgICBzdGF0aWMgaW50ZXJzZWN0KHNlZ21lbnQxOiBMaW5lU2VnbWVudCwgc2VnbWVudDI6IExpbmVTZWdtZW50KTogVmVjMiB7XG4gICAgICAgIGxldCB2MSA9IFZlYzIuc3ViKHNlZ21lbnQxLmIsIHNlZ21lbnQxLmEpO1xuICAgICAgICBsZXQgYTEgPSB2MS55IC8gdjEueDtcbiAgICAgICAgbGV0IGMxID0gc2VnbWVudDEuYi55IC0gKHNlZ21lbnQxLmIueCAqIGExKTtcblxuICAgICAgICBsZXQgdjIgPSBWZWMyLnN1YihzZWdtZW50Mi5iLCBzZWdtZW50Mi5hKTtcbiAgICAgICAgbGV0IGEyID0gdjIueSAvIHYyLng7XG4gICAgICAgIGxldCBjMiA9IHNlZ21lbnQyLmIueSAtIChzZWdtZW50Mi5iLnggKiBhMik7XG5cbiAgICAgICAgaWYgKHYxLnggPT09IDAgJiYgdjIueCAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKChzZWdtZW50MS5hLnggPj0gc2VnbWVudDIuYS54ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudDEuYS54IDw9IHNlZ21lbnQyLmIueCkgfHxcbiAgICAgICAgICAgICAgICAoc2VnbWVudDEuYS54IDw9IHNlZ21lbnQyLmEueCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50MS5hLnggPj0gc2VnbWVudDIuYi54KSkge1xuICAgICAgICAgICAgICAgIGxldCBoID0gYTIgKiBzZWdtZW50MS5hLnggKyBjMjtcbiAgICAgICAgICAgICAgICBpZiAoKGggPiBzZWdtZW50MS5hLnkgJiYgaCA8IHNlZ21lbnQxLmIueSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGggPCBzZWdtZW50MS5hLnkgJiYgaCA+IHNlZ21lbnQxLmIueSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQxLmEueCwgaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodjIueCA9PT0gMCAmJiB2MS54ICE9PSAwKSB7XG4gICAgICAgICAgICBpZiAoKHNlZ21lbnQyLmEueCA+PSBzZWdtZW50MS5hLnggJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50Mi5hLnggPD0gc2VnbWVudDEuYi54KSB8fFxuICAgICAgICAgICAgICAgIChzZWdtZW50Mi5hLnggPD0gc2VnbWVudDEuYS54ICYmXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQyLmEueCA+PSBzZWdtZW50MS5iLngpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGggPSBhMSAqIHNlZ21lbnQyLmEueCArIGMxO1xuICAgICAgICAgICAgICAgIGlmICgoaCA+IHNlZ21lbnQyLmEueSAmJiBoIDwgc2VnbWVudDIuYi55KSB8fFxuICAgICAgICAgICAgICAgICAgICAoaCA8IHNlZ21lbnQyLmEueSAmJiBoID4gc2VnbWVudDIuYi55KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoc2VnbWVudDIuYS54LCBoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2MS54ID09PSAwICYmIHYyLnggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChzZWdtZW50MS5hLnggPT09IHNlZ21lbnQyLmEueCkge1xuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbDE7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ21lbnQxLmEueSA8IHNlZ21lbnQxLmIueSkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYS55LCBzZWdtZW50MS5iLnldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMSA9IFtzZWdtZW50MS5iLnksIHNlZ21lbnQxLmEueV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbDI7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ21lbnQyLmEueSA8IHNlZ21lbnQyLmIueSkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYS55LCBzZWdtZW50Mi5iLnldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMiA9IFtzZWdtZW50Mi5iLnksIHNlZ21lbnQyLmEueV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbCA9IFsoaW50ZXJ2YWwxWzBdID4gaW50ZXJ2YWwyWzBdKSA/XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMVswXSA6IGludGVydmFsMlswXSxcbiAgICAgICAgICAgICAgICAoaW50ZXJ2YWwxWzFdIDwgaW50ZXJ2YWwyWzFdKSA/XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMVsxXSA6IGludGVydmFsMlsxXSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbFswXSA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoc2VnbWVudDEuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbnRlcnZhbDE7XG4gICAgICAgIGlmIChzZWdtZW50MS5hLnggPCBzZWdtZW50MS5iLngpIHtcbiAgICAgICAgICAgIGludGVydmFsMSA9IFtzZWdtZW50MS5hLngsIHNlZ21lbnQxLmIueF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYi54LCBzZWdtZW50MS5hLnhdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbDI7XG4gICAgICAgIGlmIChzZWdtZW50Mi5hLnggPCBzZWdtZW50Mi5iLngpIHtcbiAgICAgICAgICAgIGludGVydmFsMiA9IFtzZWdtZW50Mi5hLngsIHNlZ21lbnQyLmIueF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYi54LCBzZWdtZW50Mi5hLnhdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IFsoaW50ZXJ2YWwxWzBdID4gaW50ZXJ2YWwyWzBdKSA/XG4gICAgICAgICAgICBpbnRlcnZhbDFbMF0gOiBpbnRlcnZhbDJbMF0sXG4gICAgICAgIChpbnRlcnZhbDFbMV0gPCBpbnRlcnZhbDJbMV0pID9cbiAgICAgICAgICAgIGludGVydmFsMVsxXSA6IGludGVydmFsMlsxXSxcbiAgICAgICAgXTtcbiAgICAgICAgLy8gSWYgdGhleSBhcmUgcGFycmFsZWwgdGhlIG9ubHkgdGltZSB0aGV5IGludGVyc2VjdCBpcyB3aGVuIGMxID09IGMyLlxuICAgICAgICBpZiAoKGExID09PSBhMikgJiYgYzEgPT09IGMyICYmIGludGVydmFsWzBdIDw9IGludGVydmFsWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMixcbiAgICAgICAgICAgICAgICAoKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMikgKiBhMSArIGMxKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeCA9IChjMiAtIGMxKSAvIChhMSAtIGEyKTtcbiAgICAgICAgaWYgKHggPj0gaW50ZXJ2YWxbMF0gJiYgeCA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHggKiBhMSArIGMxKTtcbiAgICAgICAgfSBlbHNlIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgV2FsbCBmcm9tICcuL3dhbGwnO1xuaW1wb3J0IExpbmVTZWdtZW50IGZyb20gJy4vbGluZXNlZ21lbnQnO1xuaW1wb3J0IFN0aWNrIGZyb20gJy4vc3RpY2snO1xuaW1wb3J0IFNwcmluZyBmcm9tICcuL3NwcmluZyc7XG5pbXBvcnQgU29mdEJhbGwgZnJvbSAnLi9zb2Z0YmFsbCc7XG5pbXBvcnQgQm9keSBmcm9tICcuL2JvZHknO1xuXG4vKipcbiAqIENsYXNzIHRoYXQgY3JlYXRlcyBhIG5ldyB3b3JsZCBiYSB0aGUgcGh5c2ljcyBlbmdpbmVcbiAqL1xuY2xhc3MgUGh5c2ljcyB7XG4gIGJhbGxzOiBBcnJheTxCYWxsPjtcbiAgYm9kaWVzOiBBcnJheTxCb2R5PjtcbiAgZml4ZWRCYWxsczogQXJyYXk8e3g6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIsIH0+XG4gIHNvZnRCYWxsczogQXJyYXk8U29mdEJhbGw+O1xuICB3YWxsczogQXJyYXk8V2FsbD47XG4gIGJvdW5kczogQXJyYXk8bnVtYmVyPjtcbiAgc3ByaW5nczogQXJyYXk8U3ByaW5nPjtcbiAgYWlyRnJpY3Rpb246IG51bWJlcjtcbiAgZ3Jhdml0eTogVmVjMjtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCBpbml0YWxpemUgYSBuZXcgd29ybGRcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYmFsbHMgPSBbXTtcbiAgICB0aGlzLmJvZGllcyA9IFtdO1xuICAgIHRoaXMuZml4ZWRCYWxscyA9IFtdO1xuICAgIHRoaXMuc29mdEJhbGxzID0gW107XG5cbiAgICB0aGlzLndhbGxzID0gW107XG5cbiAgICB0aGlzLmJvdW5kcyA9IFtdO1xuXG4gICAgdGhpcy5zcHJpbmdzID0gW107XG5cbiAgICAvLyBBaXIgZnJpY3Rpb24gaGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgIC8vIDAgLSBubyBtb3ZlbWVudFxuICAgIC8vIDEgLSBubyBmcmljdGlvblxuICAgIHRoaXMuYWlyRnJpY3Rpb24gPSAxO1xuXG4gICAgdGhpcy5ncmF2aXR5ID0gbmV3IFZlYzIoMCwgMCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgd29ybGQgYnkgYSBnaXZlbiBhbW91bnQgb2YgdGltZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBwcmVjaXNlIElmIHRoaXMgaXMgdHJ1ZSxcbiAgICogdGhlbiB0aGUgc2ltdWxhdGlvbiBpcyBnb2luZyB0byBiZSBtb3JlIHByZWNpc2VcbiAgICovXG4gIHVwZGF0ZSh0OiBudW1iZXIsIHByZWNpc2U6IGJvb2xlYW4pIHtcbiAgICAvLyBEbyB0aGUgc2ltdWxhdGlvbiBvbiB0aGUgcmV2ZXJzZWQgc3lzdGVtXG4gICAgLy8gaWYgdGhlIHNpbXVsYXRpb24gaXMgaW4gcHJlY2lzZSBtb2RlXG4gICAgbGV0IGNsb25lZFN5c3RlbTogUGh5c2ljcyA9IHByZWNpc2UgPyB0aGlzLmNvcHkgOiBuZXcgUGh5c2ljcygpO1xuICAgIGlmIChwcmVjaXNlKSB7XG4gICAgICBjbG9uZWRTeXN0ZW0uYm9kaWVzLnJldmVyc2UoKTtcbiAgICAgIGNsb25lZFN5c3RlbS5iYWxscy5yZXZlcnNlKCk7XG4gICAgICBjbG9uZWRTeXN0ZW0udXBkYXRlKHQsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLyBBdCBmaXJzdCBtb3ZlIG9iamV0c1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5iYWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gTW92ZVxuICAgICAgdGhpcy5iYWxsc1tpXS5sYXN0UG9zID0gdGhpcy5iYWxsc1tpXS5wb3MuY29weTtcbiAgICAgIHRoaXMuYmFsbHNbaV0ucG9zLmFkZChWZWMyLm11bHQodGhpcy5iYWxsc1tpXS52ZWwsIHQpKTtcblxuICAgICAgLy8gQW5ndWxhciB2ZWxvY2l0eVxuICAgICAgdGhpcy5iYWxsc1tpXS5yb3RhdGlvbiArPSB0aGlzLmJhbGxzW2ldLmFuZyAqIHQ7XG4gICAgICB0aGlzLmJhbGxzW2ldLnJvdGF0aW9uICU9IChNYXRoLlBJICogMik7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYm9kaWVzW2ldLmxhc3RQb3MgPSB0aGlzLmJvZGllc1tpXS5wb3MuY29weTtcbiAgICAgIHRoaXMuYm9kaWVzW2ldLm1vdmUodGhpcy5ib2RpZXNbaV0udmVsLnggKiB0LCB0aGlzLmJvZGllc1tpXS52ZWwueSAqIHQpO1xuICAgICAgdGhpcy5ib2RpZXNbaV0ucm90YXRlKHRoaXMuYm9kaWVzW2ldLmFuZyAqIHQpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBzcHJpbmdzIG11bHRpcGxlIHRpbWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5zcHJpbmdzKSB7XG4gICAgICAgIGVsZW1lbnQudXBkYXRlKHQgLyAzIC8gMik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBBcHBseSBncmF2aXR5XG4gICAgICBpZiAodGhpcy5ncmF2aXR5KSB7XG4gICAgICAgIHRoaXMuYmFsbHNbaV0udmVsLmFkZChcbiAgICAgICAgICBuZXcgVmVjMih0aGlzLmdyYXZpdHkueCAqIHQsIHRoaXMuZ3Jhdml0eS55ICogdCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBDb2xsaXNpb25cbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHRoaXMuYmFsbHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYmFsbHNbaV0ubGF5ZXIgIT0gdGhpcy5iYWxsc1tqXS5sYXllciB8fFxuICAgICAgICAgICghdGhpcy5iYWxsc1tpXS5sYXllciAmJiAhdGhpcy5iYWxsc1tqXS5sYXllcikpIHtcbiAgICAgICAgICBCYWxsLmNvbGxpZGUodGhpcy5iYWxsc1tpXSwgdGhpcy5iYWxsc1tqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29sbGlzaW9uIHdpdGggd2FsbHNcbiAgICAgIGZvciAobGV0IHdhbGwgb2YgdGhpcy53YWxscykge1xuICAgICAgICB3YWxsLmNvbGxpZGVXaXRoQmFsbCh0aGlzLmJhbGxzW2ldKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ29sbGlzaW9uIHdpdGggZml4ZWQgYmFsbHNcbiAgICAgIGZvciAobGV0IGIgb2YgdGhpcy5maXhlZEJhbGxzKSB7XG4gICAgICAgIGxldCBiYWxsID0gdGhpcy5iYWxsc1tpXTtcblxuICAgICAgICBsZXQgaGVhZGluZztcbiAgICAgICAgbGV0IHJlbCA9IDA7XG4gICAgICAgIGxldCBwID0gbmV3IFZlYzIoYi54LCBiLnkpO1xuICAgICAgICBwLnggLT0gYmFsbC5wb3MueDtcbiAgICAgICAgcC55IC09IGJhbGwucG9zLnk7XG4gICAgICAgIHAubXVsdCgtMSk7XG4gICAgICAgIGlmIChwLmxlbmd0aCA8PSBiYWxsLnIgKyBiLnIpIHtcbiAgICAgICAgICBoZWFkaW5nID0gcC5oZWFkaW5nO1xuICAgICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhlYWRpbmcgPT09IDAgfHwgaGVhZGluZykge1xuICAgICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICBsZXQgdmVsID0gbmV3IFZlYzIoYmFsbC52ZWwueCwgYmFsbC52ZWwueSk7XG4gICAgICAgICAgcG9zLnJvdGF0ZSgtaGVhZGluZyArIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICB2ZWwucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuXG4gICAgICAgICAgdmVsLnkgKj0gLWJhbGwuaztcbiAgICAgICAgICBwb3MueSArPSBiYWxsLnIgKyBiLnIgLSByZWw7XG4gICAgICAgICAgbGV0IGR2eSA9IHZlbC55ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuICAgICAgICAgIGxldCBkdnggPSBNYXRoLmFicyhkdnkpICogYmFsbC5mYyAqXG4gICAgICAgICAgICBNYXRoLnNpZ24odmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoZHZ4KSA+IE1hdGguYWJzKHZlbC54IC0gYmFsbC5hbmcgKiBiYWxsLnIpKSB7XG4gICAgICAgICAgICBkdnggPSAtdmVsLnggKyBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmVsLnggKz0gZHZ4IC0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgIChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKTtcbiAgICAgICAgICBiYWxsLmFuZyAtPSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgICAgcG9zLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgIHZlbC5yb3RhdGUoaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICBiYWxsLnBvcy54ID0gcG9zLng7XG4gICAgICAgICAgYmFsbC5wb3MueSA9IHBvcy55O1xuICAgICAgICAgIGJhbGwudmVsLnggPSB2ZWwueDtcbiAgICAgICAgICBiYWxsLnZlbC55ID0gdmVsLnk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQm91bmNlIG9mZiB0aGUgZWRnZXNcbiAgICAgIGlmICh0aGlzLmJvdW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLmJhbGxzW2ldLnBvcy54IC0gdGhpcy5iYWxsc1tpXS5yIDwgdGhpcy5ib3VuZHNbMF0pIHtcbiAgICAgICAgICBsZXQgYmFsbCA9IHRoaXMuYmFsbHNbaV07XG4gICAgICAgICAgYmFsbC52ZWwueCAqPSAtYmFsbC5rO1xuICAgICAgICAgIGJhbGwucG9zLnggPSB0aGlzLmJvdW5kc1sxXSArIGJhbGwucjtcbiAgICAgICAgICBsZXQgZHZ4ID0gYmFsbC52ZWwueCAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICBsZXQgZHZ5ID0gTWF0aC5hYnMoZHZ4KSAqIGJhbGwuZmMgKlxuICAgICAgICAgICAgTWF0aC5zaWduKGJhbGwudmVsLnkgKyBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoZHZ5KSA+IE1hdGguYWJzKGJhbGwudmVsLnkgKyBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgIGR2eSA9IC1iYWxsLnZlbC55IC0gYmFsbC5hbmcgKiBiYWxsLnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJhbGwudmVsLnkgKz0gZHZ5IC0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ5IC9cbiAgICAgICAgICAgIChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKTtcbiAgICAgICAgICBiYWxsLmFuZyArPSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnkgL1xuICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5iYWxsc1tpXS5wb3MueCArIHRoaXMuYmFsbHNbaV0uciA+XG4gICAgICAgICAgKHRoaXMuYm91bmRzWzBdICsgdGhpcy5ib3VuZHNbMl0pKSB7XG4gICAgICAgICAgbGV0IGJhbGwgPSB0aGlzLmJhbGxzW2ldO1xuICAgICAgICAgIGJhbGwudmVsLnggKj0gLWJhbGwuaztcbiAgICAgICAgICBiYWxsLnBvcy54ID0gKHRoaXMuYm91bmRzWzBdICsgdGhpcy5ib3VuZHNbMl0pIC0gYmFsbC5yO1xuICAgICAgICAgIGxldCBkdnggPSBiYWxsLnZlbC54ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuICAgICAgICAgIGxldCBkdnkgPSBNYXRoLmFicyhkdngpICogYmFsbC5mYyAqXG4gICAgICAgICAgICBNYXRoLnNpZ24oYmFsbC52ZWwueSAtIGJhbGwuYW5nICogYmFsbC5yKSAqIC0xO1xuICAgICAgICAgIGlmIChNYXRoLmFicyhkdnkpID4gTWF0aC5hYnMoYmFsbC52ZWwueSAtIGJhbGwuYW5nICogYmFsbC5yKSkge1xuICAgICAgICAgICAgZHZ5ID0gLWJhbGwudmVsLnkgKyBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFsbC52ZWwueSArPSBkdnkgKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnkgL1xuICAgICAgICAgICAgKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pO1xuICAgICAgICAgIGJhbGwuYW5nIC09IGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eSAvXG4gICAgICAgICAgICAoKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pICogYmFsbC5yKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5iYWxsc1tpXS5wb3MueSArIHRoaXMuYmFsbHNbaV0uciA+XG4gICAgICAgICAgKHRoaXMuYm91bmRzWzFdICsgdGhpcy5ib3VuZHNbM10pKSB7XG4gICAgICAgICAgbGV0IGJhbGwgPSB0aGlzLmJhbGxzW2ldO1xuICAgICAgICAgIGJhbGwudmVsLnkgKj0gLWJhbGwuaztcbiAgICAgICAgICBiYWxsLnBvcy55ID0gKHRoaXMuYm91bmRzWzFdICsgdGhpcy5ib3VuZHNbM10pIC0gYmFsbC5yO1xuICAgICAgICAgIGxldCBkdnkgPSBiYWxsLnZlbC55ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuICAgICAgICAgIGxldCBkdnggPSBNYXRoLmFicyhkdnkpICogYmFsbC5mYyAqXG4gICAgICAgICAgICBNYXRoLnNpZ24oYmFsbC52ZWwueCArIGJhbGwuYW5nICogYmFsbC5yKSAqIC0xO1xuICAgICAgICAgIGlmIChNYXRoLmFicyhkdngpID4gTWF0aC5hYnMoYmFsbC52ZWwueCArIGJhbGwuYW5nICogYmFsbC5yKSkge1xuICAgICAgICAgICAgZHZ4ID0gLWJhbGwudmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFsbC52ZWwueCArPSBkdnggLSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pO1xuICAgICAgICAgIGJhbGwuYW5nICs9IGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAoKGJhbGwuYW0gKyBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0pICogYmFsbC5yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJhbGxzW2ldLnBvcy55IC0gdGhpcy5iYWxsc1tpXS5yIDwgdGhpcy5ib3VuZHNbMV0pIHtcbiAgICAgICAgICBsZXQgYmFsbCA9IHRoaXMuYmFsbHNbaV07XG4gICAgICAgICAgYmFsbC52ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgIGJhbGwucG9zLnkgPSB0aGlzLmJvdW5kc1sxXSArIGJhbGwucjtcbiAgICAgICAgICBsZXQgZHZ5ID0gYmFsbC52ZWwueSAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICBsZXQgZHZ4ID0gTWF0aC5hYnMoZHZ5KSAqIGJhbGwuZmMgKlxuICAgICAgICAgICAgTWF0aC5zaWduKGJhbGwudmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoZHZ4KSA+IE1hdGguYWJzKGJhbGwudmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgIGR2eCA9IC1iYWxsLnZlbC54ICsgYmFsbC5hbmcgKiBiYWxsLnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJhbGwudmVsLnggKz0gZHZ4ICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgIChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKTtcbiAgICAgICAgICBiYWxsLmFuZyAtPSBiYWxsLnIgKiBiYWxsLnIgKiBiYWxsLm0gKiBkdnggL1xuICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBiYWxsIG9mIHRoaXMuYmFsbHMpIHtcbiAgICAgICAgaWYgKGJhbGwubGF5ZXIgIT0gdGhpcy5ib2RpZXNbaV0ubGF5ZXIgfHxcbiAgICAgICAgICAoIWJhbGwubGF5ZXIgJiYgIXRoaXMuYm9kaWVzW2ldLmxheWVyKSkge1xuICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLmNvbGxpZGVXaXRoQmFsbChiYWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLmJvZGllcy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2RpZXNbaV0ubGF5ZXIgIT0gdGhpcy5ib2RpZXNbal0ubGF5ZXIgfHxcbiAgICAgICAgICAoIXRoaXMuYm9kaWVzW2pdLmxheWVyICYmICF0aGlzLmJvZGllc1tpXS5sYXllcikpIHtcbiAgICAgICAgICBCb2R5LmNvbGxpZGUodGhpcy5ib2RpZXNbaV0sIHRoaXMuYm9kaWVzW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBncmF2aXR5XG4gICAgICBpZiAodGhpcy5ncmF2aXR5KSB7XG4gICAgICAgIHRoaXMuYm9kaWVzW2ldLnZlbC5hZGQoXG4gICAgICAgICAgbmV3IFZlYzIodGhpcy5ncmF2aXR5LnggKiB0LCB0aGlzLmdyYXZpdHkueSAqIHQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgc29mdCBiYWxsc1xuICAgIHRoaXMuc29mdEJhbGxzLmZvckVhY2goKHNiKSA9PiB7XG4gICAgICBTb2Z0QmFsbC51cGRhdGVQcmVzc3VyZUJhc2VkRm9yY2VzKHNiLCB0KTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzcHJpbmdzIGFnYWluIG11bHRpcGxlIHRpbWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5zcHJpbmdzKSB7XG4gICAgICAgIGVsZW1lbnQudXBkYXRlKHQgLyAzIC8gMik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgYWlyIGZyaWN0aW9uXG4gICAgdGhpcy5iYWxscy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICBiLnZlbC5tdWx0KE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpKTtcbiAgICAgIGIuYW5nICo9IChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgfSk7XG4gICAgdGhpcy5ib2RpZXMuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgYi52ZWwubXVsdChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgICBiLmFuZyAqPSAoTWF0aC5wb3codGhpcy5haXJGcmljdGlvbiwgdCkpO1xuICAgIH0pO1xuXG4gICAgLy8gVGhlbiB0YWtlIHRoZSBhdmVyYWdlIG9mIHRoaXMgc3lzdGVtIGFuZCB0aGUgb3RoZXIgc3lzdGVtXG4gICAgLy8gaWYgaW4gcHJlY2lzZSBtb2RlXG4gICAgaWYgKHByZWNpc2UpIHtcbiAgICAgIGNsb25lZFN5c3RlbS5ib2RpZXMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLmJhbGxzLnJldmVyc2UoKTtcblxuICAgICAgLy8gVGFrZSB0aGUgYXZlcmFnZSBvZiB0aGUgYmFsbHNcbiAgICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCwgaSkgPT4ge1xuICAgICAgICBiYWxsLm1vdmUoKGNsb25lZFN5c3RlbS5iYWxsc1tpXS5wb3MueCAtIGJhbGwucG9zLngpICogMC41LFxuICAgICAgICAgIChjbG9uZWRTeXN0ZW0uYmFsbHNbaV0ucG9zLnkgLSBiYWxsLnBvcy55KSAqIDAuNSk7XG4gICAgICAgIGJhbGwudmVsLmFkZChuZXcgVmVjMigoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnZlbC54IC0gYmFsbC52ZWwueCkgKiAwLjUsXG4gICAgICAgICAgKGNsb25lZFN5c3RlbS5iYWxsc1tpXS52ZWwueSAtIGJhbGwudmVsLnkpICogMC41KSk7XG4gICAgICAgIGJhbGwucm90YXRpb24gPSAoYmFsbC5yb3RhdGlvbiArIGNsb25lZFN5c3RlbS5iYWxsc1tpXS5yb3RhdGlvbikgLyAyO1xuICAgICAgICBiYWxsLmFuZyA9IChiYWxsLmFuZyArIGNsb25lZFN5c3RlbS5iYWxsc1tpXS5hbmcpIC8gMjtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUYWtlIHRoZSBhdmVyYWdlIG9mIHRoZSBib2RpZXNcbiAgICAgIHRoaXMuYm9kaWVzLmZvckVhY2goKGJvZHksIGkpID0+IHtcbiAgICAgICAgbGV0IG90aGVyID0gY2xvbmVkU3lzdGVtLmJvZGllc1tpXTtcbiAgICAgICAgYm9keS5tb3ZlKChvdGhlci5wb3MueCAtIGJvZHkucG9zLngpICogMC41LFxuICAgICAgICAgIChvdGhlci5wb3MueSAtIGJvZHkucG9zLnkpICogMC41KTtcbiAgICAgICAgYm9keS52ZWwuYWRkKG5ldyBWZWMyKChvdGhlci52ZWwueCAtIGJvZHkudmVsLngpICogMC41LFxuICAgICAgICAgIChvdGhlci52ZWwueSAtIGJvZHkudmVsLnkpICogMC41KSk7XG4gICAgICAgIGJvZHkucm90YXRlKChvdGhlci5yb3RhdGlvbiAtIGJvZHkucm90YXRpb24pIC8gMik7XG4gICAgICAgIGJvZHkuYW5nID0gKGJvZHkuYW5nICsgb3RoZXIuYW5nKSAvIDI7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzeXN0ZW1cbiAgICogQHJldHVybiB7UGh5c2ljc30gVGhlIGNvcHkgb2YgdGhpcyBzeXN0ZW1cbiAgICovXG4gIGdldCBjb3B5KCk6IFBoeXNpY3Mge1xuICAgIGxldCByZXQgPSBuZXcgUGh5c2ljcygpO1xuICAgIHJldC5iYWxscyA9IHRoaXMuZ2V0Q29weU9mQmFsbHMoKTtcbiAgICByZXQuYm9kaWVzID0gdGhpcy5nZXRDb3B5T2ZCb2RpZXMoKTtcbiAgICByZXQuZml4ZWRCYWxscyA9IHRoaXMuZml4ZWRCYWxscztcbiAgICByZXQud2FsbHMgPSB0aGlzLndhbGxzO1xuICAgIHJldC5ib3VuZHMgPSB0aGlzLmJvdW5kcztcbiAgICByZXQuZ3Jhdml0eSA9IHRoaXMuZ3Jhdml0eTtcblxuICAgIHRoaXMuc3ByaW5ncy5mb3JFYWNoKChzcHJpbmcpID0+IHtcbiAgICAgIGxldCBUeXBlT2ZTcHJpbmcgPSBzcHJpbmcuY29uc3RydWN0b3IgPT0gU3ByaW5nID8gU3ByaW5nIDogU3RpY2s7XG4gICAgICBsZXQgY29waWVkU3ByaW5nID0gbmV3IFR5cGVPZlNwcmluZyhzcHJpbmcubGVuZ3RoLFxuICAgICAgICBzcHJpbmcuc3ByaW5nQ29uc3RhbnQpO1xuICAgICAgY29waWVkU3ByaW5nLnJvdGF0aW9uTG9ja2VkID0gc3ByaW5nLnJvdGF0aW9uTG9ja2VkO1xuICAgICAgY29waWVkU3ByaW5nLnBpbm5lZCA9IHNwcmluZy5waW5uZWQ7XG5cbiAgICAgIHNwcmluZy5vYmplY3RzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICBsZXQgaWR4ID0gdGhpcy5iYWxscy5pbmRleE9mKG9iaik7XG4gICAgICAgIGlmIChpZHggIT0gLTEpIGNvcGllZFNwcmluZy5hdHRhY2hPYmplY3QocmV0LmJhbGxzW2lkeF0pO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZHggPSB0aGlzLmJvZGllcy5pbmRleE9mKG9iaik7XG4gICAgICAgICAgaWYgKGlkeCAhPSAtMSkgY29waWVkU3ByaW5nLmF0dGFjaE9iamVjdChyZXQuYm9kaWVzW2lkeF0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0LnNwcmluZ3MucHVzaChjb3BpZWRTcHJpbmcpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBaXIgZnJpY3Rpb24uIGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICogMCAtIG5vIG1vdmVtZW50XG4gICAqIDEgLSBubyBmcmljdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYWlyRnJpY3Rpb24gSGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgKi9cbiAgc2V0QWlyRnJpY3Rpb24oYWlyRnJpY3Rpb246IG51bWJlcikge1xuICAgIGlmICghaXNGaW5pdGUoYWlyRnJpY3Rpb24pKSByZXR1cm47XG4gICAgdGhpcy5haXJGcmljdGlvbiA9IGFpckZyaWN0aW9uO1xuICAgIGlmICh0aGlzLmFpckZyaWN0aW9uIDwgMCkgdGhpcy5haXJGcmljdGlvbiA9IDA7XG4gICAgaWYgKHRoaXMuYWlyRnJpY3Rpb24gPiAxKSB0aGlzLmFpckZyaWN0aW9uID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBncmF2aXR5IGluIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge1ZlYzJ9IGRpciBUaGUgYWNjZWxlcmF0aW9uIHZlY3RvciBvZiB0aGUgZ3Jhdml0eVxuICAgKi9cbiAgc2V0R3Jhdml0eShkaXI6IFZlYzIpIHtcbiAgICB0aGlzLmdyYXZpdHkgPSBkaXIuY29weTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IGJhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbCBCYWxsIHRvIGFkZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZEJhbGwoYmFsbDogQmFsbCkge1xuICAgIHRoaXMuYmFsbHMucHVzaChiYWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IGJvZHkgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7Qm9keX0gYm9keSBCb2R5IHRvIGFkZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZEJvZHkoYm9keTogQm9keSkge1xuICAgIHRoaXMuYm9kaWVzLnB1c2goYm9keSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBzb2Z0IGJhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7U29mdEJhbGx9IHNvZnRCYWxsIFNvZnRCYWxsIHRvIGJlIGFkZGVkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkU29mdEJhbGwoc29mdEJhbGw6IFNvZnRCYWxsKSB7XG4gICAgdGhpcy5iYWxscy5wdXNoKC4uLnNvZnRCYWxsLnBvaW50cyk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goLi4uc29mdEJhbGwuc2lkZXMpO1xuXG4gICAgdGhpcy5zb2Z0QmFsbHMucHVzaChzb2Z0QmFsbCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIHJlY3Rhbmd1bGFyIHdhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB4IHggY29vcmRpbmF0ZSBvZiB0aGUgcmVjdGFuZ3VsYXIgd2FsbFxuICAgKiBAcGFyYW0ge251bWJlcn0geSB5IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIHdhbGxcbiAgICogQHBhcmFtIHtudW1iZXJ9IHcgd2lkdGggb2YgdGhlIHJlY3Rhbmd1bGFyIHdhbGxcbiAgICogQHBhcmFtIHtudW1iZXJ9IGggaGVpZ2h0IG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqL1xuICBhZGRSZWN0V2FsbCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4IC0gdyAvIDIsXG4gICAgICB5IC0gaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggKyB3IC8gMixcbiAgICAgIHkgLSBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCArIHcgLyAyLFxuICAgICAgeSArIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4IC0gdyAvIDIsXG4gICAgICB5ICsgaCAvIDJcbiAgICApKTtcbiAgICB0aGlzLndhbGxzLnB1c2gobmV3IFdhbGwocG9pbnRzKSk7XG4gICAgLy8gdGhpcy5ib2RpZXMucHVzaChuZXcgQm9keShwb2ludHMsIG5ldyBWZWMyKDAsIDApLCAwLjUsIDAsIDAuMykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSByZWN0YW5ndWxhciBib2R5IHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IHdpZHRoIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoIGhlaWdodCBvZiB0aGUgcmVjdGFuZ3VsYXIgYm9keVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmMgZnJpY3Rpb24gY29lZmZpY2llbnQgb2YgdGhlIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IGsgY29lZmZpY2llbnQgb2YgcmVzdGl0dXRpb24gb2YgdGhlIGJvZHlcbiAgICovXG4gIGFkZFJlY3RCb2R5KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcixcbiAgICBmYzogbnVtYmVyLCBrOiBudW1iZXIpIHtcbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4IC0gdyAvIDIsXG4gICAgICB5IC0gaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggKyB3IC8gMixcbiAgICAgIHkgLSBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCArIHcgLyAyLFxuICAgICAgeSArIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4IC0gdyAvIDIsXG4gICAgICB5ICsgaCAvIDJcbiAgICApKTtcbiAgICB0aGlzLmJvZGllcy5wdXNoKG5ldyBCb2R5KHBvaW50cywgbmV3IFZlYzIoMCwgMCksIDAuNSwgMCwgMC4zKSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIGEgbmV3IHdhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7V2FsbH0gd2FsbCBXYWxsIHRvIGFwcGVuZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZFdhbGwod2FsbDogV2FsbCkge1xuICAgIHRoaXMud2FsbHMucHVzaCh3YWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgZml4ZWQgYmFsbCB0byB0aGUgd29ybGRcbiAgICogQSBmaXhlZCBiYWxsIGlzIGltbW92YWJsZSBhbmQgb3RoZXIgb2JqZWN0cyBjb2xsaWRlIHdpdGggaXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBmaXhlZCBiYWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgZml4ZWQgYmFsbFxuICAgKiBAcGFyYW0ge251bWJlcn0gciByYWRpdXMgb2YgdGhlIGZpeGVkIGJhbGxcbiAgICovXG4gIGFkZEZpeGVkQmFsbCh4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyKSB7XG4gICAgdGhpcy5maXhlZEJhbGxzLnB1c2goe1xuICAgICAgeDogeCwgeTogeSwgcjogcixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IHNwcmluZyB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtTcHJpbmd9IHNwcmluZyBTcHJpbmcgdG8gYWRkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkU3ByaW5nKHNwcmluZzogU3ByaW5nKSB7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goc3ByaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzaXplIG9mIHRoZSB3b3JsZCAod2l0aG91dCB0aGlzIHRoZSB3b3JsZFxuICAgKiBkb2VzIG5vdCBoYXZlIGJvdW5kcylcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBjZW50cmUgb2YgdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudHJlIG9mIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0gdyBXaWR0aCBvZiB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGggSGVpZ2h0IG9mIHRoZSB3b3JsZFxuICAgKi9cbiAgc2V0Qm91bmRzKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIHRoaXMuYm91bmRzID0gW3gsIHksIHcsIGhdO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBmb3IgYW55IG9iamVjdCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSB0aGVuIHJldHVybnMgaXRcbiAgICogUmV0dXJuIGZhbHNlIGlmIG5vdGhpbmcgaXMgZm91bmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgKiBAcmV0dXJuIHtCYWxsfSBUaGUgZm91bmQgb2JqZWN0XG4gICAqL1xuICBnZXRPYmplY3RBdENvb3JkaW5hdGVzKHg6IG51bWJlciwgeTogbnVtYmVyKTogQmFsbCB7XG4gICAgbGV0IHJldCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgdiA9IG5ldyBWZWMyKHgsIHkpO1xuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCkgPT4ge1xuICAgICAgaWYgKGJhbGwucG9zLmRpc3QodikgPCBiYWxsLnIpIHJldCA9IGJhbGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGNvcGllcyBvZiBhbGwgYmFsbHMgaW4gdGhlIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtBcnJheTxCYWxsPn0gVGhlIGFycmF5IG9mIHRoZSBjb3BpZWQgYmFsbHNcbiAgICovXG4gIGdldENvcHlPZkJhbGxzKCk6IEFycmF5PEJhbGw+IHtcbiAgICBsZXQgcmV0OiBBcnJheTxCYWxsPiA9IFtdO1xuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmV0LnB1c2goaXRlbS5jb3B5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgY29waWVzIG9mIGFsbCBib2RpZXMgaW4gdGhlIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtBcnJheTxCb2R5Pn0gVGhlIGFycmF5IG9mIHRoZSBjb3BpZWQgYm9kaWVzXG4gICAqL1xuICBnZXRDb3B5T2ZCb2RpZXMoKTogQXJyYXk8Qm9keT4ge1xuICAgIGxldCByZXQ6IEFycmF5PEJvZHk+ID0gW107XG4gICAgdGhpcy5ib2RpZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmV0LnB1c2goaXRlbS5jb3B5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbmV4cG9ydCB7QmFsbH07XG5leHBvcnQge0JvZHl9O1xuZXhwb3J0IHtWZWMyfTtcbmV4cG9ydCB7V2FsbH07XG5leHBvcnQge0xpbmVTZWdtZW50fTtcbmV4cG9ydCB7U3ByaW5nfTtcbmV4cG9ydCB7U3RpY2t9O1xuZXhwb3J0IHtTb2Z0QmFsbH07XG5leHBvcnQge1BoeXNpY3N9O1xuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgU3RpY2sgZnJvbSAnLi9zdGljayc7XG5pbXBvcnQgTGluZVNlZ21lbnQgZnJvbSAnLi9saW5lc2VnbWVudCc7XG5pbXBvcnQgU3ByaW5nIGZyb20gJy4vc3ByaW5nJztcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzb2Z0Ym9keSBvYmplY3RcbiAqIFRoZXkgd29yayBsaWtlIGEgYmFsbCwgd2l0aCBwcmVzc3VyZSBpbnNpZGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29mdEJhbGwge1xuICAgIHBvaW50czogQXJyYXk8QmFsbD47XG4gICAgcHJlc3N1cmU6IG51bWJlcjtcbiAgICBmYzogbnVtYmVyO1xuICAgIHJlc29sdXRpb246IG51bWJlcjtcbiAgICByOiBudW1iZXI7XG4gICAgc2lkZXM6IEFycmF5PFNwcmluZz47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgU29mdEJhbGxcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvcyBUaGUgc3RhcnRpbmcgcG9zaXRpb24gb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIFRoZSByYWRpdXMgb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmVzc3VyZSBUaGUgXCJoYXJkbmVzc1wiIG9mIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVzb2x1dGlvbiBUaGUgbnVtYmVyIG9mIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIGJhbGxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IFZlYzIsIHI6IG51bWJlciwgcHJlc3N1cmU6IG51bWJlcixcbiAgICAgICAgZmM6IG51bWJlciwgcmVzb2x1dGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XG5cbiAgICAgICAgaWYgKGZjIHx8IGZjID09PSAwKSB0aGlzLmZjID0gZmM7XG4gICAgICAgIGVsc2UgdGhpcy5mYyA9IDAuNDtcblxuICAgICAgICB0aGlzLnByZXNzdXJlID0gcHJlc3N1cmU7XG5cbiAgICAgICAgaWYgKCFyZXNvbHV0aW9uKSB0aGlzLnJlc29sdXRpb24gPSAzMDtcbiAgICAgICAgZWxzZSB0aGlzLnJlc29sdXRpb24gPSByZXNvbHV0aW9uO1xuXG4gICAgICAgIHIgPSBNYXRoLmFicyhyKTtcbiAgICAgICAgdGhpcy5yID0gcjtcblxuICAgICAgICBsZXQgbGF5ZXJOdWJlcjogbnVtYmVyID0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzb2x1dGlvbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3UG9zID0gbmV3IFZlYzIocG9zLngsIHBvcy55KTtcbiAgICAgICAgICAgIG5ld1Bvcy5hZGQoVmVjMi5tdWx0KFxuICAgICAgICAgICAgICAgIFZlYzIuZnJvbUFuZ2xlKChpIC8gdGhpcy5yZXNvbHV0aW9uKSAqIE1hdGguUEkgKiAyKSwgcikpO1xuICAgICAgICAgICAgdGhpcy5wb2ludHMucHVzaChuZXcgQmFsbChuZXdQb3MsIG5ldyBWZWMyKDAsIDApLFxuICAgICAgICAgICAgICAgIHIgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5yZXNvbHV0aW9uKSwgMCwgMCwgdGhpcy5mYykpO1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0ubGF5ZXIgPSBsYXllck51YmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaWRlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzb2x1dGlvbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBTdGljaygyICogciAqIE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnJlc29sdXRpb24pKTtcbiAgICAgICAgICAgIHNpZGUuYXR0YWNoT2JqZWN0KHRoaXMucG9pbnRzW2ldKTtcbiAgICAgICAgICAgIHNpZGUuYXR0YWNoT2JqZWN0KHRoaXMucG9pbnRzWyhpICsgMSkgJSB0aGlzLnJlc29sdXRpb25dKTtcbiAgICAgICAgICAgIGlmIChpICUgMiA9PT0gMCkgc2lkZS5sb2NrUm90YXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuc2lkZXMucHVzaChzaWRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByZXNzdXJlLWJhc2VkIGZvcmNlcyBpbiB0aGUgc29mdCBiYWxsXG4gICAgICogQHBhcmFtIHtTb2Z0QmFsbH0gc29mdEJhbGwgVGhlIHNvZnQgYmFsbCB0byB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICBzdGF0aWMgdXBkYXRlUHJlc3N1cmVCYXNlZEZvcmNlcyhzb2Z0QmFsbDogU29mdEJhbGwsIHQ6IG51bWJlcikge1xuICAgICAgICBsZXQgcG9saWdvbnM6IEFycmF5PEFycmF5PFZlYzI+PiA9IFtdO1xuICAgICAgICBwb2xpZ29ucy5wdXNoKFtdKTtcbiAgICAgICAgc29mdEJhbGwucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHBvbGlnb25zWzBdLnB1c2gobmV3IFZlYzIocC5wb3MueCwgcC5wb3MueSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoKGZ1bmN0aW9uKHBvbCkge1xuICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pKTtcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KShwb2xpZ29uc1swXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGVzID0gKGFycjogQXJyYXk8bnVtYmVyPiwgaXRlbTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gaXRlbSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3RXaXRoUG9saWdvbiA9IGZ1bmN0aW9uKHNlZ21lbnQ6IExpbmVTZWdtZW50LFxuICAgICAgICAgICAgICAgIHBvbDogQXJyYXk8VmVjMj4sIGV4Y2VwdGlvbnM6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVzKGV4Y2VwdGlvbnMsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaV0ueCwgcG9sW2ldLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTGluZVNlZ21lbnQuaW50ZXJzZWN0KHNlZ21lbnQsIHNpZGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgICAgY2hlY2tBbGxQb2xpZ29uczogd2hpbGUgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbGlnb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2pdLngsIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgVmVjMihuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSkuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghKGEuaGVhZGluZyA+IGIuaGVhZGluZyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2ogJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2ogJSBwb2wubGVuZ3RoXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKHBvbC5sZW5ndGggLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gajsgbCA8PSBrOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBwb2wubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5zdWIocG9sWyhqICsgMSkgJSBwb2wubGVuZ3RoXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW2ogLSAxXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coYSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbCwgWyhqIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBjaGVja0FsbFBvbGlnb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IHBvbGlnb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgcG9sID0gcG9saWdvbnNbaV07XG4gICAgICAgICAgICB3aGlsZSAocG9sLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKFtwb2xbMF0sIHBvbFsxXSwgcG9sWzJdXSk7XG4gICAgICAgICAgICAgICAgcG9sLnNwbGljZSgxLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtU3VtID0gMDtcbiAgICAgICAgcG9saWdvbnMuZm9yRWFjaCgocG9sKSA9PiB7XG4gICAgICAgICAgICBsZXQgYSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMF0ueCAtIHBvbFsxXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzBdLnkgLSBwb2xbMV0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGIgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzFdLnggLSBwb2xbMl0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsxXS55IC0gcG9sWzJdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBjID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsyXS54IC0gcG9sWzBdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMl0ueSAtIHBvbFswXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMjtcbiAgICAgICAgICAgIGxldCBtID0gTWF0aC5zcXJ0KHMgKiAocyAtIGEpICogKHMgLSBiKSAqIChzIC0gYykpO1xuICAgICAgICAgICAgbVN1bSArPSBtO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgb3ZlclByZXNzdXJlID0gc29mdEJhbGwucHJlc3N1cmUgKlxuICAgICAgICAgICAgKChzb2Z0QmFsbC5yICogc29mdEJhbGwuciAqIE1hdGguUEkpIC8gbVN1bSlcbiAgICAgICAgICAgIC0gc29mdEJhbGwucHJlc3N1cmU7XG4gICAgICAgIHNvZnRCYWxsLnNpZGVzLmZvckVhY2goKHNpZGUpID0+IHtcbiAgICAgICAgICAgIGxldCBmb3JjZSA9IFZlYzIuc3ViKHNpZGUub2JqZWN0c1swXS5wb3MsIHNpZGUub2JqZWN0c1sxXS5wb3MpO1xuICAgICAgICAgICAgZm9yY2UubXVsdChvdmVyUHJlc3N1cmUpO1xuICAgICAgICAgICAgZm9yY2Uucm90YXRlKE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIGZvcmNlLm11bHQodCk7XG4gICAgICAgICAgICBzaWRlLm9iamVjdHNbMF0udmVsLmFkZChWZWMyLmRpdihmb3JjZSwgc2lkZS5vYmplY3RzWzBdLm0pKTtcbiAgICAgICAgICAgIHNpZGUub2JqZWN0c1sxXS52ZWwuYWRkKFZlYzIuZGl2KGZvcmNlLCBzaWRlLm9iamVjdHNbMV0ubSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHN0cmluZ1xuICogVGhleSBhY3QgbGlrZSBzcHJpbmdzIGluIHJlYWwgbGlmZVxuICogWW91IGNhbiBhdHRhY2ggb3RoZXIgb2JqZWN0cyB0byB0aGUgZW5kcyBvZiB0aGVtXG4gKiBUaGV5IGRvIG5vdCBjb2xsaWRlIHdpdGggb3RoZXIgb2JqZWN0IG5laXRoZXIgd2l0aCBlYWNoIG90aGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcmluZyB7XG4gICAgbGVuZ3RoOiBudW1iZXI7XG4gICAgc3ByaW5nQ29uc3RhbnQ6IG51bWJlcjtcbiAgICBwaW5uZWQ6IGFueTtcbiAgICBvYmplY3RzOiBBcnJheTxhbnk+O1xuICAgIHJvdGF0aW9uTG9ja2VkOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNwcmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggVGhlIHVuc3RyZWNoZWQgbGVuZ3RoIG9mIHRoZSBzcHJpbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3ByaW5nQ29uc3RhbnQgU3ByaW5nIGNvbnN0YW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGVuZ3RoOiBudW1iZXIsIHNwcmluZ0NvbnN0YW50OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSBzcHJpbmdDb25zdGFudDtcbiAgICAgICAgdGhpcy5waW5uZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vYmplY3RzID0gW107XG4gICAgICAgIHRoaXMucm90YXRpb25Mb2NrZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaW5zIG9uZSBzaWRlIG9mIHRoZSB0aGUgc3ByaW5nIHRvIGEgZ2l2ZW4gY29vcmRpbmF0ZSBpbiBzcGFjZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHBpbkhlcmUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5waW5uZWQgPSB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBwaW5uZWQgdGFnIGZyb20gdGhlIHNwcmluZ1xuICAgICAqIFlvdSBjYW4gbm93IGF0dGFjaCBpdCB0byBhbm90aGVyIG9iamVjdFxuICAgICAqL1xuICAgIHVucGluKCkge1xuICAgICAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIG9uZSBlbmQgb2YgdGhlIHNwcmluZyB0byBhbiBvYmplY3QgKGVnLiBCYWxsKVxuICAgICAqIEBwYXJhbSB7YW55fSBvYmplY3QgVGhlIG9iamVjdCB0aGF0IHRoZSBzcHJpbmcgaXMgZ2V0dGluZyBhdHRhY2hlZCB0b1xuICAgICAqL1xuICAgIGF0dGFjaE9iamVjdChvYmplY3Q6IGFueSkge1xuICAgICAgICBsZXQgb2IgPSB0aGlzLm9iamVjdHM7XG4gICAgICAgIG9iLnB1c2gob2JqZWN0KTtcbiAgICAgICAgaWYgKG9iLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5waW5uZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2IubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgIG9iID0gW29iW29iLmxlbmd0aCAtIDJdLCBvYltvYi5sZW5ndGggLSAxXV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2NrcyB0aGUgb2JqZWN0cyBhdHRhY2hlZCB0byB0aGUgZW5kcyBvZiB0aGUgc3ByaW5nXG4gICAgICogdG8gbm90IHJvdGF0ZSBhcm91bmQgdGhlIGF0dGFjaCBwb2ludFxuICAgICAqL1xuICAgIGxvY2tSb3RhdGlvbigpIHtcbiAgICAgICAgdGhpcy5yb3RhdGlvbkxvY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVsZWFzZXMgdGhlIG9iamVjdHMgYXR0YWNoZWQgdG8gdGhlIGVuZHMgb2YgdGhlIHNwcmluZ1xuICAgICAqIHRvIHJvdGF0ZSBhcm91bmQgdGhlIGF0dGFjaCBwb2ludFxuICAgICAqL1xuICAgIHVubG9ja1JvdGF0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdGF0aW9uTG9ja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc3ByaW5nIGJheSB0aGUgZWxhcHNlZCB0aW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgRWxhcHNlZCB0aW1lXG4gICAgICovXG4gICAgdXBkYXRlKHQ6IG51bWJlcikge1xuICAgICAgICBsZXQgcDE7XG4gICAgICAgIGxldCBwMjtcbiAgICAgICAgaWYgKHRoaXMucGlubmVkICYmIHRoaXMub2JqZWN0c1swXSkge1xuICAgICAgICAgICAgcDIgPSB0aGlzLnBpbm5lZDtcbiAgICAgICAgICAgIHAxID0gdGhpcy5vYmplY3RzWzBdO1xuICAgICAgICAgICAgbGV0IGRpc3QgPSBuZXcgVmVjMihwMi54IC0gcDEucG9zLngsIHAyLnkgLSBwMS5wb3MueSk7XG4gICAgICAgICAgICBsZXQgZGwgPSBkaXN0Lmxlbmd0aCAtIHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoZGwgKiB0aGlzLnNwcmluZ0NvbnN0YW50ICogdCAvIChwMS5tKSk7XG4gICAgICAgICAgICBwMS52ZWwueCArPSBkaXN0Lng7XG4gICAgICAgICAgICBwMS52ZWwueSArPSBkaXN0Lnk7XG5cbiAgICAgICAgICAgIGxldCB2ID0gcDEudmVsO1xuICAgICAgICAgICAgdi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGlvbkxvY2tlZCkge1xuICAgICAgICAgICAgICAgIGxldCBzID0gbmV3IFZlYzIocDIueCwgcDIueSk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMS5tICsgcDEuYW07XG4gICAgICAgICAgICAgICAgbGV0IGFuZyA9IChwMS5hbSAqIHAxLmFuZyAtIHIyLmxlbmd0aCAqIHAxLm0gKiAodi55KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdi55ID0gLWFuZyAqIHIyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHYucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vYmplY3RzWzBdICYmIHRoaXMub2JqZWN0c1sxXSkge1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBwMiA9IHRoaXMub2JqZWN0c1sxXTtcbiAgICAgICAgICAgIGxldCBkaXN0ID0gVmVjMi5zdWIocDEucG9zLCBwMi5wb3MpO1xuICAgICAgICAgICAgbGV0IGRsID0gZGlzdC5sZW5ndGggLSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIGRpc3Quc2V0TWFnKDEpO1xuICAgICAgICAgICAgZGlzdC5tdWx0KGRsICogdGhpcy5zcHJpbmdDb25zdGFudCAqIHQpO1xuICAgICAgICAgICAgcDIudmVsLmFkZChWZWMyLmRpdihkaXN0LCBwMi5tKSk7XG4gICAgICAgICAgICBwMS52ZWwuYWRkKFZlYzIuZGl2KGRpc3QsIC1wMS5tKSk7XG5cbiAgICAgICAgICAgIGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICAgICAgICBsZXQgdjEgPSBwMS52ZWw7XG4gICAgICAgICAgICBsZXQgdjIgPSBwMi52ZWw7XG4gICAgICAgICAgICB2MS5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgVmVjMihwMS5wb3MueCAqIHAxLm0gKyBwMi5wb3MueCAqIHAyLm0sXG4gICAgICAgICAgICAgICAgICAgIHAxLnBvcy55ICogcDEubSArIHAyLnBvcy55ICogcDIubSk7XG4gICAgICAgICAgICAgICAgcy5kaXYocDEubSArIHAyLm0pO1xuICAgICAgICAgICAgICAgIGxldCByMSA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDIucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMS5sZW5ndGggKiByMS5sZW5ndGggKiBwMS5tICsgcDEuYW0gK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMi5tICsgcDIuYW07XG4gICAgICAgICAgICAgICAgbGV0IHN2ID0gKHYxLnkgLSB2Mi55KSAqIHIyLmxlbmd0aCAvXG4gICAgICAgICAgICAgICAgICAgIChyMS5sZW5ndGggKyByMi5sZW5ndGgpICsgdjIueTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nID0gKHAxLmFtICogcDEuYW5nICsgcDIuYW0gKiBwMi5hbmcgLVxuICAgICAgICAgICAgICAgICAgICByMS5sZW5ndGggKiBwMS5tICogKHYxLnkgLSBzdikgK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiBwMi5tICogKHYyLnkgLSBzdikpIC8gKGFtKTtcblxuICAgICAgICAgICAgICAgIHYxLnkgPSAtYW5nICogcjEubGVuZ3RoICsgc3Y7XG4gICAgICAgICAgICAgICAgdjIueSA9ICthbmcgKiByMi5sZW5ndGggKyBzdjtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgICAgICBwMi5hbmcgPSBhbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHYxLnJvdGF0ZShkaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuaW1wb3J0IFNwcmluZyBmcm9tICcuL3NwcmluZyc7XG5cbi8qKlxuICogU3RpY2sgY2xhc3MgZm9yIHRoZSBwaHlzaWNzIGVuZ2luZVxuICogU3RpY2tzIGFyZSBub3Qgc3RyZWNoYWJsZSBvYmplY3RzIHRoYXQgZG8gbm90IGNvbGxpZGVcbiAqIHdpdGggb3RoZXIgb2JqZWN0cyBidXQgdGhleSBjYW4gaG9sZCBvdGhlciBvYmplY3RzIG9uIHRoZWlyIGVuZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RpY2sgZXh0ZW5kcyBTcHJpbmcge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzdGlja1xuICAgICAqIEBwYXJhbSB7bnViZXJ9IGxlbmd0aCBUaGUgbGVuZ3RoIG9mIHRoZSBzdGlja1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGxlbmd0aCwgMCk7XG4gICAgICAgIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHN0aWNrIHRyb3VnaCBhbiBlbGFwc2VkIHRpbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICB1cGRhdGUodDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBwMTtcbiAgICAgICAgbGV0IHAyO1xuICAgICAgICBpZiAodGhpcy5waW5uZWQgJiYgdGhpcy5vYmplY3RzWzBdKSB7XG4gICAgICAgICAgICBwMiA9IHRoaXMucGlubmVkO1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBsZXQgZGlzdCA9IG5ldyBWZWMyKHAyLnggLSBwMS5wb3MueCwgcDIueSAtIHAxLnBvcy55KTtcbiAgICAgICAgICAgIGRpc3Quc2V0TWFnKDEpO1xuICAgICAgICAgICAgZGlzdC5tdWx0KC10aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICBwMS5tb3ZlKC1wMS5wb3MueCArIHAyLnggKyBkaXN0LngsIC1wMS5wb3MueSArIHAyLnkgKyBkaXN0LnkpO1xuXG4gICAgICAgICAgICBsZXQgdiA9IHAxLnZlbDtcbiAgICAgICAgICAgIHYucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdi54ID0gMDtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAyLngsIHAyLnkpO1xuICAgICAgICAgICAgICAgIGxldCByMiA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgICAgICAgICAgbGV0IGFtID0gcjIubGVuZ3RoICogcjIubGVuZ3RoICogcDEubSArIHAxLmFtO1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgLSByMi5sZW5ndGggKiBwMS5tICogKHYueSkpIC8gKGFtKTtcblxuICAgICAgICAgICAgICAgIHYueSA9IC1hbmcgKiByMi5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBwMS5hbmcgPSBhbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHYucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vYmplY3RzWzBdICYmIHRoaXMub2JqZWN0c1sxXSkge1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBwMiA9IHRoaXMub2JqZWN0c1sxXTtcblxuICAgICAgICAgICAgbGV0IGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICAgICAgICBsZXQgZGwgPSB0aGlzLmxlbmd0aCAtIGRpc3QubGVuZ3RoO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBsZXQgbW92ZTEgPSBWZWMyLm11bHQoZGlzdCwgZGwgKiAocDIubSkgLyAoKHAxLm0pICsgKHAyLm0pKSk7XG4gICAgICAgICAgICBsZXQgbW92ZTIgPSBWZWMyLm11bHQoZGlzdCwgLWRsICogKHAxLm0pIC8gKChwMS5tKSArIChwMi5tKSkpO1xuICAgICAgICAgICAgcDEubW92ZShtb3ZlMS54LCBtb3ZlMS55KTtcbiAgICAgICAgICAgIHAyLm1vdmUobW92ZTIueCwgbW92ZTIueSk7XG5cbiAgICAgICAgICAgIGxldCB2MSA9IHAxLnZlbDtcbiAgICAgICAgICAgIGxldCB2MiA9IHAyLnZlbDtcbiAgICAgICAgICAgIHYxLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIHYyLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIHYxLnggPSB2Mi54ID0gKHAxLm0gKiB2MS54ICsgcDIubSAqIHYyLngpIC8gKChwMS5tKSArIChwMi5tKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgVmVjMihwMS5wb3MueCAqIHAxLm0gKyBwMi5wb3MueCAqIHAyLm0sXG4gICAgICAgICAgICAgICAgICAgIHAxLnBvcy55ICogcDEubSArIHAyLnBvcy55ICogcDIubSk7XG4gICAgICAgICAgICAgICAgcy5kaXYocDEubSArIHAyLm0pO1xuICAgICAgICAgICAgICAgIGxldCByMSA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDIucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMS5sZW5ndGggKiByMS5sZW5ndGggKiBwMS5tICsgcDEuYW0gK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMi5tICsgcDIuYW07XG4gICAgICAgICAgICAgICAgbGV0IHN2ID0gKHYxLnkgLSB2Mi55KSAqIHIyLmxlbmd0aCAvXG4gICAgICAgICAgICAgICAgICAgIChyMS5sZW5ndGggKyByMi5sZW5ndGgpICsgdjIueTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nID0gKHAxLmFtICogcDEuYW5nICsgcDIuYW0gKiBwMi5hbmcgLVxuICAgICAgICAgICAgICAgICAgICByMS5sZW5ndGggKiBwMS5tICogKHYxLnkgLSBzdikgK1xuICAgICAgICAgICAgICAgICAgICByMi5sZW5ndGggKiBwMi5tICogKHYyLnkgLSBzdikpIC8gKGFtKTtcblxuICAgICAgICAgICAgICAgIHYxLnkgPSAtYW5nICogcjEubGVuZ3RoICsgc3Y7XG4gICAgICAgICAgICAgICAgdjIueSA9ICthbmcgKiByMi5sZW5ndGggKyBzdjtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgICAgICBwMi5hbmcgPSBhbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHYxLnJvdGF0ZShkaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBldmVyeSBhbmdsZSBpcyBjb3VudGVyY2xvY2t3aXNlIChhbnRpY2xvY2t3aXNlKVxuLyoqIENsYXNzIHJlcHJlc2VudGluZyBhIDJkIHZlY3Rvci4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlYzIge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IHZhbHVlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBjb3B5IG9mIHRoZSB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNvcHkuXG4gICAgICovXG4gICAgZ2V0IGNvcHkoKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBsZW5ndGguXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3RvciBzcXVhcmVkLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGxlbmd0aCBzcXVhcmVkLlxuICAgICAqL1xuICAgIGdldCBzcWxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaGVhZGluZyBvZiB0aGUgdmVjdG9yIGNvbXBhcmVkIHRvICgxLCAwKS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBhbmdsZSBiZXR3ZWVuICgxLCAwKVxuICAgICAqIGFuZCB0aGUgdmVjdG9yIGluIGFudGljbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAgICAqL1xuICAgIGdldCBoZWFkaW5nKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnggPT09IDAgJiYgdGhpcy55ID09PSAwKSByZXR1cm4gMDtcbiAgICAgICAgaWYgKHRoaXMueCA9PT0gMCkgcmV0dXJuIHRoaXMueSA+IDAgPyBNYXRoLlBJIC8gMiA6IDEuNSAqIE1hdGguUEk7XG4gICAgICAgIGlmICh0aGlzLnkgPT09IDApIHJldHVybiB0aGlzLnggPiAwID8gMCA6IE1hdGguUEk7XG4gICAgICAgIGxldCB2ID0gVmVjMi5ub3JtYWxpemVkKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy54ID4gMCAmJiB0aGlzLnkgPiAwKSByZXR1cm4gTWF0aC5hc2luKHYueSk7XG4gICAgICAgIGlmICh0aGlzLnggPCAwICYmIHRoaXMueSA+IDApIHJldHVybiBNYXRoLmFzaW4oLXYueCkgKyBNYXRoLlBJIC8gMjtcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgJiYgdGhpcy55IDwgMCkgcmV0dXJuIE1hdGguYXNpbigtdi55KSArIE1hdGguUEk7XG4gICAgICAgIGlmICh0aGlzLnggPiAwICYmIHRoaXMueSA8IDApIHJldHVybiBNYXRoLmFzaW4odi54KSArIDEuNSAqIE1hdGguUEk7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYW5vdGhlciB2ZWN0b3IgdG8gdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBUaGUgb3RoZXIgdmVjdG9yLlxuICAgICAqL1xuICAgIGFkZChhOiBWZWMyKSB7XG4gICAgICAgIHRoaXMueCArPSBhLng7XG4gICAgICAgIHRoaXMueSArPSBhLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIGFub3RoZXIgdmVjdG9yIGZyb20gdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBUaGUgb3RoZXIgdmVjdG9yLlxuICAgICAqL1xuICAgIHN1YihhOiBWZWMyKSB7XG4gICAgICAgIHRoaXMueCAtPSBhLng7XG4gICAgICAgIHRoaXMueSAtPSBhLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHNjYWxhci5cbiAgICAgKi9cbiAgICBtdWx0KHg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggKj0geDtcbiAgICAgICAgdGhpcy55ICo9IHg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGl2aWRlcyB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHNjYWxhci5cbiAgICAgKi9cbiAgICBkaXYoeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCAvPSB4O1xuICAgICAgICB0aGlzLnkgLz0geDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaW5lYXJyeSBpbnRlcnBvbGF0ZXMgdGhlIHZlY3RvciBpbnRvIHRoZSBvdGhlciB2ZWN0b3IgYnkgc2NhbGFyIHguXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdGhlciAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIGxlcnAob3RoZXI6IFZlYzIsIHg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggKz0gKG90aGVyLnggLSB0aGlzLngpICogeDtcbiAgICAgICAgdGhpcy55ICs9IChvdGhlci55IC0gdGhpcy55KSAqIHg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB2ZWN0b3IgYW5kIHRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogVmVjdG9ycyBhcmUgcmVwcmVzZW50aW5nIHBvaW50cyBoZXJlLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gb3RoZXIgLSBUaGUgb3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBkaXN0KG90aGVyOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIChuZXcgVmVjMih0aGlzLnggLSBvdGhlci54LCB0aGlzLnkgLSBvdGhlci55KSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGwgLSBUaGUgbmV3IGxlbmd0aCB2YWx1ZS5cbiAgICAgKi9cbiAgICBzZXRNYWcobDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm11bHQobCAvIHRoaXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgdGhlIHZlY3RvciBhbnRpY2xvY2t3aXNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFJvdGF0aW9uIGFuZ2xlLlxuICAgICAqL1xuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgIGxldCBoID0gdGhpcy5oZWFkaW5nO1xuICAgICAgICBsZXQgdiA9IFZlYzIuZnJvbUFuZ2xlKGFuZ2xlICsgaCk7XG4gICAgICAgIHYubXVsdCh0aGlzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMueCA9IHYueDtcbiAgICAgICAgdGhpcy55ID0gdi55O1xuICAgIH1cblxuXG4gICAgLy8gU3RhdGljIGZ1bmN0aW9uczpcbiAgICAvKipcbiAgICAgKiBBZGQgdHdvIHZlY3RvcnMgdG9nZXRoZXIuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gVmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgc3VtIG9mIHRoZSB2ZWN0b3JzLlxuICAgICAqL1xuICAgIHN0YXRpYyBhZGQoYTogVmVjMiwgYjogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoYS54ICsgYi54LCBhLnkgKyBiLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gYW5vdGhlci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBzdWJ0cmFjdGlvbiBvZiB0aGUgdmVjdG9ycy5cbiAgICAgKi9cbiAgICBzdGF0aWMgc3ViKGE6IFZlYzIsIGI6IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKGEueCAtIGIueCwgYS55IC0gYi55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBseSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gdiAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFNjYWxhci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgbXVsdGlwbGllZCB2ZWN0b3IuXG4gICAgICovXG4gICAgc3RhdGljIG11bHQodjogVmVjMiwgeDogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih2LnggKiB4LCB2LnkgKiB4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGUgdGhlIHZlY3RvciBieSBhIHNjYWxhci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHYgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBTY2FsYXIuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGRpdmlkZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBkaXYodjogVmVjMiwgeDogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih2LnggLyB4LCB2LnkgLyB4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSB1bml0IHZlY3RvciBmcm9tIGFuIGFuZ2xlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhIC0gVGhlIGFuZ2xlLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBjcmVhdGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFuZ2xlKGE6IG51bWJlcik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoTWF0aC5jb3MoYSksIE1hdGguc2luKGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaW5lYXJyeSBpbnRlcnBvbGF0ZXMgYSB2ZWN0b3IgaW50byBhbm90aGVyIHZlY3RvciBieSBzY2FsYXIgeC5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBjcmVhdGVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgbGVycChhOiBWZWMyLCBiOiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIuYWRkKGEsIFZlYzIubXVsdChWZWMyLnN1YihiLCBhKSwgeCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZGlzdChhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIuc3ViKGEsIGIpLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRvdCBwcm9kdWN0IG9mIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGRvdChhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgY3Jvc3MgcHJvZHVjdCBvZiB0aGVtLlxuICAgICAqL1xuICAgIHN0YXRpYyBjcm9zcyhhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueSAtIGEueSAqIGIueDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBBbmdsZSBiZXR3ZWVuIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGFuZ2xlKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hY29zKFZlYzIuZG90KGEsIGIpIC8gTWF0aC5zcXJ0KGEuc3FsZW5ndGggKiBiLnNxbGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBhbmdsZSBiZXR3ZWVuIHR3byB2ZWN0b3JzIGJ1dCBpbiB0aGUgYW50aWNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBBbmdsZSBiZXR3ZWVuIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGFuZ2xlQUNXKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICBsZXQgYWggPSBhLmhlYWRpbmc7XG4gICAgICAgIGxldCBiaCA9IGIuaGVhZGluZztcbiAgICAgICAgbGV0IGFuZ2xlID0gYmggLSBhaDtcbiAgICAgICAgcmV0dXJuIGFuZ2xlIDwgMCA/IDIgKiBNYXRoLlBJICsgYW5nbGUgOiBhbmdsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSB2ZWN0b3Igd2l0aCB0aGUgc2FtZSBoZWFkaW5nIHdpdGggdGhlIGlucHV0IHZlY3RvclxuICAgICAqIGJ1dCB3aXRoIGxlbmd0aCA9IDEuXG4gICAgICogQHBhcmFtIHtWZWMyfSB2IC0gQSB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVmVjdG9yIHdpdGggbGVuZ3RoID0gMC5cbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsaXplZCh2OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIGxldCBsID0gdi5sZW5ndGg7XG4gICAgICAgIHJldHVybiBsID09PSAwID8gdiA6IG5ldyBWZWMyKHYueCAvIGwsIHYueSAvIGwpO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuXG4vKiogQ2xhc3MgcmVwcmVzZW50aW5nIGEgd2FsbFxuICogV2FsbHMgYXJlIG9iamVjdHMgdGhhdCBhcmUgaW1tb3ZhYmxlICBhbmQgdGhleSBhcmUgcmlnaWRcbiAqIEl0IGNhbiBiZSBjb252ZXggb3IgY29uY2F2ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSB3YWxsXG4gICAgICogQHBhcmFtIHtBcnJheTxWZWMyPn0gcG9pbnRzIEFycmF5IG9mIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIHdhbGxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9pbnRzOiBBcnJheTxWZWMyPikge1xuICAgICAgICBsZXQgcG9sID0gdGhpcy5wb2ludHM7XG4gICAgICAgIGxldCBzdW0xID0gMDtcbiAgICAgICAgbGV0IHN1bTIgPSAwO1xuICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSkpO1xuICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgcG9sW2ldKSwgVmVjMi5zdWIocG9sW2kgLSAxXSwgcG9sW2ldKSk7XG4gICAgICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSkpO1xuICAgICAgICBzdW0xICs9IGFuZ2xlO1xuICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIGlmIChzdW0yID4gc3VtMSkgcmV0dXJuO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcG9sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB0ZW1wLnB1c2gocG9sW2ldKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gdGVtcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIGZvciBjb2xsaXNpb24gZGV0ZWN0aW9uIGFuZCBiZWhhdmlvciBiZXR3ZWVuIGJhbGxzIGFuZCB3YWxsc1xuICAgICAqIEBwYXJhbSB7QmFsbH0gYmFsbCBUaGUgYmFsbCB0aGF0IGlzIGNoZWNrZWQgaWYgaXQgY29sbGlkZXMgd2l0aCB0aGUgd2FsbFxuICAgICAqL1xuICAgIGNvbGxpZGVXaXRoQmFsbChiYWxsOiBCYWxsKSB7XG4gICAgICAgIGxldCBoZWFkaW5nOiBudW1iZXI7XG4gICAgICAgIGxldCByZWw6IG51bWJlcjtcblxuICAgICAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgcC54IC09IGJhbGwucG9zLng7XG4gICAgICAgICAgICBwLnkgLT0gYmFsbC5wb3MueTtcbiAgICAgICAgICAgIHAubXVsdCgtMSk7XG4gICAgICAgICAgICBpZiAocC5sZW5ndGggPD0gYmFsbC5yKSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IHAuaGVhZGluZztcbiAgICAgICAgICAgICAgICByZWwgPSBwLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAgPSBuZXcgVmVjMihwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgIGxldCBucCA9IG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50c1soaWR4ICsgMSkgJSB0aGlzLnBvaW50cy5sZW5ndGhdLnkpO1xuICAgICAgICAgICAgbGV0IGJwID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBWZWMyKG5wLnggLSBwLngsIG5wLnkgLSBwLnkpO1xuICAgICAgICAgICAgbGV0IGggPSBzaWRlLmhlYWRpbmc7XG4gICAgICAgICAgICBwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbnAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBicC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGxldCBkID0gYnAueSAtICgocC55ICsgbnAueSkgLyAyKTtcbiAgICAgICAgICAgIGlmIChkID49IC1iYWxsLnIgJiYgZCA8PSBiYWxsLnIgJiYgYnAueCA+PSBucC54ICYmIGJwLnggPD0gcC54KSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IGggLSBNYXRoLlBJIC8gMjtcbiAgICAgICAgICAgICAgICByZWwgPSBkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaGVhZGluZyA9PT0gMCB8fCBoZWFkaW5nKSB7XG4gICAgICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgICBsZXQgdmVsID0gbmV3IFZlYzIoYmFsbC52ZWwueCwgYmFsbC52ZWwueSk7XG4gICAgICAgICAgICBwb3Mucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdmVsLnJvdGF0ZSgtaGVhZGluZyArIE1hdGguUEkgLyAyKTtcblxuICAgICAgICAgICAgdmVsLnkgKj0gLWJhbGwuaztcbiAgICAgICAgICAgIHBvcy55ICs9IGJhbGwuciAtIHJlbDtcbiAgICAgICAgICAgIGxldCBkdnkgPSB2ZWwueSAqICgxICsgKDEgLyBiYWxsLmspKTtcbiAgICAgICAgICAgIGxldCBkdnggPVxuICAgICAgICAgICAgICAgIE1hdGguYWJzKGR2eSkgKiBiYWxsLmZjICpcbiAgICAgICAgICAgICAgICBNYXRoLnNpZ24odmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKiAtMTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkdngpID4gTWF0aC5hYnModmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikpIHtcbiAgICAgICAgICAgICAgICBkdnggPSAtdmVsLnggKyBiYWxsLmFuZyAqIGJhbGwucjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZlbC54ICs9XG4gICAgICAgICAgICAgICAgZHZ4IC0gYmFsbC5yICogYmFsbC5yICogYmFsbC5tICogZHZ4IC9cbiAgICAgICAgICAgICAgICAoYmFsbC5hbSArIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSk7XG4gICAgICAgICAgICBiYWxsLmFuZyAtPVxuICAgICAgICAgICAgICAgIGJhbGwuciAqIGJhbGwuciAqIGJhbGwubSAqIGR2eCAvXG4gICAgICAgICAgICAgICAgKChiYWxsLmFtICsgYmFsbC5yICogYmFsbC5yICogYmFsbC5tKSAqIGJhbGwucik7XG4gICAgICAgICAgICBwb3Mucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2ZWwucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICBiYWxsLnBvcy54ID0gcG9zLng7XG4gICAgICAgICAgICBiYWxsLnBvcy55ID0gcG9zLnk7XG4gICAgICAgICAgICBiYWxsLnZlbC54ID0gdmVsLng7XG4gICAgICAgICAgICBiYWxsLnZlbC55ID0gdmVsLnk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
