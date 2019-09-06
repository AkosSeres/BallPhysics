/**
 * Gives back the base64 code table
 * @return {Array<String>} The code table
 */
exports.codeTable = (
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcde' + 'fghijklmnopqrstuvwxyz0123456789+/='
).split('');

/**
 * Converts the content of an ArrayBuffer to a base64 string
 * @param {ArrayBuffer} arrayBuffer The buffer
 * @return {String} The base64 string
 */
exports.arrayBuffertoBase64 = (arrayBuffer) => {
  let base = '';
  let uintArr = new Uint8Array(arrayBuffer);
  let binaryString = [];
  uintArr.forEach((n) => {
    let bin = n.toString(2);
    if (bin.length < 8) bin = '0'.repeat(8 - bin.length) + bin;
    binaryString.push(bin);
  });
  binaryString = binaryString.reduce((a, b) => {
    return a + b;
  });

  for (let i = 0; i < binaryString.length; i += 6) {
    let current = binaryString.slice(i, i + 6);
    if (current.length < 6) {
      current += '0'.repeat(6 - current.length);
      base += exports.codeTable[Number.parseInt(current, 2)];
      base += '=';
      if (base.length % 4 != 0) base += '=';
    } else {
      base += exports.codeTable[Number.parseInt(current, 2)];
    }
  }

  return base;
};

/**
 * Convert a base64 encoded string to an ArrayBuffer
 * @param {String} stringBase64 The base64 string
 * @return {ArrayBuffer} The buffer
 */
exports.base64ToArrayBuffer = (stringBase64) => {
  let binaryString = '';
  for (let i = 0; i < stringBase64.length / 4; i++) {
    let quad = stringBase64.slice(i * 4, (i + 1) * 4);
    for (let j = 0; j < quad.length; j++) {
      if (quad[j] != '=') {
        let additionalBinary = exports.codeTable.indexOf(quad[j]).toString(2);
        if (additionalBinary.length < 6) {
          additionalBinary =
            '0'.repeat(6 - additionalBinary.length) + additionalBinary;
        }
        binaryString = binaryString + additionalBinary;
      }
    }
  }

  binaryString = binaryString.slice(
    0,
    binaryString.length - (binaryString.length % 8)
  );
  let numArr = binaryString.match(/.{8}/g).map((b) => {
    return Number.parseInt(b, 2);
  });

  let ret = new ArrayBuffer(numArr.length);
  let view = new DataView(ret);
  numArr.forEach((n, i) => {
    view.setUint8(i, n);
  });

  return ret;
};
