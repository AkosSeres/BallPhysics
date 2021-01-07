// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from '../elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .slider {
      -webkit-appearance: none;
      height: 0.6rem;
      background: var(--pinky-darker);
      outline: none;
      opacity: 0.7;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      border-radius: 100vh;
      width: 90%;
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

class RangeSlider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div>
        <p className="slider-label"><slot /></p>
        <input id="slider" type="range" className="slider" />
      </div>,
    );
  }

  get slider() {
    return this.shadowRoot.querySelector('#slider');
  }

  set min(newMin) {
    this.slider.min = newMin;
  }

  set max(newMax) {
    this.slider.max = newMax;
  }

  set step(newStep) {
    this.slider.step = newStep;
  }

  set value(newVal) {
    this.slider.value = newVal;
  }

  set onChange(onchangeFunc) {
    this.slider.onchange = (event) => onchangeFunc(event.target.valueAsNumber);
    this.slider.oninput = (event) => onchangeFunc(event.target.valueAsNumber);
  }
}

window.customElements.define('range-slider', RangeSlider);
