let playerInfoBox =
  document.getElementById('player-info');
let nameInfoBox =
  document.getElementById('name-info');
let serverInfoBox =
  document.getElementById('server-stats');
let scoreBox =
  document.getElementById('score');

function parseData(str) {
  if (str === "") {
    // TODO: set error msg
    return;
  }

  let start = str.split('\n');

  let scoreLines = start
    .splice(7)
    .filter(s => {
      return (s.search(/^\#/) !== -1);
    });

  let players =
    scoreLines.map(str => {
      /*
       *  String output will be something like:
       *  {1}    {2}      {3}         {4}
       *  #<num> nickname <int:score> <time_elapsed>
       *
       *  {1} we can ignore this
       *  {2} nickname can cause problems (see below)
       *  {3} integer representing score
       *  {4} time since this player joined the game
       */

      // replace group of 2+ spaces with 1 space
      // then split the string using spaces as separators.
      // In this way we will get all sections listed before
      // in an array.
      // The array is then reversed for convenience
      let prepared = str
        .replace(/\ +/g, ' ')
        .split(' ')
        .reverse();

      // why this? If name contains spaces, it
      // will be split in multiple arrays. Here
      // we check the portion of array containing
      // the nickname:
      //
      // * If it has length 1, the nickname has no spaces
      //   and we can return it as is
      // * If it has length >1, the we re-reverse it and join,
      //   in order to restore the original spaces
      let nickname =
        prepared.slice(2, prepared.length-1);

      return {
        "nickname": nickname.length === 1 ?
                    nickname[0] :
                    nickname.reverse().join(' '),
        "score": parseInt(prepared[1]),
        "time": prepared[0]
      };

    });

  // fetch the part of the player string
  // where active players are saved
  let playersNum = start[5]
    .substring(10, 18)
    .match(/\w*/);

  let serverName = start[0]
    .replace(/\ +/g, ' ')
    .split(' ')
    .slice(1)
    .join(' ');

  let serverInfo = start[4]
    .replace(/\ +/g, ' ')
    .split(' ')
    .slice(1)
    .join(' ');

  nameInfoBox.innerHTML =
    '<span>Server name: </span>' +
    serverName;

  playerInfoBox.innerHTML =
    '<span># of players: </span>' +
    playersNum;

  serverInfoBox.innerHTML =
    serverInfo;

  if (players !== []) {

    // sort players from highest score
    // to the lowest
    let sorted = players.sort((a,b) => {
      return a.score < b.score;
    });

    let i = 0;
    let table = "";

    // Printing players info
    // TODO: implement a table
    table =
      '<table id="scoreTable"><thead><tr>' +
      '<th>Nickname</th><th>Score</th>' +
      '<th>Play Time</th></tr></thead><tbody>';

    for (i = 0; i < sorted.length; i++) {
      table +=
        '<tr>' +
        '<td>' + sorted[i].nickname + '</td>' +
        '<td>' + sorted[i].score    + '</td>' +
        '<td>' + sorted[i].time     + '</td></tr>';
    }

    table +=
      '</tbody></table>';
    scoreBox.innerHTML = table;
  }
}

function update() {
  let headers = new Headers();

  fetch('/api/score', {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      return (response.status === 503) ?
        "" : response.text();
    })
    .then(text => {
      parseData(text);
    });
}

// query takes ~ 750ms to complete
// TODO: run script ~ every 2 seconds
update();
