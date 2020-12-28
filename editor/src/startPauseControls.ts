import Physics from '../../src/physics';
import Editor from './editor';

export default function (editorApp: Editor):void {
  this.startingState = editorApp.getPhysics().toJSObject();
  this.inStartingState = true;

  document.getElementById('pause').onclick = () => {
    if (editorApp.getTimeMultiplier() !== 0) editorApp.setTimeMultiplier(0);
    else {
      editorApp.setTimeMultiplier(1);
      if (this.inStartingState == true) {
        this.startingState = editorApp.getPhysics().toJSObject();
      }
      this.inStartingState = false;
    }
  };

  document.getElementById('revert').onclick = () => {
    editorApp.setTimeMultiplier(0);
    editorApp.setPhysics(Physics.fromObject(this.startingState));
    this.inStartingState = true;
  };

  document.getElementById('clear all').onclick = () => {
    this.inStartingState = true;

    const physics = editorApp.getPhysics();
    physics.balls = [];
    physics.walls = [];
    physics.softBalls = [];
    physics.springs = [];
    physics.bodies = [];
  };

  document.getElementById('set start').onclick = () => {
    this.startingState = editorApp.getPhysics().toJSObject();
    this.inStartingState = true;
    editorApp.setTimeMultiplier(0);
  };
}
