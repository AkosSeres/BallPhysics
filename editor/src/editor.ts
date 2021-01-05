import Physics, {
  Ball, Vec2, Spring, Stick, Wall, AnyPhysicsObject,
} from '../../src/physics';
import EditorInterface from './editorInterface';

import startPauseControlsFunction from './startPauseControls';
import Modes from './modes/index';

// Import css
import '../css/style.css';

const modes = Modes;
const modeNames = modes.map((mode) => mode.name);

const palette = {
  white: '#faf3dd',
  green: '#02c39a',
  pink: '#e58c8a',
  blue: '#77b6ea',
  black: '#363732',
};

/**
 * The main Object handling the whole app
 */
class Editor implements EditorInterface {
  physics: Physics;

  mouseX: number;

  mouseY: number;

  mouseDown: boolean;

  defaultSize: number;

  k: number;

  fc: number;

  springConstant: number;

  scaling: number;

  viewOffsetX: number;

  viewOffsetY: number;

  mode: number;

  lastX: number;

  lastY: number;

  timeMultiplier: number;

  lastFrameTime: number;

  choosed: (AnyPhysicsObject | boolean);

  left: boolean;

  right: boolean;

  cnv: HTMLCanvasElement;

  canvasHolder: HTMLElement;

  sidebar: HTMLElement;

  modeTitleHolder: HTMLElement;

  drawCollisions: boolean;

  showAxes: boolean;

  constructor() {
    this.physics = new Physics();
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.defaultSize = 30;
    this.k = 0.5;
    this.fc = 2;
    this.springConstant = 2000;
    this.scaling = 1;
    this.viewOffsetX = 0;
    this.viewOffsetY = 0;
    this.mode = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.timeMultiplier = 1;
    this.lastFrameTime = performance.now();
    this.choosed = false;
    this.drawCollisions = false;
    this.showAxes = false;

    this.left = false;
    this.right = false;

    // A fully loaded window is provided
    this.cnv = <HTMLCanvasElement>document.getElementById('defaulCanvas0');
    this.canvasHolder = <HTMLElement>document.getElementById('canvas-holder');
    this.sidebar = <HTMLElement>document.getElementById('sidebar');
    this.modeTitleHolder = <HTMLElement>document.getElementById('mode-title-text');

    this.physics.setBounds(0, 0, this.cnv.width, this.cnv.height);
    this.physics.setGravity(new Vec2(0, 1000));
    this.physics.setAirFriction(0.9);

    this.cnv.addEventListener('touchstart', this.startTouch, false);
    this.cnv.addEventListener('touchend', this.endTouch, false);
    this.cnv.addEventListener('touchmove', this.moveTouch, false);
    this.cnv.addEventListener('mousedown', this.startMouse, false);
    this.cnv.addEventListener('mouseup', this.endMouse, false);
    this.cnv.addEventListener('mousemove', this.handleMouseMovement, false);
    document.addEventListener('keydown', this.keyGotDown, false);
    document.addEventListener('keyup', this.keyGotUp, false);
    window.addEventListener('resize', this.resizeCanvas, false);

    this.resizeCanvas();

    // Set up modes and link them to the buttons
    this.setupModes();

    startPauseControlsFunction(this);

    requestAnimationFrame(this.drawFunction);
  }

  /**
   * Function that is called when the window gest resized
   */
  resizeCanvas = (): void => {
    // Fit canvas inside the holder
    const canvasRect = this.canvasHolder.getBoundingClientRect();
    this.cnv.width = canvasRect.width;
    this.cnv.height = window.innerHeight - canvasRect.top;

    // Code for making the image sharp on high DPI displays
    // Scale according to the pixel ratio of the display
    const dpr = window.devicePixelRatio || 1;
    const rect = canvasRect;
    this.cnv.width = rect.width * dpr;
    this.cnv.height = rect.height * dpr;
    this.cnv.style.width = `${rect.width}px`;
    this.cnv.style.height = `${rect.height}px`;
    this.scaling = 1 / dpr;
    this.physics.setBounds(0, 0, this.cnv.width, this.cnv.height);
    const ctx = this.cnv.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = dpr;
    }

