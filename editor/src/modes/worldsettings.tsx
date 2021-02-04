/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mode from '../interfaces/modeInterface';
import elementCreator from '../components/elementCreator';
import '../components/checkbox';
import '../components/range-slider';
import '../components/range-slider-number';

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
    this.element.append(
      <range-slider
        min={0}
        max={5000}
        step={200}
        value={editorRef.physics.gravity.y}
        onChange={(nGy:number) => { editorRef.physics.gravity.y = nGy; }}
      >
        Gravity
      </range-slider>,
      <range-slider
        min={-5000}
        max={5000}
        step={1000}
        value={editorRef.physics.gravity.x}
        onChange={(nGx:number) => { editorRef.physics.gravity.x = nGx; }}
      >
        Gravity in X direction
      </range-slider>,
      <range-slider
        min={0}
        max={0.99}
        step={0.01}
        value={1 - editorRef.physics.airFriction}
        onChange={(nF:number) => { editorRef.physics.setAirFriction(1 - nF); }}
      >
        Air friction
      </range-slider>,
      <range-slider-number
        min={700}
        max={10000}
        step={10}
        value={editorRef.worldSize.width}
        onChange={(nW:number) => {
          editorRef.setWorldSize({ width: nW, height: editorRef.worldSize.height });
        }}
      >
        World width
      </range-slider-number>,
      <range-slider-number
        min={700}
        max={5000}
        step={10}
        value={editorRef.worldSize.height}
        onChange={(nH:number) => {
          editorRef.setWorldSize({ width: editorRef.worldSize.width, height: nH });
        }}
      >
        World height
      </range-slider-number>,
      <check-box
        checked={editorRef.drawCollisions}
        onChange={(nB:boolean) => { editorRef.drawCollisions = nB; }}
      >
        Show collision data
      </check-box>,
      <check-box
        checked={editorRef.showAxes}
        onChange={(nB: boolean) => { editorRef.showAxes = nB; }}
      >
        Show body axes
      </check-box>,
      <check-box
        checked={editorRef.showBoundingBoxes}
        onChange={(nB: boolean) => { editorRef.showBoundingBoxes = nB; }}
      >
        Show boounding boxes
      </check-box>,
      <check-box
        checked={editorRef.showVelocities}
        onChange={(nB: boolean) => { editorRef.showVelocities = nB; }}
      >
        Show velocities
      </check-box>,
    );
  },
};

export default WorldSettingsMode;
