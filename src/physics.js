class Physics {
  constructor() {
    this.balls = [];
    this.fixedBalls = [];

    this.walls = [];

    this.bounds = 0;

    this.springs = [];

    this.fields = [];

    this.gravity = null;
  }

  update(t) {
    for (var i = 0; i < this.balls.length; i++) {
      //move
      this.balls[i].lastPos = this.balls[i].pos.copy;
      this.balls[i].pos.add(Vec2.mult(this.balls[i].vel, t));

      //angular vel
      this.balls[i].rotation += this.balls[i].ang * t;
      this.balls[i].rotation %= (Math.PI * 2);

      //apply gravity
      if (this.gravity) this.balls[i].vel.add(Vec2.mult(this.gravity, t));

      //update springs
      this.springs.forEach(element => {
        element.update(t);
      });

      //collision
      for (var j = i + 1; j < this.balls.length; j++) {
        Ball.collide(this.balls[i], this.balls[j]);
      }

      //collision with walls
      this.walls.forEach((item) => {item.collideWithBall(this.balls[i])});

      //collision with fixed balls
      this.fixedBalls.forEach(b => {
        let ball = this.balls[i];

        let heading, rel;
        let p = new Vec2(b.x, b.y);
        p.x -= ball.pos.x; p.y -= ball.pos.y;
        p.mult(-1);
        if (p.length <= ball.r + b.r) {
          heading = p.heading;
          rel = p.length;
        }

        if (heading === 0 || heading) {
          let pos = new Vec2(ball.pos.x, ball.pos.y);
          let vel = new Vec2(ball.vel.x, ball.vel.y);
          pos.rotate(-heading + Math.PI / 2);
          vel.rotate(-heading + Math.PI / 2);

          vel.y *= -ball.k;
          pos.y += ball.r + b.r - rel;
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
      });

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
    }
  }

  setGravity(dir) {
    this.gravity = dir.copy;
  }

  addBall(ball) {
    this.balls.push(ball);
  }

  addRectWall(x, y, w, h) {
    let points = [];
    points.push({x: x - w / 2, y: y - h / 2});
    points.push({x: x + w / 2, y: y - h / 2});
    points.push({x: x + w / 2, y: y + h / 2});
    points.push({x: x - w / 2, y: y + h / 2});
    this.walls.push(new Wall(points));
  }

  addWall(wall) {
    this.walls.push(wall);
  }

  addFixedBall(x, y, r) {
    this.fixedBalls.push({x: x, y: y, r: r});
  }

  addSpring(spring) {
    this.springs.push(spring);
  }

  setBounds(x, y, w, h) {
    this.bounds = [x, y, w, h];
  }

  addField(field) {
    this.fields.push(field);
  }

  getObjectAtCoordinates(x, y) {
    let ret = false;
    var v = new Vec2(x, y);
    this.balls.forEach(ball => {
      if (ball.pos.dist(v) < ball.r) ret = ball;
    });
    return ret;
  }
}
