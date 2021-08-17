import createModule from './lzo-wasm.js';

// Note: Jest does not support WASM at this time: https://github.com/facebook/jest/issues/11011#issuecomment-776525477

let Module = null;
let lzo_decompress = null;

createModule().then((created) => {
  Module = created;
  lzo_decompress = Module.cwrap('decompress', 'number', ['number', 'number']);
  mocha.run();
});

const decompress = async (input, length) => {
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


describe('lzo-wasm tests', () => {
  it('decompresses LZO data', async () => {
    const data = new Uint8Array([8,84,104,101,32,113,117,105,99,107,32,113,41,20,0,7,98,114,111,119,110,32,102,111,120,10,17,0,0,0,0,0,0]);

    const ret = await decompress(data, data.length);
    const output = new TextDecoder().decode(ret);

    chai.expect(output).to.have.string('The quick quick quick brown fox');
  });
});
