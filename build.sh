#!/bin/bash -x

git clone --depth 1 --branch n4.3.1 https://github.com/FFmpeg/FFmpeg .

bash ./build-lzo-with-docker.sh
