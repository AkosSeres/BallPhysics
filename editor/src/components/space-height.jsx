// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from '../elementCreator';

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

class SpaceHeight extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    /** @type {HTMLDivElement} */
    this.customHeightDiv = <div />;
    this.customHeightDiv.style.height = '1rem';
    this.shadowRoot.appendChild(
      this.customHeightDiv,
    );
  }

  /**
   * @param {number} newH The new height in rems
   */
  set height(newH) {
    this.customHeightDiv.style.height = `${newH}rem`;
  }
}

window.customElements.define('space-height', SpaceHeight);
