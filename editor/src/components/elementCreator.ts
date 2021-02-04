import RangeSlider from './range-slider';
import RangeSliderNumber from './range-slider-number';

/**
 * Creates an html element from the given arguments, used in JSX.
 *
 * @param {string} type The type of the tag
 * @param {object} attributes The attributes of the tag
 * @param {any[]} content The contents of the html tag
 * @returns {HTMLElement} The created element
 */
export default function elementCreator(type: string, attributes: {}, ...content: any[]):
HTMLElement {
  const el = document.createElement(type) as any;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]: [string, any]) => {
      el[key] = value;
    });
  }

  if (content) {
    content.forEach((d) => {
      if (typeof d === 'string') {
        el.appendChild(document.createTextNode(d));
      } else if (d instanceof HTMLElement) {
        el.appendChild(d);
      }
    });
  }

  return el;
}

// Element types for type checking
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [name: string]: any;
    }
  }
}
