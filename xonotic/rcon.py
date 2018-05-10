from xrcon.client import XRcon
import re
import json

# EXAMPLE OUTPUT
# host:     Xonotic 0.8.2 Server
# version:  Xonotic build 15:21:41 Apr  3 2017 - release (gamename Xonotic)
# protocol: 3504 (DP7)
# map:      stormkeep
# timing:   62.2% CPU, 3.53% lost, offset avg 7.8ms, max 100.6ms, sdev 18.3ms
# players:  6 active (16 max)
#
# #1   asdlolasd           0   0:00:28
#    127.0.0.1:34027
# #2   [BOT]Necrotic       0   0:00:23
#    botclient
# #3   [BOT]Discovery      0   0:00:23
#    botclient
# #4   [BOT]Gator          0   0:00:23
#    botclient
# #5   [BOT]Death          0   0:00:23
#    botclient
# #6   [BOT]Airhead        1   0:00:23
#    botclient


def rm_spaces(string):
    """
    Trim contiguous spaces, and substitute them
    with a single space
    """
    return re.sub(r'\ +', ' ', string)


def get_players_num(lines):
    """
    Take line 5 of the output, select the portion
    which contains the active players, and get the number
    """
    return lines[5].split(maxsplit=2)[1]


def get_stats(lines):
    return lines[4].split(maxsplit=1)[1]

def get_map(lines):
    return lines[3].split(maxsplit=1)[1]

def get_name(lines):
    return lines[0].split(maxsplit=1)[1]

def parse_player(string):
    splitted = string.split()
    return {'nick': ' '.join(splitted[1:][:-2]),
           'score': splitted[-2],
           'time': splitted[-1]}

def get_score(lines):
    players = []
    for x in lines:
        players.append(parse_player(x))
    return players


class Server(object):

    def __init__(self, host='127.0.0.1', port=26000, rcon_pass='admin'):
        rcon = XRcon(host, port, rcon_pass)

        # connect() is not enough: to check if the server
        # is up it is necessary to call execute()
        rcon.connect()
        try:
            rcon.execute('status')
        except ConnectionRefusedError:
            print('Cannot connect to server')
        self.server = rcon


    def parse(self, data):
        # non-empty lines starting with a '#' are the actual scoreboard.
        lines = [rm_spaces(x)
                 for x in data.split('\n')
                 if x != '']
        scorelines = [x for x in lines if x[0] == '#']
        return {'name': get_name(lines),
                'num': get_players_num(lines),
                'players': get_score(scorelines),
                'stats': get_stats(lines),
                'map': get_map(lines)}

    def get_status(self):
        data = self.server.execute('status')
        if data is not None:
            return json.dumps(self.parse(data.decode('utf-8')))
        else:
            return ""
