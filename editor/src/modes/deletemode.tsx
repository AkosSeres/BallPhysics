/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';

const element = document.createElement('div');

const DeleteMode: Mode = {
  name: 'Delete',
  description: '',
  element,
  drawFunc(editorApp, dt) { },
  startInteractionFunc(editorApp) {
    if (editorApp.choosed && typeof editorApp.choosed !== 'boolean') {
      editorApp.physics.removeObjFromSystem(editorApp.choosed);
    }
  },
};

export default DeleteMode;
