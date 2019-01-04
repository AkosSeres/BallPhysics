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
                fixedBallCollision: if (heading === 0 || heading) {
                    let pos = new vec2_1.default(ball.pos.x, ball.pos.y);
                    let vel = new vec2_1.default(ball.vel.x, ball.vel.y);
                    pos.rotate(-heading + Math.PI / 2);
                    vel.rotate(-heading + Math.PI / 2);
                    if (vel.y > 0)
                        break fixedBallCollision;
                    vel.y *= -ball.k;
                    pos.y += ball.r + b.r - rel;
                    let dvy = vel.y * (1 + (1 / ball.k));
                    let deltaAng = Math.sign(vel.x - ball.ang * ball.r) *
                        (dvy * ball.fc) / (ball.amc * ball.r);
                    let maxDeltaAng = (vel.x - ball.ang * ball.r) / ball.r;
                    if (deltaAng / maxDeltaAng > 1)
                        deltaAng = maxDeltaAng;
                    deltaAng *= (ball.amc) / (ball.amc + 1);
                    ball.ang += deltaAng;
                    let dvx = deltaAng * ball.r;
                    vel.x -= dvx;
                    pos.rotate(heading - Math.PI / 2);
                    vel.rotate(heading - Math.PI / 2);
                    ball.pos.x = pos.x;
                    ball.pos.y = pos.y;
                    ball.vel.x = vel.x;
                    ball.vel.y = vel.y;
                }
            }
            // Bounce off the edges
            for (let bound of this.bounds) {
                bound.collideWithBall(this.balls[i]);
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
     * Appends a new soft square to the world
     * @param {Vec2} pos The position of the soft square
     * @param {number} sideSize The size of the square
     * @param {number} fc Friction coefficient
     * @param {Vec2} vel The initial velocity of the soft square
     */
    addSoftSquare(pos, sideSize, fc, vel) {
        let softSquare = new softball_1.default(pos, Math.sqrt(sideSize * sideSize / Math.PI), 1, fc, 24);
        softSquare.sides.forEach((side) => {
            side.length = (0.96 * 4 * sideSize / softSquare.resolution);
        });
        softSquare.points.forEach((b) => {
            b.vel = vel.copy;
        });
        this.balls.push(...softSquare.points);
        this.springs.push(...softSquare.sides);
        let springStrength = sideSize * sideSize * 200;
        let bigStick = new spring_1.default(Math.sqrt(softSquare.r * softSquare.r * Math.PI), springStrength / 2);
        bigStick.attachObject(softSquare.points[0]);
        bigStick.attachObject(softSquare.points[softSquare.resolution / 2]);
        this.springs.push(bigStick);
        bigStick = new spring_1.default(Math.sqrt(softSquare.r * softSquare.r * Math.PI), springStrength / 2);
        bigStick.attachObject(softSquare.points[softSquare.resolution / 4]);
        bigStick.attachObject(softSquare.points[3 * softSquare.resolution / 4]);
        this.springs.push(bigStick);
        bigStick = new spring_1.default(Math.sqrt(2 * softSquare.r * softSquare.r * Math.PI), springStrength);
        bigStick.attachObject(softSquare.points[softSquare.resolution / 8]);
        bigStick.attachObject(softSquare.points[5 * softSquare.resolution / 8]);
        this.springs.push(bigStick);
        bigStick = new spring_1.default(Math.sqrt(2 * softSquare.r * softSquare.r * Math.PI), springStrength);
        bigStick.attachObject(softSquare.points[3 * softSquare.resolution / 8]);
        bigStick.attachObject(softSquare.points[7 * softSquare.resolution / 8]);
        this.springs.push(bigStick);
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
        this.bounds = [];
        const getRectBody = (x_, y_, w_, h_) => {
            let points = [];
            points.push(new vec2_1.default(x_ - w_ / 2, y_ - h_ / 2));
            points.push(new vec2_1.default(x_ + w_ / 2, y_ - h_ / 2));
            points.push(new vec2_1.default(x_ + w_ / 2, y_ + h_ / 2));
            points.push(new vec2_1.default(x_ - w_ / 2, y_ + h_ / 2));
            return new wall_1.default(points);
        };
        this.bounds.push(getRectBody(x - w, y, 2 * w, 2 * h));
        this.bounds.push(getRectBody(x + 2 * w, y, 2 * w, 2 * h));
        this.bounds.push(getRectBody(x, y - h, 2 * w, h * 2));
        this.bounds.push(getRectBody(x, y + 2 * h, 2 * w, 2 * h));
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
        let layerNumber = (Math.random() * 1000000);
        for (let i = 0; i < this.resolution; i++) {
            let newPos = new vec2_1.default(pos.x, pos.y);
            newPos.add(vec2_1.default.mult(vec2_1.default.fromAngle((i / this.resolution) * Math.PI * 2), r));
            this.points.push(new ball_1.default(newPos, new vec2_1.default(0, 0), r * Math.sin(Math.PI / this.resolution), 0, 0, this.fc));
            this.points[this.points.length - 1].layer = layerNumber;
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
            if (vel.y > 0)
                return;
            vel.y *= -ball.k;
            pos.y += ball.r - rel;
            let dvy = vel.y * (1 + (1 / ball.k));
            let deltaAng = Math.sign(vel.x - ball.ang * ball.r) *
                (dvy * ball.fc) / (ball.amc * ball.r);
            let maxDeltaAng = (vel.x - ball.ang * ball.r) / ball.r;
            if (deltaAng / maxDeltaAng > 1)
                deltaAng = maxDeltaAng;
            deltaAng *= (ball.amc) / (ball.amc + 1);
            ball.ang += deltaAng;
            let dvx = deltaAng * ball.r;
            vel.x -= dvx;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFsbC50cyIsInNyYy9ib2R5LnRzIiwic3JjL2xpbmVzZWdtZW50LnRzIiwic3JjL3BoeXNpY3MudHMiLCJzcmMvc29mdGJhbGwudHMiLCJzcmMvc3ByaW5nLnRzIiwic3JjL3N0aWNrLnRzIiwic3JjL3ZlYzIudHMiLCJzcmMvd2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsaUNBQTBCO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFxQixJQUFJO0lBWXZCOzs7Ozs7Ozs7T0FTRztJQUNILFlBQVksR0FBUyxFQUFFLEdBQVMsRUFBRSxDQUFTLEVBQ3pDLENBQVMsRUFBRSxHQUFXLEVBQUUsRUFBVTtRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksR0FBRztZQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztZQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRWpDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRWxCLElBQUksR0FBRyxJQUFJLFNBQVM7WUFBRSxJQUFJ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QUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRWhDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUUvQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDM0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFBRSxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFL0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFD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SSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVkLDRDQUE0QztRQUM1QyxLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtZQUN0QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxH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LENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBcUIsRUFBRSxRQUFxQjtRQUN6RCxJQUFJLEVBQUUsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FB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QUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMvQixJQUFJLFNBQVMsQ0FBQztnQkFDZCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDSCxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLFNBQVMsQ0FBQztnQkFDZCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM3QixTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDSCxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFD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QUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzlCLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFDeEMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUNwRCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxJQUFJO1FBQ04sSUFBSSxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QixHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNsQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNwQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDakMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM5QixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxDQUFDLGVBQUssQ0FBQztZQUNqRSxJQUFJLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUMvQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekIsWUFBWSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1lBQ3BELFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUVwQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUFFLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNwRDtvQkFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzt3QkFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDM0Q7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxjQUFjLENBQUMsV0FBbUI7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFBRSxPQUFPO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDO1lBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsVUFBVSxDQUFDLEdBQVM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPLENBQUMsSUFBVTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTyxDQUFDLElBQVU7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFdBQVcsQ0FBQyxRQUFrQjtRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsYUFBYSxDQUFDLEdBQVMsRUFBRSxRQUFnQixFQUFFLEVBQVUsRUFBRSxHQUFTO1FBQzlELElBQUksVUFBVSxHQUFHLElBQUksa0JBQVEsQ0FBQyxHQUFHLEVBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzlCLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZDLElBQUksY0FBYyxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBRS9DLElBQUksUUFBUSxHQUFHLElBQUksZ0JBQU0sQ0FDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RSxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVCLFFBQVEsR0FBRyxJQUFJLGdCQUFNLENBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU1QixRQUFRLEdBQUcsSUFBSSxnQkFBTSxDQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3hFLFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUIsUUFBUSxHQUFHLElBQUksZ0JBQU0sQ0FDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUN4RSxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFDcEQsRUFBVSxFQUFFLENBQVM7UUFDckIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUNULENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUNWLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLGNBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPLENBQUMsSUFBVTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNuQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxNQUFjO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBRTtZQUNyRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FDbEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ1gsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ1osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FDbEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ1gsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ1osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FDbEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ1gsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ1osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FDbEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ1gsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ1osQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLGNBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFD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QUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZ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RSxDQUFDO1FBQ2xFLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDL0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3BFLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVEOzs7T0FHRztJQUNILEdBQUcsQ0FBQyxDQUFPO1FBQ1AsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFD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QUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDOUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksSUFBSSxLQUFLLENBQUM7UUFDZCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQ3BELEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksSUFBSSxLQUFLLENBQUM7WUFDZCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQy9CO1FBQ0QsS0FBSyxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFD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QUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN0QjtJQUNMLENBQUM7Q0FDSjtBQWhHRCx1QkFnR0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgYmFsbFxuICogQSBiYWxsIGlzIGFuIG9iamVjdCBpbiB0aGUgcGh5c2ljcyBlbmdpbmUgdGhhdFxuICogaGFzIGEgc2hhcGUgb2YgYSBjaXJjbGUgYW5kIGl0IGlzIGFmZmVjdGVkIGJ5IGdyYXZpdHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFsbCB7XG4gIHBvczogVmVjMjtcbiAgbGFzdFBvczogVmVjMjtcbiAgcjogbnVtYmVyO1xuICBmYzogbnVtYmVyO1xuICBhbWM6IG51bWJlcjtcbiAgcm90YXRpb246IG51bWJlcjtcbiAgYW5nOiBudW1iZXI7XG4gIGs6IG51bWJlcjtcbiAgdmVsOiBWZWMyO1xuICBsYXllcjogYW55O1xuXG4gIC8qKlxuICAgKiBDcmV0ZSBhIGJhbGxcbiAgICogVGhlIG1hc3Mgb2YgdGhlIGJhbGwgaXMgY2FsY3VsYXRlZCBmcm9tIGl0cyByYWRpdXNcbiAgICogQHBhcmFtIHtWZWMyfSBwb3MgVGhlIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZVxuICAgKiBAcGFyYW0ge1ZlYzJ9IHZlbCBUaGUgdmVsb2NpdHkgb2YgdGhlIGNpcmNsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gciBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gayBDb2VmZmljaWVudCBvZiByZXN0aXR1dGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nIFRoZSBhbmd1bGFyIHZlbG9jaXR5IG9mIHRoZSBiYWxsIChvcHRpb25hbClcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZjIFRoZSBmcmljdGlvbiBjb2VmZmljaWVudCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIDAuNClcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBvczogVmVjMiwgdmVsOiBWZWMyLCByOiBudW1iZXIsXG4gICAgazogbnVtYmVyLCBhbmc6IG51bWJlciwgZmM6IG51bWJlcikge1xuICAgIHRoaXMucG9zID0gcG9zLmNvcHk7XG4gICAgdGhpcy5sYXN0UG9zID0gdGhpcy5wb3MuY29weTtcbiAgICB0aGlzLnIgPSByO1xuICAgIHRoaXMuZmMgPSAwLjQ7XG4gICAgdGhpcy5hbWMgPSAyIC8gNTtcblxuICAgIHRoaXMucm90YXRpb24gPSAwO1xuXG4gICAgaWYgKGFuZykgdGhpcy5hbmcgPSBhbmc7XG4gICAgZWxzZSB0aGlzLmFuZyA9IDA7XG5cbiAgICBpZiAoZmMgfHwgZmMgPT09IDApIHRoaXMuZmMgPSBmYztcblxuICAgIGlmIChrKSB0aGlzLmsgPSBrO1xuICAgIGVsc2UgdGhpcy5rID0gMC44O1xuXG4gICAgaWYgKHZlbCAhPSB1bmRlZmluZWQpIHRoaXMudmVsID0gdmVsLmNvcHk7XG4gICAgZWxzZSB0aGlzLnZlbCA9IG5ldyBWZWMyKDAsIDApO1xuICB9XG5cblxuICAvKipcbiAgICogR2V0IHRoZSBtYXNzIG9mIHRoZSBiYWxsXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIG1hc3NcbiAgICovXG4gIGdldCBtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuciAqIHRoaXMuciAqIE1hdGguUEk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtb21lbnQgb2YgaW5lcnRpYSBvZiB0aGUgYmFsbFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBtb21lbnQgb2YgaW5lcnRpYVxuICAgKi9cbiAgZ2V0IGFtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuYW1jICogdGhpcy5yICogdGhpcy5yICogdGhpcy5tO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgdGhlIGJhbGwgdGhhdCBpcyBub3QgYSByZWZlcmVuY2UgdG8gaXRcbiAgICogQHJldHVybiB7QmFsbH0gVGhlIGNvcHkgb2YgdGhlIGJhbGxcbiAgICovXG4gIGdldCBjb3B5KCk6IEJhbGwge1xuICAgIGxldCByZXQgPVxuICAgICAgbmV3IEJhbGwodGhpcy5wb3MuY29weSwgdGhpcy52ZWwuY29weSwgdGhpcy5yLCB0aGlzLmssIHRoaXMuYW5nLCB0aGlzLmZjKTtcbiAgICByZXQubGFzdFBvcyA9IHRoaXMubGFzdFBvcy5jb3B5O1xuICAgIHJldC5yb3RhdGlvbiA9IHRoaXMucm90YXRpb247XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgYmFsbCBieSB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgKi9cbiAgbW92ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMucG9zLnggKz0geDtcbiAgICB0aGlzLnBvcy55ICs9IHk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHR3byBiYWxscyBhcmUgY29sbGlkaW5nIG9yIG5vdFxuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwgdGhlIG90aGVyIGJhbGxcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGV5IGNvbGlkcmVcbiAgICovXG4gIGNvbGxpZGVkKGJhbGw6IEJhbGwpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5wb3MuZGlzdChiYWxsLnBvcykgPCAodGhpcy5yICsgYmFsbC5yKSkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU3RhdGljIGZ1bmN0aW9uIGZvciBjb2xsaXNpb24gYmV0d2VlbiB0d28gYmFsbHNcbiAgICogQHBhcmFtIHtCYWxsfSBiYWxsMSBGaXJzdCBiYWxsXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbDIgU2Vjb25kIGJhbGxcbiAgICovXG4gIHN0YXRpYyBjb2xsaWRlKGJhbGwxOiBCYWxsLCBiYWxsMjogQmFsbCkge1xuICAgIGlmICghYmFsbDEuY29sbGlkZWQoYmFsbDIpKSByZXR1cm47XG5cbiAgICBsZXQgcG9zMSA9IGJhbGwxLnBvcztcbiAgICBsZXQgcG9zMiA9IGJhbGwyLnBvcztcbiAgICBsZXQgcjEgPSBiYWxsMS5yO1xuICAgIGxldCByMiA9IGJhbGwyLnI7XG4gICAgbGV0IGsgPSAoYmFsbDEuayArIGJhbGwyLmspIC8gMjtcbiAgICBsZXQgbTEgPSBiYWxsMS5tO1xuICAgIGxldCBtMiA9IGJhbGwyLm07XG4gICAgbGV0IGRpc3QgPSBWZWMyLmRpc3QocG9zMSwgcG9zMik7XG4gICAgbGV0IGZjID0gKGJhbGwxLmZjICsgYmFsbDIuZmMpIC8gMjtcblxuICAgIGxldCBjcDEgPSBwb3MxLmNvcHk7XG4gICAgbGV0IGNwMiA9IHBvczIuY29weTtcbiAgICBsZXQgdG9vID0gcjEgKyByMiAtIGRpc3Q7XG4gICAgbGV0IGQgPSBWZWMyLnN1Yihwb3MxLCBwb3MyKTtcbiAgICBkLnNldE1hZygxKTtcbiAgICBkLm11bHQodG9vICogbTIgLyAobTEgKyBtMikpO1xuICAgIGNwMS5hZGQoZCk7XG4gICAgZC5zZXRNYWcoMSk7XG4gICAgZC5tdWx0KC10b28gKiBtMSAvIChtMSArIG0yKSk7XG4gICAgY3AyLmFkZChkKTtcbiAgICBiYWxsMS5wb3MgPSBjcDE7XG4gICAgYmFsbDIucG9zID0gY3AyO1xuXG4gICAgaWYgKFZlYzIuZG90KGQsIFZlYzIuc3ViKGJhbGwxLnZlbCwgYmFsbDIudmVsKSkgPCAwKSByZXR1cm47XG5cbiAgICBkLnNldE1hZygxKTtcbiAgICBsZXQgdmVsMVBhcnJhbGVsID0gVmVjMi5jcm9zcyhkLCBiYWxsMS52ZWwpO1xuICAgIGxldCB2ZWwyUGFycmFsZWwgPSBWZWMyLmNyb3NzKGQsIGJhbGwyLnZlbCk7XG4gICAgbGV0IHZlbDFQZXJwZW5kaWN1bGFyID0gVmVjMi5kb3QoZCwgYmFsbDEudmVsKTtcbiAgICBsZXQgdmVsMlBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChkLCBiYWxsMi52ZWwpO1xuXG4gICAgbGV0IHZrMSA9IHIxICogYmFsbDEuYW5nO1xuICAgIGxldCB2azIgPSByMiAqIGJhbGwyLmFuZztcblxuICAgIGxldCB2ZWwxSW5Qb3MgPSB2ZWwxUGFycmFsZWwgLSB2azE7XG4gICAgbGV0IHZlbDJJblBvcyA9IHZlbDJQYXJyYWxlbCArIHZrMjtcbiAgICBsZXQgdkNvbW1vbiA9ICgodmVsMUluUG9zICogYmFsbDEuYW0pICtcbiAgICAgICh2ZWwySW5Qb3MgKiBiYWxsMi5hbSkpIC8gKGJhbGwxLmFtICsgYmFsbDIuYW0pO1xuICAgIGxldCB0b3ZDb21tb24xID0gdkNvbW1vbiAtIHZlbDFJblBvcztcbiAgICBsZXQgdG92Q29tbW9uMiA9IHZDb21tb24gLSB2ZWwySW5Qb3M7XG4gICAgbGV0IG1heERlbHRhQW5nMSA9IHRvdkNvbW1vbjEgLyByMTtcbiAgICBsZXQgbWF4RGVsdGFBbmcyID0gdG92Q29tbW9uMiAvIHIyO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBuZXcgcGVycGVuZGljdWxhciB2ZWxvY2l0aWVzXG4gICAgbGV0IHUxUGVycGVuZGljdWxhciA9ICgoMSArIGspICpcbiAgICAgICgobTEgKiB2ZWwxUGVycGVuZGljdWxhciArIG0yICogdmVsMlBlcnBlbmRpY3VsYXIpIC8gKG0xICsgbTIpKSkgLVxuICAgICAgKGsgKiB2ZWwxUGVycGVuZGljdWxhcik7XG4gICAgbGV0IHUyUGVycGVuZGljdWxhciA9ICgoMSArIGspICpcbiAgICAgICgobTEgKiB2ZWwxUGVycGVuZGljdWxhciArIG0yICogdmVsMlBlcnBlbmRpY3VsYXIpIC8gKG0xICsgbTIpKSkgLVxuICAgICAgKGsgKiB2ZWwyUGVycGVuZGljdWxhcik7XG5cbiAgICBiYWxsMS52ZWwgPSBWZWMyLm11bHQoZCwgdTFQZXJwZW5kaWN1bGFyKTtcbiAgICBiYWxsMi52ZWwgPSBWZWMyLm11bHQoZCwgdTJQZXJwZW5kaWN1bGFyKTtcblxuICAgIGxldCBkZWx0YXYxUGVycGVuZGljdWxhciA9IHUxUGVycGVuZGljdWxhciAtIHZlbDFQZXJwZW5kaWN1bGFyO1xuICAgIGxldCBkZWx0YXYyUGVycGVuZGljdWxhciA9IHUyUGVycGVuZGljdWxhciAtIHZlbDJQZXJwZW5kaWN1bGFyO1xuXG4gICAgbGV0IGRlbHRhQW5nMSA9IC0oTWF0aC5zaWduKHRvdkNvbW1vbjEpKSAqXG4gICAgICAoZGVsdGF2MVBlcnBlbmRpY3VsYXIgKiBmYykgLyAoYmFsbDEuYW1jICogcjEpO1xuICAgIGxldCBkZWx0YUFuZzIgPSAoTWF0aC5zaWduKHRvdkNvbW1vbjIpKSAqXG4gICAgICAoZGVsdGF2MlBlcnBlbmRpY3VsYXIgKiBmYykgLyAoYmFsbDIuYW1jICogcjIpO1xuXG4gICAgaWYgKGRlbHRhQW5nMSAvIG1heERlbHRhQW5nMSA+IDEpIGRlbHRhQW5nMSA9IG1heERlbHRhQW5nMTtcbiAgICBpZiAoZGVsdGFBbmcyIC8gbWF4RGVsdGFBbmcyID4gMSkgZGVsdGFBbmcyID0gbWF4RGVsdGFBbmcyO1xuXG4gICAgZGVsdGFBbmcxICo9IChiYWxsMS5hbWMpIC8gKGJhbGwxLmFtYyArIDEpO1xuICAgIGRlbHRhQW5nMiAqPSAoYmFsbDIuYW1jKSAvIChiYWxsMi5hbWMgKyAxKTtcblxuICAgIGJhbGwxLmFuZyAtPSBkZWx0YUFuZzE7XG4gICAgYmFsbDIuYW5nICs9IGRlbHRhQW5nMjtcblxuICAgIGxldCB1MVBhcnJhbGVsID0gdmVsMVBhcnJhbGVsICsgKGRlbHRhQW5nMSAqIHIxKTtcbiAgICBsZXQgdTJQYXJyYWxlbCA9IHZlbDJQYXJyYWxlbCArIChkZWx0YUFuZzIgKiByMik7XG5cbiAgICBkLnJvdGF0ZShNYXRoLlBJIC8gMik7XG4gICAgYmFsbDEudmVsLmFkZChWZWMyLm11bHQoZCwgdTFQYXJyYWxlbCkpO1xuICAgIGJhbGwyLnZlbC5hZGQoVmVjMi5tdWx0KGQsIHUyUGFycmFsZWwpKTtcbiAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgTGluZVNlZ21lbnQgZnJvbSAnLi9saW5lc2VnbWVudCc7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgYm9keVxuICogQm9kaWVzIGFyZSBtb3ZhYmxlIG9iamVjdHNcbiAqIGFuZCB0aGV5IGNvbGxpZGUgd2l0aCBvdGhlciBvYmplY3RzIChiYWxscylcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSB7XG4gICAgcG9pbnRzOiBBcnJheTxWZWMyPjtcbiAgICBsYXN0UG9zOiBWZWMyO1xuICAgIHBvczogVmVjMjtcbiAgICBmYzogbnVtYmVyO1xuICAgIHJvdGF0aW9uOiBudW1iZXI7XG4gICAgYW5nOiBudW1iZXI7XG4gICAgazogbnVtYmVyO1xuICAgIHZlbDogVmVjMjtcbiAgICBtOiBudW1iZXI7XG4gICAgYW06IG51bWJlcjtcbiAgICBsYXllcjogYW55O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGJvZHkgYW5kIGNhbGN1bGF0ZXMgaXQncyBjZW50cmUgb2YgbWFzcyAocG9zaXRpb24pXG4gICAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIFRoZSBwb2ludHMgdGhhdCBtYWtlIHVwIHRoZSBib2R5XG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWwgVGhlIHZlbG9jaXR5IG9mIHRoZSBib2R5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGsgQ29lZmZpY2llbnQgb2YgcmVzdGl0dXRpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nIEFuZ3VsYXIgdmVsb2NpdHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb2ludHM6IEFycmF5PFZlYzI+LCB2ZWw6IFZlYzIsXG4gICAgICAgIGs6IG51bWJlciwgYW5nOiBudW1iZXIsIGZjOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XG5cbiAgICAgICAgbGV0IHBvbCA9IHRoaXMucG9pbnRzO1xuICAgICAgICBsZXQgc3VtMSA9IDA7XG4gICAgICAgIGxldCBzdW0yID0gMDtcbiAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pKTtcbiAgICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvbC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgIHBvbFtpXSksIFZlYzIuc3ViKHBvbFtpIC0gMV0sIHBvbFtpXSkpO1xuICAgICAgICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgfVxuICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzBdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSxcbiAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pKTtcbiAgICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgICAgICBpZiAoc3VtMiA8IHN1bTEpIHtcbiAgICAgICAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcG9sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB0ZW1wLnB1c2gocG9sW2ldKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gdGVtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUG9zQW5kTWFzcygpO1xuICAgICAgICB0aGlzLmxhc3RQb3MgPSB0aGlzLnBvcy5jb3B5O1xuICAgICAgICB0aGlzLmZjID0gMC40O1xuXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xuXG4gICAgICAgIGlmIChhbmcpIHRoaXMuYW5nID0gYW5nO1xuICAgICAgICBlbHNlIHRoaXMuYW5nID0gMDtcblxuICAgICAgICBpZiAoZmMgfHwgZmMgPT09IDApIHRoaXMuZmMgPSBmYztcblxuICAgICAgICBpZiAoaykgdGhpcy5rID0gaztcbiAgICAgICAgZWxzZSB0aGlzLmsgPSAwLjg7XG5cbiAgICAgICAgaWYgKHZlbCAhPSB1bmRlZmluZWQpIHRoaXMudmVsID0gdmVsLmNvcHk7XG4gICAgICAgIGVsc2UgdGhpcy52ZWwgPSBuZXcgVmVjMigwLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBjb3B5IG9mIHRoZSBib2R5IHRoYXQgaXMgbm90IGEgcmVmZXJlbmNlIHRvIGl0XG4gICAgICogQHJldHVybiB7Qm9keX0gVGhlIGNvcHkgb2YgdGhlIGJvZHlcbiAgICAgKi9cbiAgICBnZXQgY29weSgpOiBCb2R5IHtcbiAgICAgICAgbGV0IHBvaW50c0NvcHkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcG9pbnRzQ29weS5wdXNoKG5ldyBWZWMyKHRoaXMucG9pbnRzW2ldLngsIHRoaXMucG9pbnRzW2ldLnkpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0ID0gbmV3IEJvZHkocG9pbnRzQ29weSwgdGhpcy52ZWwuY29weSxcbiAgICAgICAgICAgIHRoaXMuaywgdGhpcy5hbmcsIHRoaXMuZmMpO1xuICAgICAgICByZXQucm90YXRpb24gPSB0aGlzLnJvdGF0aW9uO1xuICAgICAgICByZXQubGFzdFBvcyA9IHRoaXMubGFzdFBvcy5jb3B5O1xuICAgICAgICByZXQucG9zID0gdGhpcy5wb3MuY29weTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vdmVzIHRoZSBib2R5IGJ5IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuICAgICAqIEl0IGhhcyB0byBtb3ZlIGFsbCB0aGUgcG9pbnRzIG9mIHRoZSBib2R5IGFuZFxuICAgICAqIGFsc28gdGhlIGNlbnRyZSBvZiBtYXNzIChwb3MpIG9mIHRoZSBib2R5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAgICovXG4gICAgbW92ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvcy54ICs9IHg7XG4gICAgICAgIHRoaXMucG9zLnkgKz0geTtcbiAgICAgICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgcC54ICs9IHg7XG4gICAgICAgICAgICBwLnkgKz0geTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdGhhdCBkb2VzIHRoZSBjb2xsaXNpb24gZGV0ZWN0aW9uIGFuZFxuICAgICAqIGNvbGxpc2lvbiBiZWhhdmlvciBiZXR3ZWVuIHRoZSBib2R5IGFuZCBiYWxsXG4gICAgICogQHBhcmFtIHtCYWxsfSBiYWxsIFRoZSBiYWxsIHRvIGNvbGxpZGUgd2l0aCB0aGUgYm9keVxuICAgICAqL1xuICAgIGNvbGxpZGVXaXRoQmFsbChiYWxsOiBCYWxsKSB7XG4gICAgICAgIGxldCBoZWFkaW5nOiBudW1iZXI7XG4gICAgICAgIGxldCByZWw6IG51bWJlcjtcbiAgICAgICAgbGV0IGNwO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBwLnggLT0gYmFsbC5wb3MueDtcbiAgICAgICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICAgICAgaWYgKHAubGVuZ3RoIDw9IGJhbGwucikge1xuICAgICAgICAgICAgICAgIGhlYWRpbmcgPSBwLmhlYWRpbmcgKyBNYXRoLlBJO1xuICAgICAgICAgICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgbGV0IG1vdmUgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcbiAgICAgICAgICAgICAgICBtb3ZlLm11bHQoYmFsbC5yIC0gcmVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUobW92ZS54ICogLTEgKiBiYWxsLm0gLyAodGhpcy5tICsgYmFsbC5tKSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZS55ICogLTEgKiBiYWxsLm0gLyAodGhpcy5tICsgYmFsbC5tKSk7XG4gICAgICAgICAgICAgICAgYmFsbC5tb3ZlKG1vdmUueCAqIDEgKiB0aGlzLm0gLyAodGhpcy5tICsgYmFsbC5tKSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZS55ICogMSAqIHRoaXMubSAvICh0aGlzLm0gKyBiYWxsLm0pKTtcblxuICAgICAgICAgICAgICAgIGNwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIGEubXVsdCgtMzApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgbGV0IG5wID0gbmV3IFZlYzIodGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueSk7XG4gICAgICAgICAgICBsZXQgYnAgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFZlYzIobnAueCAtIHAueCwgbnAueSAtIHAueSk7XG4gICAgICAgICAgICBsZXQgaCA9IHNpZGUuaGVhZGluZztcbiAgICAgICAgICAgIHAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBucC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGJwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbGV0IGQgPSBicC55IC0gKChwLnkgKyBucC55KSAvIDIpO1xuICAgICAgICAgICAgaWYgKGQgPj0gLWJhbGwuciAmJiBkIDw9IGJhbGwuciAmJiBicC54ID49IG5wLnggJiYgYnAueCA8PSBwLngpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gaCAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHJlbCA9IGQ7XG5cbiAgICAgICAgICAgICAgICBsZXQgbW92ZSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIG1vdmUubXVsdChiYWxsLnIgLSByZWwpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZShtb3ZlLnggKiAtMSAqIGJhbGwubSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnkgKiAtMSAqIGJhbGwubSAvICh0aGlzLm0gKyBiYWxsLm0pKTtcbiAgICAgICAgICAgICAgICBiYWxsLm1vdmUobW92ZS54ICogMSAqIHRoaXMubSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlLnkgKiAxICogdGhpcy5tIC8gKHRoaXMubSArIGJhbGwubSkpO1xuXG4gICAgICAgICAgICAgICAgY3AgPSBiYWxsLnBvcy5jb3B5O1xuICAgICAgICAgICAgICAgIGNwLmFkZChWZWMyLm11bHQoVmVjMi5mcm9tQW5nbGUoaGVhZGluZyArIE1hdGguUEkpLCBkKSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuICAgICAgICAgICAgICAgIGEubXVsdCgtMzApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaGVhZGluZyA9PT0gMCB8fCBoZWFkaW5nKSB7XG4gICAgICAgICAgICBsZXQgdjEgPSB0aGlzLnZlbC5jb3B5O1xuICAgICAgICAgICAgbGV0IHYyID0gYmFsbC52ZWwuY29weTtcbiAgICAgICAgICAgIGxldCBhbmcxID0gdGhpcy5hbmc7XG4gICAgICAgICAgICBsZXQgYW5nMiA9IGJhbGwuYW5nO1xuICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIoY3AsIHRoaXMucG9zKTtcbiAgICAgICAgICAgIGxldCByMiA9IFZlYzIuc3ViKGNwLCBiYWxsLnBvcyk7XG4gICAgICAgICAgICBsZXQgYW0xID0gdGhpcy5hbTtcbiAgICAgICAgICAgIGxldCBhbTIgPSBiYWxsLmFtO1xuICAgICAgICAgICAgbGV0IG0xID0gdGhpcy5tO1xuICAgICAgICAgICAgbGV0IG0yID0gYmFsbC5tO1xuICAgICAgICAgICAgbGV0IGsgPSAodGhpcy5rICsgYmFsbC5rKSAvIDI7XG4gICAgICAgICAgICBsZXQgZmMgPSAodGhpcy5mYyArIGJhbGwuZmMpIC8gMjtcblxuICAgICAgICAgICAgbGV0IHYxdiA9IHIxLmNvcHk7XG4gICAgICAgICAgICBsZXQgdjJ2ID0gcjIuY29weTtcbiAgICAgICAgICAgIHYxdi5yb3RhdGUoTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdjJ2LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdjF2Lm11bHQoYW5nMSk7XG4gICAgICAgICAgICB2MnYubXVsdChhbmcyKTtcbiAgICAgICAgICAgIHYxdi5hZGQodjEpO1xuICAgICAgICAgICAgdjJ2LmFkZCh2Mik7XG5cbiAgICAgICAgICAgIHYxdi5yb3RhdGUoLWhlYWRpbmcpO1xuICAgICAgICAgICAgdjJ2LnJvdGF0ZSgtaGVhZGluZyk7XG5cbiAgICAgICAgICAgIGxldCBkdjF2eCA9ICgxICsgaykgKiAobTEgKiB2MXYueCArIG0yICogdjJ2LngpIC9cbiAgICAgICAgICAgICAgICAobTEgKyBtMikgLSAoayArIDEpICogdjF2Lng7XG4gICAgICAgICAgICBsZXQgZHYydnggPSAoMSArIGspICogKG0xICogdjF2LnggKyBtMiAqIHYydi54KSAvXG4gICAgICAgICAgICAgICAgKG0xICsgbTIpIC0gKGsgKyAxKSAqIHYydi54O1xuXG4gICAgICAgICAgICBsZXQgdmsgPSAodjF2LnkgKiBtMSArIHYydi55ICogbTIpIC8gKG0xICsgbTIpO1xuXG4gICAgICAgICAgICBsZXQgZHYxdnkgPSAtTWF0aC5zaWduKHYxdi55KSAqIGZjICogZHYxdng7XG4gICAgICAgICAgICBsZXQgZHYydnkgPSAtTWF0aC5zaWduKHYydi55KSAqIGZjICogZHYydng7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmsgLSB2MXYueSkgPiBNYXRoLmFicyhkdjF2eSkpIGR2MXZ5ID0gdmsgLSB2MXYueTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2ayAtIHYydi55KSA+IE1hdGguYWJzKGR2MnZ5KSkgZHYydnkgPSB2ayAtIHYydi55O1xuXG4gICAgICAgICAgICBsZXQgZHYxdiA9IG5ldyBWZWMyKGR2MXZ4LCBkdjF2eSk7XG4gICAgICAgICAgICBsZXQgZHYydiA9IG5ldyBWZWMyKGR2MnZ4LCBkdjJ2eSk7XG4gICAgICAgICAgICBkdjF2LnJvdGF0ZShoZWFkaW5nKTtcbiAgICAgICAgICAgIGR2MnYucm90YXRlKGhlYWRpbmcpO1xuXG4gICAgICAgICAgICB2MS5hZGQoZHYxdik7XG4gICAgICAgICAgICB2Mi5hZGQoZHYydik7XG5cbiAgICAgICAgICAgIGR2MXYucm90YXRlKC1yMS5oZWFkaW5nKTtcbiAgICAgICAgICAgIGR2MnYucm90YXRlKC1yMi5oZWFkaW5nKTtcblxuICAgICAgICAgICAgbGV0IGRhbmcxID0gKGR2MXYueSAqIG0xICogcjEubGVuZ3RoKSAvXG4gICAgICAgICAgICAgICAgKGFtMSArIHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIG0xKTtcbiAgICAgICAgICAgIGxldCBkYW5nMiA9IC0oZHYydi55ICogbTIgKiByMi5sZW5ndGgpIC9cbiAgICAgICAgICAgICAgICAoYW0yICsgcjIubGVuZ3RoICogcjIubGVuZ3RoICogbTIpO1xuXG4gICAgICAgICAgICBhbmcxICs9IGRhbmcxO1xuICAgICAgICAgICAgYW5nMiArPSBkYW5nMjtcblxuICAgICAgICAgICAgbGV0IHZwMSA9IFZlYzIuZnJvbUFuZ2xlKHIxLmhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2cDEubXVsdChyMS5sZW5ndGggKiBkYW5nMSk7XG4gICAgICAgICAgICBsZXQgdnAyID0gVmVjMi5mcm9tQW5nbGUocjIuaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIHZwMi5tdWx0KHIyLmxlbmd0aCAqIGRhbmcyKTtcbiAgICAgICAgICAgIHYyLnN1Yih2cDIpO1xuICAgICAgICAgICAgdjEuYWRkKHZwMSk7XG5cbiAgICAgICAgICAgIHRoaXMudmVsID0gdjE7XG4gICAgICAgICAgICBiYWxsLnZlbCA9IHYyO1xuXG4gICAgICAgICAgICB0aGlzLmFuZyA9IGFuZzE7XG4gICAgICAgICAgICBiYWxsLmFuZyA9IGFuZzI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBtYXNzLCBtb21lbnQgb2QgaW50ZXJ0aWEgYW5kXG4gICAgICogdGhlIGNlbnRyZSBvZiBtYXNzIG9mIHRoZSBib2R5XG4gICAgICovXG4gICAgY2FsY3VsYXRlUG9zQW5kTWFzcygpIHtcbiAgICAgICAgbGV0IHBvbGlnb25zOiBBcnJheTxBcnJheTxWZWMyPj4gPSBbXTtcbiAgICAgICAgcG9saWdvbnMucHVzaChbXSk7XG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHBvbGlnb25zWzBdLnB1c2gobmV3IFZlYzIocC54LCBwLnkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNDb25jYXZlKSB7XG4gICAgICAgICAgICBjb25zdCBpbmNsdWRlcyA9IChhcnI6IEFycmF5PG51bWJlcj4sIGl0ZW06IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJbaV0gPT09IGl0ZW0pIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgaW50ZXJzZWN0V2l0aFBvbGlnb24gPSBmdW5jdGlvbihzZWdtZW50OiBMaW5lU2VnbWVudCxcbiAgICAgICAgICAgICAgICBwb2w6IEFycmF5PFZlYzI+LCBleGNlcHRpb25zOiBBcnJheTxudW1iZXI+KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2wubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmNsdWRlcyhleGNlcHRpb25zLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpZGUgPSBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2ldLngsIHBvbFtpXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKExpbmVTZWdtZW50LmludGVyc2VjdChzZWdtZW50LCBzaWRlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGNoZWNrQWxsUG9saWdvbnM6IHdoaWxlIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2xpZ29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcG9sID0gcG9saWdvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coYSwgYik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtqXS54LCBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGVIZWFkaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3IFZlYzIobmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIShhLmhlYWRpbmcgPiBiLmhlYWRpbmcgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RXaXRoUG9saWdvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtqICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqICUgcG9sLmxlbmd0aF0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbCwgWyhwb2wubGVuZ3RoIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGsgLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wxID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGo7IGwgPD0gazsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMS5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGs7IGwgPD0gaiArIHBvbC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDIucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zW2ldID0gcG9sMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2gocG9sMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBjaGVja0FsbFBvbGlnb25zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgcG9sLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsoaiArIDEpICUgcG9sLmxlbmd0aF0sIHBvbFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IFZlYzIuc3ViKHBvbFtqIC0gMV0sIHBvbFtqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKGEsIGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgayA9IGogKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghKGEuaGVhZGluZyA+IGIuaGVhZGluZyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgMiAqIE1hdGguUEkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RXaXRoUG9saWdvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wsIFsoaiAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGsgLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wxID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gajsgbCA8PSBrOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMS5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDIucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2gocG9sMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgY2hlY2tBbGxQb2xpZ29ucztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSBwb2xpZ29ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgbGV0IHBvbCA9IHBvbGlnb25zW2ldO1xuICAgICAgICAgICAgd2hpbGUgKHBvbC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChbcG9sWzBdLCBwb2xbMV0sIHBvbFsyXV0pO1xuICAgICAgICAgICAgICAgIHBvbC5zcGxpY2UoMSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbVN1bSA9IDA7XG4gICAgICAgIGxldCBhbVN1bSA9IDA7XG4gICAgICAgIGxldCBwU3VtID0gbmV3IFZlYzIoMCwgMCk7XG4gICAgICAgIHBvbGlnb25zLmZvckVhY2goKHBvbCkgPT4ge1xuICAgICAgICAgICAgbGV0IGEgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzBdLnggLSBwb2xbMV0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFswXS55IC0gcG9sWzFdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBiID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsxXS54IC0gcG9sWzJdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMV0ueSAtIHBvbFsyXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYyA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMl0ueCAtIHBvbFswXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzJdLnkgLSBwb2xbMF0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IHMgPSAoYSArIGIgKyBjKSAvIDI7XG4gICAgICAgICAgICBsZXQgbSA9IE1hdGguc3FydChzICogKHMgLSBhKSAqIChzIC0gYikgKiAocyAtIGMpKTtcbiAgICAgICAgICAgIG1TdW0gKz0gbTtcbiAgICAgICAgICAgIHBTdW0ueCArPSBtICogKHBvbFswXS54ICsgcG9sWzFdLnggKyBwb2xbMl0ueCkgLyAzO1xuICAgICAgICAgICAgcFN1bS55ICs9IG0gKiAocG9sWzBdLnkgKyBwb2xbMV0ueSArIHBvbFsyXS55KSAvIDM7XG4gICAgICAgIH0pO1xuICAgICAgICBwU3VtLmRpdihtU3VtKTtcbiAgICAgICAgdGhpcy5wb3MgPSBwU3VtO1xuICAgICAgICB0aGlzLm0gPSBtU3VtO1xuXG4gICAgICAgIC8vIGNhbGN1bGF0aW5nIHRoZSBtb21lbnQgb2YgaW5lcnRpYSBmaW5hbGx5XG4gICAgICAgIGZvciAobGV0IHBvbCBvZiBwb2xpZ29ucykge1xuICAgICAgICAgICAgbGV0IGEgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzBdLnggLSBwb2xbMV0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFswXS55IC0gcG9sWzFdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBiID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsxXS54IC0gcG9sWzJdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMV0ueSAtIHBvbFsyXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYyA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMl0ueCAtIHBvbFswXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzJdLnkgLSBwb2xbMF0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IHcgPSBNYXRoLm1heChhLCBiLCBjKTtcbiAgICAgICAgICAgIGxldCBzID0gKGEgKyBiICsgYykgLyAyO1xuICAgICAgICAgICAgbGV0IG0gPSBNYXRoLnNxcnQocyAqIChzIC0gYSkgKiAocyAtIGIpICogKHMgLSBjKSk7XG4gICAgICAgICAgICBsZXQgaCA9IDIgKiBtIC8gdztcbiAgICAgICAgICAgIGxldCB3cGFydGlhbCA9IE1hdGguc3FydChNYXRoLm1pbihhLCBjLCBiKSAqKiAyIC0gaCAqIGgpO1xuICAgICAgICAgICAgbGV0IGFtID0gaCAqIHcgKiAoaCAqIGggKyB3ICogdykgLyAyNDtcbiAgICAgICAgICAgIGxldCBkID0gTWF0aC5zcXJ0KGggKiBoIC8gMzYgK1xuICAgICAgICAgICAgICAgIChNYXRoLmFicyh3cGFydGlhbCAtIHcgLyAyKSAvIDMpICoqIDIpO1xuICAgICAgICAgICAgYW0gLT0gZCAqIGQgKiBtO1xuICAgICAgICAgICAgYW0gKz0gbmV3IFZlYzIoKHBvbFswXS54ICsgcG9sWzFdLnggKyBwb2xbMl0ueCkgLyAzLFxuICAgICAgICAgICAgICAgIChwb2xbMF0ueSArIHBvbFsxXS55ICsgcG9sWzJdLnkpIC8gMykuZGlzdCh0aGlzLnBvcykgKiogMiAqIG07XG4gICAgICAgICAgICBhbVN1bSArPSBhbTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFtID0gYW1TdW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm90YXRlcyB0aGUgYm9keSBhcm91bmQgaXQncyBjZW50cmUgb2YgbWFzcyBieSBhIGdpdmVuIGFuZ2VcbiAgICAgKiBIYXMgdG8gZG8gdGhlIHRyYW5zZm9ybWF0aW9uIGZvciBhbGwgdGhlIHBvaW50c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSBSb3RhdGlvbiBhbmdsZVxuICAgICAqL1xuICAgIHJvdGF0ZShhbmdsZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGxldCBwb2ludCA9IG5ldyBWZWMyKHAueCwgcC55KTtcbiAgICAgICAgICAgIHBvaW50LnN1Yih0aGlzLnBvcyk7XG4gICAgICAgICAgICBwb2ludC5yb3RhdGUoYW5nbGUpO1xuICAgICAgICAgICAgcG9pbnQuYWRkKHRoaXMucG9zKTtcbiAgICAgICAgICAgIHAueCA9IHBvaW50Lng7XG4gICAgICAgICAgICBwLnkgPSBwb2ludC55O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiArPSBhbmdsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBvdXQgaWYgdGhlIGJvZHkgaXMgY29uY2F2ZSBvciBub3RcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSBib2R5IGlzIGNvbmNhdmVcbiAgICAgKi9cbiAgICBnZXQgaXNDb25jYXZlKCkge1xuICAgICAgICBsZXQgcG9sID0gdGhpcy5wb2ludHM7XG4gICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvbC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgIHBvbFtpXSksIFZlYzIuc3ViKHBvbFtpIC0gMV0sIHBvbFtpXSkpO1xuICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDJdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyB0aGUgY29sbGlzaW9uIGFsZ29yaXRobSBiZXR3ZWVuIHR3byBib2RpZXNcbiAgICAgKiBAcGFyYW0ge0JvZHl9IGIxIEZpcnN0IGJvZHlcbiAgICAgKiBAcGFyYW0ge0JvZHl9IGIyIFNlY29uZCBib2R5XG4gICAgICovXG4gICAgc3RhdGljIGNvbGxpZGUoYjE6IEJvZHksIGIyOiBCb2R5KSB7XG4gICAgICAgIGxldCBtYXRjaGVzID0gMDtcbiAgICAgICAgbGV0IGhlYWRpbmcgPSAwO1xuICAgICAgICBsZXQgY3AgPSBuZXcgVmVjMigwLCAwKTtcbiAgICAgICAgbGV0IGNwczogQXJyYXk8VmVjMj4gPSBbXTtcbiAgICAgICAgbGV0IGludGVyc2VjdCA9IGZhbHNlO1xuICAgICAgICBiMS5wb2ludHMuZm9yRWFjaCgocCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2lkZTEgPSBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocC54LCBwLnkpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICBiMS5wb2ludHNbKGlkeCArIDEpICUgYjEucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgYjEucG9pbnRzWyhpZHggKyAxKSAlIGIxLnBvaW50cy5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgIGIyLnBvaW50cy5mb3JFYWNoKChwcCwgaWR4eCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaWRlMiA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwcC54LCBwcC55KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICBiMi5wb2ludHNbKGlkeHggKyAxKSAlIGIyLnBvaW50cy5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICBiMi5wb2ludHNbKGlkeHggKyAxKSAlIGIyLnBvaW50cy5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICBsZXQgc2VjdCA9IExpbmVTZWdtZW50LmludGVyc2VjdChzaWRlMSwgc2lkZTIpO1xuICAgICAgICAgICAgICAgIGlmIChzZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMrKztcbiAgICAgICAgICAgICAgICAgICAgY3AuYWRkKHNlY3QpO1xuICAgICAgICAgICAgICAgICAgICBjcHMucHVzaChzZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFpbnRlcnNlY3QpIHJldHVybjtcbiAgICAgICAgY3AuZGl2KG1hdGNoZXMpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5mbG9vcihtYXRjaGVzIC8gMik7IGkrKykge1xuICAgICAgICAgICAgaGVhZGluZyArPSBWZWMyLnN1YihjcHNbMiAqIGkgKyAxXSwgY3BzWzIgKiBpXSkuaGVhZGluZztcbiAgICAgICAgfVxuICAgICAgICBoZWFkaW5nIC89IG1hdGNoZXMgLyAyO1xuICAgICAgICBoZWFkaW5nICs9IE1hdGguUEkgLyAyO1xuXG4gICAgICAgIGxldCBhID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG5cbiAgICAgICAgbGV0IG1vdmUxTWluID0gMDtcbiAgICAgICAgbGV0IG1vdmUxTWF4ID0gMDtcbiAgICAgICAgbGV0IG1vdmUyTWluID0gMDtcbiAgICAgICAgbGV0IG1vdmUyTWF4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgYjEucG9pbnRzKSB7XG4gICAgICAgICAgICBtb3ZlMU1pbiA9IE1hdGgubWluKFZlYzIuZG90KGEsXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIobmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSksIGNwKSksIG1vdmUxTWluKTtcbiAgICAgICAgICAgIG1vdmUxTWF4ID0gTWF0aC5tYXgoVmVjMi5kb3QoYSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSwgbW92ZTFNYXgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHBvaW50IG9mIGIyLnBvaW50cykge1xuICAgICAgICAgICAgbW92ZTJNaW4gPSBNYXRoLm1pbihWZWMyLmRvdChhLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLCBtb3ZlMk1pbik7XG4gICAgICAgICAgICBtb3ZlMk1heCA9IE1hdGgubWF4KFZlYzIuZG90KGEsXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIobmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSksIGNwKSksIG1vdmUyTWF4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTWF0aC5hYnMobW92ZTFNaW4gLSBtb3ZlMk1heCkgPCBNYXRoLmFicyhtb3ZlMk1pbiAtIG1vdmUxTWF4KSkge1xuICAgICAgICAgICAgYjEubW92ZSgtYS54ICogbW92ZTFNaW4sIC1hLnkgKiBtb3ZlMU1pbik7XG4gICAgICAgICAgICBiMi5tb3ZlKC1hLnggKiBtb3ZlMk1heCwgLWEueSAqIG1vdmUyTWF4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGIxLm1vdmUoLWEueCAqIG1vdmUxTWF4LCAtYS55ICogbW92ZTFNYXgpO1xuICAgICAgICAgICAgYjIubW92ZSgtYS54ICogbW92ZTJNaW4sIC1hLnkgKiBtb3ZlMk1pbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgayA9IChiMS5rICsgYjIuaykgLyAyO1xuICAgICAgICAvLyBsZXQgdmVsMXBhcnJhbGVsID0gVmVjMi5jcm9zcyhiMS52ZWwsIGEpO1xuICAgICAgICBsZXQgdmVsMXBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChiMS52ZWwsIGEpO1xuICAgICAgICAvLyBsZXQgdmVsMnBhcnJhbGVsID0gVmVjMi5jcm9zcyhiMi52ZWwsIGEpO1xuICAgICAgICBsZXQgdmVsMnBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChiMi52ZWwsIGEpO1xuXG4gICAgICAgIGxldCBuZXdWZWwxUGVycGVuZGljdWxhciA9ICgxICsgaykgKiAoKGIxLm0gKiB2ZWwxcGVycGVuZGljdWxhcikgK1xuICAgICAgICAgICAgKGIyLm0gKiB2ZWwycGVycGVuZGljdWxhcikpIC8gKGIxLm0gKyBiMi5tKSAtXG4gICAgICAgICAgICAoayAqIHZlbDFwZXJwZW5kaWN1bGFyKTtcbiAgICAgICAgbGV0IG5ld1ZlbDJQZXJwZW5kaWN1bGFyID0gKDEgKyBrKSAqICgoYjEubSAqIHZlbDFwZXJwZW5kaWN1bGFyKSArXG4gICAgICAgICAgICAoYjIubSAqIHZlbDJwZXJwZW5kaWN1bGFyKSkgLyAoYjEubSArIGIyLm0pIC1cbiAgICAgICAgICAgIChrICogdmVsMnBlcnBlbmRpY3VsYXIpO1xuXG4gICAgICAgIGIxLnZlbC5hZGQoVmVjMi5tdWx0KGEuY29weSwgbmV3VmVsMVBlcnBlbmRpY3VsYXIgLSB2ZWwxcGVycGVuZGljdWxhcikpO1xuICAgICAgICBiMi52ZWwuYWRkKFZlYzIubXVsdChhLmNvcHksIG5ld1ZlbDJQZXJwZW5kaWN1bGFyIC0gdmVsMnBlcnBlbmRpY3VsYXIpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNlZ21lbnQgb2YgYSBsaW5lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVTZWdtZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBhIFN0YXJ0aW5nIHBvaW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBiIEVuZGluZyBwb2ludFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhOiBWZWMyLCBwdWJsaWMgYjogVmVjMikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50XG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbGVuZ3RoXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVmVjMi5kaXN0KHRoaXMuYSwgdGhpcy5iKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gYSBwb2ludCBhbmQgdGhlIGxpbmUgc2VnbWVudFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcCBUaGUgcG9pbnQgYXMgYSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkaXN0YW5jZVxuICAgICAqL1xuICAgIGRpc3RGcm9tUG9pbnQocDogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBlID0gVmVjMi5zdWIodGhpcy5hLCB0aGlzLmIpO1xuICAgICAgICBsZXQgQSA9IFZlYzIuc3ViKHAsIHRoaXMuYik7XG4gICAgICAgIGxldCBCID0gVmVjMi5zdWIocCwgdGhpcy5hKTtcbiAgICAgICAgbGV0IGEgPSBBLmxlbmd0aDtcbiAgICAgICAgbGV0IGIgPSBCLmxlbmd0aDtcbiAgICAgICAgbGV0IGMgPSBlLmxlbmd0aDtcbiAgICAgICAgaWYgKGMgPT09IDApIHJldHVybiBhO1xuICAgICAgICBsZXQgZ2FtbWEgPSBWZWMyLmFuZ2xlKEEsIEIpO1xuICAgICAgICBsZXQgYmV0aGEgPSBWZWMyLmFuZ2xlKEEsIGUpO1xuICAgICAgICBsZXQgYWxwaGEgPSBNYXRoLlBJIC0gZ2FtbWEgLSBiZXRoYTtcbiAgICAgICAgbGV0IGFyZWEgPSBNYXRoLnNpbihhbHBoYSkgKiBiICogYyAvIDI7XG4gICAgICAgIGxldCBtID0gMiAqIGFyZWEgLyBjO1xuICAgICAgICBpZiAoYWxwaGEgPiBNYXRoLlBJIC8gMikgcmV0dXJuIGI7XG4gICAgICAgIGlmIChiZXRoYSA+IE1hdGguUEkgLyAyKSByZXR1cm4gYTtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGlmIHRoZXkgaW50ZXJzZWN0IG9yIG5vdFxuICAgICAqIElmIHRoZXkgaW50ZXJzZWN0IGl0IHJldHVybnMgdGhlIGludGVyc2VjdGlvbiBwb2ludFxuICAgICAqIElmIHRoZXkgbm90IGl0IHJldHVybnMgdW5kZWZpbmVkXG4gICAgICogQHBhcmFtIHtMaW5lU2VnbWVudH0gc2VnbWVudDEgQSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtMaW5lU2VnbWVudH0gc2VnbWVudDIgT3RoZXIgc2VnbWVudFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IEludGVyc2V0aW9uIHBvaW50XG4gICAgICovXG4gICAgc3RhdGljIGludGVyc2VjdChzZWdtZW50MTogTGluZVNlZ21lbnQsIHNlZ21lbnQyOiBMaW5lU2VnbWVudCk6IFZlYzIge1xuICAgICAgICBsZXQgdjEgPSBWZWMyLnN1YihzZWdtZW50MS5iLCBzZWdtZW50MS5hKTtcbiAgICAgICAgbGV0IGExID0gdjEueSAvIHYxLng7XG4gICAgICAgIGxldCBjMSA9IHNlZ21lbnQxLmIueSAtIChzZWdtZW50MS5iLnggKiBhMSk7XG5cbiAgICAgICAgbGV0IHYyID0gVmVjMi5zdWIoc2VnbWVudDIuYiwgc2VnbWVudDIuYSk7XG4gICAgICAgIGxldCBhMiA9IHYyLnkgLyB2Mi54O1xuICAgICAgICBsZXQgYzIgPSBzZWdtZW50Mi5iLnkgLSAoc2VnbWVudDIuYi54ICogYTIpO1xuXG4gICAgICAgIGlmICh2MS54ID09PSAwICYmIHYyLnggIT09IDApIHtcbiAgICAgICAgICAgIGlmICgoc2VnbWVudDEuYS54ID49IHNlZ21lbnQyLmEueCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQxLmEueCA8PSBzZWdtZW50Mi5iLngpIHx8XG4gICAgICAgICAgICAgICAgKHNlZ21lbnQxLmEueCA8PSBzZWdtZW50Mi5hLnggJiZcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudDEuYS54ID49IHNlZ21lbnQyLmIueCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgaCA9IGEyICogc2VnbWVudDEuYS54ICsgYzI7XG4gICAgICAgICAgICAgICAgaWYgKChoID4gc2VnbWVudDEuYS55ICYmIGggPCBzZWdtZW50MS5iLnkpIHx8XG4gICAgICAgICAgICAgICAgICAgIChoIDwgc2VnbWVudDEuYS55ICYmIGggPiBzZWdtZW50MS5iLnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMihzZWdtZW50MS5hLngsIGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYyLnggPT09IDAgJiYgdjEueCAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKChzZWdtZW50Mi5hLnggPj0gc2VnbWVudDEuYS54ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudDIuYS54IDw9IHNlZ21lbnQxLmIueCkgfHxcbiAgICAgICAgICAgICAgICAoc2VnbWVudDIuYS54IDw9IHNlZ21lbnQxLmEueCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50Mi5hLnggPj0gc2VnbWVudDEuYi54KSkge1xuICAgICAgICAgICAgICAgIGxldCBoID0gYTEgKiBzZWdtZW50Mi5hLnggKyBjMTtcbiAgICAgICAgICAgICAgICBpZiAoKGggPiBzZWdtZW50Mi5hLnkgJiYgaCA8IHNlZ21lbnQyLmIueSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGggPCBzZWdtZW50Mi5hLnkgJiYgaCA+IHNlZ21lbnQyLmIueSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQyLmEueCwgaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodjEueCA9PT0gMCAmJiB2Mi54ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoc2VnbWVudDEuYS54ID09PSBzZWdtZW50Mi5hLngpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwxO1xuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50MS5hLnkgPCBzZWdtZW50MS5iLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwxID0gW3NlZ21lbnQxLmEueSwgc2VnbWVudDEuYi55XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYi55LCBzZWdtZW50MS5hLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwyO1xuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50Mi5hLnkgPCBzZWdtZW50Mi5iLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwyID0gW3NlZ21lbnQyLmEueSwgc2VnbWVudDIuYi55XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYi55LCBzZWdtZW50Mi5hLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWwgPSBbKGludGVydmFsMVswXSA+IGludGVydmFsMlswXSkgP1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDFbMF0gOiBpbnRlcnZhbDJbMF0sXG4gICAgICAgICAgICAgICAgKGludGVydmFsMVsxXSA8IGludGVydmFsMlsxXSkgP1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDFbMV0gOiBpbnRlcnZhbDJbMV0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWxbMF0gPD0gaW50ZXJ2YWxbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQxLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW50ZXJ2YWwxO1xuICAgICAgICBpZiAoc2VnbWVudDEuYS54IDwgc2VnbWVudDEuYi54KSB7XG4gICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYS54LCBzZWdtZW50MS5iLnhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWwxID0gW3NlZ21lbnQxLmIueCwgc2VnbWVudDEuYS54XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwyO1xuICAgICAgICBpZiAoc2VnbWVudDIuYS54IDwgc2VnbWVudDIuYi54KSB7XG4gICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYS54LCBzZWdtZW50Mi5iLnhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWwyID0gW3NlZ21lbnQyLmIueCwgc2VnbWVudDIuYS54XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBbKGludGVydmFsMVswXSA+IGludGVydmFsMlswXSkgP1xuICAgICAgICAgICAgaW50ZXJ2YWwxWzBdIDogaW50ZXJ2YWwyWzBdLFxuICAgICAgICAoaW50ZXJ2YWwxWzFdIDwgaW50ZXJ2YWwyWzFdKSA/XG4gICAgICAgICAgICBpbnRlcnZhbDFbMV0gOiBpbnRlcnZhbDJbMV0sXG4gICAgICAgIF07XG4gICAgICAgIC8vIElmIHRoZXkgYXJlIHBhcnJhbGVsIHRoZSBvbmx5IHRpbWUgdGhleSBpbnRlcnNlY3QgaXMgd2hlbiBjMSA9PSBjMi5cbiAgICAgICAgaWYgKChhMSA9PT0gYTIpICYmIGMxID09PSBjMiAmJiBpbnRlcnZhbFswXSA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIsXG4gICAgICAgICAgICAgICAgKChpbnRlcnZhbFswXSArIGludGVydmFsWzFdKSAvIDIpICogYTEgKyBjMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHggPSAoYzIgLSBjMSkgLyAoYTEgLSBhMik7XG4gICAgICAgIGlmICh4ID49IGludGVydmFsWzBdICYmIHggPD0gaW50ZXJ2YWxbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMih4LCB4ICogYTEgKyBjMSk7XG4gICAgICAgIH0gZWxzZSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuaW1wb3J0IFdhbGwgZnJvbSAnLi93YWxsJztcbmltcG9ydCBMaW5lU2VnbWVudCBmcm9tICcuL2xpbmVzZWdtZW50JztcbmltcG9ydCBTdGljayBmcm9tICcuL3N0aWNrJztcbmltcG9ydCBTcHJpbmcgZnJvbSAnLi9zcHJpbmcnO1xuaW1wb3J0IFNvZnRCYWxsIGZyb20gJy4vc29mdGJhbGwnO1xuaW1wb3J0IEJvZHkgZnJvbSAnLi9ib2R5JztcblxuLyoqXG4gKiBDbGFzcyB0aGF0IGNyZWF0ZXMgYSBuZXcgd29ybGQgYmEgdGhlIHBoeXNpY3MgZW5naW5lXG4gKi9cbmNsYXNzIFBoeXNpY3Mge1xuICBiYWxsczogQXJyYXk8QmFsbD47XG4gIGJvZGllczogQXJyYXk8Qm9keT47XG4gIGZpeGVkQmFsbHM6IEFycmF5PHt4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCB9PlxuICBzb2Z0QmFsbHM6IEFycmF5PFNvZnRCYWxsPjtcbiAgd2FsbHM6IEFycmF5PFdhbGw+O1xuICBib3VuZHM6IEFycmF5PFdhbGw+O1xuICBzcHJpbmdzOiBBcnJheTxTcHJpbmc+O1xuICBhaXJGcmljdGlvbjogbnVtYmVyO1xuICBncmF2aXR5OiBWZWMyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIGluaXRhbGl6ZSBhIG5ldyB3b3JsZFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5iYWxscyA9IFtdO1xuICAgIHRoaXMuYm9kaWVzID0gW107XG4gICAgdGhpcy5maXhlZEJhbGxzID0gW107XG4gICAgdGhpcy5zb2Z0QmFsbHMgPSBbXTtcblxuICAgIHRoaXMud2FsbHMgPSBbXTtcblxuICAgIHRoaXMuYm91bmRzID0gW107XG5cbiAgICB0aGlzLnNwcmluZ3MgPSBbXTtcblxuICAgIC8vIEFpciBmcmljdGlvbiBoYXMgdG8gYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgLy8gMCAtIG5vIG1vdmVtZW50XG4gICAgLy8gMSAtIG5vIGZyaWN0aW9uXG4gICAgdGhpcy5haXJGcmljdGlvbiA9IDE7XG5cbiAgICB0aGlzLmdyYXZpdHkgPSBuZXcgVmVjMigwLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB3b3JsZCBieSBhIGdpdmVuIGFtb3VudCBvZiB0aW1lXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHByZWNpc2UgSWYgdGhpcyBpcyB0cnVlLFxuICAgKiB0aGVuIHRoZSBzaW11bGF0aW9uIGlzIGdvaW5nIHRvIGJlIG1vcmUgcHJlY2lzZVxuICAgKi9cbiAgdXBkYXRlKHQ6IG51bWJlciwgcHJlY2lzZTogYm9vbGVhbikge1xuICAgIC8vIERvIHRoZSBzaW11bGF0aW9uIG9uIHRoZSByZXZlcnNlZCBzeXN0ZW1cbiAgICAvLyBpZiB0aGUgc2ltdWxhdGlvbiBpcyBpbiBwcmVjaXNlIG1vZGVcbiAgICBsZXQgY2xvbmVkU3lzdGVtOiBQaHlzaWNzID0gcHJlY2lzZSA/IHRoaXMuY29weSA6IG5ldyBQaHlzaWNzKCk7XG4gICAgaWYgKHByZWNpc2UpIHtcbiAgICAgIGNsb25lZFN5c3RlbS5ib2RpZXMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLmJhbGxzLnJldmVyc2UoKTtcbiAgICAgIGNsb25lZFN5c3RlbS51cGRhdGUodCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIEF0IGZpcnN0IG1vdmUgb2JqZXRzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBNb3ZlXG4gICAgICB0aGlzLmJhbGxzW2ldLmxhc3RQb3MgPSB0aGlzLmJhbGxzW2ldLnBvcy5jb3B5O1xuICAgICAgdGhpcy5iYWxsc1tpXS5wb3MuYWRkKFZlYzIubXVsdCh0aGlzLmJhbGxzW2ldLnZlbCwgdCkpO1xuXG4gICAgICAvLyBBbmd1bGFyIHZlbG9jaXR5XG4gICAgICB0aGlzLmJhbGxzW2ldLnJvdGF0aW9uICs9IHRoaXMuYmFsbHNbaV0uYW5nICogdDtcbiAgICAgIHRoaXMuYmFsbHNbaV0ucm90YXRpb24gJT0gKE1hdGguUEkgKiAyKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5ib2RpZXNbaV0ubGFzdFBvcyA9IHRoaXMuYm9kaWVzW2ldLnBvcy5jb3B5O1xuICAgICAgdGhpcy5ib2RpZXNbaV0ubW92ZSh0aGlzLmJvZGllc1tpXS52ZWwueCAqIHQsIHRoaXMuYm9kaWVzW2ldLnZlbC55ICogdCk7XG4gICAgICB0aGlzLmJvZGllc1tpXS5yb3RhdGUodGhpcy5ib2RpZXNbaV0uYW5nICogdCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHNwcmluZ3MgbXVsdGlwbGUgdGltZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnNwcmluZ3MpIHtcbiAgICAgICAgZWxlbWVudC51cGRhdGUodCAvIDMgLyAyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYmFsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIEFwcGx5IGdyYXZpdHlcbiAgICAgIGlmICh0aGlzLmdyYXZpdHkpIHtcbiAgICAgICAgdGhpcy5iYWxsc1tpXS52ZWwuYWRkKFxuICAgICAgICAgIG5ldyBWZWMyKHRoaXMuZ3Jhdml0eS54ICogdCwgdGhpcy5ncmF2aXR5LnkgKiB0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvblxuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy5iYWxscy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAodGhpcy5iYWxsc1tpXS5sYXllciAhPSB0aGlzLmJhbGxzW2pdLmxheWVyIHx8XG4gICAgICAgICAgKCF0aGlzLmJhbGxzW2ldLmxheWVyICYmICF0aGlzLmJhbGxzW2pdLmxheWVyKSkge1xuICAgICAgICAgIEJhbGwuY29sbGlkZSh0aGlzLmJhbGxzW2ldLCB0aGlzLmJhbGxzW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb2xsaXNpb24gd2l0aCB3YWxsc1xuICAgICAgZm9yIChsZXQgd2FsbCBvZiB0aGlzLndhbGxzKSB7XG4gICAgICAgIHdhbGwuY29sbGlkZVdpdGhCYWxsKHRoaXMuYmFsbHNbaV0pO1xuICAgICAgfVxuXG4gICAgICAvLyBDb2xsaXNpb24gd2l0aCBmaXhlZCBiYWxsc1xuICAgICAgZm9yIChsZXQgYiBvZiB0aGlzLmZpeGVkQmFsbHMpIHtcbiAgICAgICAgbGV0IGJhbGwgPSB0aGlzLmJhbGxzW2ldO1xuXG4gICAgICAgIGxldCBoZWFkaW5nO1xuICAgICAgICBsZXQgcmVsID0gMDtcbiAgICAgICAgbGV0IHAgPSBuZXcgVmVjMihiLngsIGIueSk7XG4gICAgICAgIHAueCAtPSBiYWxsLnBvcy54O1xuICAgICAgICBwLnkgLT0gYmFsbC5wb3MueTtcbiAgICAgICAgcC5tdWx0KC0xKTtcbiAgICAgICAgaWYgKHAubGVuZ3RoIDw9IGJhbGwuciArIGIucikge1xuICAgICAgICAgIGhlYWRpbmcgPSBwLmhlYWRpbmc7XG4gICAgICAgICAgcmVsID0gcC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmaXhlZEJhbGxDb2xsaXNpb246IGlmIChoZWFkaW5nID09PSAwIHx8IGhlYWRpbmcpIHtcbiAgICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICAgICAgbGV0IHZlbCA9IG5ldyBWZWMyKGJhbGwudmVsLngsIGJhbGwudmVsLnkpO1xuICAgICAgICAgIHBvcy5yb3RhdGUoLWhlYWRpbmcgKyBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgdmVsLnJvdGF0ZSgtaGVhZGluZyArIE1hdGguUEkgLyAyKTtcblxuICAgICAgICAgIGlmICh2ZWwueSA+IDApIGJyZWFrIGZpeGVkQmFsbENvbGxpc2lvbjtcbiAgICAgICAgICB2ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgIHBvcy55ICs9IGJhbGwuciArIGIuciAtIHJlbDtcbiAgICAgICAgICBsZXQgZHZ5ID0gdmVsLnkgKiAoMSArICgxIC8gYmFsbC5rKSk7XG5cbiAgICAgICAgICBsZXQgZGVsdGFBbmcgPSBNYXRoLnNpZ24odmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKlxuICAgICAgICAgICAgKGR2eSAqIGJhbGwuZmMpIC8gKGJhbGwuYW1jICogYmFsbC5yKTtcbiAgICAgICAgICBsZXQgbWF4RGVsdGFBbmcgPSAodmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgLyBiYWxsLnI7XG5cbiAgICAgICAgICBpZiAoZGVsdGFBbmcgLyBtYXhEZWx0YUFuZyA+IDEpIGRlbHRhQW5nID0gbWF4RGVsdGFBbmc7XG4gICAgICAgICAgZGVsdGFBbmcgKj0gKGJhbGwuYW1jKSAvIChiYWxsLmFtYyArIDEpO1xuICAgICAgICAgIGJhbGwuYW5nICs9IGRlbHRhQW5nO1xuXG4gICAgICAgICAgbGV0IGR2eCA9IGRlbHRhQW5nICogYmFsbC5yO1xuXG4gICAgICAgICAgdmVsLnggLT0gZHZ4O1xuXG4gICAgICAgICAgcG9zLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgIHZlbC5yb3RhdGUoaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICBiYWxsLnBvcy54ID0gcG9zLng7XG4gICAgICAgICAgYmFsbC5wb3MueSA9IHBvcy55O1xuICAgICAgICAgIGJhbGwudmVsLnggPSB2ZWwueDtcbiAgICAgICAgICBiYWxsLnZlbC55ID0gdmVsLnk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQm91bmNlIG9mZiB0aGUgZWRnZXNcbiAgICAgIGZvciAobGV0IGJvdW5kIG9mIHRoaXMuYm91bmRzKSB7XG4gICAgICAgIGJvdW5kLmNvbGxpZGVXaXRoQmFsbCh0aGlzLmJhbGxzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBiYWxsIG9mIHRoaXMuYmFsbHMpIHtcbiAgICAgICAgaWYgKGJhbGwubGF5ZXIgIT0gdGhpcy5ib2RpZXNbaV0ubGF5ZXIgfHxcbiAgICAgICAgICAoIWJhbGwubGF5ZXIgJiYgIXRoaXMuYm9kaWVzW2ldLmxheWVyKSkge1xuICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLmNvbGxpZGVXaXRoQmFsbChiYWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLmJvZGllcy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAodGhpcy5ib2RpZXNbaV0ubGF5ZXIgIT0gdGhpcy5ib2RpZXNbal0ubGF5ZXIgfHxcbiAgICAgICAgICAoIXRoaXMuYm9kaWVzW2pdLmxheWVyICYmICF0aGlzLmJvZGllc1tpXS5sYXllcikpIHtcbiAgICAgICAgICBCb2R5LmNvbGxpZGUodGhpcy5ib2RpZXNbaV0sIHRoaXMuYm9kaWVzW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBncmF2aXR5XG4gICAgICBpZiAodGhpcy5ncmF2aXR5KSB7XG4gICAgICAgIHRoaXMuYm9kaWVzW2ldLnZlbC5hZGQoXG4gICAgICAgICAgbmV3IFZlYzIodGhpcy5ncmF2aXR5LnggKiB0LCB0aGlzLmdyYXZpdHkueSAqIHQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgc29mdCBiYWxsc1xuICAgIHRoaXMuc29mdEJhbGxzLmZvckVhY2goKHNiKSA9PiB7XG4gICAgICBTb2Z0QmFsbC51cGRhdGVQcmVzc3VyZUJhc2VkRm9yY2VzKHNiLCB0KTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzcHJpbmdzIGFnYWluIG11bHRpcGxlIHRpbWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5zcHJpbmdzKSB7XG4gICAgICAgIGVsZW1lbnQudXBkYXRlKHQgLyAzIC8gMik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgYWlyIGZyaWN0aW9uXG4gICAgdGhpcy5iYWxscy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICBiLnZlbC5tdWx0KE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpKTtcbiAgICAgIGIuYW5nICo9IChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgfSk7XG4gICAgdGhpcy5ib2RpZXMuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgYi52ZWwubXVsdChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgICBiLmFuZyAqPSAoTWF0aC5wb3codGhpcy5haXJGcmljdGlvbiwgdCkpO1xuICAgIH0pO1xuXG4gICAgLy8gVGhlbiB0YWtlIHRoZSBhdmVyYWdlIG9mIHRoaXMgc3lzdGVtIGFuZCB0aGUgb3RoZXIgc3lzdGVtXG4gICAgLy8gaWYgaW4gcHJlY2lzZSBtb2RlXG4gICAgaWYgKHByZWNpc2UpIHtcbiAgICAgIGNsb25lZFN5c3RlbS5ib2RpZXMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLmJhbGxzLnJldmVyc2UoKTtcblxuICAgICAgLy8gVGFrZSB0aGUgYXZlcmFnZSBvZiB0aGUgYmFsbHNcbiAgICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCwgaSkgPT4ge1xuICAgICAgICBiYWxsLm1vdmUoKGNsb25lZFN5c3RlbS5iYWxsc1tpXS5wb3MueCAtIGJhbGwucG9zLngpICogMC41LFxuICAgICAgICAgIChjbG9uZWRTeXN0ZW0uYmFsbHNbaV0ucG9zLnkgLSBiYWxsLnBvcy55KSAqIDAuNSk7XG4gICAgICAgIGJhbGwudmVsLmFkZChuZXcgVmVjMigoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnZlbC54IC0gYmFsbC52ZWwueCkgKiAwLjUsXG4gICAgICAgICAgKGNsb25lZFN5c3RlbS5iYWxsc1tpXS52ZWwueSAtIGJhbGwudmVsLnkpICogMC41KSk7XG4gICAgICAgIGJhbGwucm90YXRpb24gPSAoYmFsbC5yb3RhdGlvbiArIGNsb25lZFN5c3RlbS5iYWxsc1tpXS5yb3RhdGlvbikgLyAyO1xuICAgICAgICBiYWxsLmFuZyA9IChiYWxsLmFuZyArIGNsb25lZFN5c3RlbS5iYWxsc1tpXS5hbmcpIC8gMjtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUYWtlIHRoZSBhdmVyYWdlIG9mIHRoZSBib2RpZXNcbiAgICAgIHRoaXMuYm9kaWVzLmZvckVhY2goKGJvZHksIGkpID0+IHtcbiAgICAgICAgbGV0IG90aGVyID0gY2xvbmVkU3lzdGVtLmJvZGllc1tpXTtcbiAgICAgICAgYm9keS5tb3ZlKChvdGhlci5wb3MueCAtIGJvZHkucG9zLngpICogMC41LFxuICAgICAgICAgIChvdGhlci5wb3MueSAtIGJvZHkucG9zLnkpICogMC41KTtcbiAgICAgICAgYm9keS52ZWwuYWRkKG5ldyBWZWMyKChvdGhlci52ZWwueCAtIGJvZHkudmVsLngpICogMC41LFxuICAgICAgICAgIChvdGhlci52ZWwueSAtIGJvZHkudmVsLnkpICogMC41KSk7XG4gICAgICAgIGJvZHkucm90YXRlKChvdGhlci5yb3RhdGlvbiAtIGJvZHkucm90YXRpb24pIC8gMik7XG4gICAgICAgIGJvZHkuYW5nID0gKGJvZHkuYW5nICsgb3RoZXIuYW5nKSAvIDI7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzeXN0ZW1cbiAgICogQHJldHVybiB7UGh5c2ljc30gVGhlIGNvcHkgb2YgdGhpcyBzeXN0ZW1cbiAgICovXG4gIGdldCBjb3B5KCk6IFBoeXNpY3Mge1xuICAgIGxldCByZXQgPSBuZXcgUGh5c2ljcygpO1xuICAgIHJldC5iYWxscyA9IHRoaXMuZ2V0Q29weU9mQmFsbHMoKTtcbiAgICByZXQuYm9kaWVzID0gdGhpcy5nZXRDb3B5T2ZCb2RpZXMoKTtcbiAgICByZXQuZml4ZWRCYWxscyA9IHRoaXMuZml4ZWRCYWxscztcbiAgICByZXQud2FsbHMgPSB0aGlzLndhbGxzO1xuICAgIHJldC5ib3VuZHMgPSB0aGlzLmJvdW5kcztcbiAgICByZXQuZ3Jhdml0eSA9IHRoaXMuZ3Jhdml0eTtcblxuICAgIHRoaXMuc3ByaW5ncy5mb3JFYWNoKChzcHJpbmcpID0+IHtcbiAgICAgIGxldCBUeXBlT2ZTcHJpbmcgPSBzcHJpbmcuY29uc3RydWN0b3IgPT0gU3ByaW5nID8gU3ByaW5nIDogU3RpY2s7XG4gICAgICBsZXQgY29waWVkU3ByaW5nID0gbmV3IFR5cGVPZlNwcmluZyhzcHJpbmcubGVuZ3RoLFxuICAgICAgICBzcHJpbmcuc3ByaW5nQ29uc3RhbnQpO1xuICAgICAgY29waWVkU3ByaW5nLnJvdGF0aW9uTG9ja2VkID0gc3ByaW5nLnJvdGF0aW9uTG9ja2VkO1xuICAgICAgY29waWVkU3ByaW5nLnBpbm5lZCA9IHNwcmluZy5waW5uZWQ7XG5cbiAgICAgIHNwcmluZy5vYmplY3RzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICBsZXQgaWR4ID0gdGhpcy5iYWxscy5pbmRleE9mKG9iaik7XG4gICAgICAgIGlmIChpZHggIT0gLTEpIGNvcGllZFNwcmluZy5hdHRhY2hPYmplY3QocmV0LmJhbGxzW2lkeF0pO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZHggPSB0aGlzLmJvZGllcy5pbmRleE9mKG9iaik7XG4gICAgICAgICAgaWYgKGlkeCAhPSAtMSkgY29waWVkU3ByaW5nLmF0dGFjaE9iamVjdChyZXQuYm9kaWVzW2lkeF0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0LnNwcmluZ3MucHVzaChjb3BpZWRTcHJpbmcpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBaXIgZnJpY3Rpb24uIGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICogMCAtIG5vIG1vdmVtZW50XG4gICAqIDEgLSBubyBmcmljdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYWlyRnJpY3Rpb24gSGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgKi9cbiAgc2V0QWlyRnJpY3Rpb24oYWlyRnJpY3Rpb246IG51bWJlcikge1xuICAgIGlmICghaXNGaW5pdGUoYWlyRnJpY3Rpb24pKSByZXR1cm47XG4gICAgdGhpcy5haXJGcmljdGlvbiA9IGFpckZyaWN0aW9uO1xuICAgIGlmICh0aGlzLmFpckZyaWN0aW9uIDwgMCkgdGhpcy5haXJGcmljdGlvbiA9IDA7XG4gICAgaWYgKHRoaXMuYWlyRnJpY3Rpb24gPiAxKSB0aGlzLmFpckZyaWN0aW9uID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBncmF2aXR5IGluIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge1ZlYzJ9IGRpciBUaGUgYWNjZWxlcmF0aW9uIHZlY3RvciBvZiB0aGUgZ3Jhdml0eVxuICAgKi9cbiAgc2V0R3Jhdml0eShkaXI6IFZlYzIpIHtcbiAgICB0aGlzLmdyYXZpdHkgPSBkaXIuY29weTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IGJhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbCBCYWxsIHRvIGFkZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZEJhbGwoYmFsbDogQmFsbCkge1xuICAgIHRoaXMuYmFsbHMucHVzaChiYWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IGJvZHkgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7Qm9keX0gYm9keSBCb2R5IHRvIGFkZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZEJvZHkoYm9keTogQm9keSkge1xuICAgIHRoaXMuYm9kaWVzLnB1c2goYm9keSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBzb2Z0IGJhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7U29mdEJhbGx9IHNvZnRCYWxsIFNvZnRCYWxsIHRvIGJlIGFkZGVkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkU29mdEJhbGwoc29mdEJhbGw6IFNvZnRCYWxsKSB7XG4gICAgdGhpcy5iYWxscy5wdXNoKC4uLnNvZnRCYWxsLnBvaW50cyk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goLi4uc29mdEJhbGwuc2lkZXMpO1xuICAgIFxuICAgIHRoaXMuc29mdEJhbGxzLnB1c2goc29mdEJhbGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBuZXcgc29mdCBzcXVhcmUgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7VmVjMn0gcG9zIFRoZSBwb3NpdGlvbiBvZiB0aGUgc29mdCBzcXVhcmVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNpZGVTaXplIFRoZSBzaXplIG9mIHRoZSBzcXVhcmVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZjIEZyaWN0aW9uIGNvZWZmaWNpZW50XG4gICAqIEBwYXJhbSB7VmVjMn0gdmVsIFRoZSBpbml0aWFsIHZlbG9jaXR5IG9mIHRoZSBzb2Z0IHNxdWFyZVxuICAgKi9cbiAgYWRkU29mdFNxdWFyZShwb3M6IFZlYzIsIHNpZGVTaXplOiBudW1iZXIsIGZjOiBudW1iZXIsIHZlbDogVmVjMikge1xuICAgIGxldCBzb2Z0U3F1YXJlID0gbmV3IFNvZnRCYWxsKHBvcyxcbiAgICAgIE1hdGguc3FydChzaWRlU2l6ZSAqIHNpZGVTaXplIC8gTWF0aC5QSSksIDEsIGZjLCAyNCk7XG4gICAgc29mdFNxdWFyZS5zaWRlcy5mb3JFYWNoKChzaWRlKSA9PiB7XG4gICAgICBzaWRlLmxlbmd0aCA9ICgwLjk2ICogNCAqIHNpZGVTaXplIC8gc29mdFNxdWFyZS5yZXNvbHV0aW9uKTtcbiAgICB9KTtcbiAgICBzb2Z0U3F1YXJlLnBvaW50cy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICBiLnZlbCA9IHZlbC5jb3B5O1xuICAgIH0pO1xuXG4gICAgdGhpcy5iYWxscy5wdXNoKC4uLnNvZnRTcXVhcmUucG9pbnRzKTtcbiAgICB0aGlzLnNwcmluZ3MucHVzaCguLi5zb2Z0U3F1YXJlLnNpZGVzKTtcblxuICAgIGxldCBzcHJpbmdTdHJlbmd0aCA9IHNpZGVTaXplICogc2lkZVNpemUgKiAyMDA7XG5cbiAgICBsZXQgYmlnU3RpY2sgPSBuZXcgU3ByaW5nKFxuICAgICAgTWF0aC5zcXJ0KHNvZnRTcXVhcmUuciAqIHNvZnRTcXVhcmUuciAqIE1hdGguUEkpLCBzcHJpbmdTdHJlbmd0aCAvIDIpO1xuICAgIGJpZ1N0aWNrLmF0dGFjaE9iamVjdChzb2Z0U3F1YXJlLnBvaW50c1swXSk7XG4gICAgYmlnU3RpY2suYXR0YWNoT2JqZWN0KHNvZnRTcXVhcmUucG9pbnRzW3NvZnRTcXVhcmUucmVzb2x1dGlvbiAvIDJdKTtcbiAgICB0aGlzLnNwcmluZ3MucHVzaChiaWdTdGljayk7XG5cbiAgICBiaWdTdGljayA9IG5ldyBTcHJpbmcoXG4gICAgICBNYXRoLnNxcnQoc29mdFNxdWFyZS5yICogc29mdFNxdWFyZS5yICogTWF0aC5QSSksIHNwcmluZ1N0cmVuZ3RoIC8gMik7XG4gICAgYmlnU3RpY2suYXR0YWNoT2JqZWN0KHNvZnRTcXVhcmUucG9pbnRzW3NvZnRTcXVhcmUucmVzb2x1dGlvbiAvIDRdKTtcbiAgICBiaWdTdGljay5hdHRhY2hPYmplY3Qoc29mdFNxdWFyZS5wb2ludHNbMyAqIHNvZnRTcXVhcmUucmVzb2x1dGlvbiAvIDRdKTtcbiAgICB0aGlzLnNwcmluZ3MucHVzaChiaWdTdGljayk7XG5cbiAgICBiaWdTdGljayA9IG5ldyBTcHJpbmcoXG4gICAgICBNYXRoLnNxcnQoMiAqIHNvZnRTcXVhcmUuciAqIHNvZnRTcXVhcmUuciAqIE1hdGguUEkpLCBzcHJpbmdTdHJlbmd0aCk7XG4gICAgYmlnU3RpY2suYXR0YWNoT2JqZWN0KHNvZnRTcXVhcmUucG9pbnRzW3NvZnRTcXVhcmUucmVzb2x1dGlvbiAvIDhdKTtcbiAgICBiaWdTdGljay5hdHRhY2hPYmplY3Qoc29mdFNxdWFyZS5wb2ludHNbNSAqIHNvZnRTcXVhcmUucmVzb2x1dGlvbiAvIDhdKTtcbiAgICB0aGlzLnNwcmluZ3MucHVzaChiaWdTdGljayk7XG5cbiAgICBiaWdTdGljayA9IG5ldyBTcHJpbmcoXG4gICAgICBNYXRoLnNxcnQoMiAqIHNvZnRTcXVhcmUuciAqIHNvZnRTcXVhcmUuciAqIE1hdGguUEkpLCBzcHJpbmdTdHJlbmd0aCk7XG4gICAgYmlnU3RpY2suYXR0YWNoT2JqZWN0KHNvZnRTcXVhcmUucG9pbnRzWzMgKiBzb2Z0U3F1YXJlLnJlc29sdXRpb24gLyA4XSk7XG4gICAgYmlnU3RpY2suYXR0YWNoT2JqZWN0KHNvZnRTcXVhcmUucG9pbnRzWzcgKiBzb2Z0U3F1YXJlLnJlc29sdXRpb24gLyA4XSk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goYmlnU3RpY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSByZWN0YW5ndWxhciB3YWxsIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIHdhbGxcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IHdpZHRoIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoIGhlaWdodCBvZiB0aGUgcmVjdGFuZ3VsYXIgd2FsbFxuICAgKi9cbiAgYWRkUmVjdFdhbGwoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCAtIHcgLyAyLFxuICAgICAgeSAtIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4ICsgdyAvIDIsXG4gICAgICB5IC0gaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggKyB3IC8gMixcbiAgICAgIHkgKyBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCAtIHcgLyAyLFxuICAgICAgeSArIGggLyAyXG4gICAgKSk7XG4gICAgdGhpcy53YWxscy5wdXNoKG5ldyBXYWxsKHBvaW50cykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSByZWN0YW5ndWxhciBib2R5IHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IHdpZHRoIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoIGhlaWdodCBvZiB0aGUgcmVjdGFuZ3VsYXIgYm9keVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmMgZnJpY3Rpb24gY29lZmZpY2llbnQgb2YgdGhlIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IGsgY29lZmZpY2llbnQgb2YgcmVzdGl0dXRpb24gb2YgdGhlIGJvZHlcbiAgICovXG4gIGFkZFJlY3RCb2R5KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcixcbiAgICBmYzogbnVtYmVyLCBrOiBudW1iZXIpIHtcbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4IC0gdyAvIDIsXG4gICAgICB5IC0gaCAvIDJcbiAgICApKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgIHggKyB3IC8gMixcbiAgICAgIHkgLSBoIC8gMlxuICAgICkpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgeCArIHcgLyAyLFxuICAgICAgeSArIGggLyAyXG4gICAgKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICB4IC0gdyAvIDIsXG4gICAgICB5ICsgaCAvIDJcbiAgICApKTtcbiAgICB0aGlzLmJvZGllcy5wdXNoKG5ldyBCb2R5KHBvaW50cywgbmV3IFZlYzIoMCwgMCksIDAuNSwgMCwgMC4zKSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIGEgbmV3IHdhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7V2FsbH0gd2FsbCBXYWxsIHRvIGFwcGVuZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZFdhbGwod2FsbDogV2FsbCkge1xuICAgIHRoaXMud2FsbHMucHVzaCh3YWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgZml4ZWQgYmFsbCB0byB0aGUgd29ybGRcbiAgICogQSBmaXhlZCBiYWxsIGlzIGltbW92YWJsZSBhbmQgb3RoZXIgb2JqZWN0cyBjb2xsaWRlIHdpdGggaXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBmaXhlZCBiYWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgZml4ZWQgYmFsbFxuICAgKiBAcGFyYW0ge251bWJlcn0gciByYWRpdXMgb2YgdGhlIGZpeGVkIGJhbGxcbiAgICovXG4gIGFkZEZpeGVkQmFsbCh4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyKSB7XG4gICAgdGhpcy5maXhlZEJhbGxzLnB1c2goe1xuICAgICAgeDogeCwgeTogeSwgcjogcixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IHNwcmluZyB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtTcHJpbmd9IHNwcmluZyBTcHJpbmcgdG8gYWRkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkU3ByaW5nKHNwcmluZzogU3ByaW5nKSB7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goc3ByaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzaXplIG9mIHRoZSB3b3JsZCAod2l0aG91dCB0aGlzIHRoZSB3b3JsZFxuICAgKiBkb2VzIG5vdCBoYXZlIGJvdW5kcylcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBjZW50cmUgb2YgdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudHJlIG9mIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0gdyBXaWR0aCBvZiB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGggSGVpZ2h0IG9mIHRoZSB3b3JsZFxuICAgKi9cbiAgc2V0Qm91bmRzKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIHRoaXMuYm91bmRzID0gW107XG5cbiAgICBjb25zdCBnZXRSZWN0Qm9keSA9ICh4XzogbnVtYmVyLCB5XzogbnVtYmVyLCB3XzogbnVtYmVyLCBoXzogbnVtYmVyKSA9PiB7XG4gICAgICBsZXQgcG9pbnRzID0gW107XG4gICAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgICAgeF8gLSB3XyAvIDIsXG4gICAgICAgIHlfIC0gaF8gLyAyXG4gICAgICApKTtcbiAgICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKFxuICAgICAgICB4XyArIHdfIC8gMixcbiAgICAgICAgeV8gLSBoXyAvIDJcbiAgICAgICkpO1xuICAgICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoXG4gICAgICAgIHhfICsgd18gLyAyLFxuICAgICAgICB5XyArIGhfIC8gMlxuICAgICAgKSk7XG4gICAgICBwb2ludHMucHVzaChuZXcgVmVjMihcbiAgICAgICAgeF8gLSB3XyAvIDIsXG4gICAgICAgIHlfICsgaF8gLyAyXG4gICAgICApKTtcbiAgICAgIHJldHVybiBuZXcgV2FsbChwb2ludHMpO1xuICAgIH07XG5cbiAgICB0aGlzLmJvdW5kcy5wdXNoKGdldFJlY3RCb2R5KHggLSB3LCB5LCAyICogdywgMiAqIGgpKTtcbiAgICB0aGlzLmJvdW5kcy5wdXNoKGdldFJlY3RCb2R5KHggKyAyICogdywgeSwgMiAqIHcsIDIgKiBoKSk7XG4gICAgdGhpcy5ib3VuZHMucHVzaChnZXRSZWN0Qm9keSh4LCB5IC0gaCwgMiAqIHcsIGggKiAyKSk7XG4gICAgdGhpcy5ib3VuZHMucHVzaChnZXRSZWN0Qm9keSh4LCB5ICsgMiAqIGgsIDIgKiB3LCAyICogaCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBmb3IgYW55IG9iamVjdCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSB0aGVuIHJldHVybnMgaXRcbiAgICogUmV0dXJuIGZhbHNlIGlmIG5vdGhpbmcgaXMgZm91bmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgKiBAcmV0dXJuIHtCYWxsfSBUaGUgZm91bmQgb2JqZWN0XG4gICAqL1xuICBnZXRPYmplY3RBdENvb3JkaW5hdGVzKHg6IG51bWJlciwgeTogbnVtYmVyKTogQmFsbCB7XG4gICAgbGV0IHJldCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgdiA9IG5ldyBWZWMyKHgsIHkpO1xuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCkgPT4ge1xuICAgICAgaWYgKGJhbGwucG9zLmRpc3QodikgPCBiYWxsLnIpIHJldCA9IGJhbGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGNvcGllcyBvZiBhbGwgYmFsbHMgaW4gdGhlIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtBcnJheTxCYWxsPn0gVGhlIGFycmF5IG9mIHRoZSBjb3BpZWQgYmFsbHNcbiAgICovXG4gIGdldENvcHlPZkJhbGxzKCk6IEFycmF5PEJhbGw+IHtcbiAgICBsZXQgcmV0OiBBcnJheTxCYWxsPiA9IFtdO1xuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmV0LnB1c2goaXRlbS5jb3B5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgY29waWVzIG9mIGFsbCBib2RpZXMgaW4gdGhlIHN5c3RlbVxuICAgKiBAcmV0dXJuIHtBcnJheTxCb2R5Pn0gVGhlIGFycmF5IG9mIHRoZSBjb3BpZWQgYm9kaWVzXG4gICAqL1xuICBnZXRDb3B5T2ZCb2RpZXMoKTogQXJyYXk8Qm9keT4ge1xuICAgIGxldCByZXQ6IEFycmF5PEJvZHk+ID0gW107XG4gICAgdGhpcy5ib2RpZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmV0LnB1c2goaXRlbS5jb3B5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG59XG5cbmV4cG9ydCB7QmFsbH07XG5leHBvcnQge0JvZHl9O1xuZXhwb3J0IHtWZWMyfTtcbmV4cG9ydCB7V2FsbH07XG5leHBvcnQge0xpbmVTZWdtZW50fTtcbmV4cG9ydCB7U3ByaW5nfTtcbmV4cG9ydCB7U3RpY2t9O1xuZXhwb3J0IHtTb2Z0QmFsbH07XG5leHBvcnQge1BoeXNpY3N9O1xuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgU3RpY2sgZnJvbSAnLi9zdGljayc7XG5pbXBvcnQgTGluZVNlZ21lbnQgZnJvbSAnLi9saW5lc2VnbWVudCc7XG5pbXBvcnQgU3ByaW5nIGZyb20gJy4vc3ByaW5nJztcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzb2Z0Ym9keSBvYmplY3RcbiAqIFRoZXkgd29yayBsaWtlIGEgYmFsbCwgd2l0aCBwcmVzc3VyZSBpbnNpZGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29mdEJhbGwge1xuICAgIHBvaW50czogQXJyYXk8QmFsbD47XG4gICAgcHJlc3N1cmU6IG51bWJlcjtcbiAgICBmYzogbnVtYmVyO1xuICAgIHJlc29sdXRpb246IG51bWJlcjtcbiAgICByOiBudW1iZXI7XG4gICAgc2lkZXM6IEFycmF5PFNwcmluZz47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgU29mdEJhbGxcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvcyBUaGUgc3RhcnRpbmcgcG9zaXRpb24gb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIFRoZSByYWRpdXMgb2YgdGhlIHNvZnQgYmFsbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmVzc3VyZSBUaGUgXCJoYXJkbmVzc1wiIG9mIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVzb2x1dGlvbiBUaGUgbnVtYmVyIG9mIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIGJhbGxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb3M6IFZlYzIsIHI6IG51bWJlciwgcHJlc3N1cmU6IG51bWJlcixcbiAgICAgICAgZmM6IG51bWJlciwgcmVzb2x1dGlvbjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XG5cbiAgICAgICAgaWYgKGZjIHx8IGZjID09PSAwKSB0aGlzLmZjID0gZmM7XG4gICAgICAgIGVsc2UgdGhpcy5mYyA9IDAuNDtcblxuICAgICAgICB0aGlzLnByZXNzdXJlID0gcHJlc3N1cmU7XG5cbiAgICAgICAgaWYgKCFyZXNvbHV0aW9uKSB0aGlzLnJlc29sdXRpb24gPSAzMDtcbiAgICAgICAgZWxzZSB0aGlzLnJlc29sdXRpb24gPSByZXNvbHV0aW9uO1xuXG4gICAgICAgIHIgPSBNYXRoLmFicyhyKTtcbiAgICAgICAgdGhpcy5yID0gcjtcblxuICAgICAgICBsZXQgbGF5ZXJOdW1iZXI6IG51bWJlciA9IChNYXRoLnJhbmRvbSgpICogMTAwMDAwMCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlc29sdXRpb247IGkrKykge1xuICAgICAgICAgICAgbGV0IG5ld1BvcyA9IG5ldyBWZWMyKHBvcy54LCBwb3MueSk7XG4gICAgICAgICAgICBuZXdQb3MuYWRkKFZlYzIubXVsdChcbiAgICAgICAgICAgICAgICBWZWMyLmZyb21BbmdsZSgoaSAvIHRoaXMucmVzb2x1dGlvbikgKiBNYXRoLlBJICogMiksIHIpKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2gobmV3IEJhbGwobmV3UG9zLCBuZXcgVmVjMigwLCAwKSxcbiAgICAgICAgICAgICAgICByICogTWF0aC5zaW4oTWF0aC5QSSAvIHRoaXMucmVzb2x1dGlvbiksIDAsIDAsIHRoaXMuZmMpKTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLmxheWVyID0gbGF5ZXJOdW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNpZGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXNvbHV0aW9uOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFN0aWNrKDIgKiByICogTWF0aC5zaW4oTWF0aC5QSSAvIHRoaXMucmVzb2x1dGlvbikpO1xuICAgICAgICAgICAgc2lkZS5hdHRhY2hPYmplY3QodGhpcy5wb2ludHNbaV0pO1xuICAgICAgICAgICAgc2lkZS5hdHRhY2hPYmplY3QodGhpcy5wb2ludHNbKGkgKyAxKSAlIHRoaXMucmVzb2x1dGlvbl0pO1xuICAgICAgICAgICAgaWYgKGkgJSAyID09PSAwKSBzaWRlLmxvY2tSb3RhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5zaWRlcy5wdXNoKHNpZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcHJlc3N1cmUtYmFzZWQgZm9yY2VzIGluIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge1NvZnRCYWxsfSBzb2Z0QmFsbCBUaGUgc29mdCBiYWxsIHRvIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgICAqL1xuICAgIHN0YXRpYyB1cGRhdGVQcmVzc3VyZUJhc2VkRm9yY2VzKHNvZnRCYWxsOiBTb2Z0QmFsbCwgdDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBwb2xpZ29uczogQXJyYXk8QXJyYXk8VmVjMj4+ID0gW107XG4gICAgICAgIHBvbGlnb25zLnB1c2goW10pO1xuICAgICAgICBzb2Z0QmFsbC5wb2ludHMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgcG9saWdvbnNbMF0ucHVzaChuZXcgVmVjMihwLnBvcy54LCBwLnBvcy55KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgoZnVuY3Rpb24ocG9sKSB7XG4gICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pKTtcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgICAgIHBvbFtpXSksIFZlYzIuc3ViKHBvbFtpIC0gMV0sIHBvbFtpXSkpO1xuICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSkpO1xuICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pKHBvbGlnb25zWzBdKSkge1xuICAgICAgICAgICAgY29uc3QgaW5jbHVkZXMgPSAoYXJyOiBBcnJheTxudW1iZXI+LCBpdGVtOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyW2ldID09PSBpdGVtKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGludGVyc2VjdFdpdGhQb2xpZ29uID0gZnVuY3Rpb24oc2VnbWVudDogTGluZVNlZ21lbnQsXG4gICAgICAgICAgICAgICAgcG9sOiBBcnJheTxWZWMyPiwgZXhjZXB0aW9uczogQXJyYXk8bnVtYmVyPikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9sLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZXMoZXhjZXB0aW9ucywgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IExpbmVTZWdtZW50KG5ldyBWZWMyKHBvbFtpXS54LCBwb2xbaV0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChMaW5lU2VnbWVudC5pbnRlcnNlY3Qoc2VnbWVudCwgc2lkZSkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlO1xuXG4gICAgICAgICAgICBjaGVja0FsbFBvbGlnb25zOiB3aGlsZSAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9saWdvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvbCA9IHBvbGlnb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKGEsIGIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgayA9IGogKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbal0ueCwgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKS5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgMiAqIE1hdGguUEkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaiAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbaiAlIHBvbC5sZW5ndGhdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wsIFsocG9sLmxlbmd0aCAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wyLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKHBvbDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgY2hlY2tBbGxQb2xpZ29ucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IHBvbC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbKGogKyAxKSAlIHBvbC5sZW5ndGhdLCBwb2xbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGIgPSBWZWMyLnN1Yihwb2xbaiAtIDFdLCBwb2xbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIobmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi55IC0gbmV3U2lkZS5hLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIShhLmhlYWRpbmcgPiBiLmhlYWRpbmcgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKGogLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbal0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGo7IGwgPD0gazsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IGs7IGwgPD0gaiArIHBvbC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wyLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGlnb25zW2ldID0gcG9sMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKHBvbDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gcG9saWdvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgIHdoaWxlIChwb2wubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgIHBvbGlnb25zLnB1c2goW3BvbFswXSwgcG9sWzFdLCBwb2xbMl1dKTtcbiAgICAgICAgICAgICAgICBwb2wuc3BsaWNlKDEsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1TdW0gPSAwO1xuICAgICAgICBwb2xpZ29ucy5mb3JFYWNoKChwb2wpID0+IHtcbiAgICAgICAgICAgIGxldCBhID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFswXS54IC0gcG9sWzFdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMF0ueSAtIHBvbFsxXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgYiA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMV0ueCAtIHBvbFsyXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzFdLnkgLSBwb2xbMl0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGMgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzJdLnggLSBwb2xbMF0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsyXS55IC0gcG9sWzBdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBzID0gKGEgKyBiICsgYykgLyAyO1xuICAgICAgICAgICAgbGV0IG0gPSBNYXRoLnNxcnQocyAqIChzIC0gYSkgKiAocyAtIGIpICogKHMgLSBjKSk7XG4gICAgICAgICAgICBtU3VtICs9IG07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBvdmVyUHJlc3N1cmUgPSBzb2Z0QmFsbC5wcmVzc3VyZSAqXG4gICAgICAgICAgICAoKHNvZnRCYWxsLnIgKiBzb2Z0QmFsbC5yICogTWF0aC5QSSkgLyBtU3VtKVxuICAgICAgICAgICAgLSBzb2Z0QmFsbC5wcmVzc3VyZTtcbiAgICAgICAgc29mdEJhbGwuc2lkZXMuZm9yRWFjaCgoc2lkZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGZvcmNlID0gVmVjMi5zdWIoc2lkZS5vYmplY3RzWzBdLnBvcywgc2lkZS5vYmplY3RzWzFdLnBvcyk7XG4gICAgICAgICAgICBmb3JjZS5tdWx0KG92ZXJQcmVzc3VyZSk7XG4gICAgICAgICAgICBmb3JjZS5yb3RhdGUoTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgZm9yY2UubXVsdCh0KTtcbiAgICAgICAgICAgIHNpZGUub2JqZWN0c1swXS52ZWwuYWRkKFZlYzIuZGl2KGZvcmNlLCBzaWRlLm9iamVjdHNbMF0ubSkpO1xuICAgICAgICAgICAgc2lkZS5vYmplY3RzWzFdLnZlbC5hZGQoVmVjMi5kaXYoZm9yY2UsIHNpZGUub2JqZWN0c1sxXS5tKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc3RyaW5nXG4gKiBUaGV5IGFjdCBsaWtlIHNwcmluZ3MgaW4gcmVhbCBsaWZlXG4gKiBZb3UgY2FuIGF0dGFjaCBvdGhlciBvYmplY3RzIHRvIHRoZSBlbmRzIG9mIHRoZW1cbiAqIFRoZXkgZG8gbm90IGNvbGxpZGUgd2l0aCBvdGhlciBvYmplY3QgbmVpdGhlciB3aXRoIGVhY2ggb3RoZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaW5nIHtcbiAgICBsZW5ndGg6IG51bWJlcjtcbiAgICBzcHJpbmdDb25zdGFudDogbnVtYmVyO1xuICAgIHBpbm5lZDogYW55O1xuICAgIG9iamVjdHM6IEFycmF5PGFueT47XG4gICAgcm90YXRpb25Mb2NrZWQ6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgc3ByaW5nXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBUaGUgdW5zdHJlY2hlZCBsZW5ndGggb2YgdGhlIHNwcmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcHJpbmdDb25zdGFudCBTcHJpbmcgY29uc3RhbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihsZW5ndGg6IG51bWJlciwgc3ByaW5nQ29uc3RhbnQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5zcHJpbmdDb25zdGFudCA9IHNwcmluZ0NvbnN0YW50O1xuICAgICAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbkxvY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpbnMgb25lIHNpZGUgb2YgdGhlIHRoZSBzcHJpbmcgdG8gYSBnaXZlbiBjb29yZGluYXRlIGluIHNwYWNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAgICovXG4gICAgcGluSGVyZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnBpbm5lZCA9IHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHBpbm5lZCB0YWcgZnJvbSB0aGUgc3ByaW5nXG4gICAgICogWW91IGNhbiBub3cgYXR0YWNoIGl0IHRvIGFub3RoZXIgb2JqZWN0XG4gICAgICovXG4gICAgdW5waW4oKSB7XG4gICAgICAgIHRoaXMucGlubmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgb25lIGVuZCBvZiB0aGUgc3ByaW5nIHRvIGFuIG9iamVjdCAoZWcuIEJhbGwpXG4gICAgICogQHBhcmFtIHthbnl9IG9iamVjdCBUaGUgb2JqZWN0IHRoYXQgdGhlIHNwcmluZyBpcyBnZXR0aW5nIGF0dGFjaGVkIHRvXG4gICAgICovXG4gICAgYXR0YWNoT2JqZWN0KG9iamVjdDogYW55KSB7XG4gICAgICAgIGxldCBvYiA9IHRoaXMub2JqZWN0cztcbiAgICAgICAgb2IucHVzaChvYmplY3QpO1xuICAgICAgICBpZiAob2IubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvYi5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgb2IgPSBbb2Jbb2IubGVuZ3RoIC0gMl0sIG9iW29iLmxlbmd0aCAtIDFdXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2tzIHRoZSBvYmplY3RzIGF0dGFjaGVkIHRvIHRoZSBlbmRzIG9mIHRoZSBzcHJpbmdcbiAgICAgKiB0byBub3Qgcm90YXRlIGFyb3VuZCB0aGUgYXR0YWNoIHBvaW50XG4gICAgICovXG4gICAgbG9ja1JvdGF0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdGF0aW9uTG9ja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWxlYXNlcyB0aGUgb2JqZWN0cyBhdHRhY2hlZCB0byB0aGUgZW5kcyBvZiB0aGUgc3ByaW5nXG4gICAgICogdG8gcm90YXRlIGFyb3VuZCB0aGUgYXR0YWNoIHBvaW50XG4gICAgICovXG4gICAgdW5sb2NrUm90YXRpb24oKSB7XG4gICAgICAgIHRoaXMucm90YXRpb25Mb2NrZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBzcHJpbmcgYmF5IHRoZSBlbGFwc2VkIHRpbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICB1cGRhdGUodDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBwMTtcbiAgICAgICAgbGV0IHAyO1xuICAgICAgICBpZiAodGhpcy5waW5uZWQgJiYgdGhpcy5vYmplY3RzWzBdKSB7XG4gICAgICAgICAgICBwMiA9IHRoaXMucGlubmVkO1xuICAgICAgICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICAgICAgICBsZXQgZGlzdCA9IG5ldyBWZWMyKHAyLnggLSBwMS5wb3MueCwgcDIueSAtIHAxLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBkbCA9IGRpc3QubGVuZ3RoIC0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICBkaXN0LnNldE1hZygxKTtcbiAgICAgICAgICAgIGRpc3QubXVsdChkbCAqIHRoaXMuc3ByaW5nQ29uc3RhbnQgKiB0IC8gKHAxLm0pKTtcbiAgICAgICAgICAgIHAxLnZlbC54ICs9IGRpc3QueDtcbiAgICAgICAgICAgIHAxLnZlbC55ICs9IGRpc3QueTtcblxuICAgICAgICAgICAgbGV0IHYgPSBwMS52ZWw7XG4gICAgICAgICAgICB2LnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHMgPSBuZXcgVmVjMihwMi54LCBwMi55KTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMS5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAxLm0gKyBwMS5hbTtcbiAgICAgICAgICAgICAgICBsZXQgYW5nID0gKHAxLmFtICogcDEuYW5nIC0gcjIubGVuZ3RoICogcDEubSAqICh2LnkpKSAvIChhbSk7XG5cbiAgICAgICAgICAgICAgICB2LnkgPSAtYW5nICogcjIubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9iamVjdHNbMF0gJiYgdGhpcy5vYmplY3RzWzFdKSB7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIHAyID0gdGhpcy5vYmplY3RzWzFdO1xuICAgICAgICAgICAgbGV0IGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICAgICAgICBsZXQgZGwgPSBkaXN0Lmxlbmd0aCAtIHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoZGwgKiB0aGlzLnNwcmluZ0NvbnN0YW50ICogdCk7XG4gICAgICAgICAgICBwMi52ZWwuYWRkKFZlYzIuZGl2KGRpc3QsIHAyLm0pKTtcbiAgICAgICAgICAgIHAxLnZlbC5hZGQoVmVjMi5kaXYoZGlzdCwgLXAxLm0pKTtcblxuICAgICAgICAgICAgZGlzdCA9IFZlYzIuc3ViKHAxLnBvcywgcDIucG9zKTtcbiAgICAgICAgICAgIGxldCB2MSA9IHAxLnZlbDtcbiAgICAgICAgICAgIGxldCB2MiA9IHAyLnZlbDtcbiAgICAgICAgICAgIHYxLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgICAgIHYyLnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAxLnBvcy54ICogcDEubSArIHAyLnBvcy54ICogcDIubSxcbiAgICAgICAgICAgICAgICAgICAgcDEucG9zLnkgKiBwMS5tICsgcDIucG9zLnkgKiBwMi5tKTtcbiAgICAgICAgICAgICAgICBzLmRpdihwMS5tICsgcDIubSk7XG4gICAgICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMi5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIHAxLm0gKyBwMS5hbSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAyLm0gKyBwMi5hbTtcbiAgICAgICAgICAgICAgICBsZXQgc3YgPSAodjEueSAtIHYyLnkpICogcjIubGVuZ3RoIC9cbiAgICAgICAgICAgICAgICAgICAgKHIxLmxlbmd0aCArIHIyLmxlbmd0aCkgKyB2Mi55O1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgKyBwMi5hbSAqIHAyLmFuZyAtXG4gICAgICAgICAgICAgICAgICAgIHIxLmxlbmd0aCAqIHAxLm0gKiAodjEueSAtIHN2KSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHAyLm0gKiAodjIueSAtIHN2KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdjEueSA9IC1hbmcgKiByMS5sZW5ndGggKyBzdjtcbiAgICAgICAgICAgICAgICB2Mi55ID0gK2FuZyAqIHIyLmxlbmd0aCArIHN2O1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgICAgIHAyLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdjEucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgU3ByaW5nIGZyb20gJy4vc3ByaW5nJztcblxuLyoqXG4gKiBTdGljayBjbGFzcyBmb3IgdGhlIHBoeXNpY3MgZW5naW5lXG4gKiBTdGlja3MgYXJlIG5vdCBzdHJlY2hhYmxlIG9iamVjdHMgdGhhdCBkbyBub3QgY29sbGlkZVxuICogd2l0aCBvdGhlciBvYmplY3RzIGJ1dCB0aGV5IGNhbiBob2xkIG90aGVyIG9iamVjdHMgb24gdGhlaXIgZW5kc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGljayBleHRlbmRzIFNwcmluZyB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHN0aWNrXG4gICAgICogQHBhcmFtIHtudWJlcn0gbGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHN0aWNrXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIobGVuZ3RoLCAwKTtcbiAgICAgICAgdGhpcy5zcHJpbmdDb25zdGFudCA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc3RpY2sgdHJvdWdoIGFuIGVsYXBzZWQgdGltZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgICAqL1xuICAgIHVwZGF0ZSh0OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHAxO1xuICAgICAgICBsZXQgcDI7XG4gICAgICAgIGlmICh0aGlzLnBpbm5lZCAmJiB0aGlzLm9iamVjdHNbMF0pIHtcbiAgICAgICAgICAgIHAyID0gdGhpcy5waW5uZWQ7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIGxldCBkaXN0ID0gbmV3IFZlYzIocDIueCAtIHAxLnBvcy54LCBwMi55IC0gcDEucG9zLnkpO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoLXRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgIHAxLm1vdmUoLXAxLnBvcy54ICsgcDIueCArIGRpc3QueCwgLXAxLnBvcy55ICsgcDIueSArIGRpc3QueSk7XG5cbiAgICAgICAgICAgIGxldCB2ID0gcDEudmVsO1xuICAgICAgICAgICAgdi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2LnggPSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGlvbkxvY2tlZCkge1xuICAgICAgICAgICAgICAgIGxldCBzID0gbmV3IFZlYzIocDIueCwgcDIueSk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMS5tICsgcDEuYW07XG4gICAgICAgICAgICAgICAgbGV0IGFuZyA9IChwMS5hbSAqIHAxLmFuZyAtIHIyLmxlbmd0aCAqIHAxLm0gKiAodi55KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdi55ID0gLWFuZyAqIHIyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9iamVjdHNbMF0gJiYgdGhpcy5vYmplY3RzWzFdKSB7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIHAyID0gdGhpcy5vYmplY3RzWzFdO1xuXG4gICAgICAgICAgICBsZXQgZGlzdCA9IFZlYzIuc3ViKHAxLnBvcywgcDIucG9zKTtcbiAgICAgICAgICAgIGxldCBkbCA9IHRoaXMubGVuZ3RoIC0gZGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBkaXN0LnNldE1hZygxKTtcbiAgICAgICAgICAgIGxldCBtb3ZlMSA9IFZlYzIubXVsdChkaXN0LCBkbCAqIChwMi5tKSAvICgocDEubSkgKyAocDIubSkpKTtcbiAgICAgICAgICAgIGxldCBtb3ZlMiA9IFZlYzIubXVsdChkaXN0LCAtZGwgKiAocDEubSkgLyAoKHAxLm0pICsgKHAyLm0pKSk7XG4gICAgICAgICAgICBwMS5tb3ZlKG1vdmUxLngsIG1vdmUxLnkpO1xuICAgICAgICAgICAgcDIubW92ZShtb3ZlMi54LCBtb3ZlMi55KTtcblxuICAgICAgICAgICAgbGV0IHYxID0gcDEudmVsO1xuICAgICAgICAgICAgbGV0IHYyID0gcDIudmVsO1xuICAgICAgICAgICAgdjEucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjEueCA9IHYyLnggPSAocDEubSAqIHYxLnggKyBwMi5tICogdjIueCkgLyAoKHAxLm0pICsgKHAyLm0pKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAxLnBvcy54ICogcDEubSArIHAyLnBvcy54ICogcDIubSxcbiAgICAgICAgICAgICAgICAgICAgcDEucG9zLnkgKiBwMS5tICsgcDIucG9zLnkgKiBwMi5tKTtcbiAgICAgICAgICAgICAgICBzLmRpdihwMS5tICsgcDIubSk7XG4gICAgICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMi5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIHAxLm0gKyBwMS5hbSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAyLm0gKyBwMi5hbTtcbiAgICAgICAgICAgICAgICBsZXQgc3YgPSAodjEueSAtIHYyLnkpICogcjIubGVuZ3RoIC9cbiAgICAgICAgICAgICAgICAgICAgKHIxLmxlbmd0aCArIHIyLmxlbmd0aCkgKyB2Mi55O1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgKyBwMi5hbSAqIHAyLmFuZyAtXG4gICAgICAgICAgICAgICAgICAgIHIxLmxlbmd0aCAqIHAxLm0gKiAodjEueSAtIHN2KSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHAyLm0gKiAodjIueSAtIHN2KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdjEueSA9IC1hbmcgKiByMS5sZW5ndGggKyBzdjtcbiAgICAgICAgICAgICAgICB2Mi55ID0gK2FuZyAqIHIyLmxlbmd0aCArIHN2O1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgICAgIHAyLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdjEucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIGV2ZXJ5IGFuZ2xlIGlzIGNvdW50ZXJjbG9ja3dpc2UgKGFudGljbG9ja3dpc2UpXG4vKiogQ2xhc3MgcmVwcmVzZW50aW5nIGEgMmQgdmVjdG9yLiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMiB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgdmFsdWUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGNvcHkgb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgY29weS5cbiAgICAgKi9cbiAgICBnZXQgY29weSgpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGxlbmd0aC5cbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yIHNxdWFyZWQuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbGVuZ3RoIHNxdWFyZWQuXG4gICAgICovXG4gICAgZ2V0IHNxbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBoZWFkaW5nIG9mIHRoZSB2ZWN0b3IgY29tcGFyZWQgdG8gKDEsIDApLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGFuZ2xlIGJldHdlZW4gKDEsIDApXG4gICAgICogYW5kIHRoZSB2ZWN0b3IgaW4gYW50aWNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICovXG4gICAgZ2V0IGhlYWRpbmcoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMueCA9PT0gMCAmJiB0aGlzLnkgPT09IDApIHJldHVybiAwO1xuICAgICAgICBpZiAodGhpcy54ID09PSAwKSByZXR1cm4gdGhpcy55ID4gMCA/IE1hdGguUEkgLyAyIDogMS41ICogTWF0aC5QSTtcbiAgICAgICAgaWYgKHRoaXMueSA9PT0gMCkgcmV0dXJuIHRoaXMueCA+IDAgPyAwIDogTWF0aC5QSTtcbiAgICAgICAgbGV0IHYgPSBWZWMyLm5vcm1hbGl6ZWQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnggPiAwICYmIHRoaXMueSA+IDApIHJldHVybiBNYXRoLmFzaW4odi55KTtcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgJiYgdGhpcy55ID4gMCkgcmV0dXJuIE1hdGguYXNpbigtdi54KSArIE1hdGguUEkgLyAyO1xuICAgICAgICBpZiAodGhpcy54IDwgMCAmJiB0aGlzLnkgPCAwKSByZXR1cm4gTWF0aC5hc2luKC12LnkpICsgTWF0aC5QSTtcbiAgICAgICAgaWYgKHRoaXMueCA+IDAgJiYgdGhpcy55IDwgMCkgcmV0dXJuIE1hdGguYXNpbih2LngpICsgMS41ICogTWF0aC5QSTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhbm90aGVyIHZlY3RvciB0byB0aGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICovXG4gICAgYWRkKGE6IFZlYzIpIHtcbiAgICAgICAgdGhpcy54ICs9IGEueDtcbiAgICAgICAgdGhpcy55ICs9IGEueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgYW5vdGhlciB2ZWN0b3IgZnJvbSB0aGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICovXG4gICAgc3ViKGE6IFZlYzIpIHtcbiAgICAgICAgdGhpcy54IC09IGEueDtcbiAgICAgICAgdGhpcy55IC09IGEueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIG11bHQoeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCAqPSB4O1xuICAgICAgICB0aGlzLnkgKj0geDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIGRpdih4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54IC89IHg7XG4gICAgICAgIHRoaXMueSAvPSB4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpbmVhcnJ5IGludGVycG9sYXRlcyB0aGUgdmVjdG9yIGludG8gdGhlIG90aGVyIHZlY3RvciBieSBzY2FsYXIgeC5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG90aGVyIC0gVGhlIG90aGVyIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBzY2FsYXIuXG4gICAgICovXG4gICAgbGVycChvdGhlcjogVmVjMiwgeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCArPSAob3RoZXIueCAtIHRoaXMueCkgKiB4O1xuICAgICAgICB0aGlzLnkgKz0gKG90aGVyLnkgLSB0aGlzLnkpICogeDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHZlY3RvciBhbmQgdGhlIG90aGVyIHZlY3Rvci5cbiAgICAgKiBWZWN0b3JzIGFyZSByZXByZXNlbnRpbmcgcG9pbnRzIGhlcmUuXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdGhlciAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtLlxuICAgICAqL1xuICAgIGRpc3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKG5ldyBWZWMyKHRoaXMueCAtIG90aGVyLngsIHRoaXMueSAtIG90aGVyLnkpKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbCAtIFRoZSBuZXcgbGVuZ3RoIHZhbHVlLlxuICAgICAqL1xuICAgIHNldE1hZyhsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMubXVsdChsIC8gdGhpcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJvdGF0ZSB0aGUgdmVjdG9yIGFudGljbG9ja3dpc2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gUm90YXRpb24gYW5nbGUuXG4gICAgICovXG4gICAgcm90YXRlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGggPSB0aGlzLmhlYWRpbmc7XG4gICAgICAgIGxldCB2ID0gVmVjMi5mcm9tQW5nbGUoYW5nbGUgKyBoKTtcbiAgICAgICAgdi5tdWx0KHRoaXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgfVxuXG5cbiAgICAvLyBTdGF0aWMgZnVuY3Rpb25zOlxuICAgIC8qKlxuICAgICAqIEFkZCB0d28gdmVjdG9ycyB0b2dldGhlci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBzdW0gb2YgdGhlIHZlY3RvcnMuXG4gICAgICovXG4gICAgc3RhdGljIGFkZChhOiBWZWMyLCBiOiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihhLnggKyBiLngsIGEueSArIGIueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSBhbm90aGVyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIHN1YnRyYWN0aW9uIG9mIHRoZSB2ZWN0b3JzLlxuICAgICAqL1xuICAgIHN0YXRpYyBzdWIoYTogVmVjMiwgYjogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoYS54IC0gYi54LCBhLnkgLSBiLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtWZWMyfSB2IC0gVmVjdG9yLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gU2NhbGFyLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBtdWx0aXBsaWVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdCh2OiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHYueCAqIHgsIHYueSAqIHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpdmlkZSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gdiAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFNjYWxhci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgZGl2aWRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgc3RhdGljIGRpdih2OiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHYueCAvIHgsIHYueSAvIHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHVuaXQgdmVjdG9yIGZyb20gYW4gYW5nbGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSBUaGUgYW5nbGUuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNyZWF0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tQW5nbGUoYTogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpbmVhcnJ5IGludGVycG9sYXRlcyBhIHZlY3RvciBpbnRvIGFub3RoZXIgdmVjdG9yIGJ5IHNjYWxhciB4LlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBzY2FsYXIuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNyZWF0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBsZXJwKGE6IFZlYzIsIGI6IFZlYzIsIHg6IG51bWJlcik6IFZlYzIge1xuICAgICAgICByZXR1cm4gVmVjMi5hZGQoYSwgVmVjMi5tdWx0KFZlYzIuc3ViKGIsIGEpLCB4KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtLlxuICAgICAqL1xuICAgIHN0YXRpYyBkaXN0KGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVmVjMi5zdWIoYSwgYikubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZG90KGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBjcm9zcyBwcm9kdWN0IG9mIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGNyb3NzKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gYS54ICogYi55IC0gYS55ICogYi54O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgYW5nbGUgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEFuZ2xlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGUoYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjMi5kb3QoYSwgYikgLyBNYXRoLnNxcnQoYS5zcWxlbmd0aCAqIGIuc3FsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIHZlY3RvcnMgYnV0IGluIHRoZSBhbnRpY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEFuZ2xlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGVBQ1coYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBhaCA9IGEuaGVhZGluZztcbiAgICAgICAgbGV0IGJoID0gYi5oZWFkaW5nO1xuICAgICAgICBsZXQgYW5nbGUgPSBiaCAtIGFoO1xuICAgICAgICByZXR1cm4gYW5nbGUgPCAwID8gMiAqIE1hdGguUEkgKyBhbmdsZSA6IGFuZ2xlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIHZlY3RvciB3aXRoIHRoZSBzYW1lIGhlYWRpbmcgd2l0aCB0aGUgaW5wdXQgdmVjdG9yXG4gICAgICogYnV0IHdpdGggbGVuZ3RoID0gMS5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHYgLSBBIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBWZWN0b3Igd2l0aCBsZW5ndGggPSAwLlxuICAgICAqL1xuICAgIHN0YXRpYyBub3JtYWxpemVkKHY6IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgbGV0IGwgPSB2Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGwgPT09IDAgPyB2IDogbmV3IFZlYzIodi54IC8gbCwgdi55IC8gbCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5cbi8qKiBDbGFzcyByZXByZXNlbnRpbmcgYSB3YWxsXG4gKiBXYWxscyBhcmUgb2JqZWN0cyB0aGF0IGFyZSBpbW1vdmFibGUgIGFuZCB0aGV5IGFyZSByaWdpZFxuICogSXQgY2FuIGJlIGNvbnZleCBvciBjb25jYXZlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGwge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHdhbGxcbiAgICAgKiBAcGFyYW0ge0FycmF5PFZlYzI+fSBwb2ludHMgQXJyYXkgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCB0aGUgd2FsbFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb2ludHM6IEFycmF5PFZlYzI+KSB7XG4gICAgICAgIGxldCBwb2wgPSB0aGlzLnBvaW50cztcbiAgICAgICAgbGV0IHN1bTEgPSAwO1xuICAgICAgICBsZXQgc3VtMiA9IDA7XG4gICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXSxcbiAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDJdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgaWYgKHN1bTIgPiBzdW0xKSByZXR1cm47XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwb2wubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHRlbXAucHVzaChwb2xbaV0pO1xuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gZm9yIGNvbGxpc2lvbiBkZXRlY3Rpb24gYW5kIGJlaGF2aW9yIGJldHdlZW4gYmFsbHMgYW5kIHdhbGxzXG4gICAgICogQHBhcmFtIHtCYWxsfSBiYWxsIFRoZSBiYWxsIHRoYXQgaXMgY2hlY2tlZCBpZiBpdCBjb2xsaWRlcyB3aXRoIHRoZSB3YWxsXG4gICAgICovXG4gICAgY29sbGlkZVdpdGhCYWxsKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGhlYWRpbmc6IG51bWJlcjtcbiAgICAgICAgbGV0IHJlbDogbnVtYmVyO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBwLnggLT0gYmFsbC5wb3MueDtcbiAgICAgICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICAgICAgcC5tdWx0KC0xKTtcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA8PSBiYWxsLnIpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gcC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgbGV0IG5wID0gbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueSk7XG4gICAgICAgICAgICBsZXQgYnAgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFZlYzIobnAueCAtIHAueCwgbnAueSAtIHAueSk7XG4gICAgICAgICAgICBsZXQgaCA9IHNpZGUuaGVhZGluZztcbiAgICAgICAgICAgIHAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBucC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGJwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbGV0IGQgPSBicC55IC0gKChwLnkgKyBucC55KSAvIDIpO1xuICAgICAgICAgICAgaWYgKGQgPj0gLWJhbGwuciAmJiBkIDw9IGJhbGwuciAmJiBicC54ID49IG5wLnggJiYgYnAueCA8PSBwLngpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gaCAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHJlbCA9IGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChoZWFkaW5nID09PSAwIHx8IGhlYWRpbmcpIHtcbiAgICAgICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCB2ZWwgPSBuZXcgVmVjMihiYWxsLnZlbC54LCBiYWxsLnZlbC55KTtcbiAgICAgICAgICAgIHBvcy5yb3RhdGUoLWhlYWRpbmcgKyBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2ZWwucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuXG4gICAgICAgICAgICBpZiAodmVsLnkgPiAwKSByZXR1cm47XG4gICAgICAgICAgICB2ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgICAgcG9zLnkgKz0gYmFsbC5yIC0gcmVsO1xuICAgICAgICAgICAgbGV0IGR2eSA9IHZlbC55ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuXG4gICAgICAgICAgICBsZXQgZGVsdGFBbmcgPSBNYXRoLnNpZ24odmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKlxuICAgICAgICAgICAgICAgIChkdnkgKiBiYWxsLmZjKSAvIChiYWxsLmFtYyAqIGJhbGwucik7XG4gICAgICAgICAgICBsZXQgbWF4RGVsdGFBbmcgPSAodmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgLyBiYWxsLnI7XG5cbiAgICAgICAgICAgIGlmIChkZWx0YUFuZyAvIG1heERlbHRhQW5nID4gMSkgZGVsdGFBbmcgPSBtYXhEZWx0YUFuZztcbiAgICAgICAgICAgIGRlbHRhQW5nICo9IChiYWxsLmFtYykgLyAoYmFsbC5hbWMgKyAxKTtcbiAgICAgICAgICAgIGJhbGwuYW5nICs9IGRlbHRhQW5nO1xuXG4gICAgICAgICAgICBsZXQgZHZ4ID0gZGVsdGFBbmcgKiBiYWxsLnI7XG5cbiAgICAgICAgICAgIHZlbC54IC09IGR2eDtcblxuICAgICAgICAgICAgcG9zLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdmVsLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgYmFsbC5wb3MueCA9IHBvcy54O1xuICAgICAgICAgICAgYmFsbC5wb3MueSA9IHBvcy55O1xuICAgICAgICAgICAgYmFsbC52ZWwueCA9IHZlbC54O1xuICAgICAgICAgICAgYmFsbC52ZWwueSA9IHZlbC55O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
