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
        this.id =
            '_' +
                Math.random()
                    .toString(36)
                    .substr(2, 9);
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
        if (this.pos.dist(ball.pos) < this.r + ball.r)
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
        d.mult((too * m2) / (m1 + m2));
        cp1.add(d);
        d.setMag(1);
        d.mult((-too * m1) / (m1 + m2));
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
        let vCommon = (vel1InPos * ball1.am + vel2InPos * ball2.am) / (ball1.am + ball2.am);
        let tovCommon1 = vCommon - vel1InPos;
        let tovCommon2 = vCommon - vel2InPos;
        let maxDeltaAng1 = tovCommon1 / r1;
        let maxDeltaAng2 = tovCommon2 / r2;
        // Calculate the new perpendicular velocities
        let u1Perpendicular = (1 + k) *
            ((m1 * vel1Perpendicular + m2 * vel2Perpendicular) / (m1 + m2)) -
            k * vel1Perpendicular;
        let u2Perpendicular = (1 + k) *
            ((m1 * vel1Perpendicular + m2 * vel2Perpendicular) / (m1 + m2)) -
            k * vel2Perpendicular;
        ball1.vel = vec2_1.default.mult(d, u1Perpendicular);
        ball2.vel = vec2_1.default.mult(d, u2Perpendicular);
        let deltav1Perpendicular = u1Perpendicular - vel1Perpendicular;
        let deltav2Perpendicular = u2Perpendicular - vel2Perpendicular;
        let deltaAng1 = (-Math.sign(tovCommon1) * (deltav1Perpendicular * fc)) / (ball1.amc * r1);
        let deltaAng2 = (Math.sign(tovCommon2) * (deltav2Perpendicular * fc)) / (ball2.amc * r2);
        if (deltaAng1 / maxDeltaAng1 > 1)
            deltaAng1 = maxDeltaAng1;
        if (deltaAng2 / maxDeltaAng2 > 1)
            deltaAng2 = maxDeltaAng2;
        deltaAng1 *= ball1.amc / (ball1.amc + 1);
        deltaAng2 *= ball2.amc / (ball2.amc + 1);
        ball1.ang -= deltaAng1;
        ball2.ang += deltaAng2;
        let u1Parralel = vel1Parralel + deltaAng1 * r1;
        let u2Parralel = vel2Parralel + deltaAng2 * r2;
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
        this.id =
            '_' +
                Math.random()
                    .toString(36)
                    .substr(2, 9);
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
                this.move((move.x * -1 * ball.m) / (this.m + ball.m), (move.y * -1 * ball.m) / (this.m + ball.m));
                ball.move((move.x * 1 * this.m) / (this.m + ball.m), (move.y * 1 * this.m) / (this.m + ball.m));
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
            let d = bp.y - (p.y + np.y) / 2;
            if (d >= -ball.r && d <= ball.r && bp.x >= np.x && bp.x <= p.x) {
                heading = h - Math.PI / 2;
                rel = d;
                let move = vec2_1.default.fromAngle(heading);
                move.mult(ball.r - rel);
                this.move((move.x * -1 * ball.m) / (this.m + ball.m), (move.y * -1 * ball.m) / (this.m + ball.m));
                ball.move((move.x * 1 * this.m) / (this.m + ball.m), (move.y * 1 * this.m) / (this.m + ball.m));
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
            let dv1vx = ((1 + k) * (m1 * v1v.x + m2 * v2v.x)) / (m1 + m2) - (k + 1) * v1v.x;
            let dv2vx = ((1 + k) * (m1 * v1v.x + m2 * v2v.x)) / (m1 + m2) - (k + 1) * v2v.x;
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
            let dang1 = (dv1v.y * m1 * r1.length) / (am1 + r1.length * r1.length * m1);
            let dang2 = -(dv2v.y * m2 * r2.length) / (am2 + r2.length * r2.length * m2);
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
                        let newSideHeading = new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y).heading;
                        while (!(a.heading > b.heading
                            ? (newSideHeading > a.heading &&
                                newSideHeading < 2 * Math.PI) ||
                                (newSideHeading > 0 && newSideHeading < b.heading)
                            : newSideHeading > a.heading && newSideHeading < b.heading) ||
                            intersectWithPoligon(new linesegment_1.default(new vec2_1.default(pol[j % pol.length].x, pol[j % pol.length].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y)), pol, [
                                (pol.length - 1) % pol.length,
                                j % pol.length,
                                (k - 1) % pol.length,
                                k % pol.length,
                            ])) {
                            k++;
                            newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                            newSideHeading = new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y).heading;
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
                            let newSideHeading = new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y).heading;
                            while (!(a.heading > b.heading
                                ? (newSideHeading > a.heading &&
                                    newSideHeading < 2 * Math.PI) ||
                                    (newSideHeading > 0 && newSideHeading < b.heading)
                                : newSideHeading > a.heading && newSideHeading < b.heading) ||
                                intersectWithPoligon(newSide, pol, [
                                    (j - 1) % pol.length,
                                    j % pol.length,
                                    (k - 1) % pol.length,
                                    k % pol.length,
                                ])) {
                                k++;
                                newSide = new linesegment_1.default(new vec2_1.default(pol[j].x, pol[j].y), new vec2_1.default(pol[k % pol.length].x, pol[k % pol.length].y));
                                newSideHeading = new vec2_1.default(newSide.b.x - newSide.a.x, newSide.b.y - newSide.a.y).heading;
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
            let a = Math.sqrt(Math.pow(pol[0].x - pol[1].x, 2) + Math.pow(pol[0].y - pol[1].y, 2));
            let b = Math.sqrt(Math.pow(pol[1].x - pol[2].x, 2) + Math.pow(pol[1].y - pol[2].y, 2));
            let c = Math.sqrt(Math.pow(pol[2].x - pol[0].x, 2) + Math.pow(pol[2].y - pol[0].y, 2));
            let s = (a + b + c) / 2;
            let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            mSum += m;
            pSum.x += (m * (pol[0].x + pol[1].x + pol[2].x)) / 3;
            pSum.y += (m * (pol[0].y + pol[1].y + pol[2].y)) / 3;
        });
        pSum.div(mSum);
        this.pos = pSum;
        this.m = mSum;
        // calculating the moment of inertia finally
        for (let pol of poligons) {
            let a = Math.sqrt(Math.pow(pol[0].x - pol[1].x, 2) + Math.pow(pol[0].y - pol[1].y, 2));
            let b = Math.sqrt(Math.pow(pol[1].x - pol[2].x, 2) + Math.pow(pol[1].y - pol[2].y, 2));
            let c = Math.sqrt(Math.pow(pol[2].x - pol[0].x, 2) + Math.pow(pol[2].y - pol[0].y, 2));
            let w = Math.max(a, b, c);
            let s = (a + b + c) / 2;
            let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            let h = (2 * m) / w;
            let wpartial = Math.sqrt(Math.min(a, c, b) ** 2 - h * h);
            let am = (h * w * (h * h + w * w)) / 24;
            let d = Math.sqrt((h * h) / 36 + (Math.abs(wpartial - w / 2) / 3) ** 2);
            am -= d * d * m;
            am +=
                new vec2_1.default((pol[0].x + pol[1].x + pol[2].x) / 3, (pol[0].y + pol[1].y + pol[2].y) / 3).dist(this.pos) **
                    2 *
                    m;
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
        let newVel1Perpendicular = ((1 + k) * (b1.m * vel1perpendicular + b2.m * vel2perpendicular)) /
            (b1.m + b2.m) -
            k * vel1perpendicular;
        let newVel2Perpendicular = ((1 + k) * (b1.m * vel1perpendicular + b2.m * vel2perpendicular)) /
            (b1.m + b2.m) -
            k * vel2perpendicular;
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
            this.balls[i].rotation %= Math.PI * 2;
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
                    let dvy = vel.y * (1 + 1 / ball.k);
                    let deltaAng = (Math.sign(vel.x - ball.ang * ball.r) * (dvy * ball.fc)) /
                        (ball.amc * ball.r);
                    let maxDeltaAng = (vel.x - ball.ang * ball.r) / ball.r;
                    if (deltaAng / maxDeltaAng > 1)
                        deltaAng = maxDeltaAng;
                    deltaAng *= ball.amc / (ball.amc + 1);
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
            b.ang *= Math.pow(this.airFriction, t);
        });
        this.bodies.forEach((b) => {
            b.vel.mult(Math.pow(this.airFriction, t));
            b.ang *= Math.pow(this.airFriction, t);
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
        let softSquare = new softball_1.default(pos, Math.sqrt((sideSize * sideSize) / Math.PI), 1, fc, 24);
        softSquare.sides.forEach((side) => {
            side.length = (0.96 * 4 * sideSize) / softSquare.resolution;
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
        bigStick.attachObject(softSquare.points[(3 * softSquare.resolution) / 4]);
        this.springs.push(bigStick);
        bigStick = new spring_1.default(Math.sqrt(2 * softSquare.r * softSquare.r * Math.PI), springStrength);
        bigStick.attachObject(softSquare.points[softSquare.resolution / 8]);
        bigStick.attachObject(softSquare.points[(5 * softSquare.resolution) / 8]);
        this.springs.push(bigStick);
        bigStick = new spring_1.default(Math.sqrt(2 * softSquare.r * softSquare.r * Math.PI), springStrength);
        bigStick.attachObject(softSquare.points[(3 * softSquare.resolution) / 8]);
        bigStick.attachObject(softSquare.points[(7 * softSquare.resolution) / 8]);
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
            x: x,
            y: y,
            r: r,
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
    /**
     * Removes the given object from the system
     * @param {any} obj The object to remove
     */
    removeObjFromSystem(obj) {
        console.log(this.balls.indexOf(obj));
        this.balls.splice(this.balls.indexOf(obj), 1);
    }
    /**
     * Finds the ball or body with the given id
     * @param {String} id The id of the object to find
     * @return {any} The data of the object
     */
    getItemDataFromId(id) {
        let ret = {};
        let filter = (b) => b.id === id;
        let balls = this.balls.filter(filter);
        if (balls.length >= 1) {
            ret.type = 'ball';
            ret.num = this.balls.indexOf(balls[0]);
            return ret;
        }
        let bodies = this.bodies.filter(filter);
        if (bodies.length >= 1) {
            ret.type = 'body';
            ret.num = this.bodies.indexOf(bodies[0]);
            return ret;
        }
        let springs = this.springs.filter(filter);
        if (springs.length >= 1) {
            ret.type = 'spring';
            ret.num = this.springs.indexOf(springs[0]);
            return ret;
        }
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
            let dist = new vec2_1.default(p2.x - p1.pos.x, p2.y - p1.pos.y);
            let dl = dist.length - this.length;
            dist.setMag(1);
            dist.mult((dl * this.springConstant * t) / p1.m);
            p1.vel.x += dist.x;
            p1.vel.y += dist.y;
            let v = p1.vel;
            v.rotate(-dist.heading);
            if (this.rotationLocked) {
                let s = new vec2_1.default(p2.x, p2.y);
                let r2 = vec2_1.default.sub(p1.pos, s);
                let am = r2.length * r2.length * p1.m + p1.am;
                let ang = (p1.am * p1.ang - r2.length * p1.m * v.y) / am;
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
                let am = r1.length * r1.length * p1.m +
                    p1.am +
                    r2.length * r2.length * p2.m +
                    p2.am;
                let sv = ((v1.y - v2.y) * r2.length) / (r1.length + r2.length) + v2.y;
                let ang = (p1.am * p1.ang +
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmFsbC50cyIsInNyYy9ib2R5LnRzIiwic3JjL2xpbmVzZWdtZW50LnRzIiwic3JjL3BoeXNpY3MudHMiLCJzcmMvc29mdGJhbGwudHMiLCJzcmMvc3ByaW5nLnRzIiwic3JjL3N0aWNrLnRzIiwic3JjL3ZlYzIudHMiLCJzcmMvd2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsaUNBQTBCO0FBRTFCOzs7O0dBSUc7QUFDSCxNQUFxQixJQUFJO0lBYXZCOzs7Ozs7Ozs7T0FTRztJQUNILFlBQ0UsR0FBUyxFQUNULEdBQVMsRUFDVCxDQUFTLEVBQ1QsQ0FBUyxFQUNULEdBQVcsRUFDWCxFQUFVO1FBRVYsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDN0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLEdBQUc7WUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7WUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFbEIsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7WUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUVqQyxJQUFJLENBQUM7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUVsQixJQUFJLEdBQUcsSUFBSSxTQUFTO1lBQUUsSUFBSSxD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Q0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEUsSUFBSSxLQUFLLEdBQ1AsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRXRFLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUUvQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDM0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FB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R0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDcEUsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFZCw0Q0FBNEM7UUFDNUMsS0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDZixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDcEUsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3BFLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNwRSxDQUFDO1lBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4RSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsRUFBRTtnQkFDQSxJQUFJLGNBQUksQ0FDTixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUNwQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNyQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUNkLENBQUM7b0JBQ0gsQ0FBQyxDQUFDO1lBQ0osS0FBSyxJQUFJLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsS0FBYTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksS0FBSyxHQUFHLElBQUksY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksU0FBUztRQUNYLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FDdkIsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3hCLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3RDLENBQUM7UUFDRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxLQUFLLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FDbkIsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMzQyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzdCLENBQUM7WUFDRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQztTQUNsQztRQUNELEtBQUssR0FBRyxjQUFJLENBQUMsUUFBUSxDQUNuQixjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUNyQyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQ25ELENBQUM7UUFDRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ2pDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQVEsRUFBRSxFQUFRO1FBQy9CLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxjQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksR0FBRyxHQUFnQixFQUFFLENBQUM7UUFDMUIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzNCLElBQUksS0FBSyxHQUFHLElBQUkscUJBQVcsQ0FDekIsSUFBSSxjQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2xCLElBQUksY0FBSSxDQUNOLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ3pDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQzFDLENBQ0YsQ0FBQztZQUNGLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUM3QixJQUFJLEtBQUssR0FBRyxJQUFJLHFCQUFXLENBQ3pCLElBQUksY0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNwQixJQUFJLGNBQUksQ0FDTixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUMzQyxDQUNGLENBQUM7Z0JBQ0YsSUFBSSxJQUFJLEdBQUcscUJBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLElBQUksRUFBRTtvQkFDUixPQUFPLEVBQUUsQ0FBQztvQkFDVixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2YsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDbEI7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPO1FBQ3ZCLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hELE9BQU8sSUFBSSxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDekQ7UUFDRCxPQUFPLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUN2QixPQUFPLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLEdBQUcsY0FBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVoQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsS0FBSyxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQzNCLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNqQixjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQ3JELFFBQVEsQ0FDVCxDQUFDO1lBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ2pCLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxjQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFDckQsUUFBUSxDQUNULENBQUM7U0FDSDtRQUNELEtBQUssSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUMzQixRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDakIsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUNyRCxRQUFRLENBQ1QsQ0FBQztZQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNqQixjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLElBQUksY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQ3JELFFBQVEsQ0FDVCxDQUFDO1NBQ0g7UUFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxFQUFFO1lBQ2pFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztTQUMzQzthQUFNO1lBQ0wsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsNENBQTRDO1FBQzVDLElBQUksaUJBQWlCLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVDLDRDQUE0QztRQUM1QyxJQUFJLGlCQUFpQixHQUFHLGNBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLG9CQUFvQixHQUN0QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxpQkFBaUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUM7WUFDL0QsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZixDQUFDLEdBQUcsaUJBQWlCLENBQUM7UUFDeEIsSUFBSSxvQkFBb0IsR0FDdEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9ELENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO1FBRXhCLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDeEUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0NBQ0Y7QUFybUJELHVCQXFtQkM7Ozs7O0FDOW1CRCxpQ0FBMEI7QUFFMUI7O0dBRUc7QUFDSCxNQUFxQixXQUFXO0lBQzVCOzs7O09BSUc7SUFDSCxZQUFtQixDQUFPLEVBQVMsQ0FBTztRQUF2QixNQUFDLEdBQUQsQ0FBQyxDQUFNO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBTTtJQUMxQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxNQUFNO1FBQ04sT0FBTyxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLENBQU87UUFDakIsSUFBSSxDQUFDLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0QixJQUFJLEtBQUssR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLEtBQUssR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDcEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFxQixFQUFFLFFBQXFCO1FBQ3pELElBQUksRUFBRSxHQUFHLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFNUMsSUFBSSxFQUFFLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUU1QyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN4QyxPQUFPLElBQUksY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNwQzthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7U0FDcEI7UUFDRCxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN4QyxPQUFPLElBQUksY0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNwQzthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7U0FDcEI7UUFDRCxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQy9CLElBQUksU0FBUyxDQUFDO2dCQUNkLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdCLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNILFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO2dCQUNELElBQUksU0FBUyxDQUFDO2dCQUNkLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdCLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNILFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO2dCQUNELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxT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QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsV0FBVyxDQUNULENBQVMsRUFDVCxDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxFQUFVLEVBQ1YsQ0FBUztRQUVULElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxjQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTyxDQUFDLElBQVU7UUFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFlBQVksQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDbkIsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxNQUFjO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBRTtZQUNyRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsT0FBTyxJQUFJLGNBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJ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LENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBRXBELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksTUFBTSxHQUFHLElBQUksY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBSSxDQUFDLElBQUksQ0FDaEIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLGNBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQzVDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1NBQzNEO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxlQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFF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QUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLE9BQU87UUFDUCxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2xFLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDL0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3BFLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVEOzs7T0FHRztJQUNILEdBQUcsQ0FBQyxDQUFPO1FBQ1AsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxHQUFHLENBQUMsQ0FBTztRQUNQLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLENBQVM7UUFDVixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxHQUFHLENBQUMsQ0FBUztRQUNULElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLENBQUMsS0FBVyxFQUFFLENBQVM7UUFDdkIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FBQyxLQUFXO1FBQ1osT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNqRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLENBQVM7UUFDWixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU87UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsS0FBYTtRQUNoQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBR0Qsb0JBQW9CO0lBQ3BCOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFPLEVBQUUsQ0FBTztRQUN2QixPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQU8sRUFBRSxDQUFPO1FBQ3ZCLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBTyxFQUFFLENBQVM7UUFDMUIsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBTyxFQUFFLENBQVM7UUFDekIsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFTO1FBQ3RCLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBTyxFQUFFLENBQU8sRUFBRSxDQUFTO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFD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R0FBRyxXQUFXLEdBQUcsQ0FBQztnQkFBRSxRQUFRLEdBQUcsV0FBVyxDQUFDO1lBQ3ZELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUM7WUFFckIsSUFBSSxHQUFHLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7WUFFYixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN0QjtJQUNMLENBQUM7Q0FDSjtBQWhHRCx1QkFnR0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgYmFsbFxuICogQSBiYWxsIGlzIGFuIG9iamVjdCBpbiB0aGUgcGh5c2ljcyBlbmdpbmUgdGhhdFxuICogaGFzIGEgc2hhcGUgb2YgYSBjaXJjbGUgYW5kIGl0IGlzIGFmZmVjdGVkIGJ5IGdyYXZpdHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFsbCB7XG4gIHBvczogVmVjMjtcbiAgbGFzdFBvczogVmVjMjtcbiAgcjogbnVtYmVyO1xuICBmYzogbnVtYmVyO1xuICBhbWM6IG51bWJlcjtcbiAgcm90YXRpb246IG51bWJlcjtcbiAgYW5nOiBudW1iZXI7XG4gIGs6IG51bWJlcjtcbiAgdmVsOiBWZWMyO1xuICBsYXllcjogYW55O1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmV0ZSBhIGJhbGxcbiAgICogVGhlIG1hc3Mgb2YgdGhlIGJhbGwgaXMgY2FsY3VsYXRlZCBmcm9tIGl0cyByYWRpdXNcbiAgICogQHBhcmFtIHtWZWMyfSBwb3MgVGhlIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZVxuICAgKiBAcGFyYW0ge1ZlYzJ9IHZlbCBUaGUgdmVsb2NpdHkgb2YgdGhlIGNpcmNsZVxuICAgKiBAcGFyYW0ge251bWJlcn0gciBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gayBDb2VmZmljaWVudCBvZiByZXN0aXR1dGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYW5nIFRoZSBhbmd1bGFyIHZlbG9jaXR5IG9mIHRoZSBiYWxsIChvcHRpb25hbClcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZjIFRoZSBmcmljdGlvbiBjb2VmZmljaWVudCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIDAuNClcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBvczogVmVjMixcbiAgICB2ZWw6IFZlYzIsXG4gICAgcjogbnVtYmVyLFxuICAgIGs6IG51bWJlcixcbiAgICBhbmc6IG51bWJlcixcbiAgICBmYzogbnVtYmVyXG4gICkge1xuICAgIHRoaXMucG9zID0gcG9zLmNvcHk7XG4gICAgdGhpcy5sYXN0UG9zID0gdGhpcy5wb3MuY29weTtcbiAgICB0aGlzLnIgPSByO1xuICAgIHRoaXMuZmMgPSAwLjQ7XG4gICAgdGhpcy5hbWMgPSAyIC8gNTtcblxuICAgIHRoaXMucm90YXRpb24gPSAwO1xuXG4gICAgaWYgKGFuZykgdGhpcy5hbmcgPSBhbmc7XG4gICAgZWxzZSB0aGlzLmFuZyA9IDA7XG5cbiAgICBpZiAoZmMgfHwgZmMgPT09IDApIHRoaXMuZmMgPSBmYztcblxuICAgIGlmIChrKSB0aGlzLmsgPSBrO1xuICAgIGVsc2UgdGhpcy5rID0gMC44O1xuXG4gICAgaWYgKHZlbCAhPSB1bmRlZmluZWQpIHRoaXMudmVsID0gdmVsLmNvcHk7XG4gICAgZWxzZSB0aGlzLnZlbCA9IG5ldyBWZWMyKDAsIDApO1xuXG4gICAgdGhpcy5pZCA9XG4gICAgICAnXycgK1xuICAgICAgTWF0aC5yYW5kb20oKVxuICAgICAgICAudG9TdHJpbmcoMzYpXG4gICAgICAgIC5zdWJzdHIoMiwgOSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtYXNzIG9mIHRoZSBiYWxsXG4gICAqIEByZXR1cm4ge251bWJlcn0gVGhlIG1hc3NcbiAgICovXG4gIGdldCBtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuciAqIHRoaXMuciAqIE1hdGguUEk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtb21lbnQgb2YgaW5lcnRpYSBvZiB0aGUgYmFsbFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBtb21lbnQgb2YgaW5lcnRpYVxuICAgKi9cbiAgZ2V0IGFtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuYW1jICogdGhpcy5yICogdGhpcy5yICogdGhpcy5tO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgdGhlIGJhbGwgdGhhdCBpcyBub3QgYSByZWZlcmVuY2UgdG8gaXRcbiAgICogQHJldHVybiB7QmFsbH0gVGhlIGNvcHkgb2YgdGhlIGJhbGxcbiAgICovXG4gIGdldCBjb3B5KCk6IEJhbGwge1xuICAgIGxldCByZXQgPSBuZXcgQmFsbChcbiAgICAgIHRoaXMucG9zLmNvcHksXG4gICAgICB0aGlzLnZlbC5jb3B5LFxuICAgICAgdGhpcy5yLFxuICAgICAgdGhpcy5rLFxuICAgICAgdGhpcy5hbmcsXG4gICAgICB0aGlzLmZjXG4gICAgKTtcbiAgICByZXQubGFzdFBvcyA9IHRoaXMubGFzdFBvcy5jb3B5O1xuICAgIHJldC5yb3RhdGlvbiA9IHRoaXMucm90YXRpb247XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgYmFsbCBieSB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZVxuICAgKi9cbiAgbW92ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMucG9zLnggKz0geDtcbiAgICB0aGlzLnBvcy55ICs9IHk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHR3byBiYWxscyBhcmUgY29sbGlkaW5nIG9yIG5vdFxuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwgdGhlIG90aGVyIGJhbGxcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGV5IGNvbGlkcmVcbiAgICovXG4gIGNvbGxpZGVkKGJhbGw6IEJhbGwpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5wb3MuZGlzdChiYWxsLnBvcykgPCB0aGlzLnIgKyBiYWxsLnIpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRpYyBmdW5jdGlvbiBmb3IgY29sbGlzaW9uIGJldHdlZW4gdHdvIGJhbGxzXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbDEgRmlyc3QgYmFsbFxuICAgKiBAcGFyYW0ge0JhbGx9IGJhbGwyIFNlY29uZCBiYWxsXG4gICAqL1xuICBzdGF0aWMgY29sbGlkZShiYWxsMTogQmFsbCwgYmFsbDI6IEJhbGwpIHtcbiAgICBpZiAoIWJhbGwxLmNvbGxpZGVkKGJhbGwyKSkgcmV0dXJuO1xuXG4gICAgbGV0IHBvczEgPSBiYWxsMS5wb3M7XG4gICAgbGV0IHBvczIgPSBiYWxsMi5wb3M7XG4gICAgbGV0IHIxID0gYmFsbDEucjtcbiAgICBsZXQgcjIgPSBiYWxsMi5yO1xuICAgIGxldCBrID0gKGJhbGwxLmsgKyBiYWxsMi5rKSAvIDI7XG4gICAgbGV0IG0xID0gYmFsbDEubTtcbiAgICBsZXQgbTIgPSBiYWxsMi5tO1xuICAgIGxldCBkaXN0ID0gVmVjMi5kaXN0KHBvczEsIHBvczIpO1xuICAgIGxldCBmYyA9IChiYWxsMS5mYyArIGJhbGwyLmZjKSAvIDI7XG5cbiAgICBsZXQgY3AxID0gcG9zMS5jb3B5O1xuICAgIGxldCBjcDIgPSBwb3MyLmNvcHk7XG4gICAgbGV0IHRvbyA9IHIxICsgcjIgLSBkaXN0O1xuICAgIGxldCBkID0gVmVjMi5zdWIocG9zMSwgcG9zMik7XG4gICAgZC5zZXRNYWcoMSk7XG4gICAgZC5tdWx0KCh0b28gKiBtMikgLyAobTEgKyBtMikpO1xuICAgIGNwMS5hZGQoZCk7XG4gICAgZC5zZXRNYWcoMSk7XG4gICAgZC5tdWx0KCgtdG9vICogbTEpIC8gKG0xICsgbTIpKTtcbiAgICBjcDIuYWRkKGQpO1xuICAgIGJhbGwxLnBvcyA9IGNwMTtcbiAgICBiYWxsMi5wb3MgPSBjcDI7XG5cbiAgICBpZiAoVmVjMi5kb3QoZCwgVmVjMi5zdWIoYmFsbDEudmVsLCBiYWxsMi52ZWwpKSA8IDApIHJldHVybjtcblxuICAgIGQuc2V0TWFnKDEpO1xuICAgIGxldCB2ZWwxUGFycmFsZWwgPSBWZWMyLmNyb3NzKGQsIGJhbGwxLnZlbCk7XG4gICAgbGV0IHZlbDJQYXJyYWxlbCA9IFZlYzIuY3Jvc3MoZCwgYmFsbDIudmVsKTtcbiAgICBsZXQgdmVsMVBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChkLCBiYWxsMS52ZWwpO1xuICAgIGxldCB2ZWwyUGVycGVuZGljdWxhciA9IFZlYzIuZG90KGQsIGJhbGwyLnZlbCk7XG5cbiAgICBsZXQgdmsxID0gcjEgKiBiYWxsMS5hbmc7XG4gICAgbGV0IHZrMiA9IHIyICogYmFsbDIuYW5nO1xuXG4gICAgbGV0IHZlbDFJblBvcyA9IHZlbDFQYXJyYWxlbCAtIHZrMTtcbiAgICBsZXQgdmVsMkluUG9zID0gdmVsMlBhcnJhbGVsICsgdmsyO1xuICAgIGxldCB2Q29tbW9uID1cbiAgICAgICh2ZWwxSW5Qb3MgKiBiYWxsMS5hbSArIHZlbDJJblBvcyAqIGJhbGwyLmFtKSAvIChiYWxsMS5hbSArIGJhbGwyLmFtKTtcbiAgICBsZXQgdG92Q29tbW9uMSA9IHZDb21tb24gLSB2ZWwxSW5Qb3M7XG4gICAgbGV0IHRvdkNvbW1vbjIgPSB2Q29tbW9uIC0gdmVsMkluUG9zO1xuICAgIGxldCBtYXhEZWx0YUFuZzEgPSB0b3ZDb21tb24xIC8gcjE7XG4gICAgbGV0IG1heERlbHRhQW5nMiA9IHRvdkNvbW1vbjIgLyByMjtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgbmV3IHBlcnBlbmRpY3VsYXIgdmVsb2NpdGllc1xuICAgIGxldCB1MVBlcnBlbmRpY3VsYXIgPVxuICAgICAgKDEgKyBrKSAqXG4gICAgICAgICgobTEgKiB2ZWwxUGVycGVuZGljdWxhciArIG0yICogdmVsMlBlcnBlbmRpY3VsYXIpIC8gKG0xICsgbTIpKSAtXG4gICAgICBrICogdmVsMVBlcnBlbmRpY3VsYXI7XG4gICAgbGV0IHUyUGVycGVuZGljdWxhciA9XG4gICAgICAoMSArIGspICpcbiAgICAgICAgKChtMSAqIHZlbDFQZXJwZW5kaWN1bGFyICsgbTIgKiB2ZWwyUGVycGVuZGljdWxhcikgLyAobTEgKyBtMikpIC1cbiAgICAgIGsgKiB2ZWwyUGVycGVuZGljdWxhcjtcblxuICAgIGJhbGwxLnZlbCA9IFZlYzIubXVsdChkLCB1MVBlcnBlbmRpY3VsYXIpO1xuICAgIGJhbGwyLnZlbCA9IFZlYzIubXVsdChkLCB1MlBlcnBlbmRpY3VsYXIpO1xuXG4gICAgbGV0IGRlbHRhdjFQZXJwZW5kaWN1bGFyID0gdTFQZXJwZW5kaWN1bGFyIC0gdmVsMVBlcnBlbmRpY3VsYXI7XG4gICAgbGV0IGRlbHRhdjJQZXJwZW5kaWN1bGFyID0gdTJQZXJwZW5kaWN1bGFyIC0gdmVsMlBlcnBlbmRpY3VsYXI7XG5cbiAgICBsZXQgZGVsdGFBbmcxID1cbiAgICAgICgtTWF0aC5zaWduKHRvdkNvbW1vbjEpICogKGRlbHRhdjFQZXJwZW5kaWN1bGFyICogZmMpKSAvIChiYWxsMS5hbWMgKiByMSk7XG4gICAgbGV0IGRlbHRhQW5nMiA9XG4gICAgICAoTWF0aC5zaWduKHRvdkNvbW1vbjIpICogKGRlbHRhdjJQZXJwZW5kaWN1bGFyICogZmMpKSAvIChiYWxsMi5hbWMgKiByMik7XG5cbiAgICBpZiAoZGVsdGFBbmcxIC8gbWF4RGVsdGFBbmcxID4gMSkgZGVsdGFBbmcxID0gbWF4RGVsdGFBbmcxO1xuICAgIGlmIChkZWx0YUFuZzIgLyBtYXhEZWx0YUFuZzIgPiAxKSBkZWx0YUFuZzIgPSBtYXhEZWx0YUFuZzI7XG5cbiAgICBkZWx0YUFuZzEgKj0gYmFsbDEuYW1jIC8gKGJhbGwxLmFtYyArIDEpO1xuICAgIGRlbHRhQW5nMiAqPSBiYWxsMi5hbWMgLyAoYmFsbDIuYW1jICsgMSk7XG5cbiAgICBiYWxsMS5hbmcgLT0gZGVsdGFBbmcxO1xuICAgIGJhbGwyLmFuZyArPSBkZWx0YUFuZzI7XG5cbiAgICBsZXQgdTFQYXJyYWxlbCA9IHZlbDFQYXJyYWxlbCArIGRlbHRhQW5nMSAqIHIxO1xuICAgIGxldCB1MlBhcnJhbGVsID0gdmVsMlBhcnJhbGVsICsgZGVsdGFBbmcyICogcjI7XG5cbiAgICBkLnJvdGF0ZShNYXRoLlBJIC8gMik7XG4gICAgYmFsbDEudmVsLmFkZChWZWMyLm11bHQoZCwgdTFQYXJyYWxlbCkpO1xuICAgIGJhbGwyLnZlbC5hZGQoVmVjMi5tdWx0KGQsIHUyUGFycmFsZWwpKTtcbiAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgTGluZVNlZ21lbnQgZnJvbSAnLi9saW5lc2VnbWVudCc7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgYm9keVxuICogQm9kaWVzIGFyZSBtb3ZhYmxlIG9iamVjdHNcbiAqIGFuZCB0aGV5IGNvbGxpZGUgd2l0aCBvdGhlciBvYmplY3RzIChiYWxscylcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSB7XG4gIHBvaW50czogQXJyYXk8VmVjMj47XG4gIGxhc3RQb3M6IFZlYzI7XG4gIHBvczogVmVjMjtcbiAgZmM6IG51bWJlcjtcbiAgcm90YXRpb246IG51bWJlcjtcbiAgYW5nOiBudW1iZXI7XG4gIGs6IG51bWJlcjtcbiAgdmVsOiBWZWMyO1xuICBtOiBudW1iZXI7XG4gIGFtOiBudW1iZXI7XG4gIGxheWVyOiBhbnk7XG4gIGlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBib2R5IGFuZCBjYWxjdWxhdGVzIGl0J3MgY2VudHJlIG9mIG1hc3MgKHBvc2l0aW9uKVxuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgVGhlIHBvaW50cyB0aGF0IG1ha2UgdXAgdGhlIGJvZHlcbiAgICogQHBhcmFtIHtWZWMyfSB2ZWwgVGhlIHZlbG9jaXR5IG9mIHRoZSBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBrIENvZWZmaWNpZW50IG9mIHJlc3RpdHV0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmcgQW5ndWxhciB2ZWxvY2l0eVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBvaW50czogQXJyYXk8VmVjMj4sXG4gICAgdmVsOiBWZWMyLFxuICAgIGs6IG51bWJlcixcbiAgICBhbmc6IG51bWJlcixcbiAgICBmYzogbnVtYmVyXG4gICkge1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuXG4gICAgbGV0IHBvbCA9IHRoaXMucG9pbnRzO1xuICAgIGxldCBzdW0xID0gMDtcbiAgICBsZXQgc3VtMiA9IDA7XG4gICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhcbiAgICAgIFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKSxcbiAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSlcbiAgICApO1xuICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgc3VtMiArPSBNYXRoLlBJICogMiAtIGFuZ2xlO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFxuICAgICAgICBWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLCBwb2xbaV0pLFxuICAgICAgICBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pXG4gICAgICApO1xuICAgICAgc3VtMSArPSBhbmdsZTtcbiAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICB9XG4gICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFxuICAgICAgVmVjMi5zdWIocG9sWzBdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSxcbiAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pXG4gICAgKTtcbiAgICBzdW0xICs9IGFuZ2xlO1xuICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICBpZiAoc3VtMiA8IHN1bTEpIHtcbiAgICAgIGxldCB0ZW1wID0gW107XG4gICAgICBmb3IgKGxldCBpID0gcG9sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB0ZW1wLnB1c2gocG9sW2ldKTtcbiAgICAgIHRoaXMucG9pbnRzID0gdGVtcDtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGN1bGF0ZVBvc0FuZE1hc3MoKTtcbiAgICB0aGlzLmxhc3RQb3MgPSB0aGlzLnBvcy5jb3B5O1xuICAgIHRoaXMuZmMgPSAwLjQ7XG5cbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcblxuICAgIGlmIChhbmcpIHRoaXMuYW5nID0gYW5nO1xuICAgIGVsc2UgdGhpcy5hbmcgPSAwO1xuXG4gICAgaWYgKGZjIHx8IGZjID09PSAwKSB0aGlzLmZjID0gZmM7XG5cbiAgICBpZiAoaykgdGhpcy5rID0gaztcbiAgICBlbHNlIHRoaXMuayA9IDAuODtcblxuICAgIGlmICh2ZWwgIT0gdW5kZWZpbmVkKSB0aGlzLnZlbCA9IHZlbC5jb3B5O1xuICAgIGVsc2UgdGhpcy52ZWwgPSBuZXcgVmVjMigwLCAwKTtcblxuICAgIHRoaXMuaWQgPVxuICAgICAgJ18nICtcbiAgICAgIE1hdGgucmFuZG9tKClcbiAgICAgICAgLnRvU3RyaW5nKDM2KVxuICAgICAgICAuc3Vic3RyKDIsIDkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGNvcHkgb2YgdGhlIGJvZHkgdGhhdCBpcyBub3QgYSByZWZlcmVuY2UgdG8gaXRcbiAgICogQHJldHVybiB7Qm9keX0gVGhlIGNvcHkgb2YgdGhlIGJvZHlcbiAgICovXG4gIGdldCBjb3B5KCk6IEJvZHkge1xuICAgIGxldCBwb2ludHNDb3B5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgcG9pbnRzQ29weS5wdXNoKG5ldyBWZWMyKHRoaXMucG9pbnRzW2ldLngsIHRoaXMucG9pbnRzW2ldLnkpKTtcbiAgICB9XG4gICAgbGV0IHJldCA9IG5ldyBCb2R5KHBvaW50c0NvcHksIHRoaXMudmVsLmNvcHksIHRoaXMuaywgdGhpcy5hbmcsIHRoaXMuZmMpO1xuICAgIHJldC5yb3RhdGlvbiA9IHRoaXMucm90YXRpb247XG4gICAgcmV0Lmxhc3RQb3MgPSB0aGlzLmxhc3RQb3MuY29weTtcbiAgICByZXQucG9zID0gdGhpcy5wb3MuY29weTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIGJvZHkgYnkgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG4gICAqIEl0IGhhcyB0byBtb3ZlIGFsbCB0aGUgcG9pbnRzIG9mIHRoZSBib2R5IGFuZFxuICAgKiBhbHNvIHRoZSBjZW50cmUgb2YgbWFzcyAocG9zKSBvZiB0aGUgYm9keVxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAqL1xuICBtb3ZlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy5wb3MueCArPSB4O1xuICAgIHRoaXMucG9zLnkgKz0geTtcbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLnggKz0geDtcbiAgICAgIHAueSArPSB5O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgZG9lcyB0aGUgY29sbGlzaW9uIGRldGVjdGlvbiBhbmRcbiAgICogY29sbGlzaW9uIGJlaGF2aW9yIGJldHdlZW4gdGhlIGJvZHkgYW5kIGJhbGxcbiAgICogQHBhcmFtIHtCYWxsfSBiYWxsIFRoZSBiYWxsIHRvIGNvbGxpZGUgd2l0aCB0aGUgYm9keVxuICAgKi9cbiAgY29sbGlkZVdpdGhCYWxsKGJhbGw6IEJhbGwpIHtcbiAgICBsZXQgaGVhZGluZzogbnVtYmVyO1xuICAgIGxldCByZWw6IG51bWJlcjtcbiAgICBsZXQgY3A7XG5cbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCwgaWR4KSA9PiB7XG4gICAgICBsZXQgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgcC54IC09IGJhbGwucG9zLng7XG4gICAgICBwLnkgLT0gYmFsbC5wb3MueTtcbiAgICAgIGlmIChwLmxlbmd0aCA8PSBiYWxsLnIpIHtcbiAgICAgICAgaGVhZGluZyA9IHAuaGVhZGluZyArIE1hdGguUEk7XG4gICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuXG4gICAgICAgIGxldCBtb3ZlID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgIG1vdmUubXVsdChiYWxsLnIgLSByZWwpO1xuICAgICAgICB0aGlzLm1vdmUoXG4gICAgICAgICAgKG1vdmUueCAqIC0xICogYmFsbC5tKSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgIChtb3ZlLnkgKiAtMSAqIGJhbGwubSkgLyAodGhpcy5tICsgYmFsbC5tKVxuICAgICAgICApO1xuICAgICAgICBiYWxsLm1vdmUoXG4gICAgICAgICAgKG1vdmUueCAqIDEgKiB0aGlzLm0pIC8gKHRoaXMubSArIGJhbGwubSksXG4gICAgICAgICAgKG1vdmUueSAqIDEgKiB0aGlzLm0pIC8gKHRoaXMubSArIGJhbGwubSlcbiAgICAgICAgKTtcblxuICAgICAgICBjcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuXG4gICAgICAgIGxldCBhID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgIGEubXVsdCgtMzApO1xuICAgICAgfVxuICAgICAgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgbGV0IG5wID0gbmV3IFZlYzIoXG4gICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueCxcbiAgICAgICAgdGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS55XG4gICAgICApO1xuICAgICAgbGV0IGJwID0gbmV3IFZlYzIoYmFsbC5wb3MueCwgYmFsbC5wb3MueSk7XG4gICAgICBsZXQgc2lkZSA9IG5ldyBWZWMyKG5wLnggLSBwLngsIG5wLnkgLSBwLnkpO1xuICAgICAgbGV0IGggPSBzaWRlLmhlYWRpbmc7XG4gICAgICBwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgbnAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICBicC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgIGxldCBkID0gYnAueSAtIChwLnkgKyBucC55KSAvIDI7XG4gICAgICBpZiAoZCA+PSAtYmFsbC5yICYmIGQgPD0gYmFsbC5yICYmIGJwLnggPj0gbnAueCAmJiBicC54IDw9IHAueCkge1xuICAgICAgICBoZWFkaW5nID0gaCAtIE1hdGguUEkgLyAyO1xuICAgICAgICByZWwgPSBkO1xuXG4gICAgICAgIGxldCBtb3ZlID0gVmVjMi5mcm9tQW5nbGUoaGVhZGluZyk7XG4gICAgICAgIG1vdmUubXVsdChiYWxsLnIgLSByZWwpO1xuICAgICAgICB0aGlzLm1vdmUoXG4gICAgICAgICAgKG1vdmUueCAqIC0xICogYmFsbC5tKSAvICh0aGlzLm0gKyBiYWxsLm0pLFxuICAgICAgICAgIChtb3ZlLnkgKiAtMSAqIGJhbGwubSkgLyAodGhpcy5tICsgYmFsbC5tKVxuICAgICAgICApO1xuICAgICAgICBiYWxsLm1vdmUoXG4gICAgICAgICAgKG1vdmUueCAqIDEgKiB0aGlzLm0pIC8gKHRoaXMubSArIGJhbGwubSksXG4gICAgICAgICAgKG1vdmUueSAqIDEgKiB0aGlzLm0pIC8gKHRoaXMubSArIGJhbGwubSlcbiAgICAgICAgKTtcblxuICAgICAgICBjcCA9IGJhbGwucG9zLmNvcHk7XG4gICAgICAgIGNwLmFkZChWZWMyLm11bHQoVmVjMi5mcm9tQW5nbGUoaGVhZGluZyArIE1hdGguUEkpLCBkKSk7XG5cbiAgICAgICAgbGV0IGEgPSBWZWMyLmZyb21BbmdsZShoZWFkaW5nKTtcbiAgICAgICAgYS5tdWx0KC0zMCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaGVhZGluZyA9PT0gMCB8fCBoZWFkaW5nKSB7XG4gICAgICBsZXQgdjEgPSB0aGlzLnZlbC5jb3B5O1xuICAgICAgbGV0IHYyID0gYmFsbC52ZWwuY29weTtcbiAgICAgIGxldCBhbmcxID0gdGhpcy5hbmc7XG4gICAgICBsZXQgYW5nMiA9IGJhbGwuYW5nO1xuICAgICAgbGV0IHIxID0gVmVjMi5zdWIoY3AsIHRoaXMucG9zKTtcbiAgICAgIGxldCByMiA9IFZlYzIuc3ViKGNwLCBiYWxsLnBvcyk7XG4gICAgICBsZXQgYW0xID0gdGhpcy5hbTtcbiAgICAgIGxldCBhbTIgPSBiYWxsLmFtO1xuICAgICAgbGV0IG0xID0gdGhpcy5tO1xuICAgICAgbGV0IG0yID0gYmFsbC5tO1xuICAgICAgbGV0IGsgPSAodGhpcy5rICsgYmFsbC5rKSAvIDI7XG4gICAgICBsZXQgZmMgPSAodGhpcy5mYyArIGJhbGwuZmMpIC8gMjtcblxuICAgICAgbGV0IHYxdiA9IHIxLmNvcHk7XG4gICAgICBsZXQgdjJ2ID0gcjIuY29weTtcbiAgICAgIHYxdi5yb3RhdGUoTWF0aC5QSSAvIDIpO1xuICAgICAgdjJ2LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xuICAgICAgdjF2Lm11bHQoYW5nMSk7XG4gICAgICB2MnYubXVsdChhbmcyKTtcbiAgICAgIHYxdi5hZGQodjEpO1xuICAgICAgdjJ2LmFkZCh2Mik7XG5cbiAgICAgIHYxdi5yb3RhdGUoLWhlYWRpbmcpO1xuICAgICAgdjJ2LnJvdGF0ZSgtaGVhZGluZyk7XG5cbiAgICAgIGxldCBkdjF2eCA9XG4gICAgICAgICgoMSArIGspICogKG0xICogdjF2LnggKyBtMiAqIHYydi54KSkgLyAobTEgKyBtMikgLSAoayArIDEpICogdjF2Lng7XG4gICAgICBsZXQgZHYydnggPVxuICAgICAgICAoKDEgKyBrKSAqIChtMSAqIHYxdi54ICsgbTIgKiB2MnYueCkpIC8gKG0xICsgbTIpIC0gKGsgKyAxKSAqIHYydi54O1xuXG4gICAgICBsZXQgdmsgPSAodjF2LnkgKiBtMSArIHYydi55ICogbTIpIC8gKG0xICsgbTIpO1xuXG4gICAgICBsZXQgZHYxdnkgPSAtTWF0aC5zaWduKHYxdi55KSAqIGZjICogZHYxdng7XG4gICAgICBsZXQgZHYydnkgPSAtTWF0aC5zaWduKHYydi55KSAqIGZjICogZHYydng7XG4gICAgICBpZiAoTWF0aC5hYnModmsgLSB2MXYueSkgPiBNYXRoLmFicyhkdjF2eSkpIGR2MXZ5ID0gdmsgLSB2MXYueTtcbiAgICAgIGlmIChNYXRoLmFicyh2ayAtIHYydi55KSA+IE1hdGguYWJzKGR2MnZ5KSkgZHYydnkgPSB2ayAtIHYydi55O1xuXG4gICAgICBsZXQgZHYxdiA9IG5ldyBWZWMyKGR2MXZ4LCBkdjF2eSk7XG4gICAgICBsZXQgZHYydiA9IG5ldyBWZWMyKGR2MnZ4LCBkdjJ2eSk7XG4gICAgICBkdjF2LnJvdGF0ZShoZWFkaW5nKTtcbiAgICAgIGR2MnYucm90YXRlKGhlYWRpbmcpO1xuXG4gICAgICB2MS5hZGQoZHYxdik7XG4gICAgICB2Mi5hZGQoZHYydik7XG5cbiAgICAgIGR2MXYucm90YXRlKC1yMS5oZWFkaW5nKTtcbiAgICAgIGR2MnYucm90YXRlKC1yMi5oZWFkaW5nKTtcblxuICAgICAgbGV0IGRhbmcxID1cbiAgICAgICAgKGR2MXYueSAqIG0xICogcjEubGVuZ3RoKSAvIChhbTEgKyByMS5sZW5ndGggKiByMS5sZW5ndGggKiBtMSk7XG4gICAgICBsZXQgZGFuZzIgPVxuICAgICAgICAtKGR2MnYueSAqIG0yICogcjIubGVuZ3RoKSAvIChhbTIgKyByMi5sZW5ndGggKiByMi5sZW5ndGggKiBtMik7XG5cbiAgICAgIGFuZzEgKz0gZGFuZzE7XG4gICAgICBhbmcyICs9IGRhbmcyO1xuXG4gICAgICBsZXQgdnAxID0gVmVjMi5mcm9tQW5nbGUocjEuaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgIHZwMS5tdWx0KHIxLmxlbmd0aCAqIGRhbmcxKTtcbiAgICAgIGxldCB2cDIgPSBWZWMyLmZyb21BbmdsZShyMi5oZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgdnAyLm11bHQocjIubGVuZ3RoICogZGFuZzIpO1xuICAgICAgdjIuc3ViKHZwMik7XG4gICAgICB2MS5hZGQodnAxKTtcblxuICAgICAgdGhpcy52ZWwgPSB2MTtcbiAgICAgIGJhbGwudmVsID0gdjI7XG5cbiAgICAgIHRoaXMuYW5nID0gYW5nMTtcbiAgICAgIGJhbGwuYW5nID0gYW5nMjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbWFzcywgbW9tZW50IG9kIGludGVydGlhIGFuZFxuICAgKiB0aGUgY2VudHJlIG9mIG1hc3Mgb2YgdGhlIGJvZHlcbiAgICovXG4gIGNhbGN1bGF0ZVBvc0FuZE1hc3MoKSB7XG4gICAgbGV0IHBvbGlnb25zOiBBcnJheTxBcnJheTxWZWMyPj4gPSBbXTtcbiAgICBwb2xpZ29ucy5wdXNoKFtdKTtcbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwb2xpZ29uc1swXS5wdXNoKG5ldyBWZWMyKHAueCwgcC55KSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pc0NvbmNhdmUpIHtcbiAgICAgIGNvbnN0IGluY2x1ZGVzID0gKGFycjogQXJyYXk8bnVtYmVyPiwgaXRlbTogbnVtYmVyKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFycltpXSA9PT0gaXRlbSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGludGVyc2VjdFdpdGhQb2xpZ29uID0gZnVuY3Rpb24oXG4gICAgICAgIHNlZ21lbnQ6IExpbmVTZWdtZW50LFxuICAgICAgICBwb2w6IEFycmF5PFZlYzI+LFxuICAgICAgICBleGNlcHRpb25zOiBBcnJheTxudW1iZXI+XG4gICAgICApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2wubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWluY2x1ZGVzKGV4Y2VwdGlvbnMsIGkpKSB7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBMaW5lU2VnbWVudChcbiAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2ldLngsIHBvbFtpXS55KSxcbiAgICAgICAgICAgICAgbmV3IFZlYzIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS54LCBwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLnkpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKExpbmVTZWdtZW50LmludGVyc2VjdChzZWdtZW50LCBzaWRlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG4gICAgICBsZXQgZm91bmQgPSB0cnVlO1xuXG4gICAgICBjaGVja0FsbFBvbGlnb25zOiB3aGlsZSAoZm91bmQpIHtcbiAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2xpZ29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsxXSwgcG9sWzBdKTtcbiAgICAgICAgICBsZXQgYiA9IFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMV0sIHBvbFswXSk7XG4gICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICBsZXQgayA9IGogKyAyO1xuICAgICAgICAgICAgbGV0IG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LCBwb2xbal0ueSksXG4gICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCwgcG9sW2sgJSBwb2wubGVuZ3RoXS55KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9IG5ldyBWZWMyKFxuICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55XG4gICAgICAgICAgICApLmhlYWRpbmc7XG4gICAgICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICAgICEoYS5oZWFkaW5nID4gYi5oZWFkaW5nXG4gICAgICAgICAgICAgICAgPyAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiYgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpXG4gICAgICAgICAgICAgICAgOiBuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJiBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykgfHxcbiAgICAgICAgICAgICAgaW50ZXJzZWN0V2l0aFBvbGlnb24oXG4gICAgICAgICAgICAgICAgbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2ogJSBwb2wubGVuZ3RoXS54LCBwb2xbaiAlIHBvbC5sZW5ndGhdLnkpLFxuICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LCBwb2xbayAlIHBvbC5sZW5ndGhdLnkpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBwb2wsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgKHBvbC5sZW5ndGggLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICBqICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgIChrIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LCBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LCBwb2xbayAlIHBvbC5sZW5ndGhdLnkpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIG5ld1NpZGVIZWFkaW5nID0gbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgbmV3U2lkZS5iLnggLSBuZXdTaWRlLmEueCxcbiAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55XG4gICAgICAgICAgICAgICkuaGVhZGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwb2wxID0gW107XG4gICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgbCA9IGo7IGwgPD0gazsgbCsrKSB7XG4gICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgcG9sLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYSA9IFZlYzIuc3ViKHBvbFsoaiArIDEpICUgcG9sLmxlbmd0aF0sIHBvbFtqXSk7XG4gICAgICAgICAgICBsZXQgYiA9IFZlYzIuc3ViKHBvbFtqIC0gMV0sIHBvbFtqXSk7XG4gICAgICAgICAgICBsZXQgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKGEsIGIpO1xuICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgIGxldCBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LCBwb2xbal0ueSksXG4gICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LCBwb2xbayAlIHBvbC5sZW5ndGhdLnkpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGxldCBuZXdTaWRlSGVhZGluZyA9IG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueVxuICAgICAgICAgICAgICApLmhlYWRpbmc7XG4gICAgICAgICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgICAgICAhKGEuaGVhZGluZyA+IGIuaGVhZGluZ1xuICAgICAgICAgICAgICAgICAgPyAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmIG5ld1NpZGVIZWFkaW5nIDwgYi5oZWFkaW5nKVxuICAgICAgICAgICAgICAgICAgOiBuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJiBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykgfHxcbiAgICAgICAgICAgICAgICBpbnRlcnNlY3RXaXRoUG9saWdvbihuZXdTaWRlLCBwb2wsIFtcbiAgICAgICAgICAgICAgICAgIChqIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCwgcG9sW2sgJSBwb2wubGVuZ3RoXS55KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPSBuZXcgVmVjMihcbiAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55XG4gICAgICAgICAgICAgICAgKS5oZWFkaW5nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxldCBwb2wxID0gW107XG4gICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgIHBvbDEucHVzaChwb2xbbCAlIHBvbC5sZW5ndGhdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBvbGlnb25zW2ldID0gcG9sMTtcbiAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgY29udGludWUgY2hlY2tBbGxQb2xpZ29ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gcG9saWdvbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgIHdoaWxlIChwb2wubGVuZ3RoID4gMykge1xuICAgICAgICBwb2xpZ29ucy5wdXNoKFtwb2xbMF0sIHBvbFsxXSwgcG9sWzJdXSk7XG4gICAgICAgIHBvbC5zcGxpY2UoMSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG1TdW0gPSAwO1xuICAgIGxldCBhbVN1bSA9IDA7XG4gICAgbGV0IHBTdW0gPSBuZXcgVmVjMigwLCAwKTtcbiAgICBwb2xpZ29ucy5mb3JFYWNoKChwb2wpID0+IHtcbiAgICAgIGxldCBhID0gTWF0aC5zcXJ0KFxuICAgICAgICBNYXRoLnBvdyhwb2xbMF0ueCAtIHBvbFsxXS54LCAyKSArIE1hdGgucG93KHBvbFswXS55IC0gcG9sWzFdLnksIDIpXG4gICAgICApO1xuICAgICAgbGV0IGIgPSBNYXRoLnNxcnQoXG4gICAgICAgIE1hdGgucG93KHBvbFsxXS54IC0gcG9sWzJdLngsIDIpICsgTWF0aC5wb3cocG9sWzFdLnkgLSBwb2xbMl0ueSwgMilcbiAgICAgICk7XG4gICAgICBsZXQgYyA9IE1hdGguc3FydChcbiAgICAgICAgTWF0aC5wb3cocG9sWzJdLnggLSBwb2xbMF0ueCwgMikgKyBNYXRoLnBvdyhwb2xbMl0ueSAtIHBvbFswXS55LCAyKVxuICAgICAgKTtcbiAgICAgIGxldCBzID0gKGEgKyBiICsgYykgLyAyO1xuICAgICAgbGV0IG0gPSBNYXRoLnNxcnQocyAqIChzIC0gYSkgKiAocyAtIGIpICogKHMgLSBjKSk7XG4gICAgICBtU3VtICs9IG07XG4gICAgICBwU3VtLnggKz0gKG0gKiAocG9sWzBdLnggKyBwb2xbMV0ueCArIHBvbFsyXS54KSkgLyAzO1xuICAgICAgcFN1bS55ICs9IChtICogKHBvbFswXS55ICsgcG9sWzFdLnkgKyBwb2xbMl0ueSkpIC8gMztcbiAgICB9KTtcbiAgICBwU3VtLmRpdihtU3VtKTtcbiAgICB0aGlzLnBvcyA9IHBTdW07XG4gICAgdGhpcy5tID0gbVN1bTtcblxuICAgIC8vIGNhbGN1bGF0aW5nIHRoZSBtb21lbnQgb2YgaW5lcnRpYSBmaW5hbGx5XG4gICAgZm9yIChsZXQgcG9sIG9mIHBvbGlnb25zKSB7XG4gICAgICBsZXQgYSA9IE1hdGguc3FydChcbiAgICAgICAgTWF0aC5wb3cocG9sWzBdLnggLSBwb2xbMV0ueCwgMikgKyBNYXRoLnBvdyhwb2xbMF0ueSAtIHBvbFsxXS55LCAyKVxuICAgICAgKTtcbiAgICAgIGxldCBiID0gTWF0aC5zcXJ0KFxuICAgICAgICBNYXRoLnBvdyhwb2xbMV0ueCAtIHBvbFsyXS54LCAyKSArIE1hdGgucG93KHBvbFsxXS55IC0gcG9sWzJdLnksIDIpXG4gICAgICApO1xuICAgICAgbGV0IGMgPSBNYXRoLnNxcnQoXG4gICAgICAgIE1hdGgucG93KHBvbFsyXS54IC0gcG9sWzBdLngsIDIpICsgTWF0aC5wb3cocG9sWzJdLnkgLSBwb2xbMF0ueSwgMilcbiAgICAgICk7XG4gICAgICBsZXQgdyA9IE1hdGgubWF4KGEsIGIsIGMpO1xuICAgICAgbGV0IHMgPSAoYSArIGIgKyBjKSAvIDI7XG4gICAgICBsZXQgbSA9IE1hdGguc3FydChzICogKHMgLSBhKSAqIChzIC0gYikgKiAocyAtIGMpKTtcbiAgICAgIGxldCBoID0gKDIgKiBtKSAvIHc7XG4gICAgICBsZXQgd3BhcnRpYWwgPSBNYXRoLnNxcnQoTWF0aC5taW4oYSwgYywgYikgKiogMiAtIGggKiBoKTtcbiAgICAgIGxldCBhbSA9IChoICogdyAqIChoICogaCArIHcgKiB3KSkgLyAyNDtcbiAgICAgIGxldCBkID0gTWF0aC5zcXJ0KChoICogaCkgLyAzNiArIChNYXRoLmFicyh3cGFydGlhbCAtIHcgLyAyKSAvIDMpICoqIDIpO1xuICAgICAgYW0gLT0gZCAqIGQgKiBtO1xuICAgICAgYW0gKz1cbiAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgKHBvbFswXS54ICsgcG9sWzFdLnggKyBwb2xbMl0ueCkgLyAzLFxuICAgICAgICAgIChwb2xbMF0ueSArIHBvbFsxXS55ICsgcG9sWzJdLnkpIC8gM1xuICAgICAgICApLmRpc3QodGhpcy5wb3MpICoqXG4gICAgICAgICAgMiAqXG4gICAgICAgIG07XG4gICAgICBhbVN1bSArPSBhbTtcbiAgICB9XG4gICAgdGhpcy5hbSA9IGFtU3VtO1xuICB9XG5cbiAgLyoqXG4gICAqIFJvdGF0ZXMgdGhlIGJvZHkgYXJvdW5kIGl0J3MgY2VudHJlIG9mIG1hc3MgYnkgYSBnaXZlbiBhbmdlXG4gICAqIEhhcyB0byBkbyB0aGUgdHJhbnNmb3JtYXRpb24gZm9yIGFsbCB0aGUgcG9pbnRzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSBSb3RhdGlvbiBhbmdsZVxuICAgKi9cbiAgcm90YXRlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBsZXQgcG9pbnQgPSBuZXcgVmVjMihwLngsIHAueSk7XG4gICAgICBwb2ludC5zdWIodGhpcy5wb3MpO1xuICAgICAgcG9pbnQucm90YXRlKGFuZ2xlKTtcbiAgICAgIHBvaW50LmFkZCh0aGlzLnBvcyk7XG4gICAgICBwLnggPSBwb2ludC54O1xuICAgICAgcC55ID0gcG9pbnQueTtcbiAgICB9KTtcbiAgICB0aGlzLnJvdGF0aW9uICs9IGFuZ2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIG91dCBpZiB0aGUgYm9keSBpcyBjb25jYXZlIG9yIG5vdFxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSBib2R5IGlzIGNvbmNhdmVcbiAgICovXG4gIGdldCBpc0NvbmNhdmUoKSB7XG4gICAgbGV0IHBvbCA9IHRoaXMucG9pbnRzO1xuICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coXG4gICAgICBWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDFdLCBwb2xbMF0pXG4gICAgKTtcbiAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvbC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhcbiAgICAgICAgVmVjMi5zdWIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXSwgcG9sW2ldKSxcbiAgICAgICAgVmVjMi5zdWIocG9sW2kgLSAxXSwgcG9sW2ldKVxuICAgICAgKTtcbiAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coXG4gICAgICBWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAyXSwgcG9sW3BvbC5sZW5ndGggLSAxXSlcbiAgICApO1xuICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEb2VzIHRoZSBjb2xsaXNpb24gYWxnb3JpdGhtIGJldHdlZW4gdHdvIGJvZGllc1xuICAgKiBAcGFyYW0ge0JvZHl9IGIxIEZpcnN0IGJvZHlcbiAgICogQHBhcmFtIHtCb2R5fSBiMiBTZWNvbmQgYm9keVxuICAgKi9cbiAgc3RhdGljIGNvbGxpZGUoYjE6IEJvZHksIGIyOiBCb2R5KSB7XG4gICAgbGV0IG1hdGNoZXMgPSAwO1xuICAgIGxldCBoZWFkaW5nID0gMDtcbiAgICBsZXQgY3AgPSBuZXcgVmVjMigwLCAwKTtcbiAgICBsZXQgY3BzOiBBcnJheTxWZWMyPiA9IFtdO1xuICAgIGxldCBpbnRlcnNlY3QgPSBmYWxzZTtcbiAgICBiMS5wb2ludHMuZm9yRWFjaCgocCwgaWR4KSA9PiB7XG4gICAgICBsZXQgc2lkZTEgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgIG5ldyBWZWMyKHAueCwgcC55KSxcbiAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgYjEucG9pbnRzWyhpZHggKyAxKSAlIGIxLnBvaW50cy5sZW5ndGhdLngsXG4gICAgICAgICAgYjEucG9pbnRzWyhpZHggKyAxKSAlIGIxLnBvaW50cy5sZW5ndGhdLnlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGIyLnBvaW50cy5mb3JFYWNoKChwcCwgaWR4eCkgPT4ge1xuICAgICAgICBsZXQgc2lkZTIgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgbmV3IFZlYzIocHAueCwgcHAueSksXG4gICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICBiMi5wb2ludHNbKGlkeHggKyAxKSAlIGIyLnBvaW50cy5sZW5ndGhdLngsXG4gICAgICAgICAgICBiMi5wb2ludHNbKGlkeHggKyAxKSAlIGIyLnBvaW50cy5sZW5ndGhdLnlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGxldCBzZWN0ID0gTGluZVNlZ21lbnQuaW50ZXJzZWN0KHNpZGUxLCBzaWRlMik7XG4gICAgICAgIGlmIChzZWN0KSB7XG4gICAgICAgICAgbWF0Y2hlcysrO1xuICAgICAgICAgIGNwLmFkZChzZWN0KTtcbiAgICAgICAgICBjcHMucHVzaChzZWN0KTtcbiAgICAgICAgICBpbnRlcnNlY3QgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmICghaW50ZXJzZWN0KSByZXR1cm47XG4gICAgY3AuZGl2KG1hdGNoZXMpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKG1hdGNoZXMgLyAyKTsgaSsrKSB7XG4gICAgICBoZWFkaW5nICs9IFZlYzIuc3ViKGNwc1syICogaSArIDFdLCBjcHNbMiAqIGldKS5oZWFkaW5nO1xuICAgIH1cbiAgICBoZWFkaW5nIC89IG1hdGNoZXMgLyAyO1xuICAgIGhlYWRpbmcgKz0gTWF0aC5QSSAvIDI7XG5cbiAgICBsZXQgYSA9IFZlYzIuZnJvbUFuZ2xlKGhlYWRpbmcpO1xuXG4gICAgbGV0IG1vdmUxTWluID0gMDtcbiAgICBsZXQgbW92ZTFNYXggPSAwO1xuICAgIGxldCBtb3ZlMk1pbiA9IDA7XG4gICAgbGV0IG1vdmUyTWF4ID0gMDtcbiAgICBmb3IgKGxldCBwb2ludCBvZiBiMS5wb2ludHMpIHtcbiAgICAgIG1vdmUxTWluID0gTWF0aC5taW4oXG4gICAgICAgIFZlYzIuZG90KGEsIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLFxuICAgICAgICBtb3ZlMU1pblxuICAgICAgKTtcbiAgICAgIG1vdmUxTWF4ID0gTWF0aC5tYXgoXG4gICAgICAgIFZlYzIuZG90KGEsIFZlYzIuc3ViKG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpLCBjcCkpLFxuICAgICAgICBtb3ZlMU1heFxuICAgICAgKTtcbiAgICB9XG4gICAgZm9yIChsZXQgcG9pbnQgb2YgYjIucG9pbnRzKSB7XG4gICAgICBtb3ZlMk1pbiA9IE1hdGgubWluKFxuICAgICAgICBWZWMyLmRvdChhLCBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSxcbiAgICAgICAgbW92ZTJNaW5cbiAgICAgICk7XG4gICAgICBtb3ZlMk1heCA9IE1hdGgubWF4KFxuICAgICAgICBWZWMyLmRvdChhLCBWZWMyLnN1YihuZXcgVmVjMihwb2ludC54LCBwb2ludC55KSwgY3ApKSxcbiAgICAgICAgbW92ZTJNYXhcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChNYXRoLmFicyhtb3ZlMU1pbiAtIG1vdmUyTWF4KSA8IE1hdGguYWJzKG1vdmUyTWluIC0gbW92ZTFNYXgpKSB7XG4gICAgICBiMS5tb3ZlKC1hLnggKiBtb3ZlMU1pbiwgLWEueSAqIG1vdmUxTWluKTtcbiAgICAgIGIyLm1vdmUoLWEueCAqIG1vdmUyTWF4LCAtYS55ICogbW92ZTJNYXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBiMS5tb3ZlKC1hLnggKiBtb3ZlMU1heCwgLWEueSAqIG1vdmUxTWF4KTtcbiAgICAgIGIyLm1vdmUoLWEueCAqIG1vdmUyTWluLCAtYS55ICogbW92ZTJNaW4pO1xuICAgIH1cblxuICAgIGxldCBrID0gKGIxLmsgKyBiMi5rKSAvIDI7XG4gICAgLy8gbGV0IHZlbDFwYXJyYWxlbCA9IFZlYzIuY3Jvc3MoYjEudmVsLCBhKTtcbiAgICBsZXQgdmVsMXBlcnBlbmRpY3VsYXIgPSBWZWMyLmRvdChiMS52ZWwsIGEpO1xuICAgIC8vIGxldCB2ZWwycGFycmFsZWwgPSBWZWMyLmNyb3NzKGIyLnZlbCwgYSk7XG4gICAgbGV0IHZlbDJwZXJwZW5kaWN1bGFyID0gVmVjMi5kb3QoYjIudmVsLCBhKTtcblxuICAgIGxldCBuZXdWZWwxUGVycGVuZGljdWxhciA9XG4gICAgICAoKDEgKyBrKSAqIChiMS5tICogdmVsMXBlcnBlbmRpY3VsYXIgKyBiMi5tICogdmVsMnBlcnBlbmRpY3VsYXIpKSAvXG4gICAgICAgIChiMS5tICsgYjIubSkgLVxuICAgICAgayAqIHZlbDFwZXJwZW5kaWN1bGFyO1xuICAgIGxldCBuZXdWZWwyUGVycGVuZGljdWxhciA9XG4gICAgICAoKDEgKyBrKSAqIChiMS5tICogdmVsMXBlcnBlbmRpY3VsYXIgKyBiMi5tICogdmVsMnBlcnBlbmRpY3VsYXIpKSAvXG4gICAgICAgIChiMS5tICsgYjIubSkgLVxuICAgICAgayAqIHZlbDJwZXJwZW5kaWN1bGFyO1xuXG4gICAgYjEudmVsLmFkZChWZWMyLm11bHQoYS5jb3B5LCBuZXdWZWwxUGVycGVuZGljdWxhciAtIHZlbDFwZXJwZW5kaWN1bGFyKSk7XG4gICAgYjIudmVsLmFkZChWZWMyLm11bHQoYS5jb3B5LCBuZXdWZWwyUGVycGVuZGljdWxhciAtIHZlbDJwZXJwZW5kaWN1bGFyKSk7XG4gIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc2VnbWVudCBvZiBhIGxpbmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZVNlZ21lbnQge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHNlZ21lbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgU3RhcnRpbmcgcG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgRW5kaW5nIHBvaW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIGE6IFZlYzIsIHB1YmxpYyBiOiBWZWMyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBsZW5ndGhcbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBWZWMyLmRpc3QodGhpcy5hLCB0aGlzLmIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiBhIHBvaW50IGFuZCB0aGUgbGluZSBzZWdtZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBwIFRoZSBwb2ludCBhcyBhIHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlXG4gICAgICovXG4gICAgZGlzdEZyb21Qb2ludChwOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGUgPSBWZWMyLnN1Yih0aGlzLmEsIHRoaXMuYik7XG4gICAgICAgIGxldCBBID0gVmVjMi5zdWIocCwgdGhpcy5iKTtcbiAgICAgICAgbGV0IEIgPSBWZWMyLnN1YihwLCB0aGlzLmEpO1xuICAgICAgICBsZXQgYSA9IEEubGVuZ3RoO1xuICAgICAgICBsZXQgYiA9IEIubGVuZ3RoO1xuICAgICAgICBsZXQgYyA9IGUubGVuZ3RoO1xuICAgICAgICBpZiAoYyA9PT0gMCkgcmV0dXJuIGE7XG4gICAgICAgIGxldCBnYW1tYSA9IFZlYzIuYW5nbGUoQSwgQik7XG4gICAgICAgIGxldCBiZXRoYSA9IFZlYzIuYW5nbGUoQSwgZSk7XG4gICAgICAgIGxldCBhbHBoYSA9IE1hdGguUEkgLSBnYW1tYSAtIGJldGhhO1xuICAgICAgICBsZXQgYXJlYSA9IE1hdGguc2luKGFscGhhKSAqIGIgKiBjIC8gMjtcbiAgICAgICAgbGV0IG0gPSAyICogYXJlYSAvIGM7XG4gICAgICAgIGlmIChhbHBoYSA+IE1hdGguUEkgLyAyKSByZXR1cm4gYjtcbiAgICAgICAgaWYgKGJldGhhID4gTWF0aC5QSSAvIDIpIHJldHVybiBhO1xuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgaWYgdGhleSBpbnRlcnNlY3Qgb3Igbm90XG4gICAgICogSWYgdGhleSBpbnRlcnNlY3QgaXQgcmV0dXJucyB0aGUgaW50ZXJzZWN0aW9uIHBvaW50XG4gICAgICogSWYgdGhleSBub3QgaXQgcmV0dXJucyB1bmRlZmluZWRcbiAgICAgKiBAcGFyYW0ge0xpbmVTZWdtZW50fSBzZWdtZW50MSBBIHNlZ21lbnRcbiAgICAgKiBAcGFyYW0ge0xpbmVTZWdtZW50fSBzZWdtZW50MiBPdGhlciBzZWdtZW50XG4gICAgICogQHJldHVybiB7VmVjMn0gSW50ZXJzZXRpb24gcG9pbnRcbiAgICAgKi9cbiAgICBzdGF0aWMgaW50ZXJzZWN0KHNlZ21lbnQxOiBMaW5lU2VnbWVudCwgc2VnbWVudDI6IExpbmVTZWdtZW50KTogVmVjMiB7XG4gICAgICAgIGxldCB2MSA9IFZlYzIuc3ViKHNlZ21lbnQxLmIsIHNlZ21lbnQxLmEpO1xuICAgICAgICBsZXQgYTEgPSB2MS55IC8gdjEueDtcbiAgICAgICAgbGV0IGMxID0gc2VnbWVudDEuYi55IC0gKHNlZ21lbnQxLmIueCAqIGExKTtcblxuICAgICAgICBsZXQgdjIgPSBWZWMyLnN1YihzZWdtZW50Mi5iLCBzZWdtZW50Mi5hKTtcbiAgICAgICAgbGV0IGEyID0gdjIueSAvIHYyLng7XG4gICAgICAgIGxldCBjMiA9IHNlZ21lbnQyLmIueSAtIChzZWdtZW50Mi5iLnggKiBhMik7XG5cbiAgICAgICAgaWYgKHYxLnggPT09IDAgJiYgdjIueCAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKChzZWdtZW50MS5hLnggPj0gc2VnbWVudDIuYS54ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudDEuYS54IDw9IHNlZ21lbnQyLmIueCkgfHxcbiAgICAgICAgICAgICAgICAoc2VnbWVudDEuYS54IDw9IHNlZ21lbnQyLmEueCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50MS5hLnggPj0gc2VnbWVudDIuYi54KSkge1xuICAgICAgICAgICAgICAgIGxldCBoID0gYTIgKiBzZWdtZW50MS5hLnggKyBjMjtcbiAgICAgICAgICAgICAgICBpZiAoKGggPiBzZWdtZW50MS5hLnkgJiYgaCA8IHNlZ21lbnQxLmIueSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGggPCBzZWdtZW50MS5hLnkgJiYgaCA+IHNlZ21lbnQxLmIueSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHNlZ21lbnQxLmEueCwgaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodjIueCA9PT0gMCAmJiB2MS54ICE9PSAwKSB7XG4gICAgICAgICAgICBpZiAoKHNlZ21lbnQyLmEueCA+PSBzZWdtZW50MS5hLnggJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50Mi5hLnggPD0gc2VnbWVudDEuYi54KSB8fFxuICAgICAgICAgICAgICAgIChzZWdtZW50Mi5hLnggPD0gc2VnbWVudDEuYS54ICYmXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnQyLmEueCA+PSBzZWdtZW50MS5iLngpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGggPSBhMSAqIHNlZ21lbnQyLmEueCArIGMxO1xuICAgICAgICAgICAgICAgIGlmICgoaCA+IHNlZ21lbnQyLmEueSAmJiBoIDwgc2VnbWVudDIuYi55KSB8fFxuICAgICAgICAgICAgICAgICAgICAoaCA8IHNlZ21lbnQyLmEueSAmJiBoID4gc2VnbWVudDIuYi55KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoc2VnbWVudDIuYS54LCBoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2MS54ID09PSAwICYmIHYyLnggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChzZWdtZW50MS5hLnggPT09IHNlZ21lbnQyLmEueCkge1xuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbDE7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ21lbnQxLmEueSA8IHNlZ21lbnQxLmIueSkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYS55LCBzZWdtZW50MS5iLnldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMSA9IFtzZWdtZW50MS5iLnksIHNlZ21lbnQxLmEueV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbDI7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ21lbnQyLmEueSA8IHNlZ21lbnQyLmIueSkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYS55LCBzZWdtZW50Mi5iLnldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMiA9IFtzZWdtZW50Mi5iLnksIHNlZ21lbnQyLmEueV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnZhbCA9IFsoaW50ZXJ2YWwxWzBdID4gaW50ZXJ2YWwyWzBdKSA/XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMVswXSA6IGludGVydmFsMlswXSxcbiAgICAgICAgICAgICAgICAoaW50ZXJ2YWwxWzFdIDwgaW50ZXJ2YWwyWzFdKSA/XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsMVsxXSA6IGludGVydmFsMlsxXSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbFswXSA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoc2VnbWVudDEuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbnRlcnZhbDE7XG4gICAgICAgIGlmIChzZWdtZW50MS5hLnggPCBzZWdtZW50MS5iLngpIHtcbiAgICAgICAgICAgIGludGVydmFsMSA9IFtzZWdtZW50MS5hLngsIHNlZ21lbnQxLmIueF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnRlcnZhbDEgPSBbc2VnbWVudDEuYi54LCBzZWdtZW50MS5hLnhdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbDI7XG4gICAgICAgIGlmIChzZWdtZW50Mi5hLnggPCBzZWdtZW50Mi5iLngpIHtcbiAgICAgICAgICAgIGludGVydmFsMiA9IFtzZWdtZW50Mi5hLngsIHNlZ21lbnQyLmIueF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnRlcnZhbDIgPSBbc2VnbWVudDIuYi54LCBzZWdtZW50Mi5hLnhdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbnRlcnZhbCA9IFsoaW50ZXJ2YWwxWzBdID4gaW50ZXJ2YWwyWzBdKSA/XG4gICAgICAgICAgICBpbnRlcnZhbDFbMF0gOiBpbnRlcnZhbDJbMF0sXG4gICAgICAgIChpbnRlcnZhbDFbMV0gPCBpbnRlcnZhbDJbMV0pID9cbiAgICAgICAgICAgIGludGVydmFsMVsxXSA6IGludGVydmFsMlsxXSxcbiAgICAgICAgXTtcbiAgICAgICAgLy8gSWYgdGhleSBhcmUgcGFycmFsZWwgdGhlIG9ubHkgdGltZSB0aGV5IGludGVyc2VjdCBpcyB3aGVuIGMxID09IGMyLlxuICAgICAgICBpZiAoKGExID09PSBhMikgJiYgYzEgPT09IGMyICYmIGludGVydmFsWzBdIDw9IGludGVydmFsWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzIoKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMixcbiAgICAgICAgICAgICAgICAoKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMikgKiBhMSArIGMxKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeCA9IChjMiAtIGMxKSAvIChhMSAtIGEyKTtcbiAgICAgICAgaWYgKHggPj0gaW50ZXJ2YWxbMF0gJiYgeCA8PSBpbnRlcnZhbFsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHgsIHggKiBhMSArIGMxKTtcbiAgICAgICAgfSBlbHNlIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5pbXBvcnQgV2FsbCBmcm9tICcuL3dhbGwnO1xuaW1wb3J0IExpbmVTZWdtZW50IGZyb20gJy4vbGluZXNlZ21lbnQnO1xuaW1wb3J0IFN0aWNrIGZyb20gJy4vc3RpY2snO1xuaW1wb3J0IFNwcmluZyBmcm9tICcuL3NwcmluZyc7XG5pbXBvcnQgU29mdEJhbGwgZnJvbSAnLi9zb2Z0YmFsbCc7XG5pbXBvcnQgQm9keSBmcm9tICcuL2JvZHknO1xuXG4vKipcbiAqIENsYXNzIHRoYXQgY3JlYXRlcyBhIG5ldyB3b3JsZCBiYSB0aGUgcGh5c2ljcyBlbmdpbmVcbiAqL1xuY2xhc3MgUGh5c2ljcyB7XG4gIGJhbGxzOiBBcnJheTxCYWxsPjtcbiAgYm9kaWVzOiBBcnJheTxCb2R5PjtcbiAgZml4ZWRCYWxsczogQXJyYXk8eyB4OiBudW1iZXI7IHk6IG51bWJlcjsgcjogbnVtYmVyIH0+O1xuICBzb2Z0QmFsbHM6IEFycmF5PFNvZnRCYWxsPjtcbiAgd2FsbHM6IEFycmF5PFdhbGw+O1xuICBib3VuZHM6IEFycmF5PFdhbGw+O1xuICBzcHJpbmdzOiBBcnJheTxTcHJpbmc+O1xuICBhaXJGcmljdGlvbjogbnVtYmVyO1xuICBncmF2aXR5OiBWZWMyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5kIGluaXRhbGl6ZSBhIG5ldyB3b3JsZFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5iYWxscyA9IFtdO1xuICAgIHRoaXMuYm9kaWVzID0gW107XG4gICAgdGhpcy5maXhlZEJhbGxzID0gW107XG4gICAgdGhpcy5zb2Z0QmFsbHMgPSBbXTtcblxuICAgIHRoaXMud2FsbHMgPSBbXTtcblxuICAgIHRoaXMuYm91bmRzID0gW107XG5cbiAgICB0aGlzLnNwcmluZ3MgPSBbXTtcblxuICAgIC8vIEFpciBmcmljdGlvbiBoYXMgdG8gYmUgYmV0d2VlbiAwIGFuZCAxXG4gICAgLy8gMCAtIG5vIG1vdmVtZW50XG4gICAgLy8gMSAtIG5vIGZyaWN0aW9uXG4gICAgdGhpcy5haXJGcmljdGlvbiA9IDE7XG5cbiAgICB0aGlzLmdyYXZpdHkgPSBuZXcgVmVjMigwLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB3b3JsZCBieSBhIGdpdmVuIGFtb3VudCBvZiB0aW1lXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHByZWNpc2UgSWYgdGhpcyBpcyB0cnVlLFxuICAgKiB0aGVuIHRoZSBzaW11bGF0aW9uIGlzIGdvaW5nIHRvIGJlIG1vcmUgcHJlY2lzZVxuICAgKi9cbiAgdXBkYXRlKHQ6IG51bWJlciwgcHJlY2lzZTogYm9vbGVhbikge1xuICAgIC8vIERvIHRoZSBzaW11bGF0aW9uIG9uIHRoZSByZXZlcnNlZCBzeXN0ZW1cbiAgICAvLyBpZiB0aGUgc2ltdWxhdGlvbiBpcyBpbiBwcmVjaXNlIG1vZGVcbiAgICBsZXQgY2xvbmVkU3lzdGVtOiBQaHlzaWNzID0gcHJlY2lzZSA/IHRoaXMuY29weSA6IG5ldyBQaHlzaWNzKCk7XG4gICAgaWYgKHByZWNpc2UpIHtcbiAgICAgIGNsb25lZFN5c3RlbS5ib2RpZXMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLmJhbGxzLnJldmVyc2UoKTtcbiAgICAgIGNsb25lZFN5c3RlbS51cGRhdGUodCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIEF0IGZpcnN0IG1vdmUgb2JqZXRzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBNb3ZlXG4gICAgICB0aGlzLmJhbGxzW2ldLmxhc3RQb3MgPSB0aGlzLmJhbGxzW2ldLnBvcy5jb3B5O1xuICAgICAgdGhpcy5iYWxsc1tpXS5wb3MuYWRkKFZlYzIubXVsdCh0aGlzLmJhbGxzW2ldLnZlbCwgdCkpO1xuXG4gICAgICAvLyBBbmd1bGFyIHZlbG9jaXR5XG4gICAgICB0aGlzLmJhbGxzW2ldLnJvdGF0aW9uICs9IHRoaXMuYmFsbHNbaV0uYW5nICogdDtcbiAgICAgIHRoaXMuYmFsbHNbaV0ucm90YXRpb24gJT0gTWF0aC5QSSAqIDI7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYm9kaWVzW2ldLmxhc3RQb3MgPSB0aGlzLmJvZGllc1tpXS5wb3MuY29weTtcbiAgICAgIHRoaXMuYm9kaWVzW2ldLm1vdmUodGhpcy5ib2RpZXNbaV0udmVsLnggKiB0LCB0aGlzLmJvZGllc1tpXS52ZWwueSAqIHQpO1xuICAgICAgdGhpcy5ib2RpZXNbaV0ucm90YXRlKHRoaXMuYm9kaWVzW2ldLmFuZyAqIHQpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBzcHJpbmdzIG11bHRpcGxlIHRpbWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5zcHJpbmdzKSB7XG4gICAgICAgIGVsZW1lbnQudXBkYXRlKHQgLyAzIC8gMik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBBcHBseSBncmF2aXR5XG4gICAgICBpZiAodGhpcy5ncmF2aXR5KSB7XG4gICAgICAgIHRoaXMuYmFsbHNbaV0udmVsLmFkZChuZXcgVmVjMih0aGlzLmdyYXZpdHkueCAqIHQsIHRoaXMuZ3Jhdml0eS55ICogdCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBDb2xsaXNpb25cbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHRoaXMuYmFsbHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuYmFsbHNbaV0ubGF5ZXIgIT0gdGhpcy5iYWxsc1tqXS5sYXllciB8fFxuICAgICAgICAgICghdGhpcy5iYWxsc1tpXS5sYXllciAmJiAhdGhpcy5iYWxsc1tqXS5sYXllcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgQmFsbC5jb2xsaWRlKHRoaXMuYmFsbHNbaV0sIHRoaXMuYmFsbHNbal0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvbiB3aXRoIHdhbGxzXG4gICAgICBmb3IgKGxldCB3YWxsIG9mIHRoaXMud2FsbHMpIHtcbiAgICAgICAgd2FsbC5jb2xsaWRlV2l0aEJhbGwodGhpcy5iYWxsc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbGxpc2lvbiB3aXRoIGZpeGVkIGJhbGxzXG4gICAgICBmb3IgKGxldCBiIG9mIHRoaXMuZml4ZWRCYWxscykge1xuICAgICAgICBsZXQgYmFsbCA9IHRoaXMuYmFsbHNbaV07XG5cbiAgICAgICAgbGV0IGhlYWRpbmc7XG4gICAgICAgIGxldCByZWwgPSAwO1xuICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKGIueCwgYi55KTtcbiAgICAgICAgcC54IC09IGJhbGwucG9zLng7XG4gICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICBwLm11bHQoLTEpO1xuICAgICAgICBpZiAocC5sZW5ndGggPD0gYmFsbC5yICsgYi5yKSB7XG4gICAgICAgICAgaGVhZGluZyA9IHAuaGVhZGluZztcbiAgICAgICAgICByZWwgPSBwLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpeGVkQmFsbENvbGxpc2lvbjogaWYgKGhlYWRpbmcgPT09IDAgfHwgaGVhZGluZykge1xuICAgICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICBsZXQgdmVsID0gbmV3IFZlYzIoYmFsbC52ZWwueCwgYmFsbC52ZWwueSk7XG4gICAgICAgICAgcG9zLnJvdGF0ZSgtaGVhZGluZyArIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICB2ZWwucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuXG4gICAgICAgICAgaWYgKHZlbC55ID4gMCkgYnJlYWsgZml4ZWRCYWxsQ29sbGlzaW9uO1xuICAgICAgICAgIHZlbC55ICo9IC1iYWxsLms7XG4gICAgICAgICAgcG9zLnkgKz0gYmFsbC5yICsgYi5yIC0gcmVsO1xuICAgICAgICAgIGxldCBkdnkgPSB2ZWwueSAqICgxICsgMSAvIGJhbGwuayk7XG5cbiAgICAgICAgICBsZXQgZGVsdGFBbmcgPVxuICAgICAgICAgICAgKE1hdGguc2lnbih2ZWwueCAtIGJhbGwuYW5nICogYmFsbC5yKSAqIChkdnkgKiBiYWxsLmZjKSkgL1xuICAgICAgICAgICAgKGJhbGwuYW1jICogYmFsbC5yKTtcbiAgICAgICAgICBsZXQgbWF4RGVsdGFBbmcgPSAodmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgLyBiYWxsLnI7XG5cbiAgICAgICAgICBpZiAoZGVsdGFBbmcgLyBtYXhEZWx0YUFuZyA+IDEpIGRlbHRhQW5nID0gbWF4RGVsdGFBbmc7XG4gICAgICAgICAgZGVsdGFBbmcgKj0gYmFsbC5hbWMgLyAoYmFsbC5hbWMgKyAxKTtcbiAgICAgICAgICBiYWxsLmFuZyArPSBkZWx0YUFuZztcblxuICAgICAgICAgIGxldCBkdnggPSBkZWx0YUFuZyAqIGJhbGwucjtcblxuICAgICAgICAgIHZlbC54IC09IGR2eDtcblxuICAgICAgICAgIHBvcy5yb3RhdGUoaGVhZGluZyAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICB2ZWwucm90YXRlKGhlYWRpbmcgLSBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgYmFsbC5wb3MueCA9IHBvcy54O1xuICAgICAgICAgIGJhbGwucG9zLnkgPSBwb3MueTtcbiAgICAgICAgICBiYWxsLnZlbC54ID0gdmVsLng7XG4gICAgICAgICAgYmFsbC52ZWwueSA9IHZlbC55O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJvdW5jZSBvZmYgdGhlIGVkZ2VzXG4gICAgICBmb3IgKGxldCBib3VuZCBvZiB0aGlzLmJvdW5kcykge1xuICAgICAgICBib3VuZC5jb2xsaWRlV2l0aEJhbGwodGhpcy5iYWxsc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgYmFsbCBvZiB0aGlzLmJhbGxzKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBiYWxsLmxheWVyICE9IHRoaXMuYm9kaWVzW2ldLmxheWVyIHx8XG4gICAgICAgICAgKCFiYWxsLmxheWVyICYmICF0aGlzLmJvZGllc1tpXS5sYXllcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5ib2RpZXNbaV0uY29sbGlkZVdpdGhCYWxsKGJhbGwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmJvZGllc1tpXS5sYXllciAhPSB0aGlzLmJvZGllc1tqXS5sYXllciB8fFxuICAgICAgICAgICghdGhpcy5ib2RpZXNbal0ubGF5ZXIgJiYgIXRoaXMuYm9kaWVzW2ldLmxheWVyKVxuICAgICAgICApIHtcbiAgICAgICAgICBCb2R5LmNvbGxpZGUodGhpcy5ib2RpZXNbaV0sIHRoaXMuYm9kaWVzW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBncmF2aXR5XG4gICAgICBpZiAodGhpcy5ncmF2aXR5KSB7XG4gICAgICAgIHRoaXMuYm9kaWVzW2ldLnZlbC5hZGQoXG4gICAgICAgICAgbmV3IFZlYzIodGhpcy5ncmF2aXR5LnggKiB0LCB0aGlzLmdyYXZpdHkueSAqIHQpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHNvZnQgYmFsbHNcbiAgICB0aGlzLnNvZnRCYWxscy5mb3JFYWNoKChzYikgPT4ge1xuICAgICAgU29mdEJhbGwudXBkYXRlUHJlc3N1cmVCYXNlZEZvcmNlcyhzYiwgdCk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3ByaW5ncyBhZ2FpbiBtdWx0aXBsZSB0aW1lc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuc3ByaW5ncykge1xuICAgICAgICBlbGVtZW50LnVwZGF0ZSh0IC8gMyAvIDIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFwcGx5IGFpciBmcmljdGlvblxuICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgYi52ZWwubXVsdChNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KSk7XG4gICAgICBiLmFuZyAqPSBNYXRoLnBvdyh0aGlzLmFpckZyaWN0aW9uLCB0KTtcbiAgICB9KTtcbiAgICB0aGlzLmJvZGllcy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICBiLnZlbC5tdWx0KE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpKTtcbiAgICAgIGIuYW5nICo9IE1hdGgucG93KHRoaXMuYWlyRnJpY3Rpb24sIHQpO1xuICAgIH0pO1xuXG4gICAgLy8gVGhlbiB0YWtlIHRoZSBhdmVyYWdlIG9mIHRoaXMgc3lzdGVtIGFuZCB0aGUgb3RoZXIgc3lzdGVtXG4gICAgLy8gaWYgaW4gcHJlY2lzZSBtb2RlXG4gICAgaWYgKHByZWNpc2UpIHtcbiAgICAgIGNsb25lZFN5c3RlbS5ib2RpZXMucmV2ZXJzZSgpO1xuICAgICAgY2xvbmVkU3lzdGVtLmJhbGxzLnJldmVyc2UoKTtcblxuICAgICAgLy8gVGFrZSB0aGUgYXZlcmFnZSBvZiB0aGUgYmFsbHNcbiAgICAgIHRoaXMuYmFsbHMuZm9yRWFjaCgoYmFsbCwgaSkgPT4ge1xuICAgICAgICBiYWxsLm1vdmUoXG4gICAgICAgICAgKGNsb25lZFN5c3RlbS5iYWxsc1tpXS5wb3MueCAtIGJhbGwucG9zLngpICogMC41LFxuICAgICAgICAgIChjbG9uZWRTeXN0ZW0uYmFsbHNbaV0ucG9zLnkgLSBiYWxsLnBvcy55KSAqIDAuNVxuICAgICAgICApO1xuICAgICAgICBiYWxsLnZlbC5hZGQoXG4gICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnZlbC54IC0gYmFsbC52ZWwueCkgKiAwLjUsXG4gICAgICAgICAgICAoY2xvbmVkU3lzdGVtLmJhbGxzW2ldLnZlbC55IC0gYmFsbC52ZWwueSkgKiAwLjVcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGJhbGwucm90YXRpb24gPSAoYmFsbC5yb3RhdGlvbiArIGNsb25lZFN5c3RlbS5iYWxsc1tpXS5yb3RhdGlvbikgLyAyO1xuICAgICAgICBiYWxsLmFuZyA9IChiYWxsLmFuZyArIGNsb25lZFN5c3RlbS5iYWxsc1tpXS5hbmcpIC8gMjtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUYWtlIHRoZSBhdmVyYWdlIG9mIHRoZSBib2RpZXNcbiAgICAgIHRoaXMuYm9kaWVzLmZvckVhY2goKGJvZHksIGkpID0+IHtcbiAgICAgICAgbGV0IG90aGVyID0gY2xvbmVkU3lzdGVtLmJvZGllc1tpXTtcbiAgICAgICAgYm9keS5tb3ZlKFxuICAgICAgICAgIChvdGhlci5wb3MueCAtIGJvZHkucG9zLngpICogMC41LFxuICAgICAgICAgIChvdGhlci5wb3MueSAtIGJvZHkucG9zLnkpICogMC41XG4gICAgICAgICk7XG4gICAgICAgIGJvZHkudmVsLmFkZChcbiAgICAgICAgICBuZXcgVmVjMihcbiAgICAgICAgICAgIChvdGhlci52ZWwueCAtIGJvZHkudmVsLngpICogMC41LFxuICAgICAgICAgICAgKG90aGVyLnZlbC55IC0gYm9keS52ZWwueSkgKiAwLjVcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGJvZHkucm90YXRlKChvdGhlci5yb3RhdGlvbiAtIGJvZHkucm90YXRpb24pIC8gMik7XG4gICAgICAgIGJvZHkuYW5nID0gKGJvZHkuYW5nICsgb3RoZXIuYW5nKSAvIDI7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhpcyBzeXN0ZW1cbiAgICogQHJldHVybiB7UGh5c2ljc30gVGhlIGNvcHkgb2YgdGhpcyBzeXN0ZW1cbiAgICovXG4gIGdldCBjb3B5KCk6IFBoeXNpY3Mge1xuICAgIGxldCByZXQgPSBuZXcgUGh5c2ljcygpO1xuICAgIHJldC5iYWxscyA9IHRoaXMuZ2V0Q29weU9mQmFsbHMoKTtcbiAgICByZXQuYm9kaWVzID0gdGhpcy5nZXRDb3B5T2ZCb2RpZXMoKTtcbiAgICByZXQuZml4ZWRCYWxscyA9IHRoaXMuZml4ZWRCYWxscztcbiAgICByZXQud2FsbHMgPSB0aGlzLndhbGxzO1xuICAgIHJldC5ib3VuZHMgPSB0aGlzLmJvdW5kcztcbiAgICByZXQuZ3Jhdml0eSA9IHRoaXMuZ3Jhdml0eTtcblxuICAgIHRoaXMuc3ByaW5ncy5mb3JFYWNoKChzcHJpbmcpID0+IHtcbiAgICAgIGxldCBUeXBlT2ZTcHJpbmcgPSBzcHJpbmcuY29uc3RydWN0b3IgPT0gU3ByaW5nID8gU3ByaW5nIDogU3RpY2s7XG4gICAgICBsZXQgY29waWVkU3ByaW5nID0gbmV3IFR5cGVPZlNwcmluZyhzcHJpbmcubGVuZ3RoLCBzcHJpbmcuc3ByaW5nQ29uc3RhbnQpO1xuICAgICAgY29waWVkU3ByaW5nLnJvdGF0aW9uTG9ja2VkID0gc3ByaW5nLnJvdGF0aW9uTG9ja2VkO1xuICAgICAgY29waWVkU3ByaW5nLnBpbm5lZCA9IHNwcmluZy5waW5uZWQ7XG5cbiAgICAgIHNwcmluZy5vYmplY3RzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICBsZXQgaWR4ID0gdGhpcy5iYWxscy5pbmRleE9mKG9iaik7XG4gICAgICAgIGlmIChpZHggIT0gLTEpIGNvcGllZFNwcmluZy5hdHRhY2hPYmplY3QocmV0LmJhbGxzW2lkeF0pO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZHggPSB0aGlzLmJvZGllcy5pbmRleE9mKG9iaik7XG4gICAgICAgICAgaWYgKGlkeCAhPSAtMSkgY29waWVkU3ByaW5nLmF0dGFjaE9iamVjdChyZXQuYm9kaWVzW2lkeF0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0LnNwcmluZ3MucHVzaChjb3BpZWRTcHJpbmcpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBaXIgZnJpY3Rpb24uIGhhcyB0byBiZSBiZXR3ZWVuIDAgYW5kIDFcbiAgICogMCAtIG5vIG1vdmVtZW50XG4gICAqIDEgLSBubyBmcmljdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYWlyRnJpY3Rpb24gSGFzIHRvIGJlIGJldHdlZW4gMCBhbmQgMVxuICAgKi9cbiAgc2V0QWlyRnJpY3Rpb24oYWlyRnJpY3Rpb246IG51bWJlcikge1xuICAgIGlmICghaXNGaW5pdGUoYWlyRnJpY3Rpb24pKSByZXR1cm47XG4gICAgdGhpcy5haXJGcmljdGlvbiA9IGFpckZyaWN0aW9uO1xuICAgIGlmICh0aGlzLmFpckZyaWN0aW9uIDwgMCkgdGhpcy5haXJGcmljdGlvbiA9IDA7XG4gICAgaWYgKHRoaXMuYWlyRnJpY3Rpb24gPiAxKSB0aGlzLmFpckZyaWN0aW9uID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBncmF2aXR5IGluIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge1ZlYzJ9IGRpciBUaGUgYWNjZWxlcmF0aW9uIHZlY3RvciBvZiB0aGUgZ3Jhdml0eVxuICAgKi9cbiAgc2V0R3Jhdml0eShkaXI6IFZlYzIpIHtcbiAgICB0aGlzLmdyYXZpdHkgPSBkaXIuY29weTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IGJhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7QmFsbH0gYmFsbCBCYWxsIHRvIGFkZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZEJhbGwoYmFsbDogQmFsbCkge1xuICAgIHRoaXMuYmFsbHMucHVzaChiYWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IGJvZHkgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7Qm9keX0gYm9keSBCb2R5IHRvIGFkZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZEJvZHkoYm9keTogQm9keSkge1xuICAgIHRoaXMuYm9kaWVzLnB1c2goYm9keSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBzb2Z0IGJhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7U29mdEJhbGx9IHNvZnRCYWxsIFNvZnRCYWxsIHRvIGJlIGFkZGVkIHRvIHRoZSB3b3JsZFxuICAgKi9cbiAgYWRkU29mdEJhbGwoc29mdEJhbGw6IFNvZnRCYWxsKSB7XG4gICAgdGhpcy5iYWxscy5wdXNoKC4uLnNvZnRCYWxsLnBvaW50cyk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goLi4uc29mdEJhbGwuc2lkZXMpO1xuXG4gICAgdGhpcy5zb2Z0QmFsbHMucHVzaChzb2Z0QmFsbCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyBzb2Z0IHNxdWFyZSB0byB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtWZWMyfSBwb3MgVGhlIHBvc2l0aW9uIG9mIHRoZSBzb2Z0IHNxdWFyZVxuICAgKiBAcGFyYW0ge251bWJlcn0gc2lkZVNpemUgVGhlIHNpemUgb2YgdGhlIHNxdWFyZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmMgRnJpY3Rpb24gY29lZmZpY2llbnRcbiAgICogQHBhcmFtIHtWZWMyfSB2ZWwgVGhlIGluaXRpYWwgdmVsb2NpdHkgb2YgdGhlIHNvZnQgc3F1YXJlXG4gICAqL1xuICBhZGRTb2Z0U3F1YXJlKHBvczogVmVjMiwgc2lkZVNpemU6IG51bWJlciwgZmM6IG51bWJlciwgdmVsOiBWZWMyKSB7XG4gICAgbGV0IHNvZnRTcXVhcmUgPSBuZXcgU29mdEJhbGwoXG4gICAgICBwb3MsXG4gICAgICBNYXRoLnNxcnQoKHNpZGVTaXplICogc2lkZVNpemUpIC8gTWF0aC5QSSksXG4gICAgICAxLFxuICAgICAgZmMsXG4gICAgICAyNFxuICAgICk7XG4gICAgc29mdFNxdWFyZS5zaWRlcy5mb3JFYWNoKChzaWRlKSA9PiB7XG4gICAgICBzaWRlLmxlbmd0aCA9ICgwLjk2ICogNCAqIHNpZGVTaXplKSAvIHNvZnRTcXVhcmUucmVzb2x1dGlvbjtcbiAgICB9KTtcbiAgICBzb2Z0U3F1YXJlLnBvaW50cy5mb3JFYWNoKChiKSA9PiB7XG4gICAgICBiLnZlbCA9IHZlbC5jb3B5O1xuICAgIH0pO1xuXG4gICAgdGhpcy5iYWxscy5wdXNoKC4uLnNvZnRTcXVhcmUucG9pbnRzKTtcbiAgICB0aGlzLnNwcmluZ3MucHVzaCguLi5zb2Z0U3F1YXJlLnNpZGVzKTtcblxuICAgIGxldCBzcHJpbmdTdHJlbmd0aCA9IHNpZGVTaXplICogc2lkZVNpemUgKiAyMDA7XG5cbiAgICBsZXQgYmlnU3RpY2sgPSBuZXcgU3ByaW5nKFxuICAgICAgTWF0aC5zcXJ0KHNvZnRTcXVhcmUuciAqIHNvZnRTcXVhcmUuciAqIE1hdGguUEkpLFxuICAgICAgc3ByaW5nU3RyZW5ndGggLyAyXG4gICAgKTtcbiAgICBiaWdTdGljay5hdHRhY2hPYmplY3Qoc29mdFNxdWFyZS5wb2ludHNbMF0pO1xuICAgIGJpZ1N0aWNrLmF0dGFjaE9iamVjdChzb2Z0U3F1YXJlLnBvaW50c1tzb2Z0U3F1YXJlLnJlc29sdXRpb24gLyAyXSk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goYmlnU3RpY2spO1xuXG4gICAgYmlnU3RpY2sgPSBuZXcgU3ByaW5nKFxuICAgICAgTWF0aC5zcXJ0KHNvZnRTcXVhcmUuciAqIHNvZnRTcXVhcmUuciAqIE1hdGguUEkpLFxuICAgICAgc3ByaW5nU3RyZW5ndGggLyAyXG4gICAgKTtcbiAgICBiaWdTdGljay5hdHRhY2hPYmplY3Qoc29mdFNxdWFyZS5wb2ludHNbc29mdFNxdWFyZS5yZXNvbHV0aW9uIC8gNF0pO1xuICAgIGJpZ1N0aWNrLmF0dGFjaE9iamVjdChzb2Z0U3F1YXJlLnBvaW50c1soMyAqIHNvZnRTcXVhcmUucmVzb2x1dGlvbikgLyA0XSk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goYmlnU3RpY2spO1xuXG4gICAgYmlnU3RpY2sgPSBuZXcgU3ByaW5nKFxuICAgICAgTWF0aC5zcXJ0KDIgKiBzb2Z0U3F1YXJlLnIgKiBzb2Z0U3F1YXJlLnIgKiBNYXRoLlBJKSxcbiAgICAgIHNwcmluZ1N0cmVuZ3RoXG4gICAgKTtcbiAgICBiaWdTdGljay5hdHRhY2hPYmplY3Qoc29mdFNxdWFyZS5wb2ludHNbc29mdFNxdWFyZS5yZXNvbHV0aW9uIC8gOF0pO1xuICAgIGJpZ1N0aWNrLmF0dGFjaE9iamVjdChzb2Z0U3F1YXJlLnBvaW50c1soNSAqIHNvZnRTcXVhcmUucmVzb2x1dGlvbikgLyA4XSk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goYmlnU3RpY2spO1xuXG4gICAgYmlnU3RpY2sgPSBuZXcgU3ByaW5nKFxuICAgICAgTWF0aC5zcXJ0KDIgKiBzb2Z0U3F1YXJlLnIgKiBzb2Z0U3F1YXJlLnIgKiBNYXRoLlBJKSxcbiAgICAgIHNwcmluZ1N0cmVuZ3RoXG4gICAgKTtcbiAgICBiaWdTdGljay5hdHRhY2hPYmplY3Qoc29mdFNxdWFyZS5wb2ludHNbKDMgKiBzb2Z0U3F1YXJlLnJlc29sdXRpb24pIC8gOF0pO1xuICAgIGJpZ1N0aWNrLmF0dGFjaE9iamVjdChzb2Z0U3F1YXJlLnBvaW50c1soNyAqIHNvZnRTcXVhcmUucmVzb2x1dGlvbikgLyA4XSk7XG4gICAgdGhpcy5zcHJpbmdzLnB1c2goYmlnU3RpY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSByZWN0YW5ndWxhciB3YWxsIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIHdhbGxcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IHdpZHRoIG9mIHRoZSByZWN0YW5ndWxhciB3YWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoIGhlaWdodCBvZiB0aGUgcmVjdGFuZ3VsYXIgd2FsbFxuICAgKi9cbiAgYWRkUmVjdFdhbGwoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgbGV0IHBvaW50cyA9IFtdO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKHggLSB3IC8gMiwgeSAtIGggLyAyKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoeCArIHcgLyAyLCB5IC0gaCAvIDIpKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMih4ICsgdyAvIDIsIHkgKyBoIC8gMikpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKHggLSB3IC8gMiwgeSArIGggLyAyKSk7XG4gICAgdGhpcy53YWxscy5wdXNoKG5ldyBXYWxsKHBvaW50cykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSByZWN0YW5ndWxhciBib2R5IHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIHJlY3Rhbmd1bGFyIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IHdpZHRoIG9mIHRoZSByZWN0YW5ndWxhciBib2R5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoIGhlaWdodCBvZiB0aGUgcmVjdGFuZ3VsYXIgYm9keVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmMgZnJpY3Rpb24gY29lZmZpY2llbnQgb2YgdGhlIGJvZHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IGsgY29lZmZpY2llbnQgb2YgcmVzdGl0dXRpb24gb2YgdGhlIGJvZHlcbiAgICovXG4gIGFkZFJlY3RCb2R5KFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBmYzogbnVtYmVyLFxuICAgIGs6IG51bWJlclxuICApIHtcbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoeCAtIHcgLyAyLCB5IC0gaCAvIDIpKTtcbiAgICBwb2ludHMucHVzaChuZXcgVmVjMih4ICsgdyAvIDIsIHkgLSBoIC8gMikpO1xuICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKHggKyB3IC8gMiwgeSArIGggLyAyKSk7XG4gICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoeCAtIHcgLyAyLCB5ICsgaCAvIDIpKTtcbiAgICB0aGlzLmJvZGllcy5wdXNoKG5ldyBCb2R5KHBvaW50cywgbmV3IFZlYzIoMCwgMCksIDAuNSwgMCwgMC4zKSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIGEgbmV3IHdhbGwgdG8gdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7V2FsbH0gd2FsbCBXYWxsIHRvIGFwcGVuZCB0byB0aGUgd29ybGRcbiAgICovXG4gIGFkZFdhbGwod2FsbDogV2FsbCkge1xuICAgIHRoaXMud2FsbHMucHVzaCh3YWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgZml4ZWQgYmFsbCB0byB0aGUgd29ybGRcbiAgICogQSBmaXhlZCBiYWxsIGlzIGltbW92YWJsZSBhbmQgb3RoZXIgb2JqZWN0cyBjb2xsaWRlIHdpdGggaXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggeCBjb29yZGluYXRlIG9mIHRoZSBmaXhlZCBiYWxsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5IHkgY29vcmRpbmF0ZSBvZiB0aGUgZml4ZWQgYmFsbFxuICAgKiBAcGFyYW0ge251bWJlcn0gciByYWRpdXMgb2YgdGhlIGZpeGVkIGJhbGxcbiAgICovXG4gIGFkZEZpeGVkQmFsbCh4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyKSB7XG4gICAgdGhpcy5maXhlZEJhbGxzLnB1c2goe1xuICAgICAgeDogeCxcbiAgICAgIHk6IHksXG4gICAgICByOiByLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYSBuZXcgc3ByaW5nIHRvIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge1NwcmluZ30gc3ByaW5nIFNwcmluZyB0byBhZGQgdG8gdGhlIHdvcmxkXG4gICAqL1xuICBhZGRTcHJpbmcoc3ByaW5nOiBTcHJpbmcpIHtcbiAgICB0aGlzLnNwcmluZ3MucHVzaChzcHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNpemUgb2YgdGhlIHdvcmxkICh3aXRob3V0IHRoaXMgdGhlIHdvcmxkXG4gICAqIGRvZXMgbm90IGhhdmUgYm91bmRzKVxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRyZSBvZiB0aGUgd29ybGRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlIG9mIHRoZSBjZW50cmUgb2YgdGhlIHdvcmxkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3IFdpZHRoIG9mIHRoZSB3b3JsZFxuICAgKiBAcGFyYW0ge251bWJlcn0gaCBIZWlnaHQgb2YgdGhlIHdvcmxkXG4gICAqL1xuICBzZXRCb3VuZHMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgdGhpcy5ib3VuZHMgPSBbXTtcblxuICAgIGNvbnN0IGdldFJlY3RCb2R5ID0gKHhfOiBudW1iZXIsIHlfOiBudW1iZXIsIHdfOiBudW1iZXIsIGhfOiBudW1iZXIpID0+IHtcbiAgICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKHhfIC0gd18gLyAyLCB5XyAtIGhfIC8gMikpO1xuICAgICAgcG9pbnRzLnB1c2gobmV3IFZlYzIoeF8gKyB3XyAvIDIsIHlfIC0gaF8gLyAyKSk7XG4gICAgICBwb2ludHMucHVzaChuZXcgVmVjMih4XyArIHdfIC8gMiwgeV8gKyBoXyAvIDIpKTtcbiAgICAgIHBvaW50cy5wdXNoKG5ldyBWZWMyKHhfIC0gd18gLyAyLCB5XyArIGhfIC8gMikpO1xuICAgICAgcmV0dXJuIG5ldyBXYWxsKHBvaW50cyk7XG4gICAgfTtcblxuICAgIHRoaXMuYm91bmRzLnB1c2goZ2V0UmVjdEJvZHkoeCAtIHcsIHksIDIgKiB3LCAyICogaCkpO1xuICAgIHRoaXMuYm91bmRzLnB1c2goZ2V0UmVjdEJvZHkoeCArIDIgKiB3LCB5LCAyICogdywgMiAqIGgpKTtcbiAgICB0aGlzLmJvdW5kcy5wdXNoKGdldFJlY3RCb2R5KHgsIHkgLSBoLCAyICogdywgaCAqIDIpKTtcbiAgICB0aGlzLmJvdW5kcy5wdXNoKGdldFJlY3RCb2R5KHgsIHkgKyAyICogaCwgMiAqIHcsIDIgKiBoKSk7XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIGZvciBhbnkgb2JqZWN0IGF0IHRoZSBnaXZlbiBjb29yZGluYXRlIHRoZW4gcmV0dXJucyBpdFxuICAgKiBSZXR1cm4gZmFsc2UgaWYgbm90aGluZyBpcyBmb3VuZFxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAqIEByZXR1cm4ge0JhbGx9IFRoZSBmb3VuZCBvYmplY3RcbiAgICovXG4gIGdldE9iamVjdEF0Q29vcmRpbmF0ZXMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBCYWxsIHtcbiAgICBsZXQgcmV0ID0gdW5kZWZpbmVkO1xuICAgIGxldCB2ID0gbmV3IFZlYzIoeCwgeSk7XG4gICAgdGhpcy5iYWxscy5mb3JFYWNoKChiYWxsKSA9PiB7XG4gICAgICBpZiAoYmFsbC5wb3MuZGlzdCh2KSA8IGJhbGwucikgcmV0ID0gYmFsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgY29waWVzIG9mIGFsbCBiYWxscyBpbiB0aGUgc3lzdGVtXG4gICAqIEByZXR1cm4ge0FycmF5PEJhbGw+fSBUaGUgYXJyYXkgb2YgdGhlIGNvcGllZCBiYWxsc1xuICAgKi9cbiAgZ2V0Q29weU9mQmFsbHMoKTogQXJyYXk8QmFsbD4ge1xuICAgIGxldCByZXQ6IEFycmF5PEJhbGw+ID0gW107XG4gICAgdGhpcy5iYWxscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByZXQucHVzaChpdGVtLmNvcHkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBjb3BpZXMgb2YgYWxsIGJvZGllcyBpbiB0aGUgc3lzdGVtXG4gICAqIEByZXR1cm4ge0FycmF5PEJvZHk+fSBUaGUgYXJyYXkgb2YgdGhlIGNvcGllZCBib2RpZXNcbiAgICovXG4gIGdldENvcHlPZkJvZGllcygpOiBBcnJheTxCb2R5PiB7XG4gICAgbGV0IHJldDogQXJyYXk8Qm9keT4gPSBbXTtcbiAgICB0aGlzLmJvZGllcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByZXQucHVzaChpdGVtLmNvcHkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gb2JqZWN0IGZyb20gdGhlIHN5c3RlbVxuICAgKiBAcGFyYW0ge2FueX0gb2JqIFRoZSBvYmplY3QgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVPYmpGcm9tU3lzdGVtKG9iajogYW55KSB7XG4gICAgY29uc29sZS5sb2codGhpcy5iYWxscy5pbmRleE9mKG9iaikpO1xuICAgIHRoaXMuYmFsbHMuc3BsaWNlKHRoaXMuYmFsbHMuaW5kZXhPZihvYmopLCAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgYmFsbCBvciBib2R5IHdpdGggdGhlIGdpdmVuIGlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgaWQgb2YgdGhlIG9iamVjdCB0byBmaW5kXG4gICAqIEByZXR1cm4ge2FueX0gVGhlIGRhdGEgb2YgdGhlIG9iamVjdFxuICAgKi9cbiAgZ2V0SXRlbURhdGFGcm9tSWQoaWQ6IFN0cmluZyk6IHsgdHlwZTogc3RyaW5nOyBudW06IG51bWJlciB9IHtcbiAgICBsZXQgcmV0OiBhbnkgPSB7fTtcbiAgICBsZXQgZmlsdGVyID0gKGI6IGFueSkgPT4gYi5pZCA9PT0gaWQ7XG5cbiAgICBsZXQgYmFsbHMgPSB0aGlzLmJhbGxzLmZpbHRlcihmaWx0ZXIpO1xuICAgIGlmIChiYWxscy5sZW5ndGggPj0gMSkge1xuICAgICAgcmV0LnR5cGUgPSAnYmFsbCc7XG4gICAgICByZXQubnVtID0gdGhpcy5iYWxscy5pbmRleE9mKGJhbGxzWzBdKTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgbGV0IGJvZGllcyA9IHRoaXMuYm9kaWVzLmZpbHRlcihmaWx0ZXIpO1xuICAgIGlmIChib2RpZXMubGVuZ3RoID49IDEpIHtcbiAgICAgIHJldC50eXBlID0gJ2JvZHknO1xuICAgICAgcmV0Lm51bSA9IHRoaXMuYm9kaWVzLmluZGV4T2YoYm9kaWVzWzBdKTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgbGV0IHNwcmluZ3MgPSB0aGlzLnNwcmluZ3MuZmlsdGVyKGZpbHRlcik7XG4gICAgaWYgKHNwcmluZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgIHJldC50eXBlID0gJ3NwcmluZyc7XG4gICAgICByZXQubnVtID0gdGhpcy5zcHJpbmdzLmluZGV4T2Yoc3ByaW5nc1swXSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBCYWxsIH07XG5leHBvcnQgeyBCb2R5IH07XG5leHBvcnQgeyBWZWMyIH07XG5leHBvcnQgeyBXYWxsIH07XG5leHBvcnQgeyBMaW5lU2VnbWVudCB9O1xuZXhwb3J0IHsgU3ByaW5nIH07XG5leHBvcnQgeyBTdGljayB9O1xuZXhwb3J0IHsgU29mdEJhbGwgfTtcbmV4cG9ydCB7IFBoeXNpY3MgfTtcbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgQmFsbCBmcm9tICcuL2JhbGwnO1xuaW1wb3J0IFN0aWNrIGZyb20gJy4vc3RpY2snO1xuaW1wb3J0IExpbmVTZWdtZW50IGZyb20gJy4vbGluZXNlZ21lbnQnO1xuaW1wb3J0IFNwcmluZyBmcm9tICcuL3NwcmluZyc7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc29mdGJvZHkgb2JqZWN0XG4gKiBUaGV5IHdvcmsgbGlrZSBhIGJhbGwsIHdpdGggcHJlc3N1cmUgaW5zaWRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvZnRCYWxsIHtcbiAgICBwb2ludHM6IEFycmF5PEJhbGw+O1xuICAgIHByZXNzdXJlOiBudW1iZXI7XG4gICAgZmM6IG51bWJlcjtcbiAgICByZXNvbHV0aW9uOiBudW1iZXI7XG4gICAgcjogbnVtYmVyO1xuICAgIHNpZGVzOiBBcnJheTxTcHJpbmc+O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIFNvZnRCYWxsXG4gICAgICogQHBhcmFtIHtWZWMyfSBwb3MgVGhlIHN0YXJ0aW5nIHBvc2l0aW9uIG9mIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gciBUaGUgcmFkaXVzIG9mIHRoZSBzb2Z0IGJhbGxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJlc3N1cmUgVGhlIFwiaGFyZG5lc3NcIiBvZiB0aGUgc29mdCBiYWxsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZjIEZyaWN0aW9uIGNvZWZmaWNpZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlc29sdXRpb24gVGhlIG51bWJlciBvZiBwb2ludHMgdGhhdCBtYWtlIHVwIHRoZSBiYWxsXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9zOiBWZWMyLCByOiBudW1iZXIsIHByZXNzdXJlOiBudW1iZXIsXG4gICAgICAgIGZjOiBudW1iZXIsIHJlc29sdXRpb246IG51bWJlcikge1xuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xuXG4gICAgICAgIGlmIChmYyB8fCBmYyA9PT0gMCkgdGhpcy5mYyA9IGZjO1xuICAgICAgICBlbHNlIHRoaXMuZmMgPSAwLjQ7XG5cbiAgICAgICAgdGhpcy5wcmVzc3VyZSA9IHByZXNzdXJlO1xuXG4gICAgICAgIGlmICghcmVzb2x1dGlvbikgdGhpcy5yZXNvbHV0aW9uID0gMzA7XG4gICAgICAgIGVsc2UgdGhpcy5yZXNvbHV0aW9uID0gcmVzb2x1dGlvbjtcblxuICAgICAgICByID0gTWF0aC5hYnMocik7XG4gICAgICAgIHRoaXMuciA9IHI7XG5cbiAgICAgICAgbGV0IGxheWVyTnVtYmVyOiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXNvbHV0aW9uOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdQb3MgPSBuZXcgVmVjMihwb3MueCwgcG9zLnkpO1xuICAgICAgICAgICAgbmV3UG9zLmFkZChWZWMyLm11bHQoXG4gICAgICAgICAgICAgICAgVmVjMi5mcm9tQW5nbGUoKGkgLyB0aGlzLnJlc29sdXRpb24pICogTWF0aC5QSSAqIDIpLCByKSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKG5ldyBCYWxsKG5ld1BvcywgbmV3IFZlYzIoMCwgMCksXG4gICAgICAgICAgICAgICAgciAqIE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnJlc29sdXRpb24pLCAwLCAwLCB0aGlzLmZjKSk7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXS5sYXllciA9IGxheWVyTnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaWRlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzb2x1dGlvbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBTdGljaygyICogciAqIE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnJlc29sdXRpb24pKTtcbiAgICAgICAgICAgIHNpZGUuYXR0YWNoT2JqZWN0KHRoaXMucG9pbnRzW2ldKTtcbiAgICAgICAgICAgIHNpZGUuYXR0YWNoT2JqZWN0KHRoaXMucG9pbnRzWyhpICsgMSkgJSB0aGlzLnJlc29sdXRpb25dKTtcbiAgICAgICAgICAgIGlmIChpICUgMiA9PT0gMCkgc2lkZS5sb2NrUm90YXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuc2lkZXMucHVzaChzaWRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByZXNzdXJlLWJhc2VkIGZvcmNlcyBpbiB0aGUgc29mdCBiYWxsXG4gICAgICogQHBhcmFtIHtTb2Z0QmFsbH0gc29mdEJhbGwgVGhlIHNvZnQgYmFsbCB0byB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICBzdGF0aWMgdXBkYXRlUHJlc3N1cmVCYXNlZEZvcmNlcyhzb2Z0QmFsbDogU29mdEJhbGwsIHQ6IG51bWJlcikge1xuICAgICAgICBsZXQgcG9saWdvbnM6IEFycmF5PEFycmF5PFZlYzI+PiA9IFtdO1xuICAgICAgICBwb2xpZ29ucy5wdXNoKFtdKTtcbiAgICAgICAgc29mdEJhbGwucG9pbnRzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIHBvbGlnb25zWzBdLnB1c2gobmV3IFZlYzIocC5wb3MueCwgcC5wb3MueSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoKGZ1bmN0aW9uKHBvbCkge1xuICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSksXG4gICAgICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9sLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbKGkgKyAxKSAlIHBvbC5sZW5ndGhdLFxuICAgICAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhWZWMyLnN1Yihwb2xbMF0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgICAgIFZlYzIuc3ViKHBvbFtwb2wubGVuZ3RoIC0gMl0sIHBvbFtwb2wubGVuZ3RoIC0gMV0pKTtcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IE1hdGguUEkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KShwb2xpZ29uc1swXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1ZGVzID0gKGFycjogQXJyYXk8bnVtYmVyPiwgaXRlbTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gaXRlbSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3RXaXRoUG9saWdvbiA9IGZ1bmN0aW9uKHNlZ21lbnQ6IExpbmVTZWdtZW50LFxuICAgICAgICAgICAgICAgIHBvbDogQXJyYXk8VmVjMj4sIGV4Y2VwdGlvbnM6IEFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVzKGV4Y2VwdGlvbnMsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2lkZSA9IG5ldyBMaW5lU2VnbWVudChuZXcgVmVjMihwb2xbaV0ueCwgcG9sW2ldLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFsoaSArIDEpICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTGluZVNlZ21lbnQuaW50ZXJzZWN0KHNlZ21lbnQsIHNpZGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcblxuICAgICAgICAgICAgY2hlY2tBbGxQb2xpZ29uczogd2hpbGUgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvbGlnb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb2wgPSBwb2xpZ29uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSBWZWMyLnN1Yihwb2xbMV0sIHBvbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gVmVjMi5hbmdsZUFDVyhhLCBiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlID4gTWF0aC5QSSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBqICsgMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdTaWRlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2pdLngsIHBvbFtqXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2sgJSBwb2wubGVuZ3RoXS55KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgVmVjMihuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSkuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghKGEuaGVhZGluZyA+IGIuaGVhZGluZyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IDIgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3U2lkZUhlYWRpbmcgPiBhLmhlYWRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCBiLmhlYWRpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTGluZVNlZ21lbnQobmV3IFZlYzIocG9sW2ogJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2ogJSBwb2wubGVuZ3RoXS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtrICUgcG9sLmxlbmd0aF0ueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sLCBbKHBvbC5sZW5ndGggLSAxKSAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueCAtIG5ld1NpZGUuYS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb2wyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gajsgbCA8PSBrOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gazsgbCA8PSBqICsgcG9sLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnNbaV0gPSBwb2wxO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGNoZWNrQWxsUG9saWdvbnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBwb2wubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhID0gVmVjMi5zdWIocG9sWyhqICsgMSkgJSBwb2wubGVuZ3RoXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiID0gVmVjMi5zdWIocG9sW2ogLSAxXSwgcG9sW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coYSwgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGUgPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrID0gaiArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1NpZGUgPSBuZXcgTGluZVNlZ21lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKHBvbFtqXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjMihwb2xbayAlIHBvbC5sZW5ndGhdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xbayAlIHBvbC5sZW5ndGhdLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3U2lkZUhlYWRpbmcgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlLmIueSAtIG5ld1NpZGUuYS55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlYWRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCEoYS5oZWFkaW5nID4gYi5oZWFkaW5nID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuZXdTaWRlSGVhZGluZyA+IGEuaGVhZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZUhlYWRpbmcgPCAyICogTWF0aC5QSSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXdTaWRlSGVhZGluZyA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ld1NpZGVIZWFkaW5nID4gYS5oZWFkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA8IGIuaGVhZGluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFdpdGhQb2xpZ29uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbCwgWyhqIC0gMSkgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiAlIHBvbC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoayAtIDEpICUgcG9sLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgJSBwb2wubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlID0gbmV3IExpbmVTZWdtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2pdLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sW2pdLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlYzIocG9sW2sgJSBwb2wubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbFtrICUgcG9sLmxlbmd0aF0ueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTaWRlSGVhZGluZyA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NpZGUuYi54IC0gbmV3U2lkZS5hLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2lkZS5iLnkgLSBuZXdTaWRlLmEueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVhZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvbDEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9sMiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBqOyBsIDw9IGs7IGwrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2wxLnB1c2gocG9sW2wgJSBwb2wubGVuZ3RoXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSBrOyBsIDw9IGogKyBwb2wubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sMi5wdXNoKHBvbFtsICUgcG9sLmxlbmd0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpZ29uc1tpXSA9IHBvbDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saWdvbnMucHVzaChwb2wyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBjaGVja0FsbFBvbGlnb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IHBvbGlnb25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgcG9sID0gcG9saWdvbnNbaV07XG4gICAgICAgICAgICB3aGlsZSAocG9sLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICBwb2xpZ29ucy5wdXNoKFtwb2xbMF0sIHBvbFsxXSwgcG9sWzJdXSk7XG4gICAgICAgICAgICAgICAgcG9sLnNwbGljZSgxLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtU3VtID0gMDtcbiAgICAgICAgcG9saWdvbnMuZm9yRWFjaCgocG9sKSA9PiB7XG4gICAgICAgICAgICBsZXQgYSA9IE1hdGguc3FydChNYXRoLnBvdyhwb2xbMF0ueCAtIHBvbFsxXS54LCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cocG9sWzBdLnkgLSBwb2xbMV0ueSwgMikpO1xuICAgICAgICAgICAgbGV0IGIgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9sWzFdLnggLSBwb2xbMl0ueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KHBvbFsxXS55IC0gcG9sWzJdLnksIDIpKTtcbiAgICAgICAgICAgIGxldCBjID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvbFsyXS54IC0gcG9sWzBdLngsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb2xbMl0ueSAtIHBvbFswXS55LCAyKSk7XG4gICAgICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMjtcbiAgICAgICAgICAgIGxldCBtID0gTWF0aC5zcXJ0KHMgKiAocyAtIGEpICogKHMgLSBiKSAqIChzIC0gYykpO1xuICAgICAgICAgICAgbVN1bSArPSBtO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgb3ZlclByZXNzdXJlID0gc29mdEJhbGwucHJlc3N1cmUgKlxuICAgICAgICAgICAgKChzb2Z0QmFsbC5yICogc29mdEJhbGwuciAqIE1hdGguUEkpIC8gbVN1bSlcbiAgICAgICAgICAgIC0gc29mdEJhbGwucHJlc3N1cmU7XG4gICAgICAgIHNvZnRCYWxsLnNpZGVzLmZvckVhY2goKHNpZGUpID0+IHtcbiAgICAgICAgICAgIGxldCBmb3JjZSA9IFZlYzIuc3ViKHNpZGUub2JqZWN0c1swXS5wb3MsIHNpZGUub2JqZWN0c1sxXS5wb3MpO1xuICAgICAgICAgICAgZm9yY2UubXVsdChvdmVyUHJlc3N1cmUpO1xuICAgICAgICAgICAgZm9yY2Uucm90YXRlKE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgIGZvcmNlLm11bHQodCk7XG4gICAgICAgICAgICBzaWRlLm9iamVjdHNbMF0udmVsLmFkZChWZWMyLmRpdihmb3JjZSwgc2lkZS5vYmplY3RzWzBdLm0pKTtcbiAgICAgICAgICAgIHNpZGUub2JqZWN0c1sxXS52ZWwuYWRkKFZlYzIuZGl2KGZvcmNlLCBzaWRlLm9iamVjdHNbMV0ubSkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjMiBmcm9tICcuL3ZlYzInO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHN0cmluZ1xuICogVGhleSBhY3QgbGlrZSBzcHJpbmdzIGluIHJlYWwgbGlmZVxuICogWW91IGNhbiBhdHRhY2ggb3RoZXIgb2JqZWN0cyB0byB0aGUgZW5kcyBvZiB0aGVtXG4gKiBUaGV5IGRvIG5vdCBjb2xsaWRlIHdpdGggb3RoZXIgb2JqZWN0IG5laXRoZXIgd2l0aCBlYWNoIG90aGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwcmluZyB7XG4gIGxlbmd0aDogbnVtYmVyO1xuICBzcHJpbmdDb25zdGFudDogbnVtYmVyO1xuICBwaW5uZWQ6IGFueTtcbiAgb2JqZWN0czogQXJyYXk8YW55PjtcbiAgcm90YXRpb25Mb2NrZWQ6IGJvb2xlYW47XG4gIGlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzcHJpbmdcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBUaGUgdW5zdHJlY2hlZCBsZW5ndGggb2YgdGhlIHNwcmluZ1xuICAgKiBAcGFyYW0ge251bWJlcn0gc3ByaW5nQ29uc3RhbnQgU3ByaW5nIGNvbnN0YW50XG4gICAqL1xuICBjb25zdHJ1Y3RvcihsZW5ndGg6IG51bWJlciwgc3ByaW5nQ29uc3RhbnQ6IG51bWJlcikge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSBzcHJpbmdDb25zdGFudDtcbiAgICB0aGlzLnBpbm5lZCA9IGZhbHNlO1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMucm90YXRpb25Mb2NrZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlkID1cbiAgICAgICdfJyArXG4gICAgICBNYXRoLnJhbmRvbSgpXG4gICAgICAgIC50b1N0cmluZygzNilcbiAgICAgICAgLnN1YnN0cigyLCA5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQaW5zIG9uZSBzaWRlIG9mIHRoZSB0aGUgc3ByaW5nIHRvIGEgZ2l2ZW4gY29vcmRpbmF0ZSBpbiBzcGFjZVxuICAgKiBAcGFyYW0ge251bWJlcn0geCB4IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgeSBjb29yZGluYXRlXG4gICAqL1xuICBwaW5IZXJlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy5waW5uZWQgPSB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHBpbm5lZCB0YWcgZnJvbSB0aGUgc3ByaW5nXG4gICAqIFlvdSBjYW4gbm93IGF0dGFjaCBpdCB0byBhbm90aGVyIG9iamVjdFxuICAgKi9cbiAgdW5waW4oKSB7XG4gICAgdGhpcy5waW5uZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBvbmUgZW5kIG9mIHRoZSBzcHJpbmcgdG8gYW4gb2JqZWN0IChlZy4gQmFsbClcbiAgICogQHBhcmFtIHthbnl9IG9iamVjdCBUaGUgb2JqZWN0IHRoYXQgdGhlIHNwcmluZyBpcyBnZXR0aW5nIGF0dGFjaGVkIHRvXG4gICAqL1xuICBhdHRhY2hPYmplY3Qob2JqZWN0OiBhbnkpIHtcbiAgICBsZXQgb2IgPSB0aGlzLm9iamVjdHM7XG4gICAgb2IucHVzaChvYmplY3QpO1xuICAgIGlmIChvYi5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRoaXMucGlubmVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvYi5sZW5ndGggPj0gMykge1xuICAgICAgb2IgPSBbb2Jbb2IubGVuZ3RoIC0gMl0sIG9iW29iLmxlbmd0aCAtIDFdXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ja3MgdGhlIG9iamVjdHMgYXR0YWNoZWQgdG8gdGhlIGVuZHMgb2YgdGhlIHNwcmluZ1xuICAgKiB0byBub3Qgcm90YXRlIGFyb3VuZCB0aGUgYXR0YWNoIHBvaW50XG4gICAqL1xuICBsb2NrUm90YXRpb24oKSB7XG4gICAgdGhpcy5yb3RhdGlvbkxvY2tlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIG9iamVjdHMgYXR0YWNoZWQgdG8gdGhlIGVuZHMgb2YgdGhlIHNwcmluZ1xuICAgKiB0byByb3RhdGUgYXJvdW5kIHRoZSBhdHRhY2ggcG9pbnRcbiAgICovXG4gIHVubG9ja1JvdGF0aW9uKCkge1xuICAgIHRoaXMucm90YXRpb25Mb2NrZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzcHJpbmcgYmF5IHRoZSBlbGFwc2VkIHRpbWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHQgRWxhcHNlZCB0aW1lXG4gICAqL1xuICB1cGRhdGUodDogbnVtYmVyKSB7XG4gICAgbGV0IHAxO1xuICAgIGxldCBwMjtcbiAgICBpZiAodGhpcy5waW5uZWQgJiYgdGhpcy5vYmplY3RzWzBdKSB7XG4gICAgICBwMiA9IHRoaXMucGlubmVkO1xuICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICBsZXQgZGlzdCA9IG5ldyBWZWMyKHAyLnggLSBwMS5wb3MueCwgcDIueSAtIHAxLnBvcy55KTtcbiAgICAgIGxldCBkbCA9IGRpc3QubGVuZ3RoIC0gdGhpcy5sZW5ndGg7XG4gICAgICBkaXN0LnNldE1hZygxKTtcbiAgICAgIGRpc3QubXVsdCgoZGwgKiB0aGlzLnNwcmluZ0NvbnN0YW50ICogdCkgLyBwMS5tKTtcbiAgICAgIHAxLnZlbC54ICs9IGRpc3QueDtcbiAgICAgIHAxLnZlbC55ICs9IGRpc3QueTtcblxuICAgICAgbGV0IHYgPSBwMS52ZWw7XG4gICAgICB2LnJvdGF0ZSgtZGlzdC5oZWFkaW5nKTtcbiAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgIGxldCBzID0gbmV3IFZlYzIocDIueCwgcDIueSk7XG4gICAgICAgIGxldCByMiA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgIGxldCBhbSA9IHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAxLm0gKyBwMS5hbTtcbiAgICAgICAgbGV0IGFuZyA9IChwMS5hbSAqIHAxLmFuZyAtIHIyLmxlbmd0aCAqIHAxLm0gKiB2LnkpIC8gYW07XG5cbiAgICAgICAgdi55ID0gLWFuZyAqIHIyLmxlbmd0aDtcblxuICAgICAgICBwMS5hbmcgPSBhbmc7XG4gICAgICB9XG4gICAgICB2LnJvdGF0ZShkaXN0LmhlYWRpbmcpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vYmplY3RzWzBdICYmIHRoaXMub2JqZWN0c1sxXSkge1xuICAgICAgcDEgPSB0aGlzLm9iamVjdHNbMF07XG4gICAgICBwMiA9IHRoaXMub2JqZWN0c1sxXTtcbiAgICAgIGxldCBkaXN0ID0gVmVjMi5zdWIocDEucG9zLCBwMi5wb3MpO1xuICAgICAgbGV0IGRsID0gZGlzdC5sZW5ndGggLSB0aGlzLmxlbmd0aDtcbiAgICAgIGRpc3Quc2V0TWFnKDEpO1xuICAgICAgZGlzdC5tdWx0KGRsICogdGhpcy5zcHJpbmdDb25zdGFudCAqIHQpO1xuICAgICAgcDIudmVsLmFkZChWZWMyLmRpdihkaXN0LCBwMi5tKSk7XG4gICAgICBwMS52ZWwuYWRkKFZlYzIuZGl2KGRpc3QsIC1wMS5tKSk7XG5cbiAgICAgIGRpc3QgPSBWZWMyLnN1YihwMS5wb3MsIHAyLnBvcyk7XG4gICAgICBsZXQgdjEgPSBwMS52ZWw7XG4gICAgICBsZXQgdjIgPSBwMi52ZWw7XG4gICAgICB2MS5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICB2Mi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG5cbiAgICAgIGlmICh0aGlzLnJvdGF0aW9uTG9ja2VkKSB7XG4gICAgICAgIGxldCBzID0gbmV3IFZlYzIoXG4gICAgICAgICAgcDEucG9zLnggKiBwMS5tICsgcDIucG9zLnggKiBwMi5tLFxuICAgICAgICAgIHAxLnBvcy55ICogcDEubSArIHAyLnBvcy55ICogcDIubVxuICAgICAgICApO1xuICAgICAgICBzLmRpdihwMS5tICsgcDIubSk7XG4gICAgICAgIGxldCByMSA9IFZlYzIuc3ViKHAxLnBvcywgcyk7XG4gICAgICAgIGxldCByMiA9IFZlYzIuc3ViKHAyLnBvcywgcyk7XG4gICAgICAgIGxldCBhbSA9XG4gICAgICAgICAgcjEubGVuZ3RoICogcjEubGVuZ3RoICogcDEubSArXG4gICAgICAgICAgcDEuYW0gK1xuICAgICAgICAgIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAyLm0gK1xuICAgICAgICAgIHAyLmFtO1xuICAgICAgICBsZXQgc3YgPSAoKHYxLnkgLSB2Mi55KSAqIHIyLmxlbmd0aCkgLyAocjEubGVuZ3RoICsgcjIubGVuZ3RoKSArIHYyLnk7XG4gICAgICAgIGxldCBhbmcgPVxuICAgICAgICAgIChwMS5hbSAqIHAxLmFuZyArXG4gICAgICAgICAgICBwMi5hbSAqIHAyLmFuZyAtXG4gICAgICAgICAgICByMS5sZW5ndGggKiBwMS5tICogKHYxLnkgLSBzdikgK1xuICAgICAgICAgICAgcjIubGVuZ3RoICogcDIubSAqICh2Mi55IC0gc3YpKSAvXG4gICAgICAgICAgYW07XG5cbiAgICAgICAgdjEueSA9IC1hbmcgKiByMS5sZW5ndGggKyBzdjtcbiAgICAgICAgdjIueSA9ICthbmcgKiByMi5sZW5ndGggKyBzdjtcblxuICAgICAgICBwMS5hbmcgPSBhbmc7XG4gICAgICAgIHAyLmFuZyA9IGFuZztcbiAgICAgIH1cblxuICAgICAgdjEucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICB2Mi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgU3ByaW5nIGZyb20gJy4vc3ByaW5nJztcblxuLyoqXG4gKiBTdGljayBjbGFzcyBmb3IgdGhlIHBoeXNpY3MgZW5naW5lXG4gKiBTdGlja3MgYXJlIG5vdCBzdHJlY2hhYmxlIG9iamVjdHMgdGhhdCBkbyBub3QgY29sbGlkZVxuICogd2l0aCBvdGhlciBvYmplY3RzIGJ1dCB0aGV5IGNhbiBob2xkIG90aGVyIG9iamVjdHMgb24gdGhlaXIgZW5kc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGljayBleHRlbmRzIFNwcmluZyB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHN0aWNrXG4gICAgICogQHBhcmFtIHtudWJlcn0gbGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIHN0aWNrXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIobGVuZ3RoLCAwKTtcbiAgICAgICAgdGhpcy5zcHJpbmdDb25zdGFudCA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc3RpY2sgdHJvdWdoIGFuIGVsYXBzZWQgdGltZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IEVsYXBzZWQgdGltZVxuICAgICAqL1xuICAgIHVwZGF0ZSh0OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHAxO1xuICAgICAgICBsZXQgcDI7XG4gICAgICAgIGlmICh0aGlzLnBpbm5lZCAmJiB0aGlzLm9iamVjdHNbMF0pIHtcbiAgICAgICAgICAgIHAyID0gdGhpcy5waW5uZWQ7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIGxldCBkaXN0ID0gbmV3IFZlYzIocDIueCAtIHAxLnBvcy54LCBwMi55IC0gcDEucG9zLnkpO1xuICAgICAgICAgICAgZGlzdC5zZXRNYWcoMSk7XG4gICAgICAgICAgICBkaXN0Lm11bHQoLXRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgIHAxLm1vdmUoLXAxLnBvcy54ICsgcDIueCArIGRpc3QueCwgLXAxLnBvcy55ICsgcDIueSArIGRpc3QueSk7XG5cbiAgICAgICAgICAgIGxldCB2ID0gcDEudmVsO1xuICAgICAgICAgICAgdi5yb3RhdGUoLWRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2LnggPSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5yb3RhdGlvbkxvY2tlZCkge1xuICAgICAgICAgICAgICAgIGxldCBzID0gbmV3IFZlYzIocDIueCwgcDIueSk7XG4gICAgICAgICAgICAgICAgbGV0IHIyID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgYW0gPSByMi5sZW5ndGggKiByMi5sZW5ndGggKiBwMS5tICsgcDEuYW07XG4gICAgICAgICAgICAgICAgbGV0IGFuZyA9IChwMS5hbSAqIHAxLmFuZyAtIHIyLmxlbmd0aCAqIHAxLm0gKiAodi55KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdi55ID0gLWFuZyAqIHIyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHAxLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9iamVjdHNbMF0gJiYgdGhpcy5vYmplY3RzWzFdKSB7XG4gICAgICAgICAgICBwMSA9IHRoaXMub2JqZWN0c1swXTtcbiAgICAgICAgICAgIHAyID0gdGhpcy5vYmplY3RzWzFdO1xuXG4gICAgICAgICAgICBsZXQgZGlzdCA9IFZlYzIuc3ViKHAxLnBvcywgcDIucG9zKTtcbiAgICAgICAgICAgIGxldCBkbCA9IHRoaXMubGVuZ3RoIC0gZGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBkaXN0LnNldE1hZygxKTtcbiAgICAgICAgICAgIGxldCBtb3ZlMSA9IFZlYzIubXVsdChkaXN0LCBkbCAqIChwMi5tKSAvICgocDEubSkgKyAocDIubSkpKTtcbiAgICAgICAgICAgIGxldCBtb3ZlMiA9IFZlYzIubXVsdChkaXN0LCAtZGwgKiAocDEubSkgLyAoKHAxLm0pICsgKHAyLm0pKSk7XG4gICAgICAgICAgICBwMS5tb3ZlKG1vdmUxLngsIG1vdmUxLnkpO1xuICAgICAgICAgICAgcDIubW92ZShtb3ZlMi54LCBtb3ZlMi55KTtcblxuICAgICAgICAgICAgbGV0IHYxID0gcDEudmVsO1xuICAgICAgICAgICAgbGV0IHYyID0gcDIudmVsO1xuICAgICAgICAgICAgdjEucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjIucm90YXRlKC1kaXN0LmhlYWRpbmcpO1xuICAgICAgICAgICAgdjEueCA9IHYyLnggPSAocDEubSAqIHYxLnggKyBwMi5tICogdjIueCkgLyAoKHAxLm0pICsgKHAyLm0pKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucm90YXRpb25Mb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcyA9IG5ldyBWZWMyKHAxLnBvcy54ICogcDEubSArIHAyLnBvcy54ICogcDIubSxcbiAgICAgICAgICAgICAgICAgICAgcDEucG9zLnkgKiBwMS5tICsgcDIucG9zLnkgKiBwMi5tKTtcbiAgICAgICAgICAgICAgICBzLmRpdihwMS5tICsgcDIubSk7XG4gICAgICAgICAgICAgICAgbGV0IHIxID0gVmVjMi5zdWIocDEucG9zLCBzKTtcbiAgICAgICAgICAgICAgICBsZXQgcjIgPSBWZWMyLnN1YihwMi5wb3MsIHMpO1xuICAgICAgICAgICAgICAgIGxldCBhbSA9IHIxLmxlbmd0aCAqIHIxLmxlbmd0aCAqIHAxLm0gKyBwMS5hbSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHIyLmxlbmd0aCAqIHAyLm0gKyBwMi5hbTtcbiAgICAgICAgICAgICAgICBsZXQgc3YgPSAodjEueSAtIHYyLnkpICogcjIubGVuZ3RoIC9cbiAgICAgICAgICAgICAgICAgICAgKHIxLmxlbmd0aCArIHIyLmxlbmd0aCkgKyB2Mi55O1xuICAgICAgICAgICAgICAgIGxldCBhbmcgPSAocDEuYW0gKiBwMS5hbmcgKyBwMi5hbSAqIHAyLmFuZyAtXG4gICAgICAgICAgICAgICAgICAgIHIxLmxlbmd0aCAqIHAxLm0gKiAodjEueSAtIHN2KSArXG4gICAgICAgICAgICAgICAgICAgIHIyLmxlbmd0aCAqIHAyLm0gKiAodjIueSAtIHN2KSkgLyAoYW0pO1xuXG4gICAgICAgICAgICAgICAgdjEueSA9IC1hbmcgKiByMS5sZW5ndGggKyBzdjtcbiAgICAgICAgICAgICAgICB2Mi55ID0gK2FuZyAqIHIyLmxlbmd0aCArIHN2O1xuXG4gICAgICAgICAgICAgICAgcDEuYW5nID0gYW5nO1xuICAgICAgICAgICAgICAgIHAyLmFuZyA9IGFuZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdjEucm90YXRlKGRpc3QuaGVhZGluZyk7XG4gICAgICAgICAgICB2Mi5yb3RhdGUoZGlzdC5oZWFkaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIGV2ZXJ5IGFuZ2xlIGlzIGNvdW50ZXJjbG9ja3dpc2UgKGFudGljbG9ja3dpc2UpXG4vKiogQ2xhc3MgcmVwcmVzZW50aW5nIGEgMmQgdmVjdG9yLiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMiB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgdmFsdWUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGNvcHkgb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgY29weS5cbiAgICAgKi9cbiAgICBnZXQgY29weSgpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGxlbmd0aC5cbiAgICAgKi9cbiAgICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yIHNxdWFyZWQuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbGVuZ3RoIHNxdWFyZWQuXG4gICAgICovXG4gICAgZ2V0IHNxbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBoZWFkaW5nIG9mIHRoZSB2ZWN0b3IgY29tcGFyZWQgdG8gKDEsIDApLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGFuZ2xlIGJldHdlZW4gKDEsIDApXG4gICAgICogYW5kIHRoZSB2ZWN0b3IgaW4gYW50aWNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICovXG4gICAgZ2V0IGhlYWRpbmcoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMueCA9PT0gMCAmJiB0aGlzLnkgPT09IDApIHJldHVybiAwO1xuICAgICAgICBpZiAodGhpcy54ID09PSAwKSByZXR1cm4gdGhpcy55ID4gMCA/IE1hdGguUEkgLyAyIDogMS41ICogTWF0aC5QSTtcbiAgICAgICAgaWYgKHRoaXMueSA9PT0gMCkgcmV0dXJuIHRoaXMueCA+IDAgPyAwIDogTWF0aC5QSTtcbiAgICAgICAgbGV0IHYgPSBWZWMyLm5vcm1hbGl6ZWQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnggPiAwICYmIHRoaXMueSA+IDApIHJldHVybiBNYXRoLmFzaW4odi55KTtcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgJiYgdGhpcy55ID4gMCkgcmV0dXJuIE1hdGguYXNpbigtdi54KSArIE1hdGguUEkgLyAyO1xuICAgICAgICBpZiAodGhpcy54IDwgMCAmJiB0aGlzLnkgPCAwKSByZXR1cm4gTWF0aC5hc2luKC12LnkpICsgTWF0aC5QSTtcbiAgICAgICAgaWYgKHRoaXMueCA+IDAgJiYgdGhpcy55IDwgMCkgcmV0dXJuIE1hdGguYXNpbih2LngpICsgMS41ICogTWF0aC5QSTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhbm90aGVyIHZlY3RvciB0byB0aGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICovXG4gICAgYWRkKGE6IFZlYzIpIHtcbiAgICAgICAgdGhpcy54ICs9IGEueDtcbiAgICAgICAgdGhpcy55ICs9IGEueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgYW5vdGhlciB2ZWN0b3IgZnJvbSB0aGUgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICovXG4gICAgc3ViKGE6IFZlYzIpIHtcbiAgICAgICAgdGhpcy54IC09IGEueDtcbiAgICAgICAgdGhpcy55IC09IGEueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaWVzIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIG11bHQoeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCAqPSB4O1xuICAgICAgICB0aGlzLnkgKj0geDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgc2NhbGFyLlxuICAgICAqL1xuICAgIGRpdih4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54IC89IHg7XG4gICAgICAgIHRoaXMueSAvPSB4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpbmVhcnJ5IGludGVycG9sYXRlcyB0aGUgdmVjdG9yIGludG8gdGhlIG90aGVyIHZlY3RvciBieSBzY2FsYXIgeC5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG90aGVyIC0gVGhlIG90aGVyIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBzY2FsYXIuXG4gICAgICovXG4gICAgbGVycChvdGhlcjogVmVjMiwgeDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCArPSAob3RoZXIueCAtIHRoaXMueCkgKiB4O1xuICAgICAgICB0aGlzLnkgKz0gKG90aGVyLnkgLSB0aGlzLnkpICogeDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHZlY3RvciBhbmQgdGhlIG90aGVyIHZlY3Rvci5cbiAgICAgKiBWZWN0b3JzIGFyZSByZXByZXNlbnRpbmcgcG9pbnRzIGhlcmUuXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdGhlciAtIFRoZSBvdGhlciB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtLlxuICAgICAqL1xuICAgIGRpc3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKG5ldyBWZWMyKHRoaXMueCAtIG90aGVyLngsIHRoaXMueSAtIG90aGVyLnkpKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbCAtIFRoZSBuZXcgbGVuZ3RoIHZhbHVlLlxuICAgICAqL1xuICAgIHNldE1hZyhsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIHRoaXMubXVsdChsIC8gdGhpcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJvdGF0ZSB0aGUgdmVjdG9yIGFudGljbG9ja3dpc2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gUm90YXRpb24gYW5nbGUuXG4gICAgICovXG4gICAgcm90YXRlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGggPSB0aGlzLmhlYWRpbmc7XG4gICAgICAgIGxldCB2ID0gVmVjMi5mcm9tQW5nbGUoYW5nbGUgKyBoKTtcbiAgICAgICAgdi5tdWx0KHRoaXMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgfVxuXG5cbiAgICAvLyBTdGF0aWMgZnVuY3Rpb25zOlxuICAgIC8qKlxuICAgICAqIEFkZCB0d28gdmVjdG9ycyB0b2dldGhlci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBWZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBzdW0gb2YgdGhlIHZlY3RvcnMuXG4gICAgICovXG4gICAgc3RhdGljIGFkZChhOiBWZWMyLCBiOiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihhLnggKyBiLngsIGEueSArIGIueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSBhbm90aGVyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIHN1YnRyYWN0aW9uIG9mIHRoZSB2ZWN0b3JzLlxuICAgICAqL1xuICAgIHN0YXRpYyBzdWIoYTogVmVjMiwgYjogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoYS54IC0gYi54LCBhLnkgLSBiLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuXG4gICAgICogQHBhcmFtIHtWZWMyfSB2IC0gVmVjdG9yLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gU2NhbGFyLlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBtdWx0aXBsaWVkIHZlY3Rvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdCh2OiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHYueCAqIHgsIHYueSAqIHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpdmlkZSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gdiAtIFZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFNjYWxhci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgZGl2aWRlZCB2ZWN0b3IuXG4gICAgICovXG4gICAgc3RhdGljIGRpdih2OiBWZWMyLCB4OiBudW1iZXIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHYueCAvIHgsIHYueSAvIHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHVuaXQgdmVjdG9yIGZyb20gYW4gYW5nbGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSBUaGUgYW5nbGUuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNyZWF0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tQW5nbGUoYTogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpbmVhcnJ5IGludGVycG9sYXRlcyBhIHZlY3RvciBpbnRvIGFub3RoZXIgdmVjdG9yIGJ5IHNjYWxhciB4LlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYSAtIEEgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gYiAtIE90aGVyIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBzY2FsYXIuXG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGNyZWF0ZWQgdmVjdG9yLlxuICAgICAqL1xuICAgIHN0YXRpYyBsZXJwKGE6IFZlYzIsIGI6IFZlYzIsIHg6IG51bWJlcik6IFZlYzIge1xuICAgICAgICByZXR1cm4gVmVjMi5hZGQoYSwgVmVjMi5tdWx0KFZlYzIuc3ViKGIsIGEpLCB4KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtLlxuICAgICAqL1xuICAgIHN0YXRpYyBkaXN0KGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gVmVjMi5zdWIoYSwgYikubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBhIC0gQSB2ZWN0b3IuXG4gICAgICogQHBhcmFtIHtWZWMyfSBiIC0gT3RoZXIgdmVjdG9yXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZG90KGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBjcm9zcyBwcm9kdWN0IG9mIHRoZW0uXG4gICAgICovXG4gICAgc3RhdGljIGNyb3NzKGE6IFZlYzIsIGI6IFZlYzIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gYS54ICogYi55IC0gYS55ICogYi54O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgYW5nbGUgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEFuZ2xlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGUoYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoVmVjMi5kb3QoYSwgYikgLyBNYXRoLnNxcnQoYS5zcWxlbmd0aCAqIGIuc3FsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIHZlY3RvcnMgYnV0IGluIHRoZSBhbnRpY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGEgLSBBIHZlY3Rvci5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGIgLSBPdGhlciB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IEFuZ2xlIGJldHdlZW4gdGhlbS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGVBQ1coYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBhaCA9IGEuaGVhZGluZztcbiAgICAgICAgbGV0IGJoID0gYi5oZWFkaW5nO1xuICAgICAgICBsZXQgYW5nbGUgPSBiaCAtIGFoO1xuICAgICAgICByZXR1cm4gYW5nbGUgPCAwID8gMiAqIE1hdGguUEkgKyBhbmdsZSA6IGFuZ2xlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIHZlY3RvciB3aXRoIHRoZSBzYW1lIGhlYWRpbmcgd2l0aCB0aGUgaW5wdXQgdmVjdG9yXG4gICAgICogYnV0IHdpdGggbGVuZ3RoID0gMS5cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHYgLSBBIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBWZWN0b3Igd2l0aCBsZW5ndGggPSAwLlxuICAgICAqL1xuICAgIHN0YXRpYyBub3JtYWxpemVkKHY6IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgbGV0IGwgPSB2Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGwgPT09IDAgPyB2IDogbmV3IFZlYzIodi54IC8gbCwgdi55IC8gbCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBCYWxsIGZyb20gJy4vYmFsbCc7XG5cbi8qKiBDbGFzcyByZXByZXNlbnRpbmcgYSB3YWxsXG4gKiBXYWxscyBhcmUgb2JqZWN0cyB0aGF0IGFyZSBpbW1vdmFibGUgIGFuZCB0aGV5IGFyZSByaWdpZFxuICogSXQgY2FuIGJlIGNvbnZleCBvciBjb25jYXZlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGwge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHdhbGxcbiAgICAgKiBAcGFyYW0ge0FycmF5PFZlYzI+fSBwb2ludHMgQXJyYXkgb2YgcG9pbnRzIHRoYXQgbWFrZSB1cCB0aGUgd2FsbFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb2ludHM6IEFycmF5PFZlYzI+KSB7XG4gICAgICAgIGxldCBwb2wgPSB0aGlzLnBvaW50cztcbiAgICAgICAgbGV0IHN1bTEgPSAwO1xuICAgICAgICBsZXQgc3VtMiA9IDA7XG4gICAgICAgIGxldCBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWzFdLCBwb2xbMF0pLFxuICAgICAgICAgICAgVmVjMi5zdWIocG9sW3BvbC5sZW5ndGggLSAxXSwgcG9sWzBdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2wubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBhbmdsZSA9IFZlYzIuYW5nbGVBQ1coVmVjMi5zdWIocG9sWyhpICsgMSkgJSBwb2wubGVuZ3RoXSxcbiAgICAgICAgICAgICAgICBwb2xbaV0pLCBWZWMyLnN1Yihwb2xbaSAtIDFdLCBwb2xbaV0pKTtcbiAgICAgICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgICAgICBzdW0yICs9IE1hdGguUEkgKiAyIC0gYW5nbGU7XG4gICAgICAgIH1cbiAgICAgICAgYW5nbGUgPSBWZWMyLmFuZ2xlQUNXKFZlYzIuc3ViKHBvbFswXSwgcG9sW3BvbC5sZW5ndGggLSAxXSksXG4gICAgICAgICAgICBWZWMyLnN1Yihwb2xbcG9sLmxlbmd0aCAtIDJdLCBwb2xbcG9sLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgIHN1bTEgKz0gYW5nbGU7XG4gICAgICAgIHN1bTIgKz0gTWF0aC5QSSAqIDIgLSBhbmdsZTtcbiAgICAgICAgaWYgKHN1bTIgPiBzdW0xKSByZXR1cm47XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRlbXAgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwb2wubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHRlbXAucHVzaChwb2xbaV0pO1xuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gZm9yIGNvbGxpc2lvbiBkZXRlY3Rpb24gYW5kIGJlaGF2aW9yIGJldHdlZW4gYmFsbHMgYW5kIHdhbGxzXG4gICAgICogQHBhcmFtIHtCYWxsfSBiYWxsIFRoZSBiYWxsIHRoYXQgaXMgY2hlY2tlZCBpZiBpdCBjb2xsaWRlcyB3aXRoIHRoZSB3YWxsXG4gICAgICovXG4gICAgY29sbGlkZVdpdGhCYWxsKGJhbGw6IEJhbGwpIHtcbiAgICAgICAgbGV0IGhlYWRpbmc6IG51bWJlcjtcbiAgICAgICAgbGV0IHJlbDogbnVtYmVyO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2goKHBvaW50LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBwLnggLT0gYmFsbC5wb3MueDtcbiAgICAgICAgICAgIHAueSAtPSBiYWxsLnBvcy55O1xuICAgICAgICAgICAgcC5tdWx0KC0xKTtcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA8PSBiYWxsLnIpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gcC5oZWFkaW5nO1xuICAgICAgICAgICAgICAgIHJlbCA9IHAubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IG5ldyBWZWMyKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgbGV0IG5wID0gbmV3IFZlYzIoXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbKGlkeCArIDEpICUgdGhpcy5wb2ludHMubGVuZ3RoXS54LFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzWyhpZHggKyAxKSAlIHRoaXMucG9pbnRzLmxlbmd0aF0ueSk7XG4gICAgICAgICAgICBsZXQgYnAgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCBzaWRlID0gbmV3IFZlYzIobnAueCAtIHAueCwgbnAueSAtIHAueSk7XG4gICAgICAgICAgICBsZXQgaCA9IHNpZGUuaGVhZGluZztcbiAgICAgICAgICAgIHAucm90YXRlKC1oICsgTWF0aC5QSSk7XG4gICAgICAgICAgICBucC5yb3RhdGUoLWggKyBNYXRoLlBJKTtcbiAgICAgICAgICAgIGJwLnJvdGF0ZSgtaCArIE1hdGguUEkpO1xuICAgICAgICAgICAgbGV0IGQgPSBicC55IC0gKChwLnkgKyBucC55KSAvIDIpO1xuICAgICAgICAgICAgaWYgKGQgPj0gLWJhbGwuciAmJiBkIDw9IGJhbGwuciAmJiBicC54ID49IG5wLnggJiYgYnAueCA8PSBwLngpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gaCAtIE1hdGguUEkgLyAyO1xuICAgICAgICAgICAgICAgIHJlbCA9IGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChoZWFkaW5nID09PSAwIHx8IGhlYWRpbmcpIHtcbiAgICAgICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMihiYWxsLnBvcy54LCBiYWxsLnBvcy55KTtcbiAgICAgICAgICAgIGxldCB2ZWwgPSBuZXcgVmVjMihiYWxsLnZlbC54LCBiYWxsLnZlbC55KTtcbiAgICAgICAgICAgIHBvcy5yb3RhdGUoLWhlYWRpbmcgKyBNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICB2ZWwucm90YXRlKC1oZWFkaW5nICsgTWF0aC5QSSAvIDIpO1xuXG4gICAgICAgICAgICBpZiAodmVsLnkgPiAwKSByZXR1cm47XG4gICAgICAgICAgICB2ZWwueSAqPSAtYmFsbC5rO1xuICAgICAgICAgICAgcG9zLnkgKz0gYmFsbC5yIC0gcmVsO1xuICAgICAgICAgICAgbGV0IGR2eSA9IHZlbC55ICogKDEgKyAoMSAvIGJhbGwuaykpO1xuXG4gICAgICAgICAgICBsZXQgZGVsdGFBbmcgPSBNYXRoLnNpZ24odmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgKlxuICAgICAgICAgICAgICAgIChkdnkgKiBiYWxsLmZjKSAvIChiYWxsLmFtYyAqIGJhbGwucik7XG4gICAgICAgICAgICBsZXQgbWF4RGVsdGFBbmcgPSAodmVsLnggLSBiYWxsLmFuZyAqIGJhbGwucikgLyBiYWxsLnI7XG5cbiAgICAgICAgICAgIGlmIChkZWx0YUFuZyAvIG1heERlbHRhQW5nID4gMSkgZGVsdGFBbmcgPSBtYXhEZWx0YUFuZztcbiAgICAgICAgICAgIGRlbHRhQW5nICo9IChiYWxsLmFtYykgLyAoYmFsbC5hbWMgKyAxKTtcbiAgICAgICAgICAgIGJhbGwuYW5nICs9IGRlbHRhQW5nO1xuXG4gICAgICAgICAgICBsZXQgZHZ4ID0gZGVsdGFBbmcgKiBiYWxsLnI7XG5cbiAgICAgICAgICAgIHZlbC54IC09IGR2eDtcblxuICAgICAgICAgICAgcG9zLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgdmVsLnJvdGF0ZShoZWFkaW5nIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICAgICAgYmFsbC5wb3MueCA9IHBvcy54O1xuICAgICAgICAgICAgYmFsbC5wb3MueSA9IHBvcy55O1xuICAgICAgICAgICAgYmFsbC52ZWwueCA9IHZlbC54O1xuICAgICAgICAgICAgYmFsbC52ZWwueSA9IHZlbC55O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
