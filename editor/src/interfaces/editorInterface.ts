import Physics, { AnyPhysicsObject, PinPoint, Vec2 } from '../../../src/physics';
import Renderer from '../renderer';

interface EditorInterface {
  physics: Physics;
  mouseX: number;
  mouseY: number;
  oldMouseX: number;
  oldMouseY: number;
  mouseDown: boolean;
  scaling: number;
  lastX: number;
  lastY: number;
  timeMultiplier: number;
  choosed: AnyPhysicsObject | boolean | PinPoint;
  cnv: HTMLCanvasElement;
  drawCollisions: boolean;
  showAxes: boolean;
  showBoundingBoxes: boolean;
  showVelocities: boolean;
  worldSize: {width: number, height: number};
  setWorldSize: (sizes: {width: number, height: number}) => void;
  convertToCanvasSpace: (p: {x: number, y: number}) => Vec2;
  convertToPhysicsSpace: (p: {x: number, y: number}) => Vec2;
  renderer: Renderer;
}

export default EditorInterface;
