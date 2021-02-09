// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import elementCreator from './elementCreator';
import './apply-cancel';

const style = document.createElement('template');
style.innerHTML = `
  <style>
  .container {
      width: 100%;
      border-radius: 0.5rem;
      background-color: var(--pinky-darker);
      box-shadow: 3px 3px 3px black;
      margin-bottom: 0.5rem;
  }

  .thumbnail {
      width: 100%;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
  }

  .name-holder {
      font-size: small;
      font-weight: bold;
      margin: 0em 0.2em;
  }

  .description-holder {
    font-size: small;
    font-weight: light;
    margin: 0em 0.2em;
    padding-bottom: 0.1em;
  }
  </style>
`;

class CreationDisplay extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style.content.cloneNode(true));
    this.shadowRoot.appendChild(
      <div className="container">
        <img alt="thumbnail" id="thumbnail-image" className="thumbnail" />
        <div id="name-holder" className="name-holder" />
        <div id="description-holder" className="description-holder" />
        <apply-cancel applyText="Place" cancelText="Delete" id="place-delete" small />
      </div>,
    );
  }

  set onPlace(callback) {
    this.placeDeleteBtn.onApply = callback;
  }

  set onDelete(callback) {
    this.placeDeleteBtn.onCancel = callback;
  }

  get placeDeleteBtn() {
    return this.shadowRoot.getElementById('place-delete');
  }

  get thumbnail() {
    return this.shadowRoot.getElementById('thumbnail-image');
  }

  get nameHolder() {
    return this.shadowRoot.getElementById('name-holder');
  }

  get descHolder() {
    return this.shadowRoot.getElementById('description-holder');
  }

  set thumbnailSrc(src) {
    this.thumbnail.src = src;
  }

  set creationName(newName) {
    this.nameHolder.innerText = newName;
  }

  set description(newDesc) {
    this.descHolder.innerText = newDesc;
  }

  set data(newDat) {
    this.creationData = newDat;
    this.thumbnailSrc = newDat.thumbnail;
    this.creationName = newDat.name;
    this.description = newDat.description;
  }
}

window.customElements.define('creation-display', CreationDisplay);
