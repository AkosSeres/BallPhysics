import Physics, { PhysicsAsObject } from '../../../src/physics';

let startingState: PhysicsAsObject;
let inStartingState: boolean;
let startBtn: HTMLElement;

interface HasPhysicsAndTime {
  getPhysics(): Physics,
  setPhysics(physics: Physics): void,
  getTimeMultiplier(): number,
  setTimeMultiplier(m: number): void
}

/**
 * Sets the starting state boolean indicator and the color of the button.
 *
 * @param {boolean} st The new starting state indicator.
 */
function setStartingStateBool(st: boolean) {
  inStartingState = st;
  if (st) {
    startBtn.classList.add('bg-pink-darker');
  } else {
    startBtn.classList.remove('bg-pink-darker');
  }
}

/**
 * Sets event listeners for controlling the time in the Physics object of the editor
 *
 * @see Physics
 *
 * @param {HasPhysicsAndTime} editorApp The editor app to control
 */
export default function timeController(editorApp: HasPhysicsAndTime): void {
  startingState = editorApp.getPhysics().toJSON();
  startBtn = <HTMLElement>document.getElementById('set start');
  setStartingStateBool(false);

  const pauseBtn = document.getElementById('pause');
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      if (editorApp.getTimeMultiplier() !== 0) {
        editorApp.setTimeMultiplier(0);
      } else {
        editorApp.setTimeMultiplier(1);
        if (inStartingState === true) {
          startingState = editorApp.getPhysics().toJSON();
        }
        setStartingStateBool(false);
      }
    };
  }

  const revertBtn = document.getElementById('revert');
  if (revertBtn) {
    revertBtn.onclick = () => {
      editorApp.setTimeMultiplier(0);
      console.log(Physics.fromObject(startingState));
      editorApp.setPhysics(Physics.fromObject(startingState));
      setStartingStateBool(true);
    };
  }

  const clearBtn = document.getElementById('clear all');
  if (clearBtn) {
    clearBtn.onclick = () => {
      setStartingStateBool(true);

      const physics = editorApp.getPhysics();
      physics.springs = [];
      physics.bodies = [];
    };
  }

  if (startBtn) {
    startBtn.onclick = () => {
      startingState = editorApp.getPhysics().toJSON();
      console.log(startingState);
      setStartingStateBool(true);
      editorApp.setTimeMultiplier(0);
    };
  }

  let shouldResume = false;
  // Stop time on focus loss and resume on focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (editorApp.getTimeMultiplier() !== 0) {
        editorApp.setTimeMultiplier(0);
        shouldResume = true;
      } else {
        shouldResume = false;
      }
    } else if (shouldResume) {
      editorApp.setTimeMultiplier(1);
    }
  });
}
