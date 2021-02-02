// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from '../elementCreator';

const style = document.createElement('template');
style.innerHTML = `
  <style>
    ul, div {
        list-style: none;
        margin: 0;
        padding-left: 0;
    }
    ul {
        background: #00000000;
        width: 100%;
    }
    div {
        background: var(--independence);
        display: block;
        position: relative;
        z-index: 5;
        box-shadow: 3px 3px 3px black;
        margin-top: 0.2rem;
        margin-bottom: 0.4rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        border-radius: 0.4em;
        transition: background 0.2s ease, opacity 0.2s ease;
        text-align: center;
        width: 90%;
        opacity: 0.8;
    }
    div:hover {
        background: var(--blacky-hover);
        opacity: 1;
    }
    li {
        color: #fff;
        background: var(--independence);
        display: block;
        float: left;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        position: relative;
        width: 100%;
        text-decoration: none;
        transition-duration: 0.5s;
    }
    li:hover,
    li:focus-within {
        background: var(--pinky);
        cursor: pointer;
    }
    li:focus-within a {
        outline: none;
    }
    div ul {
        background: var(--independence);
        visibility: hidden;
        opacity: 0;
        min-width: 5rem;
        position: absolute;
        transition: all 0.5s ease;
        margin-top: 0rem;
        left: 0;
        display: none;
        border-bottom-left-radius: 0.4em;
        border-bottom-right-radius: 0.4em;
    }
    div:hover > ul,
    div:focus-within > ul,
    div ul:hover,
    div ul:focus {
        visibility: visible;
        opacity: 1;
        display: block
    }
    div ul li {
        clear: both;
        width: 100%;
        border-radius: 0.4em;
    }
    .hidden {
        visibility: hidden !important;
    }
    .chosen {
        background: var(--pinky-darker) !important;
    }
    /* For tablets */
    @media (max-width: 768px) {
        div {
          font-size: small;
        }
    }
  </style>
`;

class DropDown extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div>
        <span><slot /></span>
        <ul id="listHolder" className="dropdown" />
      </div>,
    );
  }

  /**
   * @param {string[]} entryList The list of possible choices
   */
  set entries(entryList) {
    this.entryList = entryList;
    const { listHolder } = this;
    listHolder.innerHTML = '';
    listHolder.append(
      ...this.entryList.map((entry) => (<li innerText={entry} />)),
    );
  }

  set value(newVal) {
    this.listHolder.childNodes.forEach((node) => {
      if (!('classList' in node)) return;
      if (node.innerText === newVal)node.classList.add('chosen');
      else node.classList.remove('chosen');
    });
  }

  get listHolder() {
    return this.shadowRoot.getElementById('listHolder');
  }

  set onChoice(onchangeFunc) {
    const callback = (event) => {
      onchangeFunc(event.target.innerText);
      this.listHolder.classList.add('hidden');
      this.listHolder.childNodes.forEach((node) => {
        if (!('classList' in node)) return;
        if (node.innerText === event.target.innerText)node.classList.add('chosen');
        else node.classList.remove('chosen');
      });
      setTimeout(() => {
        this.listHolder.classList.remove('hidden');
      }, 20);
    };
    const list = this.listHolder;
    this.listHolder.childNodes.forEach((child) => {
      const newChild = child.cloneNode(true);
      newChild.addEventListener('click', callback);
      list.replaceChild(newChild, child);
    });
  }
}

window.customElements.define('drop-down', DropDown);
