// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .number {
      display: block;
      height: 0.6rem;
      background: var(--independence);
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      border-bottom-right-radius: 0.3rem;
      border-bottom-left-radius: 0.3rem;
      padding: 0px;
      padding-top: 0.15rem;
      padding-bottom: 0.15rem;
      border: 0px;
      margin-left: 2px;
      margin-right: 2px;
      text-align: center;
      width: 100%;
      color: white;
    }
    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    .number:hover {
      opacity: 1;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    .slider {
      -webkit-appearance: none;
      height: 0.6rem;
      background: var(--pinky-darker);
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      width: 100%;
      margin-bottom: 0px;
      display: block;
    }
    .slider:hover {
      opacity: 1;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 0.8rem;
      height: 0.8rem;
      background: var(--blues-hover);
      opacity: 0.7;
      cursor: pointer;
      border-radius: 100vh;
    }
    .slider::-moz-range-thumb {
      width: 0.8rem;
      height: 0.8rem;
      background: var(--blues-hover);
      opacity: 0.7;
      cursor: pointer;
      border-radius: 100vh;
    }
    .slider-label {
      margin-top: 1em;
      margin-bottom: 0.3em;
      padding-left: 0em;
      font-weight: bold;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .slider-label {
        font-weight: bold;
        margin-top: 0.5em;
        margin-bottom: 0rem;
        font-size: small;
      }
      .slider {
        height: 0.4rem;
      }
      .slider::-webkit-slider-thumb {
        width: 0.55rem;
        height: 0.55rem;
      }
      .slider::-moz-range-thumb {
        width: 0.55rem;
        height: 0.55rem;
      }
    }
  </style>
`;

class RangeSliderNumber extends HTMLElement {
  constructor() {
    super();

    this.minNum = 0;
    this.maxNum = 0;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div id="mainContainer">
        <p className="slider-label"><slot /></p>
        <input id="slider" type="range" className="slider" />
        <input id="number-input" type="number" className="number" />
      </div>,
    );
  }

  get slider() {
    return this.shadowRoot.querySelector('#slider');
  }

  get numInput() {
    return this.shadowRoot.querySelector('#number-input');
  }

  set min(newMin) {
    this.slider.min = newMin;
    this.numInput.min = newMin;
    this.minNum = newMin;
  }

  set max(newMax) {
    this.slider.max = newMax;
    this.numInput.max = newMax;
    this.maxNum = newMax;
  }

  set step(newStep) {
    this.slider.step = newStep;
    this.numInput.step = newStep;
  }

  set value(newVal) {
    this.slider.value = newVal;
    this.numInput.value = newVal;
  }

  normalizeValue(val) {
    return Math.min(Math.max(this.minNum, val), this.maxNum);
  }

  disable() {
    this.shadowRoot.querySelector('#mainContainer').classList.add('disabled');
  }

  enable() {
    this.shadowRoot.querySelector('#mainContainer').classList.remove('disabled');
  }

  set onChange(onchangeFunc) {
    this.slider.onchange = (event) => {
      const norm = this.normalizeValue(event.target.valueAsNumber).toString();
      onchangeFunc(Number.parseFloat(norm));
      this.value = norm;
    };
    this.slider.oninput = (event) => {
      const norm = this.normalizeValue(event.target.valueAsNumber).toString();
      onchangeFunc(Number.parseFloat(norm));
      this.value = norm;
    };
    this.numInput.onchange = (event) => {
      const norm = this.normalizeValue(event.target.valueAsNumber).toString();
      onchangeFunc(Number.parseFloat(norm));
      this.value = norm;
    };
  }
}

window.customElements.define('range-slider-number', RangeSliderNumber);
