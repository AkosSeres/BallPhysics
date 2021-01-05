/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../modeInterface';
import * as Creator from '../elementCreator';

const element = document.createElement('div');

/**
 * This mode is for placing down balls in the world
 */
const WorldSettingsMode: Mode = {
  name: 'World settings',
  description: '',
  element,
  init(editorApp) {
    const editorRef = editorApp;
    [
      Creator.createSlider('Gravity', 0, 5000, editorRef.physics.gravity.y, (event) => {
        editorRef.physics.gravity.y = (<HTMLInputElement>event.target).valueAsNumber;
      }, 100),
      Creator.createSlider('Gravity in the X direction', -5000, 5000, editorRef.physics.gravity.x, (event) => {
        editorRef.physics.gravity.x = (<HTMLInputElement>event.target).valueAsNumber;
      }, 1000),
      Creator.createSlider('Air friction', 0, 0.99, 1 - editorRef.physics.airFriction, (event) => {
        const af = (<HTMLInputElement>event.target).valueAsNumber;
        editorRef.physics.setAirFriction(1 - af);
      }, 0.01),
      Creator.createCheckbox('Show collision data', editorRef.drawCollisions, (event) => {
        editorRef.drawCollisions = (<HTMLInputElement>event.target).checked;
      }),
      Creator.createCheckbox('Show body axes', editorRef.showAxes, (event) => {
        editorRef.showAxes = (<HTMLInputElement>event.target).checked;
      }),
    ].forEach(element.appendChild.bind(element));
  },
};

export default WorldSettingsMode;
