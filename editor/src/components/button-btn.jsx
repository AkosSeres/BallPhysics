// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    #btn {
        background-color: var(--independence);
        border: none;
        color: white;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        text-align: center;
        text-decoration: none;
        display: block;
        font-size: medium;
        border-radius: 0.4em;
        margin-top: 1em;
        box-shadow: 3px 3px 3px black;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
        width: 100%;
        opacity: 0.8;
        cursor: pointer;
    }
    #btn:hover {
        opacity: 1;
    }
    .hidden {
      display: none;
    }
    /* For tablets */
    @media (max-width: 768px) {
        #btn {
            width: 100%;
        }
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        #btn {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;

class ButtonBtn extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div id="btn"><slot /></div>,
    );
    this.hidden = false;
  }

  set bgColor(c) {
    this.btn.style.backgroundColor = c;
  }

  set textColor(c) {
    this.btn.style.color = c;
  }

  get btn() {
    return this.shadowRoot.getElementById('btn');
  }

  set onClick(clickFunc) {
    this.btn.onclick = clickFunc;
  }

  smallMargin() {
    this.btn.style.marginTop = '0.2em';
  }

  hide() {
    this.btn.classList.add('hidden');
    this.hidden = true;
  }

  show() {
    this.btn.classList.remove('hidden');
    this.hidden = false;
  }
}

window.customElements.define('button-btn', ButtonBtn);
