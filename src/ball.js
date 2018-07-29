class Ball {
  constructor(pos, vel, r, k, ang, fc) {
    this.pos = pos.copy;
    this.lastPos = this.pos.copy;
    this.r = r;
    this.fc = 0.4;//coefficient of friction
    this.amc = 2 / 5;//angular mass coefficient

    this.rotation = 0;

    if (ang) this.ang = ang;
    else this.ang = 0;

    if (fc || fc === 0) this.fc = fc;

    if (k) this.k = k;
    else this.k = 0.8;

    if (vel != undefined) this.vel = vel.copy;
    else this.vel = new Vec2(0, 0);
  }

  get m() {
    return this.r * this.r * Math.PI;
  }

  get am() {
    return this.amc * this.m * this.r * this.r;
  }

  get copy() {
    var ret = new Ball(this.pos.copy, this.vel.copy, this.r, this.k, this.ang, this.fc);
    ret.lastPos = this.lastPos.copy;
    ret.rotation = this.rotation;
    return ret;
  }

  move(x, y) {
    this.pos.x += x;
    this.pos.y += y;
  }

  collided(ball) {
    if (this.pos.dist(ball.pos) < (this.r + ball.r)) return true;
    else return false;
  }

  static collide(ball1, ball2) {
    if (ball1.collided(ball2)) {
      var pos1 = ball1.pos;
      var pos2 = ball2.pos;
      var lPos1 = ball1.lastPos;
      var lPos2 = ball2.lastPos;
      var r1 = ball1.r;
      var r2 = ball2.r;
      var rSum = r1 + r2;
      var kk = (ball1.k + ball2.k) / 2;
      var m1 = r1 * r1;
      var m2 = r2 * r2;
      var v1 = ball1.vel;
      var v2 = ball2.vel;
      var s1 = Vec2.sub(pos1, lPos1);
      var s2 = Vec2.sub(pos2, lPos2);
      var dist = Vec2.dist(pos1, pos2);
      var lastDist = Vec2.dist(lPos1, lPos2);
      var fc = (ball1.fc + ball2.fc) / 2;

      var cp1 = pos1.copy;
      var cp2 = pos2.copy;
      let too = r1 + r2 - dist;
      var d = Vec2.sub(pos1, pos2);
      d.setMag(1);
      d.mult(too * m2 / (m1 + m2));
      cp1.add(d);
      d.setMag(1);
      d.mult(-too * m1 / (m1 + m2));
      cp2.add(d);

      while (lastDist < rSum && false) {
        var d1 = Vec2.sub(pos1, pos2);
        var randVec = new Vec2(0, 1);
        randVec.rotate(Math.random() * Math.PI * 2);
        if (dist === 0) {
          ball1.pos.add(Vec2.mult(randVec, rSum / 2));
          ball2.pos.add(Vec2.mult(randVec, -rSum / 2));
        }
        d1.mult(rSum / dist);
        d1.mult(kk);
        d1.mult(m2 / (m1 + m2));
        ball1.vel.add(d1);

        var d2 = Vec2.sub(pos2, pos1);
        if (dist === 0) {d2 = Vec2.mult(d1, -1);}
        d2.mult(rSum / dist);
        d2.mult(kk);
        d2.mult(m1 / (m2 + m1));
        ball2.vel.add(d2);

        d1.setMag(1);
        d1.mult(rSum / dist);
        d1.mult(m2 / (m1 + m2));
        ball1.pos.add(d1);

        d2.setMag(1);
        d2.mult(rSum / dist);
        d2.mult(m1 / (m2 + m1));
        ball2.pos.add(d2);

        return;
      }

      ball1.pos = cp1;
      ball2.pos = cp2;
      let np1 = cp1.copy;
      let np2 = cp2.copy;

      var v1n = v1.copy;
      let angle = Vec2.angleACW(new Vec2(v1.x, v1.y), new Vec2(np2.x - np1.x, np2.y - np1.y));
      v1n.rotate(angle);
      v1n.mult(Math.cos(angle));
      var v2n = v2.copy;
      angle = Vec2.angleACW(new Vec2(v2.x, v2.y), new Vec2(np1.x - np2.x, np1.y - np2.y));
      v2n.rotate(angle);
      v2n.mult(Math.cos(angle));

      var v1p = v1.copy;
      angle = Vec2.angleACW(new Vec2(v1.x, v1.y), new Vec2(np2.x - np1.x, np2.y - np1.y));
      v1p.rotate(-HALF_PI + angle);
      v1p.mult(Math.sin(angle));
      var v2p = v2.copy;
      angle = Vec2.angleACW(new Vec2(v2.x, v2.y), new Vec2(np1.x - np2.x, np1.y - np2.y));
      v2p.rotate(-HALF_PI + angle);
      v2p.mult(Math.sin(angle));

      var u1n = Vec2.mult(v1n, m1);
      u1n.add(Vec2.mult(v2n, m2));
      u1n.mult(1 + kk);
      u1n.div(m1 + m2);
      u1n.sub(Vec2.mult(v1n, kk));

      var u2n = Vec2.mult(v1n, m1);
      u2n.add(Vec2.mult(v2n, m2));
      u2n.mult(1 + kk);
      u2n.div(m1 + m2);
      u2n.sub(Vec2.mult(v2n, kk));

      let dv1n = Vec2.dist(u1n, v1n);
      let dv2n = Vec2.dist(u2n, v2n);

      let p1 = new Vec2(v1.x, v1.y);
      let p2 = new Vec2(v2.x, v2.y);
      let rot = new Vec2(np1.x - np2.x, np1.y - np2.y).heading;

      p1.rotate(-rot + Math.PI / 2);
      p2.rotate(-rot + Math.PI / 2);
      let vk = (m1 * (p1.x + ball1.ang * r1) + m2 * (p2.x - ball2.ang * r2)) / (m1 + m2);

      let dv1p = -dv1n * fc * Math.sign(p1.x - ball1.ang * r1 - vk);
      if (Math.abs(dv1p) > Math.abs(p1.x - ball1.ang * r1 - vk)) {dv1p = -p1.x + ball1.ang * r1 + vk;}
      let dv2p = -dv2n * fc * Math.sign(p2.x + ball2.ang * r2 - vk);
      if (Math.abs(dv2p) > Math.abs(p2.x + ball2.ang * r2 - vk)) {dv2p = -p2.x - ball2.ang * r2 + vk;}
      let dv1 = new Vec2(dv1p + ball1.r * ball1.r * ball1.m * dv1p / (ball1.am + ball1.r * ball1.r * ball1.m), 0);
      let dv2 = new Vec2(dv2p - ball2.r * ball2.r * ball2.m * dv2p / (ball2.am + ball2.r * ball2.r * ball2.m), 0);
      dv1.rotate(rot - Math.PI / 2);
      dv2.rotate(rot - Math.PI / 2);

      v1n = u1n;
      v2n = u2n;

      ball1.vel = Vec2.add(v1n, v1p);
      ball2.vel = Vec2.add(v2n, v2p);

      ball1.ang -= ball1.r * ball1.r * ball1.m * dv1p / ((ball1.am + ball1.r * ball1.r * ball1.m) * r1);
      ball2.ang += ball1.r * ball1.r * ball1.m * dv2p / ((ball2.am + ball2.r * ball2.r * ball2.m) * r2);
      ball1.vel.x += dv1.x;
      ball1.vel.y += dv1.y;
      ball2.vel.x += dv2.x;
      ball2.vel.y += dv2.y;

      ball1.lastPos = cp1;
      ball2.lastPos = cp2;
    }
  }

}