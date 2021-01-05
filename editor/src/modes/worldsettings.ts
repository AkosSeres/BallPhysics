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
      Creator.createSlider('Gravity', 0, 5000, editorRef.physics.gravity.y, (newGravY) => {
        editorRef.physics.gravity.y = newGravY;
      }, 100),
      Creator.createSlider('Gravity in the X direction', -5000, 5000, editorRef.physics.gravity.x, (newGravX) => {
        editorRef.physics.gravity.x = newGravX;
      }, 1000),
      Creator.createSlider('Air friction', 0, 0.99, 1 - editorRef.physics.airFriction, (newFric) => {
        editorRef.physics.setAirFriction(1 - newFric);
      }, 0.01),
      Creator.createCheckbox('Show collision data', editorRef.drawCollisions, (newBoolColl) => {
        editorRef.drawCollisions = newBoolColl;
      }),
      Creator.createCheckbox('Show body axes', editorRef.showAxes, (newBoolShowAxes) => {
        editorRef.showAxes = newBoolShowAxes;
      }),
    ].forEach(element.appendChild.bind(element));
  },
};

export default WorldSettingsMode;
