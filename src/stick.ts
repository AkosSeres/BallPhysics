import Vec2 from './vec2';
import Spring from './spring';

/**
 * Stick class for the physics engine
 * Sticks are not strechable objects that do not collide
 * with other objects but they can hold other objects on their ends
 */
export default class Stick extends Spring {
    /**
     * Creates a stick
     * @param {nuber} length The length of the stick
     */
    constructor(length: number) {
        super(length, 0);
        this.springConstant = 0;
    }

    /**
     * Updates the stick trough an elapsed time
     * @param {number} t Elapsed time
     */
    update(t: number) {
        let p1;
        let p2;
        if (this.pinned && this.objects[0]) {
            p2 = this.pinned;
            p1 = this.objects[0];
            let dist = new Vec2(p2.x - p1.pos.x, p2.y - p1.pos.y);
            dist.setMag(1);
            dist.mult(-this.length);
            p1.move(-p1.pos.x + p2.x + dist.x, -p1.pos.y + p2.y + dist.y);

            let v = p1.vel;
            v.rotate(-dist.heading);
            v.x = 0;

            if (this.rotationLocked) {
                let s = new Vec2(p2.x, p2.y);
                let r2 = Vec2.sub(p1.pos, s);
                let am = r2.length * r2.length * p1.m + p1.am;
                let ang = (p1.am * p1.ang - r2.length * p1.m * (v.y)) / (am);

                v.y = -ang * r2.length;

                p1.ang = ang;
            }

            v.rotate(dist.heading);
        } else if (this.objects[0] && this.objects[1]) {
            p1 = this.objects[0];
            p2 = this.objects[1];

            let dist = Vec2.sub(p1.pos, p2.pos);
            let dl = this.length - dist.length;
            dist.setMag(1);
            let move1 = Vec2.mult(dist, dl * (p2.m) / ((p1.m) + (p2.m)));
            let move2 = Vec2.mult(dist, -dl * (p1.m) / ((p1.m) + (p2.m)));
            p1.move(move1.x, move1.y);
            p2.move(move2.x, move2.y);

            let v1 = p1.vel;
            let v2 = p2.vel;
            v1.rotate(-dist.heading);
            v2.rotate(-dist.heading);
            v1.x = v2.x = (p1.m * v1.x + p2.m * v2.x) / ((p1.m) + (p2.m));

            if (this.rotationLocked) {
                let s = new Vec2(p1.pos.x * p1.m + p2.pos.x * p2.m,
                    p1.pos.y * p1.m + p2.pos.y * p2.m);
                s.div(p1.m + p2.m);
                let r1 = Vec2.sub(p1.pos, s);
                let r2 = Vec2.sub(p2.pos, s);
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
