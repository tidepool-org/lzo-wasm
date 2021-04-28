#!/bin/bash -x

# verify Emscripten version
emcc -v

# configure FFMpeg with Emscripten
CFLAGS="-s USE_PTHREADS -O3"
LDFLAGS="$CFLAGS -s INITIAL_MEMORY=33554432" # 33554432 bytes = 32 MB
CONFIG_ARGS=(
  --target-os=none        # use none to prevent any os specific configurations
  --arch=x86_32           # use x86_32 to achieve minimal architectural optimization
  --enable-cross-compile  # enable cross compile
  --disable-x86asm        # disable x86 asm
  --disable-inline-asm    # disable inline asm
  --disable-stripping     # disable stripping
  --disable-programs      # disable programs build (incl. ffplay, ffprobe & ffmpeg)
  --disable-doc           # disable doc
  --extra-cflags="$CFLAGS"
  --extra-cxxflags="$CFLAGS"
  --extra-ldflags="$LDFLAGS"
  --nm="llvm-nm -g"
  --ar=emar
  --as=llvm-as
  --ranlib=llvm-ranlib
  --cc=emcc
  --cxx=em++
  --objcc=emcc
  --dep-cc=emcc
)
emconfigure ./FFmpeg/configure "${CONFIG_ARGS[@]}"

# build dependencies
emmake make -j4

# build lzo-wasm
ARGS=(
  -Llibavutil
  -Qunused-arguments
  -o wasm/lzo-wasm.js wasm/module.c
  -lavutil
  -O3                                           # Optimize code with performance first
  -s USE_SDL=2                                  # use SDL2
  -s USE_PTHREADS=1                             # enable pthreads support
  -s PROXY_TO_PTHREAD=1                         # detach main() from browser/UI main thread
  -s INVOKE_RUN=0                               # not to run the main() in the beginning
  -s EXPORTED_RUNTIME_METHODS="[cwrap, setValue, getValue]"   # export preamble funcs
  -s EXPORTED_FUNCTIONS="[_malloc, _free]"
  -s INITIAL_MEMORY=33554432                    # 33554432 bytes = 32 MB
  -s ENVIRONMENT=web,worker                     # don't output Node.js code, it confuses webpack
  -s MODULARIZE=1
  -s EXPORT_ES6=1
  -s USE_ES6_IMPORT_META=0
  -s EXPORT_NAME='createModule'                 # createModule().then(function(Module) { })
)
emcc "${ARGS[@]}"
