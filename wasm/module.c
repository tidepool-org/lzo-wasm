#include <stdlib.h>
#include <emscripten.h>
#include "lzo.h"

EMSCRIPTEN_KEEPALIVE
unsigned char * decompress(const void *inputBuffer, int inputBuffer_len, unsigned long outputBufferSize) {
  unsigned char *outputBuffer = malloc(outputBufferSize + AV_LZO_OUTPUT_PADDING);
  int remaining = outputBufferSize;
  int inputBufferSize = inputBuffer_len + AV_LZO_INPUT_PADDING;

  int ret = av_lzo1x_decode(outputBuffer, &remaining, inputBuffer, &inputBufferSize);

  if (ret != 0) {
    EM_ASM(
      throw new Error('Failed to decompress');
    );
  }

  return outputBuffer;
}
