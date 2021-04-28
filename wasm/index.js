import createModule from './lzo-wasm.js';
import lzoWasm from './lzo-wasm.wasm';

module.exports.decompress = async (input, length) => {

  const Module = await createModule();

  const lzo_decompress = Module.cwrap('decompress', 'number', ['number', 'number']);

  const inputLength = input.length * input.BYTES_PER_ELEMENT;
  const inputPtr = Module._malloc(inputLength);
  Module.HEAPU8.set(input, inputPtr);

  const outputPtr = lzo_decompress(inputPtr, inputLength, length);

  const resultView = new Uint8Array(Module.HEAPU8.buffer, outputPtr, length);
  const output = new Uint8Array(resultView); // copy data
  Module._free(outputPtr);
  return output;
};
