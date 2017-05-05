#!/usr/bin/env python3

import subprocess

enter_stmt = "is now playing"
players = []

def parse_line(line):
    global players
    index = line.find(enter_stmt)
    if index != -1:
        index -= 3
        name = line[:index]
        players += (name, 0)
        print("Player joined: " + name)

def main():
    server = subprocess.Popen(["xonotic-dedicated"], stdout=subprocess.PIPE, universal_newlines=True)
    while True:
        line = server.stdout.readline()
        parse_line(line)

if __name__ == "__main__":
    main()
