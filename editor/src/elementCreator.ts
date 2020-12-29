type EventHandlerFunction = (event: Event) => void;

/**
 * Returns an HTML element with the title in it for putting it on top of the sidebar
 *
 * @param {string} title The text of the title
 * @returns {HTMLDivElement} The created element
 */
export function createModeTitle(title: string): HTMLDivElement {
  const el = document.createElement('div');
  const h = document.createElement('h3');
  h.innerText = title;
  h.classList.add('modetitlemargin');
  el.appendChild(h);
  el.classList.add('mode-title');
  el.classList.add('bg-blue');
  return el;
}

/**
 * Returns an HTML element with the label in with a slider
 * The given function gets called when the slider changes by the user
 *
 * @param {string} label The label over the slider
 * @param {number} min The minimum value of the slider input
 * @param {number} max The maximum value of the slider input
 * @param {number} defaultVal The initial value of the slider
 * @param {EventHandlerFunction} onchange The event handler function
 * @param {number} step The stepping size of the slider (optional)
 * @returns {HTMLDivElement} The div containing the slider and the label
 */
export function createSlider(
  label: string, min: number, max: number, defaultVal: number,
  onchange: EventHandlerFunction, step = 1,
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
  sizeSlider.onchange = onchange;

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
 * @param {EventHandlerFunction} onchange The event handler function
 * @returns {HTMLDivElement} The div containing the checkbox and the label
 */
export function createCheckbox(
  label: string, defaultVal: boolean, onchange: (event: Event) => void,
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
  checkbox.onchange = onchange;

  // Add them both to the container
  const container = document.createElement('div');
  container.appendChild(checkbox);
  container.appendChild(checkboxLabel);
  return container;
}
