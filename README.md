# Xonotic Web Scoreboard

## Description

Simple xonotic web scoreboard written using Python3 and Flask (client written using standard html5+css+js, no libraries).

## Requirements

* Python 3
* Flask and XRcon packages: `pip3 install Flask XRcon`
* A modern web-browser (Firefox/chromium)

## Usage

```
Usage: scoreboard.py [options]

Options:
  -h, --help            show this help message and exit
  -d, --debug           run server with debugging enabled
  -x HOST, --host=HOST  the host where xonotic server is running
  -p PORT, --port=PORT  port where xonotic server is listening
  -u USER, --user=USER  rcon user defined in xonotic server.cfg
```

