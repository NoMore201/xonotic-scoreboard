#!/usr/bin/env python3

from flask import Flask, render_template, abort
from rcon import Server

# application setup

app = Flask(__name__)
server = Server()

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
        abort(503)
    else:
        return data


app.run(debug=True)
