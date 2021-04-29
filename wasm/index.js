import createModule from './lzo-wasm.js';
import lzoWasm from './lzo-wasm.wasm';

let Module = null;
let lzo_decompress = null;

createModule().then((created) => {
  Module = created;
  lzo_decompress = Module.cwrap('decompress', 'number', ['number', 'number']);
});

module.exports.decompress = (input, length) => {
  if(Module == null || lzo_decompress || null) {
    throw new Error('LZO module not ready yet');
  }

  const inputLength = input.length * input.BYTES_PER_ELEMENT;
  const inputPtr = Module._malloc(inputLength);
  Module.HEAPU8.set(input, inputPtr);

  const outputPtr = lzo_decompress(inputPtr, inputLength, length);

  const resultView = new Uint8Array(Module.HEAPU8.buffer, outputPtr, length);
  const output = new Uint8Array(resultView); // copy data
  Module._free(outputPtr);
  return output;
};
