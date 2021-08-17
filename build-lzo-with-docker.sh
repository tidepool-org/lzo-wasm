#!/bin/bash -x

EM_VERSION=2.0.18

docker pull emscripten/emsdk:$EM_VERSION
docker run \
  -v $PWD:/src \
  -v $PWD/cache-wasm:/emsdk_portable/.data/cache/wasm \
  emscripten/emsdk:$EM_VERSION \
  sh -c 'bash ./build-lzo.sh'
