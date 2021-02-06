import {
  Spring, Vec2, Body, Stick,
} from '../../../src/physics';
import palette from '../../../src/util/colorpalette';
import Renderer from '../renderer';
import Group from './group';

const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 300;
const THUMBNAIL_BORDER_RATIO = 1.2;

class Creation {
  name: string;

  description: string;

  content: Group;

  thumbnail: string;

  /**
   * Creates a Creation from a Group and a given name.
   * Centers the content, and generates a thumbnail for it.
   *
   * @param {string} name The name of the creation
   * @param {string} description A description for the creation.
   * @param {Group} content The contents (bodies, springs) of the creation inside a Group
   */
  constructor(name: string, description: string, content: Group) {
    this.name = name;
    this.description = description;
    this.content = content.copy;

    const bb = this.content.boundingBox;
    this.content.move(new Vec2(
      -bb.x.min - (bb.x.size() / 2),
      -bb.y.min - (bb.y.size() / 2),
    ));

    // Placeholder if something goes wrong
    this.thumbnail = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
    this.generateThumbnail();
  }

  /**
   * Generates a thumbnail of the creation and stores it.
   */
  generateThumbnail() {
    const cnv = document.createElement('canvas') as HTMLCanvasElement;
    cnv.width = THUMBNAIL_WIDTH;
    cnv.height = THUMBNAIL_HEIGHT;

    const bb = this.content.boundingBox;
    const aspectRatio = THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT;
    let unit;
    if (aspectRatio > (bb.x.size() / bb.y.size())) {
      unit = bb.y.size() / THUMBNAIL_HEIGHT;
    } else unit = bb.x.size() / THUMBNAIL_WIDTH;
    unit = (1 / unit) / THUMBNAIL_BORDER_RATIO;

    // Create renderer and retrieve context
    const renderer = new Renderer();
    const ctx = cnv.getContext('2d') as CanvasRenderingContext2D;

    // Draw background
    ctx.fillStyle = palette.Independence;
    ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

    // Center the tansform on the canvas
    ctx.translate(THUMBNAIL_WIDTH / 2, THUMBNAIL_HEIGHT / 2);
    ctx.scale(unit, unit);

    // Render bodies on the thumbnail
    const bodyDrawCallback = (element: Body) => {
      if (element.m === 0) {
        ctx.strokeStyle = '#00000000';
      }
      if (element.shape.r !== 0) {
        // Draw circle
        const ball = element;
        ctx.beginPath();
        ctx.arc(
          ball.pos.x,
          ball.pos.y,
          ball.shape.r,
          0,
          2 * Math.PI,
        );
        ctx.stroke();
        ctx.fill();

        if (element.m !== 0) {
          ctx.beginPath();
          ctx.moveTo(ball.pos.x, ball.pos.y);
          ctx.lineTo(ball.pos.x + ball.shape.r * Math.cos(ball.rotation),
            ball.pos.y + ball.shape.r * Math.sin(ball.rotation));
          ctx.stroke();
        }
      } else {
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(
          element.shape.points[element.shape.points.length - 1].x,
          element.shape.points[element.shape.points.length - 1].y,
        );
        element.shape.points.forEach((p) => {
          ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.fill();

        if (element.m !== 0) {
          ctx.beginPath();
          ctx.arc(element.pos.x, element.pos.y, 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    // Draw them with colors
    this.content.bodies.forEach((b) => {
      ctx.fillStyle = b.style;
      ctx.strokeStyle = 'black';
      bodyDrawCallback(b);
    });

    // Draw with textures
    this.content.bodies.forEach((b) => {
      if (b.texture === 'none') return;
      const trData = b.textureTransform;
      const offset = trData.offset.copy;
      offset.rotate(b.rotation);
      offset.add(b.pos);
      const matrix = new DOMMatrix([
        trData.scale,
        0,
        0,
        trData.scale,
        offset.x,
        offset.y,
      ]);
      matrix.rotateSelf(0, 0, ((trData.rotation + b.rotation) * 180) / Math.PI);
      const texturedPattern = ctx.createPattern(b.texture, b.textureRepeat) as CanvasPattern;
      texturedPattern.setTransform(matrix);
      ctx.fillStyle = texturedPattern;
      ctx.strokeStyle = '#00000000';
      bodyDrawCallback(b);
    });

    // Render springs on the thumbnail
    ctx.lineWidth = 2;
    this.content.springs.forEach((element) => {
      if (element instanceof Spring && !(element instanceof Stick)) {
        ctx.strokeStyle = palette.blue;
        ctx.fillStyle = palette.blue;
        renderer.renderSpring(element, ctx);
      } else {
        ctx.strokeStyle = palette.blue;
        ctx.fillStyle = palette.blue;
        renderer.renderStick(element, ctx);
      }
    });

    // Then convert the rendered image to a png data url
    this.thumbnail = cnv.toDataURL();
  }
}

export default Creation;