    // Set the size of the balls
    this.defaultSize = (this.cnv.width + this.cnv.height) / 80;
  };

  /**
   * My draw function
   */
  drawFunction = (): void => {
    if (!Number.isFinite(this.lastFrameTime)) this.lastFrameTime = performance.now();
    let elapsedTime = performance.now() - this.lastFrameTime;
    if (!Number.isFinite(elapsedTime)) {
      elapsedTime = 0;
    }
    elapsedTime /= 1000;

    const ctx = <CanvasRenderingContext2D> this.cnv.getContext('2d');

    // paint the background
    ctx.fillStyle = palette.black;
    ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

    ctx.save();
    ctx.translate(this.viewOffsetX, this.viewOffsetY);
    ctx.scale(this.scaling, this.scaling);

    modes[this.mode].drawFunc?.(this, elapsedTime * this.timeMultiplier);
    this.physicsDraw();

    ctx.restore();

    if (this.physics.balls[0]) {
      if (this.left) this.physics.balls[0].ang -= Math.PI * 100 * elapsedTime;
      if (this.right) this.physics.balls[0].ang += Math.PI * 100 * elapsedTime;
    }

    elapsedTime *= this.timeMultiplier;
    this.physics.update(elapsedTime / 5, false);
    this.physics.update(elapsedTime / 5, false);
    this.physics.update(elapsedTime / 5, false);
    this.physics.update(elapsedTime / 5, false);
    this.physics.update(elapsedTime / 5, false);

    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.drawFunction);
  };

  /**
   * Gets called on the start of an interaction with the canvas
   *
   * @param {number} x The x position of the mouse or the finger on the canvas
   * @param {number} y The y position of the mouse or the finger on the canvas
   */
  startInteraction = (x: number, y: number): void => {
    this.mouseX = x / this.scaling - this.viewOffsetX / this.scaling;
    this.mouseY = y / this.scaling - this.viewOffsetY / this.scaling;
    this.choosed = this.physics.getObjectAtCoordinates(this.mouseX, this.mouseY);
    if (!this.choosed) {
      this.choosed = {
        x: this.mouseX,
        y: this.mouseY,
        pinPoint: true,
      };
    }
    this.lastX = this.mouseX;
    this.lastY = this.mouseY;
    this.mouseDown = true;

    modes[this.mode].startInteractionFunc?.(this);
  };

  /**
   * Gets called on the end of an interaction with the canvas
   *
   * @param {number} x The x position of the mouse of the finger on the canvas
   * @param {number} y The y position of the mouse of the finger on the canvas
   */
  endInteraction = (x: number, y: number): void => {
    this.mouseX = x / this.scaling - this.viewOffsetX / this.scaling;
    this.mouseY = y / this.scaling - this.viewOffsetY / this.scaling;

    modes[this.mode].endInteractionFunc?.(this);

    if (this.lastX === 0 && this.lastY === 0) return;

    this.lastX = 0;
    this.lastY = 0;
    this.mouseDown = false;
    this.choosed = false;
  };

  /**
   * My keyboard event function for pressing down a key
   *
   * @param {KeyboardEvent} event The event containing data
   */
  keyGotDown = (event: KeyboardEvent): void => {
    const keyCode = event.key;
    if (keyCode === 's') {
      this.spawnNewtonsCradle(this.cnv.width / 2, this.cnv.height / 2, 0.5, this.physics);
    }
    if (keyCode === 'a') {
      this.scaling += 0.01;
    }
    if (keyCode === 'd') {
      this.scaling -= 0.01;
    }
    if (keyCode === 'j') {
      this.viewOffsetX -= 10;
    }
    if (keyCode === 'l') {
      this.viewOffsetX += 10;
    }
    if (keyCode === 'k') {
      this.viewOffsetY -= 10;
    }
    if (keyCode === 'i') {
      this.viewOffsetY += 10;
    }
    if (keyCode === 'ArrowRight') {
      this.right = true;
    }
    if (keyCode === 'ArrowLeft') {
      this.left = true;
    }
  };

  /**
   * My keyboard event function for releasing a key
   *
   * @param {KeyboardEvent} event The event containing data
   */
  keyGotUp = (event: KeyboardEvent): void => {
    const keyCode = event.key;
    // Right arrow
    if (keyCode === 'ArrowRight') {
      this.right = false;
    }
    // Left arrow
    if (keyCode === 'ArrowLeft') {
      this.left = false;
    }
  };

  /**
   * My touch event function
   *
   * @param {TouchEvent} event The event containing data
   * @returns {boolean} Returns false for preventing default browser behavior
   */
  startTouch = (event: TouchEvent): boolean => {
    event.preventDefault();
    const cnvBounds = this.canvasHolder.getBoundingClientRect();
    this.startInteraction(
      event.changedTouches[0].clientX - cnvBounds.left,
      event.changedTouches[0].clientY - cnvBounds.top,
    );
    return false;
  };

  /**
   * My touch event function
   *
   * @param {TouchEvent} event The event containing data
   * @returns {boolean} Returns false for preventing default browser behavior
   */
  endTouch = (event: TouchEvent): boolean => {
    event.preventDefault();
    const cnvBounds = this.canvasHolder.getBoundingClientRect();
    this.endInteraction(
      event.changedTouches[0].clientX - cnvBounds.left,
      event.changedTouches[0].clientY - cnvBounds.top,
    );
    return false;
  };

  /**
   * My touch event function
   *
   * @param {TouchEvent} event The event containing data
   * @returns {boolean} Returns false for preventing default browser behavior
   */
  moveTouch = (event: TouchEvent): boolean => {
    event.preventDefault();
    const cnvBounds = this.canvasHolder.getBoundingClientRect();
    this.mouseX = event.changedTouches[0].clientX - cnvBounds.left;
    this.mouseY = event.changedTouches[0].clientY - cnvBounds.top;
    this.mouseX = this.mouseX / this.scaling - this.viewOffsetX / this.scaling;
    this.mouseY = this.mouseY / this.scaling - this.viewOffsetY / this.scaling;
    return false;
  };

  /**
   * My mouse event function that handles pressing down a mouse key
   *
   * @param {TouchEvent} event The event containing data
   * @returns {boolean} Returns false for preventing default browser behavior
   */
  startMouse = (event: MouseEvent): boolean => {
    this.startInteraction(event.offsetX, event.offsetY);
    return false;
  };

  /**
   * My mouse event function that handles releasing a mouse key
   *
   * @param {TouchEvent} event The event containing data
   * @returns {boolean} Returns false for preventing default browser behavior
   */
  endMouse = (event: MouseEvent): boolean => {
    this.endInteraction(event.offsetX, event.offsetY);
    return false;
  };

  /**
   * My mouse event function that handles mouse movement
   *
   * @param {TouchEvent} event The event containing data
   */
  handleMouseMovement = (event: MouseEvent): void => {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
    this.mouseX = this.mouseX / this.scaling - this.viewOffsetX / this.scaling;
    this.mouseY = this.mouseY / this.scaling - this.viewOffsetY / this.scaling;
  };

  physicsDraw = (): void => {
    const ctx = this.cnv.getContext('2d');

    if (ctx) {
      ctx.fillStyle = palette.green;
      ctx.strokeStyle = 'black';
      for (let i = 0; i < this.physics.balls.length; i += 1) {
        const ball = this.physics.balls[i];
        ctx.beginPath();
        ctx.arc(
          ball.pos.x,
          ball.pos.y,
          ball.r,
          0,
          2 * Math.PI,
        );
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ball.pos.x, ball.pos.y);
        ctx.lineTo(ball.pos.x + ball.r * Math.cos(ball.rotation),
          ball.pos.y + ball.r * Math.sin(ball.rotation));
        ctx.stroke();
      }

      this.physics.bodies.forEach((element) => {
        ctx.beginPath();
        ctx.moveTo(
          element.points[element.points.length - 1].x,
          element.points[element.points.length - 1].y,
        );
        element.points.forEach((p) => {
          ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.fill();

        if (this.showAxes) {
          element.axes.forEach((axe) => {
            ctx.beginPath();
            ctx.moveTo(element.pos.x, element.pos.y);
            ctx.lineTo(element.pos.x + axe.x * 30, element.pos.y + axe.y * 30);
            ctx.stroke();
          });
        }

        ctx.beginPath();
        ctx.arc(element.pos.x, element.pos.y, 1.5, 0, Math.PI * 2);
        ctx.stroke();
      });

      const drawWall = (element: Wall) => {
        ctx.beginPath();
        ctx.moveTo(
          element.points[element.points.length - 1].x,
          element.points[element.points.length - 1].y,
        );
        element.points.forEach((p) => {
          ctx.lineTo(p.x, p.y);
        });
        ctx.fill();
      };
      ctx.fillStyle = 'white';
      this.physics.walls.forEach(drawWall);
      this.physics.bounds.forEach(drawWall);

      this.physics.fixedBalls.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.save();
      ctx.lineWidth = 2;
      this.physics.springs.forEach((element) => {
        if (element instanceof Spring && !(element instanceof Stick)) {
          let x1;
          let y1;
          let x2;
          let y2;
          if (element.pinned && typeof element.pinned === 'object') {
            x1 = element.pinned.x;
            y1 = element.pinned.y;
            x2 = element.objects[0].pos.x;
            y2 = element.objects[0].pos.y;
          } else {
            x1 = element.objects[0].pos.x;
            y1 = element.objects[0].pos.y;
            x2 = element.objects[1].pos.x;
            y2 = element.objects[1].pos.y;
          }
          let v = new Vec2(x2 - x1, y2 - y1);
          const c = v.copy;
          v.rotate(Math.PI / 2);
          v.setMag(5);
          let last = new Vec2(x1, y1);
          const num = Math.floor(element.length / 10);
          for (let i = 1; i <= num; i += 1) {
            ctx.strokeStyle = palette.blue;
            ctx.fillStyle = palette.blue;
            if (i === num) v = new Vec2(0, 0);
            ctx.beginPath();
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(x1 + (i / num) * c.x + v.x, y1 + (i / num) * c.y + v.y);
            ctx.stroke();
            last = new Vec2(x1 + (i / num) * c.x + v.x, y1 + (i / num) * c.y + v.y);
            v.mult(-1);
          }
        } else {
          ctx.strokeStyle = palette.blue;
          ctx.fillStyle = palette.blue;
          ctx.beginPath();
          ctx.moveTo(element.objects[0].pos.x, element.objects[0].pos.y);
          ctx.lineTo(
            (typeof element.pinned === 'object') ? element.pinned.x : element.objects[1].pos.x,
            (typeof element.pinned === 'object') ? element.pinned.y : element.objects[1].pos.y,
          );
          ctx.stroke();
        }
        element.objects.forEach((o) => {
          ctx.strokeStyle = 'black';
          ctx.fillStyle = palette.blue;
          ctx.beginPath();
          ctx.arc(o.pos.x, o.pos.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
        if (typeof element.pinned === 'object') {
          ctx.strokeStyle = 'black';
          ctx.fillStyle = palette.blue;
          ctx.beginPath();
          ctx.arc(element.pinned.x, element.pinned.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
      ctx.restore();

      ctx.fillStyle = palette.pink;
      ctx.strokeStyle = palette.pink;
      ctx.lineWidth = 4;
      if (this.drawCollisions) {
        this.physics.collisionData.forEach((cd) => {
          ctx.beginPath();
          ctx.moveTo(cd.cp.x, cd.cp.y);
          ctx.lineTo(cd.cp.x + cd.n.x * 30, cd.cp.y + cd.n.y * 30);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cd.cp.x, cd.cp.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }
  };

  /**
   * Spawns a Newton cradle inside the given world at given size and
   * coordinates
   *
   * @param {number} x The x coordinate of it
   * @param {number} y The y coordinate of it
   * @param {number} scale The size of it
   * @param {Physics} phy The world to put it in
   */
  spawnNewtonsCradle = (x: number, y: number, scale: number, phy: Physics): void => {
    const balls = [];
    const defaultR = 25;
    const defaultStick = 250;
    const ballNumber = 8;
    balls.push(
      new Ball(new Vec2(x, y), new Vec2(0, 0), scale * defaultR, 1, 0, 0),
    );
    let count = 1;
    for (let i = 0; i < ballNumber - 1; i += 1) {
      balls.push(
        new Ball(
          new Vec2(x + count * scale * defaultR * 1.01 * 2, y),
          new Vec2(0, 0),
          scale * 25,
          1,
          0,
          0,
        ),
      );
      count *= -1;
      if (count > 0) count += 1;
      if (i === ballNumber - 2) {
        balls[balls.length - 1].vel.x = -Math.sign(count) * scale * defaultR * 8;
      }
    }
    balls.forEach((ball) => {
      phy.addBall(ball);
      const stick = new Stick(defaultStick);
      stick.attachObject(ball);
      stick.pinHere(ball.pos.x, ball.pos.y - defaultStick);
      phy.addSpring(stick);
      stick.lockRotation();
    });
  };

  /**
   * Gets called when one of the mode buttons get clicked
   * Swithces to the mode corresponding to the button
   *
   * @param {MouseEvent} e The click event
   */
  modeButtonClicked = (e: MouseEvent): void => {
    const modeName = (<HTMLElement>e.target).id.replace('-btn', '');
    const modeNum = modeNames.indexOf(modeName);
    this.switchToMode(modeNum);
  };

  /**
   * Switches the editor to the given mode
   * It also puts the corresponding HTML elements on the sidebar
   *
   * @param {number} modeNum The mode number to switch to
   */
  switchToMode = (modeNum: number): void => {
    const prevoiusBtn = document.getElementById(`${modeNames[this.mode]}-btn`);
    if (prevoiusBtn) prevoiusBtn.classList.remove('bg-pink-darker');
    this.sidebar.innerHTML = '';

    const newBtn = document.getElementById(`${modeNames[modeNum]}-btn`);
    if (newBtn) newBtn.classList.add('bg-pink-darker');
    // And set new title
    this.modeTitleHolder.innerText = modes[modeNum].name;
    this.mode = modeNum;
    this.sidebar.appendChild(modes[this.mode].element);
  };

  /**
   * It initially creates the buttons for each mode and switches to the first one
   */
  setupModes = (): void => {
    const buttonHolder = document.getElementById('button-holder');

    modeNames.forEach((modeName, i) => {
      const button = document.createElement('div');
      button.classList.add('big-button');
      button.classList.add('fix-width');
      button.id = `${modeName}-btn`;
      button.textContent = modes[i].name;
      modes[i].init?.(this);
      button.onclick = this.modeButtonClicked;
      if (buttonHolder) buttonHolder.appendChild(button);
    });

    this.switchToMode(this.mode);
  };

  /**
   * Setter for the variable timeMultipler for passing it to other scopes
   *
   * @param {number} x The new value of timeMultiplier
   */
  setTimeMultiplier = (x: number): void => {
    if (Number.isFinite(x)) this.timeMultiplier = x;
  };

  /**
   * Getter for the variable timeMultiplier for passing it to other scopes
   *
   * @returns {number} The value of timeMultiplier
   */
  getTimeMultiplier = (): number => this.timeMultiplier;

  /**
   * Setter for the object physics for passing it to other scopes
   *
   * @param {Physics} phy The new physics object
   */
  setPhysics = (phy: Physics): void => {
    if (phy instanceof Physics) this.physics = phy;
  };

  /**
   * Getter for the physics object for passing it to other scopes
   *
   * @returns {Physics} The physics object
   */
  getPhysics = (): Physics => this.physics;
}

export default Editor;
