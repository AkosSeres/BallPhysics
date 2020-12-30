import Physics, { PhysicsAsObject } from '../../src/physics';

let startingState: PhysicsAsObject;
let inStartingState: boolean;

interface HasPhysicsAndTime {
  getPhysics(): Physics,
  setPhysics(physics: Physics): void,
  getTimeMultiplier(): number,
  setTimeMultiplier(m: number): void
}

/**
 * Sets event listeners for controlling the time in the Physics object of the editor
 *
 * @see Physics
 *
 * @param {HasPhysicsAndTime} editorApp The editor app to control
 */
export default function timeController(editorApp: HasPhysicsAndTime): void {
  startingState = editorApp.getPhysics().toJSObject();
  inStartingState = true;

  const pauseBtn = document.getElementById('pause');
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      if (editorApp.getTimeMultiplier() !== 0) editorApp.setTimeMultiplier(0);
      else {
        editorApp.setTimeMultiplier(1);
        if (inStartingState === true) {
          startingState = editorApp.getPhysics().toJSObject();
        }
        inStartingState = false;
      }
    };
  }

  const revertBtn = document.getElementById('revert');
  if (revertBtn) {
    revertBtn.onclick = () => {
      editorApp.setTimeMultiplier(0);
      editorApp.setPhysics(Physics.fromObject(startingState));
      inStartingState = true;
    };
  }

  const clearBtn = document.getElementById('clear all');
  if (clearBtn) {
    clearBtn.onclick = () => {
      inStartingState = true;

      const physics = editorApp.getPhysics();
      physics.balls = [];
      physics.walls = [];
      physics.softBalls = [];
      physics.springs = [];
      physics.bodies = [];
    };
  }

  const startBtn = document.getElementById('set start');
  if (startBtn) {
    startBtn.onclick = () => {
      startingState = editorApp.getPhysics().toJSObject();
      inStartingState = true;
      editorApp.setTimeMultiplier(0);
    };
  }
}
