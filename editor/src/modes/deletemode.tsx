/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body } from '../../../src/physics';
import Mode from '../modeInterface';

const element = document.createElement('div');

const DeleteMode: Mode = {
  name: 'Delete',
  description: '',
  element,
  drawFunc(editorApp, dt) { },
  startInteractionFunc(editorApp) {
    if (editorApp.choosed && typeof editorApp.choosed !== 'boolean') {
      if (editorApp.choosed instanceof Body) {
        editorApp.physics.removeObjFromSystem(editorApp.choosed);
      }
    }
  },
};

export default DeleteMode;
