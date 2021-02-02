// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from '../elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    #inputEl {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
      cursor: pointer;
    }
    #inputLabel {
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
      box-shadow: var(--blacky);
      margin-top: 0.2em;
      box-shadow: 3px 3px 3px black;
      -webkit-transition: 0.2s;
      transition: opacity 0.2s;
      width: 90%;
      opacity: 0.8;
      cursor: pointer;
    }
    #inputLabel:hover {
      opacity: 1;
    }
    #inputLabel:focus {
      background-color: var(--pinky-darker);
    }
    /* For tablets */
    @media (max-width: 768px) {

    }
  </style>
`;

class FileInput extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div>
        <input type="file" id="inputEl" name="inputEl" />
        <label id="inputLabel" htmlFor="inputEl"><slot /></label>
      </div>,
    );
  }

  get input() {
    return this.shadowRoot.getElementById('inputEl');
  }

  set accept(toAccept) {
    this.input.accept = toAccept;
  }

  set onFile(onFileFunc) {
    const callback = (event) => {
      if (event.target.files.length !== 0)onFileFunc(event.target.files[0]);
    };
    this.input.onchange = callback;
  }
}

window.customElements.define('file-input', FileInput);
