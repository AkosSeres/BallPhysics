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
    #indicatorContainer {
        display: inline-block;
        width: 1em;
        height: 1em;
        background: var(--pinky-darker);
        border-radius: 100vh;
        align-text: center;
    }
    #rotationIndicator {
        transform: translateY(0.1em) rotate(0deg);
        position: relative;
        width: 0.8em;
        border-top: 0.1em solid white;
        border-bottom: 0.1em solid white;
        border-right: 0.2em solid black;
    }
    .hidden {
      display: none;
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

class AngleDisplay extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div className="number-label">
        <span><slot /></span>
        <div id="indicatorContainer"><hr id="rotationIndicator" /></div>
        <span>&nbsp;</span>
        <span id="numberPlace" />
        <span id="symbolPlace">&deg;</span>
      </div>,
    );
  }

  set value(newVal) {
    const inDeg = ((newVal * 180) / Math.PI) % 360;
    this.shadowRoot.querySelector('#numberPlace').innerText = Math.abs(inDeg).toFixed();
    this.shadowRoot.querySelector('#rotationIndicator').style.transform = `translateY(-0.1em) rotate(${inDeg}deg)`;
  }

  get value() {
    return this.shadowRoot.querySelector('#numberPlace').innerText;
  }

  hideNumber() {
    this.shadowRoot.querySelector('#numberPlace').classList.add('hidden');
    this.shadowRoot.querySelector('#symbolPlace').classList.add('hidden');
  }

  showNumber() {
    this.shadowRoot.querySelector('#numberPlace').classList.remove('hidden');
    this.shadowRoot.querySelector('#symbolPlace').classList.remove('hidden');
  }
}

window.customElements.define('angle-display', AngleDisplay);
