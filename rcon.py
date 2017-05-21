from xrcon.client import XRcon
import re
import json


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
        # For each of them, remove multiple spaces (see below)
        scorelines = [re.sub(r'\ +', ' ', x)
                      for x in start if x != '' and x[0] == '#']
        # initialize output
        parsed_data = {'name': '', 'num': 0, 'players': [], 'stats': ''}
        # select the part of the string which contains the number
        # of players and then search for the numerical part to extract
        num = re.search(r'\d+', start[5][10:19]).group(0)
        parsed_data['num'] = num
        # regexes are used to remove sequences of more than
        # one space, so the string can be easily split(' ')
        # without headaches
        name = re.sub(r'\ +', ' ', start[0]).split(' ')[1:]
        name = ' '.join(name)
        parsed_data['name'] = name
        stats = re.sub(r'\ +', ' ', start[4]).split(' ')[1:]
        stats = ' '.join(stats)
        parsed_data['stats'] = stats
        if scorelines != []:
            players = []
            for x in scorelines:
                p = {'nick': '', 'score': -1, 'time': ''}
                temp = x.split(' ')[::-1]
                p['nick'] = ' '.join(temp[2:-1][::-1])
                p['score'] = int(temp[1])
                p['time'] = temp[0]
                players.append(p)
            parsed_data['players'] = sorted(players,
                                            key=lambda x: x['score'],
                                            reverse=True)
        return parsed_data

    def get_status(self):
        data = self.server.execute('status')
        if data is not None:
            return json.dumps(self.parse(data.decode('utf-8')))
        else:
            return ""
