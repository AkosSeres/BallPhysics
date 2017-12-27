class Wall {
    constructor(x, y, w, h) {
        // The wall is immovable and it is a rectangle
        // Coordinates of the center
        this.x = x;
        this.y = y;
        // Width and height
        this.w = w;
        this.h = h;
    }

    collideWithBall(ball) {
        if (ball.pos.x > this.x - this.w / 2 && ball.pos.x < this.x + this.w / 2 && ball.pos.y < this.y + this.h / 2 && ball.pos.y > this.y - this.h / 2) {
            let dp = new Vec2(0, 0);
            console.log("bene");
            if (Math.abs(ball.pos.x - this.x) > Math.abs(ball.pos.y - this.y)) ball.pos.x += this.x + Math.sign(ball.pos.x - this.x) * this.w / 2 - ball.pos.x + Math.sign(ball.pos.x - this.x) * ball.r;
            else ball.pos.y += this.y + Math.sign(ball.pos.y - this.y) * this.h / 2 - ball.pos.y + Math.sign(ball.pos.y - this.y) * ball.r;
            return;
        }
        if (ball.pos.x === this.x && ball.pos.y === this.y) {ball.pos.y += this.h / 2 + ball.r; return;}
        let heading = null;
        let rel = null;
        if (ball.pos.x < this.x + this.w / 2 && ball.pos.x > this.x - this.w / 2 && ball.pos.y >= this.y + this.h / 2 && ball.pos.y - ball.r <= this.y + this.h / 2) {
            ball.vel.y *= -ball.k;
            ball.pos.y = this.y + this.h / 2 + ball.r;
            let dvy = ball.vel.y * (1 + (1 / ball.k));
            let dvx = Math.abs(dvy) * ball.fc * Math.sign(ball.vel.x - ball.ang * ball.r) * -1;
            if (Math.abs(dvx) > Math.abs(ball.vel.x - ball.ang * ball.r)) {
                dvx = -ball.vel.x + ball.ang * ball.r;
            }
            ball.vel.x += dvx + dvx / (ball.am + 1);
            ball.ang -= dvx / ((ball.am + 1) * ball.r);
            return;
        } else if (ball.pos.x < this.x + this.w / 2 && ball.pos.x > this.x - this.w / 2 && ball.pos.y <= this.y - this.h / 2 && ball.pos.y + ball.r >= this.y - this.h / 2) {
            ball.vel.y *= -ball.k;
            ball.pos.y = this.y - this.h / 2 - ball.r;
            let dvy = ball.vel.y * (1 + (1 / ball.k));
            let dvx = Math.abs(dvy) * ball.fc * Math.sign(ball.vel.x + ball.ang * ball.r) * -1;
            if (Math.abs(dvx) > Math.abs(ball.vel.x + ball.ang * ball.r)) {
                dvx = -ball.vel.x - ball.ang * ball.r;
            }
            ball.vel.x += dvx - dvx / (ball.am + 1);
            ball.ang += dvx / ((ball.am + 1) * ball.r);
            return;
        } else if (ball.pos.y < this.y + this.h / 2 && ball.pos.y > this.y - this.h / 2 && ball.pos.x >= this.x + this.w / 2 && ball.pos.x - ball.r <= this.x + this.w / 2) {
            ball.vel.x *= -ball.k;
            ball.pos.x = this.x + this.w / 2 + ball.r;
            let dvx = ball.vel.x * (1 + (1 / ball.k));
            let dvy = Math.abs(dvx) * ball.fc * Math.sign(ball.vel.y - ball.ang * ball.r) * -1;
            if (Math.abs(dvy) > Math.abs(ball.vel.y - ball.ang * ball.r)) {
                dvy = -ball.vel.y + ball.ang * ball.r;
            }
            ball.vel.y += dvy + dvy / (ball.am + 1);
            ball.ang -= dvy / ((ball.am + 1) * ball.r);
            return;
        } else if (ball.pos.y < this.y + this.h / 2 && ball.pos.y > this.y - this.h / 2 && ball.pos.x <= this.x - this.w / 2 && ball.pos.x + ball.r >= this.x - this.w / 2) {
            ball.vel.x *= -ball.k;
            ball.pos.x = this.x - this.w / 2 - ball.r;
            let dvx = ball.vel.x * (1 + (1 / ball.k));
            let dvy = Math.abs(dvx) * ball.fc * Math.sign(ball.vel.y - ball.ang * ball.r) * -1;
            if (Math.abs(dvy) > Math.abs(ball.vel.y - ball.ang * ball.r)) {
                dvy = -ball.vel.y + ball.ang * ball.r;
            }
            ball.vel.y += dvy + dvy / (ball.am + 1);
            ball.ang -= dvy / ((ball.am + 1) * ball.r);
            return;
        } else if (new Vec2(ball.pos.x - this.x - this.w / 2, ball.pos.y - this.y - this.h / 2).length <= ball.r) {
            let d = new Vec2(ball.pos.x - this.x - this.w / 2, ball.pos.y - this.y - this.h / 2);
            heading = d.heading;
            rel = d.length;
        } else if (new Vec2(ball.pos.x - this.x + this.w / 2, ball.pos.y - this.y + this.h / 2).length <= ball.r) {
            let d = new Vec2(ball.pos.x - this.x + this.w / 2, ball.pos.y - this.y + this.h / 2);
            heading = d.heading;
            rel = d.length;
        } else if (new Vec2(ball.pos.x - this.x + this.w / 2, ball.pos.y - this.y - this.h / 2).length <= ball.r) {
            let d = new Vec2(ball.pos.x - this.x + this.w / 2, ball.pos.y - this.y - this.h / 2);
            heading = d.heading;
            rel = d.length;
        } else if (new Vec2(ball.pos.x - this.x - this.w / 2, ball.pos.y - this.y + this.h / 2).length <= ball.r) {
            let d = new Vec2(ball.pos.x - this.x - this.w / 2, ball.pos.y - this.y + this.h / 2);
            heading = d.heading;
            rel = d.length;
        }
        if (heading) {
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
            vel.x += dvx - dvx / (ball.am + 1);
            ball.ang -= dvx / ((ball.am + 1) * ball.r);
            pos.rotate(heading - Math.PI / 2);
            vel.rotate(heading - Math.PI / 2);
            ball.pos.x = pos.x; ball.pos.y = pos.y;
            ball.vel.x = vel.x; ball.vel.y = vel.y;
        }
    }
}