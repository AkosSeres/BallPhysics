const frictionCoefficient = 0.2;

function Physics() {
  this.balls = [];

  this.bounds = 0;

  this.fields = [];

  this.update = function (t) {

    for (var i = 0; i < this.balls.length; i++) {
      //move
      this.balls[i].lastPos = this.balls[i].pos.copy();
      this.balls[i].pos.add(this.balls[i].vel.copy().mult(t));

      //apply fields's forces
      for (var j = 0; j < this.fields.length; j++) {
        if (this.fields[j].type == "conservative") {
          this.balls[i].vel.add(this.fields[j].dir.copy().mult(t));
        } else if (this.fields[j].type == "point") {
          noStroke();
          fill("blue");
          ellipse(this.fields[j].pos.x, this.fields[j].pos.y, 10, 10);
          var distVec = this.balls[i].pos.copy();
          distVec.sub(this.fields[j].pos);
          var dist = this.balls[i].pos.dist(this.fields[j].pos);
          distVec.div(dist);
          distVec.mult(this.fields[j].dir);
          distVec.mult(t);
          this.balls[i].vel.add(distVec);
        }
      }

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
        collide(this.balls[i], this.balls[j]);
      }
      for (var j = i + 1; j < this.balls.length; j++) {
        collide(this.balls[i], this.balls[j]);
      }
    }


  }

  this.addBall = function (ball) {
    this.balls.push(ball);
  }

  this.setBounds = function (x, y, w, h) {
    this.bounds = [x, y, w, h];
  }

  this.addField = function (field) {
    this.fields.push(field);
  }
}
