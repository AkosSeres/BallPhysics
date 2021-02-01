/* eslint-disable class-methods-use-this */
import {
  Body,
  StickOrSpring, Vec2,
} from '../../src/physics';

class Renderer {
  textures: string[];

  constructor() {
    this.textures = [];
  }

  renderBody(body: Body, ctx: CanvasRenderingContext2D) {
    if (body.shape.r !== 0) {
      // The chosen body is a circle
      ctx.beginPath();
      ctx.arc(body.pos.x, body.pos.y, body.shape.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    } else {
      // The body is a polygon
      ctx.beginPath();
      ctx.moveTo(body.shape.points[0].x, body.shape.points[0].y);
      for (let i = 1; i < body.shape.points.length; i += 1) {
        ctx.lineTo(body.shape.points[i].x, body.shape.points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }

  renderSpring(spring: StickOrSpring, ctx: CanvasRenderingContext2D) {
    const ps = spring.points;
    const x1 = ps[0].x;
    const y1 = ps[0].y;
    const x2 = ps[1].x;
    const y2 = ps[1].y;
    let v = new Vec2(x2 - x1, y2 - y1);
    const c = v.copy;
    v.rotate(Math.PI / 2);
    v.setMag(5);
    let last = new Vec2(x1, y1);
    const num = Math.floor(spring.length / 10);
    for (let i = 1; i <= num; i += 1) {
      if (i === num) v = new Vec2(0, 0);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x1 + (i / num) * c.x + v.x, y1 + (i / num) * c.y + v.y);
      ctx.stroke();
      last = new Vec2(x1 + (i / num) * c.x + v.x, y1 + (i / num) * c.y + v.y);
      v.mult(-1);
    }
    ctx.strokeStyle = 'black';
    spring.points.forEach((o) => {
      ctx.beginPath();
      ctx.arc(o.x, o.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  renderStick(stick: StickOrSpring, ctx: CanvasRenderingContext2D) {
    const ps = stick.points;
    ctx.beginPath();
    ctx.moveTo(ps[0].x, ps[0].y);
    ctx.lineTo(ps[1].x, ps[1].y);
    ctx.stroke();
    ctx.strokeStyle = 'black';
    stick.points.forEach((o) => {
      ctx.beginPath();
      ctx.arc(o.x, o.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }
}

export default Renderer;
