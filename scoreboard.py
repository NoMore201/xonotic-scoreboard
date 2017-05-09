#!/usr/bin/env python3

import time
from xrcon.client import XRcon

def server_parse_output(data):
    print(data.decode('utf-8'))

# With a local xonotic server, a cycle of the while
# loop requires nearly 700 ms
def server_poll(server):
    while True:
        start=time.time()
        #time.sleep(1.0 - ((time.time() - start) % 1.0))
        try:
            data = server.execute('status')
        except ConnectionRefusedError:
            print('Connection lost, quitting..')
            quit()
        else:
            if data is not None:
                server_parse_output(data)
                print(time.time() - start)

def main():
    rcon = XRcon('127.0.0.1', 26000, 'admin')

    # connect() is not enough: to check if the server
    # is up it is necessary to call execute()
    rcon.connect()
    try:
        rcon.execute('status')
    except ConnectionRefusedError:
        print('Cannot connect to the server')
        quit()
    else:
        server_poll(rcon)

if __name__ == "__main__":
    main()
