// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .btn {
        border: none;
        color: white;
        padding-left: 0.2em;
        padding-right: 0.2em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        text-align: center;
        text-decoration: none;
        font-size: medium;
        border-radius: 0.4em;
        box-shadow: var(--blacky);
        margin-top: 0.3em;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
        opacity: 0.8;
        flex-grow: 1;
    }
    #cancel {
      background-color: var(--imperial-red);
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    #apply {
      background-color: var(--greeny-hover);
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .btn:hover {
        opacity: 1;
    }
    #container {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        box-shadow: 3px 3px 3px black;
        cursor: pointer;
    }
    /* For tablets */
    @media (max-width: 768px) {
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        .btn {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;

class ApplyCancel extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div id="container">
        <div id="apply" className="btn">Apply</div>
        <div id="cancel" className="btn"> Cancel</div>
      </div>,
    );
  }

  set visible(visibility) {
    if (visibility) {
      const container = this.containerElement;
      if (container.style.display !== 'flex')container.style.display = 'flex';
    } else {
      const container = this.containerElement;
      if (container.style.display !== 'none')container.style.display = 'none';
    }
  }

  get containerElement() {
    return this.shadowRoot.getElementById('container');
  }

  get applyBtn() {
    return this.shadowRoot.getElementById('apply');
  }

  get cancelBtn() {
    return this.shadowRoot.getElementById('cancel');
  }

  set onApply(clickFunc) {
    this.applyBtn.onclick = clickFunc;
  }

  set onCancel(clickFunc) {
    this.cancelBtn.onclick = clickFunc;
  }
}

window.customElements.define('apply-cancel', ApplyCancel);
