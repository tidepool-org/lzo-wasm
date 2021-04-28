import createModule from './lzo-wasm.js';

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



const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;

  const reader = new FileReader();
  reader.addEventListener('load', async (event) => {
    const data = new Uint8Array(event.target.result);
    console.log(data);
    const skip = 50;
    const ret = await decompress(data.slice(skip), data.length - skip);
    console.log(new TextDecoder().decode(ret));
  });
  reader.readAsArrayBuffer(fileList[0]);
});
