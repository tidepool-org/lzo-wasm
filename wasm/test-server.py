#!/usr/bin/env python

# == BSD2 LICENSE ==
# Copyright (c) 2021, Tidepool Project
#
# This program is free software; you can redistribute it and/or modify it under
# the terms of the associated License, which is identical to the BSD 2-Clause
# License as published by the Open Source Initiative at opensource.org.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the License for more details.
#
# You should have received a copy of the License along with this program; if
# not, you can obtain one from Tidepool Project at tidepool.org.
# == BSD2 LICENSE ==

import http.server
import webbrowser
import sys
import time
import threading

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()

        server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")

class StoppableHTTPServer(http.server.HTTPServer):
    def run(self):
        try:
            self.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            self.server_close()

http.server.SimpleHTTPRequestHandler.extensions_map['.wasm'] = 'application/wasm'

server = StoppableHTTPServer(("127.0.0.1", 8080),
                             MyHTTPRequestHandler)

# start server on a new thread so that we can open the browser
# on the current thread
thread = threading.Thread(None, server.run)
thread.start()

url = 'http://localhost:8000/tests.html'
webbrowser.open_new(url)

while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        server.shutdown()
        thread.join()
        sys.exit(0)
