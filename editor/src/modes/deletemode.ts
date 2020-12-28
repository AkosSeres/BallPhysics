/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

const element = document.createElement('div');

export const DeleteMode: Mode = {
  name: 'Delete',
  description: '',
  element,
  drawFunc: function (editorApp, dt) { },
  startInteractionFunc: function (editorApp) {
    if (editorApp.choosed) {
      editorApp.physics.removeObjFromSystem(editorApp.choosed);
    }
  },
  endInteractionFunc: function (editorApp) { },
  keyGotUpFunc: function (editorApp) { },
  keyGotDownFunc: function (editorApp) { },
};

[
  Creator.createModeTitle(DeleteMode.name),
].forEach(element.appendChild.bind(element));