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


def get_players_num(output):
    """
    Take line 5 of the output, select the portion
    which contains the active players, and get the number
    """
    num = re.search(r'\d+', output[5][10:19]).group(0)
    return num


def get_stats(output):
    """
    """
    stats = rm_spaces(output[4]).split(' ')[1:]
    stats = ' '.join(stats)
    return stats


def get_map(output):
    tmap = rm_spaces(output[3]).split(' ')[1]
    return tmap

def get_name(output):
    """
    """
    name = rm_spaces(output[0]).split(' ')[1:]
    name = ' '.join(name)
    return name

def parse_player(string):
    player = {'nick': '', 'score': -1, 'time': ''}
    temp = string.split(' ')[::-1]
    player['nick'] = ' '.join(temp[2:-1][::-1])
    player['score'] = int(temp[1])
    player['time'] = temp[0]
    return player


def get_score(output):
    """
    """
    scorelines = [rm_spaces(x) for x in output
                  if x != '' and x[0] == '#']
    if scorelines != []:
        players = []
        for x in scorelines:
            players.append(parse_player(x))
        return players
    return []


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
        # split the output string for each line
        start = data.split('\n')
        # non-empty lines starting with a '#' are the actual scoreboard.
        scorelines = [re.sub(r'\ +', ' ', x)
                      for x in start if x != '' and x[0] == '#']
        parsed_data = {'name': '', 'num': 0,
                       'players': [], 'stats': '',
                       'map': ''}
        parsed_data['num'] = get_players_num(start)
        parsed_data['name'] = get_name(start)
        parsed_data['stats'] = get_stats(start)
        parsed_data['players'] = sorted(get_score(start),
                                        key=lambda x: x['score'],
                                        reverse=True)
        parsed_data['map'] = get_map(start)
        return parsed_data

    def get_status(self):
        data = self.server.execute('status')
        if data is not None:
            return json.dumps(self.parse(data.decode('utf-8')))
        else:
            return ""
