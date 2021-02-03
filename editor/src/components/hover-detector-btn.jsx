// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from '../elementCreator';

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
        margin: 0px;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s, background-color 0.2s;
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
    .last {
      border-bottom-left-radius: 0.4em;
      border-bottom-right-radius: 0.4em;
    }
    .upper {
      border-top-left-radius: 0.4em;
      border-top-right-radius: 0.4em;
    }
    /* For tablets */
    @media (max-width: 768px) {
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

class HoverDetectorBtn extends HTMLElement {
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

  set onEnter(enterFunc) {
    this.btn.onpointerenter = enterFunc;
  }

  set onLeave(leaveFunc) {
    this.btn.onpointerleave = leaveFunc;
  }

  hide() {
    this.btn.classList.add('hidden');
    this.hidden = true;
  }

  show() {
    this.btn.classList.remove('hidden');
    this.hidden = false;
  }

  asUpper() {
    this.btn.classList.add('upper');
  }

  asMiddle() {
    this.btn.classList.remove('upper');
    this.btn.classList.remove('last');
  }

  asLast() {
    this.btn.classList.add('last');
  }
}

window.customElements.define('hover-detector-btn', HoverDetectorBtn);
