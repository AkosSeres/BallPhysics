/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Vec2 } from '../../../src/physics';
import Mode from '../interfaces/modeInterface';

const element = document.createElement('div');

const MoveMode: Mode = {
  name: 'Move',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    const { choosed } = editorApp;
    const mouse = new Vec2(editorApp.mouseX, editorApp.mouseY);

    // Highlight chosen body
    const atCoord = choosed || editorApp.physics.getObjectAtCoordinates(mouse.x, mouse.y, 4);
    if (atCoord instanceof Body) {
      const ctx = editorApp.cnv.getContext('2d') as CanvasRenderingContext2D;
      ctx.save();
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = '#FFFFFF';
      ctx.fillStyle = '#00000000';
      editorApp.renderer.renderBody(atCoord, ctx);
      ctx.restore();
    }

    if (choosed instanceof Body && choosed.m !== 0) {
      const oldMouse = new Vec2(editorApp.oldMouseX, editorApp.oldMouseY);
      const dMouse = Vec2.sub(mouse, oldMouse);

      if (dt === 0) {
        choosed.vel.x = 0;
        choosed.vel.y = 0;
        choosed.move(dMouse);
      } else {
        if (mouse.x < choosed.boundingBox.x.min) {
          choosed.move(new Vec2(mouse.x - choosed.boundingBox.x.min, 0));
        } else if (mouse.x > choosed.boundingBox.x.max) {
          choosed.move(new Vec2(mouse.x - choosed.boundingBox.x.max, 0));
        }
        if (mouse.y < choosed.boundingBox.y.min) {
          choosed.move(new Vec2(0, mouse.y - choosed.boundingBox.y.min));
        } else if (mouse.y > choosed.boundingBox.y.max) {
          choosed.move(new Vec2(0, mouse.y - choosed.boundingBox.y.max));
        }
        choosed.vel.x = (dMouse.x) / dt;
        choosed.vel.y = (dMouse.y) / dt;
      }
      choosed.ang = 0;
    }
  },
  startInteractionFunc(editorApp) {
    const { choosed } = editorApp;
    if (choosed instanceof Body && choosed.m !== 0) {
      const app = editorApp;
      app.cnv.style.cursor = 'grabbing';
    }
  },
  endInteractionFunc(editorApp) {
    const { choosed } = editorApp;
    if (choosed instanceof Body && choosed.m !== 0) {
      const app = editorApp;
      app.cnv.style.cursor = 'grab';
    }
  },
  activated(editorApp) {
    const app = editorApp;
    app.cnv.style.cursor = 'grab';
  },
  deactivated(editorApp) {
    const app = editorApp;
    app.cnv.style.cursor = 'default';
  },
};

export default MoveMode;
