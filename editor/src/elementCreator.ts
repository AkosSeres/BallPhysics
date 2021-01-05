type EventHandlerFunctionNum = (event: number) => void;
type EventHandlerFunctionBool = (event: boolean) => void;

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
  sizeSlider.onchange = (event) => { onchange((<HTMLInputElement>event.target).valueAsNumber); };
  sizeSlider.oninput = (event) => { onchange((<HTMLInputElement>event.target).valueAsNumber); };

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
  checkboxLabel.innerText = label;
  checkboxLabel.htmlFor = name;
  checkboxLabel.classList.add('checkbox-label');

  // Create slider element
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = name;
  checkbox.value = defaultVal.toString();
  checkbox.classList.add('ch-box');
  checkbox.onchange = (event) => { onchange((<HTMLInputElement>event.target).checked); };

  // Make label clickable
  checkboxLabel.onclick = () => {
    checkbox.checked = !checkbox.checked;
    onchange(checkbox.checked);
  };

  // Add them both to the container
  const container = document.createElement('div');
  container.classList.add('cursor-pointer');
  container.appendChild(checkbox);
  container.appendChild(checkboxLabel);
  return container;
}
