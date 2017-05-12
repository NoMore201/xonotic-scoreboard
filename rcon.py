from xrcon.client import XRcon


class Server(object):

    def __init__(self, host='127.0.0.1', port='26000', rcon_user='admin'):
        rcon = XRcon(host, port, rcon_user)

        # connect() is not enough: to check if the server
        # is up it is necessary to call execute()
        rcon.connect()
        try:
            rcon.execute('status')
            self.server = rcon
        except ConnectionRefusedError:
            print('Cannot connect to server')
            quit()

    def get_status(self):
            return self.server.execute('status').decode('utf-8')
