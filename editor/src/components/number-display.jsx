// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .number-label {
        display: flex;
        align-items: center;
        font-weight: bold;
        padding-right: 0.45em;
        margin-top: 0.5em;
    }
    /* For tablets */
    @media (max-width: 768px) {
      .number-label {
        margin-top: 0.6em;
        font-size: small;
      }
    }
  </style>
`;

class NumberDisplay extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div className="number-label">
        <span><slot /></span>
        <span id="numberPlace" />
      </div>,
    );
  }

  set value(newVal) {
    this.shadowRoot.querySelector('#numberPlace').innerText = newVal;
  }

  get value() {
    return this.shadowRoot.querySelector('#numberPlace').innerText;
  }
}

window.customElements.define('number-display', NumberDisplay);
