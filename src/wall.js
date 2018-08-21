const Vec2 = require('./vec2');

class Wall {
    constructor(points) {
        // The wall is immovable
        this.points = points;

        let pol = this.points;
        let sum1 = 0;
        let sum2 = 0;
        let angle = Vec2.angleACW(Vec2.sub(pol[1], pol[0]),
            Vec2.sub(pol[pol.length - 1], pol[0]));
        sum1 += angle;
        sum2 += Math.PI * 2 - angle;
        for (let i = 1; i < pol.length - 1; i++) {
            angle = Vec2.angleACW(Vec2.sub(pol[(i + 1) % pol.length],
                pol[i]), Vec2.sub(pol[i - 1], pol[i]));
            sum1 += angle;
            sum2 += Math.PI * 2 - angle;
        }
        angle = Vec2.angleACW(Vec2.sub(pol[0], pol[pol.length - 1]),
            Vec2.sub(pol[pol.length - 2], pol[pol.length - 1]));
        sum1 += angle;
        sum2 += Math.PI * 2 - angle;
        if (sum2 > sum1) return;
        else {
            let temp = [];
            for (let i = pol.length - 1; i >= 0; i--) temp.push(pol[i]);
            this.points = temp;
        }
    }

    collideWithBall(ball) {
        let heading = null;
        let rel = null;

        this.points.forEach((point, idx) => {
            let p = new Vec2(point.x, point.y);
            p.x -= ball.pos.x;
            p.y -= ball.pos.y;
            p.mult(-1);
            if (p.length <= ball.r) {
                heading = p.heading;
                rel = p.length;
            }
            p = new Vec2(point.x, point.y);
            let np = new Vec2(this.points[(idx + 1) % this.points.length].x, this.points[(idx + 1) % this.points.length].y);
            let bp = new Vec2(ball.pos.x, ball.pos.y);
            let side = new Vec2(np.x - p.x, np.y - p.y);
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
            let pos = new Vec2(ball.pos.x, ball.pos.y);
            let vel = new Vec2(ball.vel.x, ball.vel.y);
            pos.rotate(-heading + Math.PI / 2);
            vel.rotate(-heading + Math.PI / 2);

            vel.y *= -ball.k;
            pos.y += ball.r - rel;
            let dvy = vel.y * (1 + (1 / ball.k));
            let dvx = Math.abs(dvy) * ball.fc * Math.sign(vel.x - ball.ang * ball.r) * -1;
            if (Math.abs(dvx) > Math.abs(vel.x - ball.ang * ball.r)) {
                dvx = -vel.x + ball.ang * ball.r;
            }
            vel.x += dvx - ball.r * ball.r * ball.m * dvx / (ball.am + ball.r * ball.r * ball.m);
            ball.ang -= ball.r * ball.r * ball.m * dvx / ((ball.am + ball.r * ball.r * ball.m) * ball.r);
            pos.rotate(heading - Math.PI / 2);
            vel.rotate(heading - Math.PI / 2);
            ball.pos.x = pos.x;
            ball.pos.y = pos.y;
            ball.vel.x = vel.x;
            ball.vel.y = vel.y;
        }
    }
}

module.exports = Wall;