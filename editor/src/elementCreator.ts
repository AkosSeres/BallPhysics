type EventHandlerFunctionNum = (newNum: number) => void;
type EventHandlerFunctionBool = (newBool: boolean) => void;

/**
 * Returns an HTML element with the label in with a slider
 * The given function gets called when the slider changes by the user
 *
 * @param {string} label The label over the slider
 * @param {number} min The minimum value of the slider input
 * @param {number} max The maximum value of the slider input
 * @param {number} defaultVal The initial value of the slider
 * @param {EventHandlerFunctionNum} onchange The new value handler function
 * @param {number} step The stepping size of the slider (optional)
 * @returns {HTMLDivElement} The div containing the slider and the label
 */
export function createSlider(
  label: string, min: number, max: number, defaultVal: number,
  onchange: EventHandlerFunctionNum, step = 1,
): HTMLDivElement {
  // Create label
  const sizeSliderLabel = document.createElement('p');
  sizeSliderLabel.classList.add('slider-label');
  sizeSliderLabel.innerText = label;

  // Create slider element
  const sizeSlider = document.createElement('input');
  sizeSlider.type = 'range';
  sizeSlider.min = min.toString();
  sizeSlider.max = max.toString();
  sizeSlider.step = step.toString();
  sizeSlider.value = defaultVal.toString();
  sizeSlider.classList.add('slider');
  sizeSlider.classList.add('fix-width');
  sizeSlider.onchange = (event) => { onchange((event.target as HTMLInputElement).valueAsNumber); };
  sizeSlider.oninput = (event) => { onchange((event.target as HTMLInputElement).valueAsNumber); };

  // Add them both to the container
  const container = document.createElement('div');
  container.appendChild(sizeSliderLabel);
  container.appendChild(sizeSlider);
  return container;
}

/**
 * Returns an HTML element with a label in with a checkbox
 * The given function gets called when the checkox gets checked or unchecked
 *
 * @param {string} label The label next to the checkbox
 * @param {boolean} defaultVal The initial state of the checkbox
 * @param {EventHandlerFunctionBool} onchange The new value handler function
 * @returns {HTMLDivElement} The div containing the checkbox and the label
 */
export function createCheckbox(
  label: string, defaultVal: boolean, onchange: (newBool: boolean) => void,
): HTMLDivElement {
  // Create label
  const name = label + Math.random().toString();
  const checkboxLabel = document.createElement('label');
  checkboxLabel.htmlFor = name;
  checkboxLabel.classList.add('checkbox-label');

  // Create slider element
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = defaultVal;
  checkbox.classList.add('ch-box');
  checkbox.id = name;

  const labelText = document.createElement('div');
  labelText.innerText = label;
  labelText.classList.add('label-text');

  // Create the checkbox to be displayed
  const checkboxDisplay = document.createElement('div');
  // Create checkmark image
  checkboxDisplay.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg>';
  checkboxDisplay.getElementsByTagName('svg')[0].classList.add('checkmark');
  checkboxDisplay.classList.add('checkbox-display');

  // Add them both to the container
  const container = document.createElement('div');
  container.classList.add('cursor-pointer');
  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(checkboxDisplay);
  checkboxLabel.appendChild(labelText);

  checkboxLabel.childNodes.forEach((node) => {
    const cb = node as HTMLInputElement;
    if (cb?.id === name) {
      cb.onchange = (event) => { onchange((event.target as HTMLInputElement).checked); };
    }
  });

  container.appendChild(checkboxLabel);

  return container;
}

/**
 * Creates an html element from the given arguments, used in JSX.
 *
 * @param {string} type The type of the tag
 * @param {object} attributes The attributes of the tag
 * @param {any[]} content The contents of the html tag
 * @returns {HTMLElement} The created element
 */
export default function elementCreator(type: string, attributes: {}, ...content: any[]):
HTMLElement {
  const el = document.createElement(type) as any;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]: [string, any]) => {
      el[key] = value;
    });
  }

  if (content) {
    content.forEach((d) => {
      if (typeof d === 'string') {
        el.appendChild(document.createTextNode(d));
      } else if (d instanceof HTMLElement) {
        el.appendChild(d);
      }
    });
  }

  return el;
}

// Element types for type checking
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      hline: any;
      br: any;
    }
  }
}
