import Mode from '../interfaces.ts/modeInterface';
import elementCreator from '../components/elementCreator';
import palette from '../../../src/util/colorpalette';
import EditorInterface from '../interfaces.ts/editorInterface';
import '../components/hover-detector-btn';
import '../components/space-height';

import BallCreator from './ballcreator';
import RectangleWallCreator from './rectangle';
import RectangleBodyCreator from './rectanglebodycreator';
import SquircleCreator from './squirclecreator';
import SoftSquareCreator from './softsquarecreator';
import WallDrawer from './walldrawer';
import TriangleCreatorMode from './trianglecreator';
import PentagonCreatorMode from './pentagoncreator';
import HexagonCreatorMode from './hexagoncreator';
import OctagonCreatorMode from './octagoncreator';
import HalfCircleCreatorMode from './halfcirclecreator';
import ConvexShapeCreatorMode from './convexshapecreator';

const CreatorModes = [
  BallCreator,
  RectangleBodyCreator,
  RectangleWallCreator,
  WallDrawer,
  ConvexShapeCreatorMode,
  SquircleCreator,
  SoftSquareCreator,
  HalfCircleCreatorMode,
  TriangleCreatorMode,
  PentagonCreatorMode,
  HexagonCreatorMode,
  OctagonCreatorMode,
];
let currentMode: Mode = CreatorModes[0];

const element = document.createElement('div');
const container: HTMLDivElement = <div className="full-width" />;
let editor: EditorInterface;

/**
 * @returns {number} The index of the current used mode
 */
function currentIndex() {
  return CreatorModes.indexOf(currentMode);
}

/**
 * @param {number} indexOfChosen The index of the chosen mode
 * @param {HTMLElement[]} buttonArray The array of buttons used to choose between the modes
 */
function setMode(indexOfChosen: number, buttonArray: any) {
  const btnArr = buttonArray;
  currentMode.deactivated?.(editor);
  btnArr[currentIndex()].bgColor = palette.Independence;
  btnArr[indexOfChosen].bgColor = palette.pinkDarker;
  container.innerHTML = '';
  container.appendChild(CreatorModes[indexOfChosen].element);
  currentMode = CreatorModes[indexOfChosen];
}

const buttons = CreatorModes.map((mode, i) => (
  <hover-detector-btn
    onClick={() => { setMode(i, buttons); }}
  >
    {mode.name}
  </hover-detector-btn>
));

const ShapeCreatorMode: Mode = {
  name: 'Shapes',
  description: '',
  element,
  drawFunc(editorApp, dt) {
    currentMode.drawFunc?.(editorApp, dt);
  },
  startInteractionFunc(editorApp) {
      currentMode.startInteractionFunc?.(editorApp);
  },
  endInteractionFunc(editorApp) {
    currentMode.endInteractionFunc?.(editorApp);
  },
  init(editorApp) {
    editor = editorApp;
    CreatorModes.forEach((mode) => mode.init?.(editorApp));
    buttons.forEach((b, i) => {
      if (i === 0) b.asUpper();
      if (i === buttons.length - 1) b.asLast();
    });
  },
};

element.append(<space-height height={1} />, ...buttons, container);
setMode(0, buttons);

export default ShapeCreatorMode;
