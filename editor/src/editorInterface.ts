import Physics, { AnyPhysicsObject } from '../../src/physics';

interface EditorInterface {
  physics: Physics;
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  scaling: number;
  lastX: number;
  lastY: number;
  timeMultiplier: number;
  choosed: AnyPhysicsObject|boolean;
  cnv: HTMLCanvasElement;
  drawCollisions: boolean;
  showAxes: boolean;
}

export default EditorInterface;
