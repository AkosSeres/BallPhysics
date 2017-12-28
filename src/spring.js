class Spring {
    constructor(length, springConstant) {
        this.length = length;
        this.springConstant = springConstant;
        this.pinned = false;
        this.objects = [];
    }
    pinHere(x, y) {
        this.pinned = {x, y};
    }
    unpin() {
        this.pinned = false;
    }
    attachObject(object) {
        this.objects.push(object);
        if (this.objects.length === 2) {
            this.pinned = false;
        }
        if (this.objects.length >= 3) {
            this.objects = [this.objects[this.objects.length - 2], this.objects[this.objects.length - 1]]
        }
    }

    update(t) {
        let p1, p2;
        if (this.pinned && this.objects[0]) {
            p2 = this.pinned;
            p1 = this.objects[0];
            let dist = new Vec2(p2.x - p1.pos.x, p2.y - p1.pos.y);
            let dl = dist.length - this.length;
            dist.setMag(1);
            dist.mult(dl * this.springConstant * t / (p1.r * p1.r));
            p1.vel.x += dist.x;
            p1.vel.y += dist.y;
        } else if (this.objects[0] && this.objects[1]) {
            p1 = this.objects[0];
            p2 = this.objects[1];
            let dist = Vec2.sub(p1.pos, p2.pos);
            let dl = dist.length - this.length;
            dist.setMag(1);
            dist.mult(dl * this.springConstant * t);
            p2.vel.add(Vec2.div(dist, p2.r * p2.r));
            p1.vel.add(Vec2.div(dist, -p1.r * p1.r));
        }
    }
}