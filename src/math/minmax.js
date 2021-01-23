/**
 * Used to descrive an interval.
 *
 * @class
 * @param {number} min The lower bound
 * @param {number} max The high bound
 */
export function MinMax(min, max) {
  this.min = min;
  this.max = max;
}

MinMax.prototype.size = function size() {
  return this.max - this.min;
};

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
