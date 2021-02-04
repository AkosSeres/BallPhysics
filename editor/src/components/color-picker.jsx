// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .picker-label {
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 1.3em;
    }
    #colorWell {
        margin-left: 0.5rem;
        border-radius: 100vh;
        background-color: var(--turquoise);
        border: none;
        height: 1rem;
        cursor: pointer;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .picker-label {
        margin-top: 0.6em;
        font-size: small;
      }
      #colorWell {
        height: 1em;
      }
    }
  </style>
`;

class ColorPicker extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div>
        <label htmlFor="colorWell" className="picker-label">
          <div><slot /></div>
          <input type="color" id="colorWell" />
        </label>
      </div>,
    );
  }

  get picker() {
    return this.shadowRoot.querySelector('#colorWell');
  }

  set value(newVal) {
    this.picker.value = newVal;
    this.picker.style['background-color'] = newVal;
  }

  set onChange(onchangeFunc) {
    const callback = (event) => {
      onchangeFunc(event.target.value);
      this.picker.style['background-color'] = event.target.value;
    };
    this.picker.onchange = callback;
    this.picker.oninput = callback;
  }
}

window.customElements.define('color-picker', ColorPicker);
