/* eslint-disable class-methods-use-this */
import { Spring, Stick, Vec2 } from '../../src/physics';

class Renderer {
  textures: string[];

  constructor() {
    this.textures = [];
  }

  renderSpring(spring: Spring, ctx: CanvasRenderingContext2D) {
    let x1;
    let y1;
    let x2;
    let y2;
    if (spring.pinned && typeof spring.pinned === 'object') {
      x1 = spring.pinned.x;
      y1 = spring.pinned.y;
      x2 = spring.objects[0].pos.x;
      y2 = spring.objects[0].pos.y;
    } else {
      x1 = spring.objects[0].pos.x;
      y1 = spring.objects[0].pos.y;
      x2 = spring.objects[1].pos.x;
      y2 = spring.objects[1].pos.y;
    }
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
    spring.objects.forEach((o) => {
      ctx.beginPath();
      ctx.arc(o.pos.x, o.pos.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    if (typeof spring.pinned === 'object') {
      ctx.beginPath();
      ctx.arc(spring.pinned.x, spring.pinned.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  renderStick(stick: Stick, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(stick.objects[0].pos.x, stick.objects[0].pos.y);
    ctx.lineTo(
      (typeof stick.pinned === 'object') ? stick.pinned.x : stick.objects[1].pos.x,
      (typeof stick.pinned === 'object') ? stick.pinned.y : stick.objects[1].pos.y,
    );
    ctx.stroke();
    ctx.strokeStyle = 'black';
    stick.objects.forEach((o) => {
      ctx.beginPath();
      ctx.arc(o.pos.x, o.pos.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    if (typeof stick.pinned === 'object') {
      ctx.beginPath();
      ctx.arc(stick.pinned.x, stick.pinned.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
}

export default Renderer;
