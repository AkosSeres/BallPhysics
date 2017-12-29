class Body {
    constructor(points, vel, k, ang, fc) {
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
            for (let i = pol.length - 1; i >= 0; i--)temp.push(pol[i]);
            this.points = temp;
        }

        this.pos = this.calculatePos();
        this.lastPos = this.pos.copy;
        this.fc = 0.4;//coefficient of friction
        this.am = 2 / 5;//angular mass (am*m*r*r)

        this.rotation = 0;

        if (ang) this.ang = ang;
        else this.ang = 0;

        if (fc || fc === 0) this.fc = fc;

        if (k) this.k = k;
        else this.k = 0.8;

        if (vel != undefined) this.vel = vel.copy;
        else this.vel = new Vec2(0, 0);
    }

    calculatePos() {
        if (this.isConcave) {
            const includes = (arr, item) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === item) return true;
                }
                return false;
            };
            const intersectWithPoligon = function(segment, pol, exceptions) {
                for (let i = 0; i < pol.length; i++) {
                    if (!includes(exceptions, i)) {
                        let side = new LineSegment(new Vec2(pol[i].x, pol[i].y),
                            new Vec2(pol[(i + 1) % pol.length].x,
                                pol[(i + 1) % pol.length].y));
                        if (LineSegment.intersect(segment, side)) return true;
                    }
                }
                return false;
            };
            let found = true;
            let poligons = [];
            poligons.push([]);
            this.points.forEach(p => {poligons[0].push({x: p.x, y: p.y})});

            checkAllPoligons: while (found) {
                found = false;
                for (let i = 0; i < poligons.length; i++) {
                    let pol = poligons[i];
                    let a = Vec2.sub(pol[1], pol[0]);
                    let b = Vec2.sub(pol[pol.length - 1], pol[0]);
                    let angle = Vec2.angleACW(a, b);
                    if (angle > Math.PI) {
                        found = true;
                        let j = 0;
                        let k = j + 2;
                        let newSide = new LineSegment(new Vec2(pol[j].x, pol[j].y),
                            new Vec2(pol[k % pol.length].x, pol[k % pol.length].y));
                        let newSideHeading =
                            (new Vec2(newSide.b.x - newSide.a.x,
                                newSide.b.y - newSide.a.y)).heading;
                        while (!(a.heading > b.heading ?
                            ((newSideHeading > a.heading &&
                                newSideHeading < 2 * Math.PI) ||
                                (newSideHeading > 0 &&
                                    newSideHeading < b.heading)) :
                            (newSideHeading > a.heading &&
                                newSideHeading < b.heading))
                            || intersectWithPoligon(
                                new LineSegment(new Vec2(pol[j % pol.length].x,
                                    pol[j % pol.length].y),
                                    new Vec2(pol[k % pol.length].x,
                                        pol[k % pol.length].y)),
                                pol,
                                [(pol.length - 1) % pol.length,
                                j % pol.length,
                                (k - 1) % pol.length,
                                k % pol.length])) {
                            k++;
                            newSide = new LineSegment(
                                new Vec2(pol[j].x,
                                    pol[j].y),
                                new Vec2(pol[k % pol.length].x,
                                    pol[k % pol.length].y));
                            newSideHeading = (
                                new Vec2(
                                    newSide.b.x - newSide.a.x,
                                    newSide.b.y - newSide.a.y))
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
                        let a = Vec2.sub(pol[(j + 1) % pol.length], pol[j]);
                        let b = Vec2.sub(pol[j - 1], pol[j]);
                        let angle = Vec2.angleACW(a, b);
                        if (angle > Math.PI) {
                            found = true;
                            let k = j + 2;
                            let newSide = new LineSegment(
                                new Vec2(pol[j].x,
                                    pol[j].y),
                                new Vec2(pol[k % pol.length].x,
                                    pol[k % pol.length].y));
                            let newSideHeading = (
                                new Vec2(newSide.b.x - newSide.a.x,
                                    newSide.b.y - newSide.a.y))
                                .heading;
                            while (!(a.heading > b.heading ?
                                ((newSideHeading > a.heading &&
                                    newSideHeading < 2 * Math.PI) ||
                                    (newSideHeading > 0 &&
                                        newSideHeading < b.heading)) :
                                (newSideHeading > a.heading &&
                                    newSideHeading < b.heading)) ||
                                intersectWithPoligon(
                                    newSide,
                                    pol,
                                    [(j - 1) % pol.length,
                                    j % pol.length,
                                    (k - 1) % pol.length,
                                    k % pol.length])) {
                                k++;
                                newSide = new LineSegment(
                                    new Vec2(pol[j].x,
                                        pol[j].y),
                                    new Vec2(pol[k % pol.length].x,
                                        pol[k % pol.length].y));
                                newSideHeading = (
                                    new Vec2(
                                        newSide.b.x - newSide.a.x,
                                        newSide.b.y - newSide.a.y))
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

            for (let i = poligons.length - 1; i >= 0; i--) {
                let pol = poligons[i];
                console.log(pol);
                while (pol.length > 3) {
                    poligons.push([pol[0], pol[1], pol[2]]);
                    pol.splice(1, 1);
                }
            }

            let mSum = 0;
            let pSum = new Vec2(0, 0);
            poligons.forEach(pol => {
                let a = Math.sqrt(Math.pow(pol[0].x - pol[1].x, 2) + Math.pow(pol[0].y - pol[1].y, 2));
                let b = Math.sqrt(Math.pow(pol[1].x - pol[2].x, 2) + Math.pow(pol[1].y - pol[2].y, 2));
                let c = Math.sqrt(Math.pow(pol[2].x - pol[0].x, 2) + Math.pow(pol[2].y - pol[0].y, 2));
                let s = (a + b + c) / 2;
                let m = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                mSum += m;
                pSum.x += m * (pol[0].x + pol[1].x + pol[2].x) / 3;
                pSum.y += m * (pol[0].y + pol[1].y + pol[2].y) / 3;
            });
            pSum.div(mSum);
            return pSum;
        } else {
            let x = 0, y = 0;
            this.points.forEach(element => {
                x += element.x;
                y += element.y;
            });
            return new Vec2(x / this.points.length, y / this.points.length);
        }
    }

    rotate(angle) {
        this.points.forEach(p => {
            let point = new Vec2(p.x, p.y);
            point.sub(this.pos);
            point.rotate(angle);
            point.add(this.pos);
            p.x = point.x;
            p.y = point.y;
        });
    }

    get isConcave() {
        let pol = this.points;
        let angle = Vec2.angleACW(Vec2.sub(pol[1], pol[0]),
            Vec2.sub(pol[pol.length - 1], pol[0]));
        if (angle > Math.PI) return true;
        for (let i = 1; i < pol.length - 1; i++) {
            angle = Vec2.angleACW(Vec2.sub(pol[(i + 1) % pol.length],
                pol[i]), Vec2.sub(pol[i - 1], pol[i]));
            if (angle > Math.PI) return true;
        }
        angle = Vec2.angleACW(Vec2.sub(pol[0], pol[pol.length - 1]),
            Vec2.sub(pol[pol.length - 2], pol[pol.length - 1]));
        if (angle > Math.PI) return true;
        return false;
    }
}