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
  choosed: AnyPhysicsObject;
  cnv: HTMLCanvasElement;
}

export default EditorInterface;
