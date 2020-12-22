/**
 * Class representing a mode for the editor
 */
class Mode {
  /**
   * Creats a new mode
   * @param {string} name The name of the mode
   * @param {string} description The description of the mode
   * @param {function} drawFunc The drawing function of the mode
   * @param {function} startInteractionFunc The function that gets
   * called at the start of an interaction
   * @param {function} endInteractionFunc The function that gets
   * called at the end of an interaction
   * @param {function} keyGotUpFunc The function that gets
   * called at releasing a key
   * @param {function} keyGotDownFunc The function that gets
   * called at pressing down a key
   */
  constructor(
      name,
      description,
      drawFunc,
      startInteractionFunc,
      endInteractionFunc,
      keyGotUpFunc,
      keyGotDownFunc
  ) {
    this.name = name;
    this.description = description;
    this.drawFunc = drawFunc;
    this.startInteractionFunc = startInteractionFunc;
    this.endInteractionFunc = endInteractionFunc;
    this.keyGotUpFunc = keyGotUpFunc;
    this.keyGotDownFunc = keyGotDownFunc;
  }
}

module.exports = Mode;
