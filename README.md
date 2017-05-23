# Xonotic Web Scoreboard

## Description

Simple xonotic web scoreboard written using Python3 and Flask (client written using standard html5+css+js, no libraries). Check example.png for a preview :) .

## Requirements

* Python 3
* Flask and XRcon packages: `pip3 install Flask XRcon`
* A modern web-browser (Firefox/chromium)

## !! Important notes !!

The xonotic server may give problems (`server denied rcon access to`) if the scoreboard is running on a different host (even if the ports are correctly forwarded and the rcon protocol is correctly set up). It is **recommended** to run the scoreboard on the same host as the xonotic server, and then access the web server from any host. The Flask web server is listening on port 5000.

```
Usage: scoreboard.py [options]

Options:
  -h, --help            show this help message and exit
  -d, --debug           run server with debugging enabled
  -x HOST, --host=HOST  the host where xonotic server is running
  -p PORT, --port=PORT  port where xonotic server is listening
  -r PASS, --rcon=PASS  rcon password defined in xonotic server.cfg
```

