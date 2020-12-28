import Mode from '../modeInterface';

/**
 * @type {Mode}
 */
export const DeleteMode: Mode = {
  name: 'Delete',
  description: '',
  drawFunc: function(editorApp, dt) { },
  startInteractionFunc: function(editorApp) {
    if (editorApp.choosed) {
      editorApp.physics.removeObjFromSystem(editorApp.choosed);
    }
  },
  endInteractionFunc: function(editorApp) { },
  keyGotUpFunc: function(editorApp) { },
  keyGotDownFunc: function(editorApp) { },
};
