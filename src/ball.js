function Ball(pos, vel, r, k) {
  this.pos = pos.copy();
  this.lastPos = this.pos.copy();

  this.r = r;

  this.rotation = 0;
  this.ang = 0;

  if (k) this.k = k;
  else this.k = 0.8;

  if (vel) this.vel = vel.copy();
  else this.vel = createVector(0, 0);

  this.collided = function (ball) {
    if (this.pos.dist(ball.pos) < (this.r + ball.r)) return true;
    else return false;
  }
}

function collide(ball1, ball2) {
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
      if (dist === 0) { d2 = p5.Vector.mult(d1, -1); }
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

    //calculate the point of the collision in time (lastPos in time = 0, current is 1)
    var deltaT = map(rSum, lastDist, dist, 0, 1);
    var cp1 = p5.Vector.lerp(lPos1, pos1, deltaT);
    var cp2 = p5.Vector.lerp(lPos2, pos2, deltaT);

    var remain1 = p5.Vector.mag(p5.Vector.mult(s1, 1 - deltaT));
    var remain2 = p5.Vector.mag(p5.Vector.mult(s2, 1 - deltaT));

    ball1.pos = cp1;
    ball2.pos = cp2;

    var v1n = v1.copy();
    v1n.mult(Math.cos(p5.Vector.angleBetween(v1, p5.Vector.sub(pos2, pos1))));
    v1n.rotate(p5.Vector.angleBetween(v1, p5.Vector.sub(pos2, pos1)));
    var v2n = v2.copy();
    v2n.mult(Math.cos(p5.Vector.angleBetween(v2, p5.Vector.sub(pos1, pos2))));
    v2n.rotate(p5.Vector.angleBetween(v2, p5.Vector.sub(pos1, pos2)));

    var v1p = v1.copy();
    v1p.mult(Math.sin(p5.Vector.angleBetween(v1, p5.Vector.sub(pos2, pos1))));
    v1p.rotate(-HALF_PI + p5.Vector.angleBetween(v1, p5.Vector.sub(pos2, pos1)));
    var v2p = v2.copy();
    v2p.mult(Math.sin(p5.Vector.angleBetween(v2, p5.Vector.sub(pos1, pos2))));
    v2p.rotate(-HALF_PI + p5.Vector.angleBetween(v2, p5.Vector.sub(pos1, pos2)));

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

    v1n = u1n;
    v2n = u2n;

    ball1.vel = p5.Vector.add(v1n, v1p);
    ball2.vel = p5.Vector.add(v2n, v2p);

    var v1unit = ball1.vel.copy();
    v1unit.normalize();
    v1unit.mult(remain1 * kk);
    ball1.pos.add(v1unit);
    var v2unit = ball2.vel.copy();
    v2unit.normalize();
    v2unit.mult(remain2 * kk);
    ball2.pos.add(v2unit);

    ball1.lastPos = cp1;
    ball2.lastPos = cp2;
  }
}
