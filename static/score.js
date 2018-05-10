const playerInfoBox = document.getElementById('player-info');
const nameInfoBox = document.getElementById('name-info');
const serverInfoBox = document.getElementById('server-stats');
const scoreBox = document.getElementById('score');
const errorBox = document.getElementById('error-msg');
const mapInfoBox = document.getElementById('map-info');

const headers = new Headers();
headers.append("Content-Type", "text/plain");

function resetView() {
  playerInfoBox.innerHTML = "";
  nameInfoBox.innerHTML = "";
  serverInfoBox.innerHTML = "";
  scoreBox.innerHTML = "";
  mapInfoBox.innerHTML = "";	
  errorBox.innerHTML = "Waiting for server...";
}

function parseScore(score) {
  return score === -666 ? 'Spect' : parseInt(score);
}

function parseData(data) {
  if (data === "") {
    resetView();

    return;
  }

  data = JSON.parse(data);

  data.players.sort( function(a, b) {
    return parseInt(b.score) - parseInt(a.score);
  });

  errorBox.innerHTML = "";

  serverInfoBox.innerHTML = data.stats;

  nameInfoBox.innerHTML = '<span>Name: </span>' +
                          data.name;
  playerInfoBox.innerHTML = '<span>Players: </span>' +
                            parseInt(data.num);
  mapInfoBox.innerHTML = '<span>Map: </span>' +
                         data.map;

  if (data.players.length !== 0) {
    let table = "";
    table = '<table id="scoreTable"><thead><tr>' +
            '<th class="tdname">Nickname</th><th class="tdscore">Score</th>' +
            '<th class="tdtime">Play Time</th></tr></thead><tbody>';

    for (i = 0; i < data.players.length; i++) {
      table += '<tr>' +
              '<td class="tdname">'  + data.players[i].nick  + '</td>' +
              '<td class="tdscore">' + parseScore(data.players[i].score) + '</td>' +
              '<td class="tdtime">'  + data.players[i].time  + '</td></tr>';
    }

    table += '</tbody></table>';
    scoreBox.innerHTML = table;
  }
}

function update() {

  fetch('/api/score', {
    method: 'GET',
    headers: headers
  }).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw Error(response.statusText);
    }
  }).then(text => {
    parseData(text);
  }).catch(error => {
    resetView();
  });

}

// query takes ~ 750ms to complete
update();
setInterval(update, 3000);
