/* eslint-disable jsx-a11y/label-has-associated-control */
// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from '../elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .container {
        width: 100%;
        display: block;
        margin-top: 1.3em;
    }
    label {
        display: block;
        width: 100%;
        border-radius: 0.3em;
        background-color: var(--independence);
        cursor: pointer;
        padding: 0.2em 0px;
        color: #BBBBBB;
        text-align: center;
        transform: color 0.2 ease, border-radius 0.25s ease-in;
    }
    .toggle:hover {
        color: #FEFEFE;
    }
    .toggle::before {
        content: ' ';
        display: inline-block;
        border-top: 0.25em solid transparent;
        border-bottom: 0.25em solid transparent;
        border-left: 0.25em solid currentColor;
        vertical-align: middle;
        margin-right: 0.45em;
        transform: translateY(-0.1em);
        transition: transform 0.2s ease-out;
    }
    input[type='checkbox'] {
        display: none;
    }
    input[type='checkbox']:checked + .toggle::before {
        transform: rotate(90deg) translateX(-3px);
    }
    input[type='checkbox']:checked + .toggle{
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }
    input[type='checkbox']:checked + .toggle + .toClose {
        display: block;
    }
    .toClose {
        border-bottom-left-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
        margin: 0px;
        overflow: hidden;
        display: none;
    }
    /* For tablets */
    @media (max-width: 768px) {
    }
    /* For smaller laptops */
    @media (max-width: 1125px) {
        .toggle {
            padding-top: 0.12em;
            padding-bottom: 0.12em;
            font-size: small;
        }
    }
  </style>
`;

class Collapsible extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div className="container">
        <input id="collapsible" className="toggle" type="checkbox" checked />
        <label htmlFor="collapsible" className="toggle" id="toggleEl">More</label>
        <div className="toClose">
          <slot />
        </div>
      </div>,
    );
  }

  get input() {
    return this.shadowRoot.getElementById('collapsible');
  }

  set title(newTitle) {
    this.shadowRoot.querySelector('#toggleEl').innerText = newTitle;
  }

  collapse() {
    this.input.checked = false;
  }

  open() {
    this.input.checked = true;
  }

  set closed(newCl) {
    this.input.checked = !newCl;
  }
}

window.customElements.define('collapsible-element', Collapsible);
