const frictionCoefficient = 0.2;

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

      //apply gravity
      this.balls[i].vel.add(this.gravity.copy().mult(t));

      //bounce from the edges
      if (this.bounds != 0) {
        if (this.balls[i].pos.x - this.balls[i].r < this.bounds[0]) {
          this.balls[i].vel.x *= -this.balls[i].k;
          var xS = this.balls[i].pos.x - this.balls[i].lastPos.x;
          this.balls[i].pos.x = 2 * this.bounds[0] - this.balls[i].pos.x + 2 * this.balls[i].r;
          this.balls[i].lastPos.x = this.balls[i].pos.x + xS;
        } else if (this.balls[i].pos.x + this.balls[i].r > (this.bounds[0] + this.bounds[2])) {
          this.balls[i].vel.x *= -this.balls[i].k;
          var xS = this.balls[i].pos.x - this.balls[i].lastPos.x;
          this.balls[i].pos.x = 2 * (this.bounds[0] + this.bounds[2]) - this.balls[i].pos.x - 2 * this.balls[i].r;
          this.balls[i].lastPos.x = this.balls[i].pos.x + xS;
        }
        if (this.balls[i].pos.y + this.balls[i].r > (this.bounds[1] + this.bounds[3])) {
          this.balls[i].vel.y *= -this.balls[i].k;
          var yS = this.balls[i].pos.y - this.balls[i].lastPos.y;
          this.balls[i].pos.y = 2 * (this.bounds[1] + this.bounds[3]) - this.balls[i].pos.y - 2 * this.balls[i].r;
          this.balls[i].lastPos.y = this.balls[i].pos.y + yS;
        } else if (this.balls[i].pos.y - this.balls[i].r < this.bounds[1]) {
          this.balls[i].vel.y *= -this.balls[i].k;
          var yS = this.balls[i].pos.y - this.balls[i].lastPos.y;
          this.balls[i].pos.y = 2 * this.bounds[1] - this.balls[i].pos.y + 2 * this.balls[i].r;
          this.balls[i].lastPos.y = this.balls[i].pos.y + yS;
        }
      }

      //collision
      for (var j = i + 1; j < this.balls.length; j++) {
        Ball.collide(this.balls[i], this.balls[j]);
      }
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
