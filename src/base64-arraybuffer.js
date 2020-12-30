/**
 * Gives back the base64 code table
 */
/**
 * @type {string[]} The code table
 */
export const codeTable = (
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
).split('');

/**
 * @param {ArrayBuffer} arrayBuffer The buffer
 * @returns {string} The base64 string, converts the
 * content of an ArrayBuffer to a base64 string
 */
export const arrayBuffertoBase64 = (arrayBuffer) => {
  let base = '';
  const uintArr = new Uint8Array(arrayBuffer);
  /** @type {string[]} */
  const binaryStrings = [];
  uintArr.forEach((n) => {
    let bin = n.toString(2);
    if (bin.length < 8) bin = '0'.repeat(8 - bin.length) + bin;
    binaryStrings.push(bin);
  });
  const binaryString = binaryStrings.reduce((a, b) => a + b);

  for (let i = 0; i < binaryString.length; i += 6) {
    let current = binaryString.slice(i, i + 6);
    if (current.length < 6) {
      current += '0'.repeat(6 - current.length);
      base += exports.codeTable[Number.parseInt(current, 2)];
      base += '=';
      if (base.length % 4 !== 0) base += '=';
    } else {
      base += exports.codeTable[Number.parseInt(current, 2)];
    }
  }

  return base;
};

/**
 * Convert a base64 encoded string to an ArrayBuffer
 *
 * @param {string} stringBase64 The base64 string
 * @returns {ArrayBuffer} The buffer
 */
export const base64ToArrayBuffer = (stringBase64) => {
  let binaryString = '';
  for (let i = 0; i < stringBase64.length / 4; i += 1) {
    const quad = stringBase64.slice(i * 4, (i + 1) * 4);
    for (let j = 0; j < quad.length; j += 1) {
      if (quad[j] !== '=') {
        let additionalBinary = exports.codeTable.indexOf(quad[j]).toString(2);
        if (additionalBinary.length < 6) {
          additionalBinary = '0'.repeat(6 - additionalBinary.length) + additionalBinary;
        }
        binaryString += additionalBinary;
      }
    }
  }

  binaryString = binaryString.slice(
    0,
    binaryString.length - (binaryString.length % 8),
  );
  const numArr = binaryString.match(/.{8}/g)?.map((b) => Number.parseInt(b, 2));
  if (numArr) {
    const ret = new ArrayBuffer(numArr.length);
    const view = new DataView(ret);
    numArr.forEach((n, i) => {
      view.setUint8(i, n);
    });

    return ret;
  } return new ArrayBuffer(0);
};
