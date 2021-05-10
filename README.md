# lzo-wasm

Decompress using LZO in the browser using Ffmpeg

## Introduction

`lzo-wasm` is a WebAssembly version of the the LZO implementation in [FFMpeg's libavutil](https://github.com/FFmpeg/FFmpeg/tree/master/libavutil) library.

`lzo-wasm` works in the browser. For Node.js, use [lzo-decompress](https://github.com/tidepool-org/lzo-decompress) instead.

This software uses code of [FFmpeg](http://ffmpeg.org) licensed under the [LGPLv3](https://www.gnu.org/licenses/lgpl.html) and its source can be downloaded [here](https://github.com/FFmpeg/FFmpeg/tree/master/libavutil).

## Usage

```js
import lzo from 'lzo-wasm';

const decompressed = await lzo.decompress(input, length);
```

## Building from source

Run `build.sh`.

Scripts:

- `build.sh` - clones the FFmpeg repo and builds from source using Docker
- `build-lzo-with-docker.sh` - builds from source using Docker
- `build-lzo.sh` - builds if Emscripten is available


## Example in browser

- In `wasm/`, run `python3 -m http.server 8080`
- In your browser, open `http://localhost:8080/main.html`
- Click `Choose File` and select the `y.lzo` LZO-compressed file
- Check your web console for the decompressed data
