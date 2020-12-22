const Physics = require('../../src/physics');

module.exports = function(translator) {
  this.startingState = translator.getPhysics().toJSObject();
  this.inStartingState = true;

  document.getElementById('pause').onclick = () => {
    if (translator.getTimeMultiplier() !== 0) translator.setTimeMultiplier(0);
    else {
      translator.setTimeMultiplier(1);
      if (this.inStartingState == true) {
        this.startingState = translator.getPhysics().toJSObject();
      }
      this.inStartingState = false;
    }
  };

  document.getElementById('revert').onclick = () => {
    translator.setTimeMultiplier(0);
    translator.setPhysics(Physics.fromObject(this.startingState));
    this.inStartingState = true;
  };

  document.getElementById('clear all').onclick = () => {
    this.inStartingState = true;

    const physics = translator.getPhysics();
    physics.balls = [];
    physics.walls = [];
    physics.softBalls = [];
    physics.springs = [];
    physics.bodies = [];
  };

  document.getElementById('set start').onclick = () => {
    this.startingState = translator.getPhysics().toJSObject();
    this.inStartingState = true;
    translator.setTimeMultiplier(0);
  };
};
