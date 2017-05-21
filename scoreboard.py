#!/usr/bin/env python3

from flask import Flask, render_template
from rcon import Server
from optparse import OptionParser

# application setup
app = Flask(__name__)

# please chromium, don't cache static data
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def render_page():
    return render_template('index.html')


@app.route('/api/score', methods=['GET'])
def get_score():
    try:
        data = server.get_status()
    except ConnectionRefusedError:
        return ""
    return data


if __name__ == '__main__':
    parser = OptionParser()
    parser.add_option('-d', '--debug', action='store_true',
                      dest='debug', default=False,
                      help='run server with debugging enabled')
    parser.add_option('-x', '--host', dest='host', default='127.0.0.1',
                      help='the host where xonotic server is running')
    parser.add_option('-p', '--port', type='int', dest='port', default=26000,
                      help='port where xonotic server is listening')
    parser.add_option('-s', '--password', dest='password', default='admin',
                      metavar='PASS',
                      help='rcon password defined in xonotic server.cfg')
    (options, args) = parser.parse_args()

    server = Server(options.host, options.port, options.password)
    if options.debug is True:
        app.run(debug=True)
    else:
        app.run()
