/* eslint-disable jsx-a11y/label-has-associated-control */
// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    .inputLabel {
        margin-left: 1.2rem;
        margin-top: 0.7rem;
        display: block;
        transition: transform 0.3s, color 0.25s;
        transform: scale(0.95);
        color: grey;
    }
    
    .inputText {
        background-color: var(--independence);
        font-size: medium;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        padding-left: 0.5em;
        padding-right: 0.5em;
        border-radius: 100vh;
        color: #FFFFFF;
        border: none;
        height: 1.2em;
        width: 100%;
        outline: none;
        display: block;
        transition: border 0.25s;
    }

    .inputText:focus {
      border: 1.5px solid var(--roman-silver);
    }

    .container:focus-within > .inputLabel {
      transform: scale(1);
      color: white;
    }

    .container {
      width: 65%;
      margin: 0 auto;
      margin-bottom: 0.7rem;
    }
  
    /* For tablets */
    @media (max-width: 768px) {
        .container {
          width: 80%;
        }
    }

    /* For mobile devices */
    @media (max-width: 500px) {
        .container {
          width: 90%;
        }
    }
  </style>
`;

class TextInput extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div className="container">
        <label htmlFor="textInput" className="inputLabel"><slot /></label>
        <input type="text" className="inputText" id="textInput" placeholder={this.slot} autoComplete="off" />
      </div>,
    );
  }

  get textInput() {
    return this.shadowRoot.getElementById('textInput');
  }

  get inputValue() {
    return this.textInput.value;
  }

  set onChange(onchangeFunc) {
    const callback = (event) => {
      onchangeFunc(event.target.value);
    };
    this.picker.onchange = callback;
  }
}

window.customElements.define('text-input', TextInput);
