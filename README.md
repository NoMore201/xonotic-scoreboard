# Xonotic Web Scoreboard

## Description

Simple xonotic web scoreboard written using Python3 and Flask (client written using standard html5+css+js, no libraries). Check example.png for a preview :) .

## Requirements & Install

* Python 3
* Flask and XRcon packages: `pip install Flask XRcon`
* A modern web-browser (Firefox/chromium)

Using a virtualenv:
```
pip install -r requirements.txt
./scoreboard
```

```
Usage: scoreboard.py [options]

Options:
  -h, --help            show this help message and exit
  -d, --debug           run server with debugging enabled
  -x HOST, --host=HOST  the host where xonotic server is running
  -p PORT, --port=PORT  port where xonotic server is listening
  -r PASS, --rcon=PASS  rcon password defined in xonotic server.cfg
```

## Required server config

The server config file, located in `$HOME/.xonotic/data/server.cfg`, must have the
following settings for the rcon protocol to work properly

    port 26000 // be sure to provide same port to scoreboard
    net_address 0.0.0.0
    rcon_password "yoyo" // without a password rcon protocol is disabled

Usually if you installed xonotic through your distro package manager, you can find a sample
config file in `/usr/share/xonotic/server`, which you can edit.

