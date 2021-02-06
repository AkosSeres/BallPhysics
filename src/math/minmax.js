/**
 * @typedef {{min:number, max:number}} MinMaxAsObject
 */

/**
 * Used to descrive an interval.
 */
export class MinMax {
  /**
   * Crates the interval, MinMax.
   *
   * @param {number} min The start value of the interval
   * @param {number} max The end value of the interval
   */
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  /**
   * Returns the size of the interval (length).
   *
   * @returns {number} The size
   */
  size() {
    return this.max - this.min;
  }

  /**
   * Expand the MinMax with another MinMax.
   *
   * @param {MinMax} other The other interval
   */
  add(other) {
    this.min = Math.min(this.min, other.min);
    this.max = Math.max(this.max, other.max);
  }

  /**
   * Returns a copy of the interval.
   *
   * @returns {MinMax} The copy
   */
  get copy() {
    return new MinMax(this.min, this.max);
  }

  /**
   * Creates a bounding box of a set of numbers.
   *
   * @param  {...number} points The numbers to get the interval from
   * @returns {MinMax} The created interval
   */
  static fromPoints(...points) {
    const ret = new MinMax(0, 0);
    ret.min = Math.min(...points);
    ret.max = Math.max(...points);
    return ret;
  }
}

/**
 * Returns the min and max of an array of numbers
 *
 * @param {number[]} arr Array of numbers
 * @returns {MinMax} The min and max value
 */
export function minMaxOfArray(arr) {
  return new MinMax(Math.min(...arr), Math.max(...arr));
}

/**
 * Finds the overlap of two {@link MinMax}-es.
 *
 * @param {MinMax} interval1 The first MinMax
 * @param {MinMax} interval2 The second MinMax
 * @returns {MinMax} Their overlap
 */
export function findOverlap(interval1, interval2) {
  return new MinMax(Math.max(interval1.min, interval2.min),
    Math.min(interval1.max, interval2.max));
}
