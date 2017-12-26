class Ball {
  constructor(pos, vel, r, k, ang) {
    this.pos = pos.copy();
    this.lastPos = this.pos.copy();
    this.r = r;
    this.fc = 0.4;//coefficient of friction
    this.am = 1;//angular mass (am*m*r*r)

    this.rotation = 0;

    if (ang) this.ang = ang;
    else this.ang = 0;

    if (k) this.k = k;
    else this.k = 0.8;

    if (vel) this.vel = vel.copy();
    else this.vel = createVector(0, 0);
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
      var s1 = p5.Vector.sub(pos1, lPos1);
      var s2 = p5.Vector.sub(pos2, lPos2);
      var dist = p5.Vector.dist(pos1, pos2);
      var lastDist = p5.Vector.dist(lPos1, lPos2);
      var fc = (ball1.fc + ball2.fc) / 2;

      while (lastDist < rSum) {
        var d1 = p5.Vector.sub(pos1, pos2);
        var randVec = p5.Vector.random2D();
        if (dist === 0) {
          ball1.pos.add(p5.Vector.mult(randVec, rSum / 2));
          ball2.pos.add(p5.Vector.mult(randVec, -rSum / 2));
        }
        d1.mult(rSum / dist);
        d1.mult(kk);
        d1.mult(m2 / (m1 + m2));
        ball1.vel.add(d1);

        var d2 = p5.Vector.sub(pos2, pos1);
        if (dist === 0) {d2 = p5.Vector.mult(d1, -1);}
        d2.mult(rSum / dist);
        d2.mult(kk);
        d2.mult(m1 / (m2 + m1));
        ball2.vel.add(d2);

        d1.normalize();
        d1.mult(rSum / dist);
        d1.mult(m2 / (m1 + m2));
        ball1.pos.add(d1);

        d2.normalize();
        d2.mult(rSum / dist);
        d2.mult(m1 / (m2 + m1));
        ball2.pos.add(d2);

        return;
      }

      var cp1 = pos1.copy();
      var cp2 = pos2.copy();
      let too = r1 + r2 - dist;
      var d = p5.Vector.sub(pos1, pos2);
      d.normalize();
      d.mult(too * m2 / (m1 + m2));
      cp1.add(d.x, d.y, d.z);
      d.normalize();
      d.mult(-too * m1 / (m1 + m2));
      cp2.add(d.x, d.y, d.z);

      ball1.pos = cp1;
      ball2.pos = cp2;
      let np1 = cp1.copy();
      let np2 = cp2.copy();

      var v1n = v1.copy();
      let angle = Vec2.angleACW(new Vec2(v1.x, v1.y), new Vec2(np2.x - np1.x, np2.y - np1.y));
      v1n.rotate(angle);
      v1n.mult(Math.cos(angle));
      var v2n = v2.copy();
      angle = Vec2.angleACW(new Vec2(v2.x, v2.y), new Vec2(np1.x - np2.x, np1.y - np2.y));
      v2n.rotate(angle);
      v2n.mult(Math.cos(angle));

      var v1p = v1.copy();
      angle = Vec2.angleACW(new Vec2(v1.x, v1.y), new Vec2(np2.x - np1.x, np2.y - np1.y));
      v1p.rotate(-HALF_PI + angle);
      v1p.mult(Math.sin(angle));
      var v2p = v2.copy();
      angle = Vec2.angleACW(new Vec2(v2.x, v2.y), new Vec2(np1.x - np2.x, np1.y - np2.y));
      v2p.rotate(-HALF_PI + angle);
      v2p.mult(Math.sin(angle));

      var u1n = p5.Vector.mult(v1n, m1);
      u1n.add(p5.Vector.mult(v2n, m2));
      u1n.mult(1 + kk);
      u1n.div(m1 + m2);
      u1n.sub(p5.Vector.mult(v1n, kk));

      var u2n = p5.Vector.mult(v1n, m1);
      u2n.add(p5.Vector.mult(v2n, m2));
      u2n.mult(1 + kk);
      u2n.div(m1 + m2);
      u2n.sub(p5.Vector.mult(v2n, kk));

      let dv1n = p5.Vector.dist(u1n, v1n);
      let dv2n = p5.Vector.dist(u2n, v2n);

      let p1 = new Vec2(v1.x, v1.y);
      let p2 = new Vec2(v2.x, v2.y);
      let rot = new Vec2(np1.x - np2.x, np1.y - np2.y).heading;

      p1.rotate(-rot + Math.PI / 2);
      p2.rotate(-rot + Math.PI / 2);
      let vk = (m1 * p1.x + m2 * p2.x) / (m1 + m2);
      //let vk = (m1 * (p1.x + ball1.ang * r1) + m2 * (p2.x - ball2.ang * r2)) / (m1 + m2);
      //vk += (m1 * ball1.ang * r1 - m2 * ball2.ang * r2) / (m1 + m2);
      vk += (ball1.am * m1 * r1 * r1 * ball1.ang - ball2.am * m2 * r2 * r2 * ball2.ang) / (ball1.am * m1 * r1 + ball2.am * m2 * r2);

      let dv1p = -dv1n * fc * Math.sign(p1.x - ball1.ang * r1 - vk);
      if (Math.abs(dv1p) > Math.abs(p1.x - ball1.ang * r1 - vk)) {dv1p = -p1.x + ball1.ang * r1 + vk;}
      let dv2p = -dv2n * fc * Math.sign(p2.x + ball2.ang * r2 - vk);
      if (Math.abs(dv2p) > Math.abs(p2.x + ball2.ang * r2 - vk)) {dv2p = -p2.x - ball2.ang * r2 + vk;}
      let dv1 = new Vec2(dv1p + dv1p / (ball1.am + 1), 0);
      let dv2 = new Vec2(dv2p - dv2p / (ball2.am + 1), 0);
      dv1.rotate(rot - Math.PI / 2);
      dv2.rotate(rot - Math.PI / 2);

      v1n = u1n;
      v2n = u2n;

      ball1.vel = p5.Vector.add(v1n, v1p);
      ball2.vel = p5.Vector.add(v2n, v2p);

      ball1.ang -= dv1p / ((ball1.am + 1) * r1);
      ball2.ang += dv2p / ((ball2.am + 1) * r2);
      ball1.vel.x += dv1.x;
      ball1.vel.y += dv1.y;
      ball2.vel.x += dv2.x;
      ball2.vel.y += dv2.y;

      ball1.lastPos = cp1;
      ball2.lastPos = cp2;
    }
  }

}

