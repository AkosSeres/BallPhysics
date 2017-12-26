class Physics {
  constructor() {
    this.balls = [];

    this.bounds = 0;

    this.fields = [];

    this.gravity = null;
  }

  update(t) {

    for (var i = 0; i < this.balls.length; i++) {
      //move
      this.balls[i].lastPos = this.balls[i].pos.copy();
      this.balls[i].pos.add(this.balls[i].vel.copy().mult(t));

      //angular vel
      this.balls[i].rotation += this.balls[i].ang * t;
      this.balls[i].rotation %= (Math.PI * 2);

      //apply gravity
      if (this.gravity) this.balls[i].vel.add(this.gravity.copy().mult(t));

      //bounce from the edges
      if (this.bounds) {
        if (this.balls[i].pos.x - this.balls[i].r < this.bounds[0]) {
          let ball = this.balls[i];
          ball.vel.x *= -ball.k;
          ball.pos.x = this.bounds[1] + ball.r;
          let dvx = ball.vel.x * (1 + (1 / ball.k));
          let dvy = Math.abs(dvx) * ball.fc * Math.sign(ball.vel.y + ball.ang * ball.r) * -1;
          if (Math.abs(dvy) > Math.abs(ball.vel.y + ball.ang * ball.r)) {
            dvy = -ball.vel.y - ball.ang * ball.r;
          }
          ball.vel.y += dvy - dvy / (ball.am + 1);
          ball.ang += dvy / ((ball.am + 1) * ball.r);

        } else if (this.balls[i].pos.x + this.balls[i].r > (this.bounds[0] + this.bounds[2])) {
          let ball = this.balls[i];
          ball.vel.x *= -ball.k;
          ball.pos.x = (this.bounds[0] + this.bounds[2]) - ball.r;
          let dvx = ball.vel.x * (1 + (1 / ball.k));
          let dvy = Math.abs(dvx) * ball.fc * Math.sign(ball.vel.y - ball.ang * ball.r) * -1;
          if (Math.abs(dvy) > Math.abs(ball.vel.y - ball.ang * ball.r)) {
            dvy = -ball.vel.y + ball.ang * ball.r;
          }
          ball.vel.y += dvy + dvy / (ball.am + 1);
          ball.ang -= dvy / ((ball.am + 1) * ball.r);
        }
        if (this.balls[i].pos.y + this.balls[i].r > (this.bounds[1] + this.bounds[3])) {
          let ball = this.balls[i];
          ball.vel.y *= -ball.k;
          ball.pos.y = (this.bounds[1] + this.bounds[3]) - ball.r;
          let dvy = ball.vel.y * (1 + (1 / ball.k));
          let dvx = Math.abs(dvy) * ball.fc * Math.sign(ball.vel.x + ball.ang * ball.r) * -1;
          if (Math.abs(dvx) > Math.abs(ball.vel.x + ball.ang * ball.r)) {
            dvx = -ball.vel.x - ball.ang * ball.r;
          }
          ball.vel.x += dvx - dvx / (ball.am + 1);
          ball.ang += dvx / ((ball.am + 1) * ball.r);
        } else if (this.balls[i].pos.y - this.balls[i].r < this.bounds[1]) {
          let ball = this.balls[i];
          ball.vel.y *= -ball.k;
          ball.pos.y = this.bounds[1] + ball.r;
          let dvy = ball.vel.y * (1 + (1 / ball.k));
          let dvx = Math.abs(dvy) * ball.fc * Math.sign(ball.vel.x - ball.ang * ball.r) * -1;
          if (Math.abs(dvx) > Math.abs(ball.vel.x - ball.ang * ball.r)) {
            dvx = -ball.vel.x + ball.ang * ball.r;
          }
          ball.vel.x += dvx + dvx / (ball.am + 1);
          ball.ang -= dvx / ((ball.am + 1) * ball.r);
        }
      }

      //collision
      for (var j = i + 1; j < this.balls.length; j++) {
        Ball.collide(this.balls[i], this.balls[j]);
      }
    }
  }

  setGravity(dir) {
    this.gravity = dir.copy();
  }

  addBall(ball) {
    this.balls.push(ball);
  }

  setBounds(x, y, w, h) {
    this.bounds = [x, y, w, h];
  }

  addField(field) {
    this.fields.push(field);
  }
}
