/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

const element = document.createElement('div');

const DeleteMode: Mode = {
  name: 'Delete',
  description: '',
  element,
  drawFunc(editorApp, dt) { },
  startInteractionFunc(editorApp) {
    if (editorApp.choosed) {
      editorApp.physics.removeObjFromSystem(editorApp.choosed);
    }
  },
  endInteractionFunc(editorApp) { },
  keyGotUpFunc(editorApp) { },
  keyGotDownFunc(editorApp) { },
};

[
  Creator.createModeTitle(DeleteMode.name),
].forEach(element.appendChild.bind(element));

export default DeleteMode;