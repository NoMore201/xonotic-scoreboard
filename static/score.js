let playerInfoBox = document.getElementById('player-info');
let nameInfoBox = document.getElementById('name-info');
let serverInfoBox = document.getElementById('server-stats');
let scoreBox = document.getElementById('score');
let errorBox = document.getElementById('error-msg');

function resetView() {
  playerInfoBox.innerHTML = "";
  nameInfoBox.innerHTML = "";
  serverInfoBox.innerHTML = "";
  scoreBox.innerHTML = "";
  
  errorBox.innerHTML = "Waiting for server...";
}

function parseData(data) {
  if (data === "") {
    resetView();
    
    return;
  }

  data = JSON.parse(data);

  errorBox.innerHTML = "";

  serverInfoBox.innerHTML = data.stats;

  nameInfoBox.innerHTML = '<span>Server name: </span>' +
                          data.name;
  playerInfoBox.innerHTML = '<span># of players: </span>' +
                            parseInt(data.num);

  if (data.players.length !== 0) {
    let table = "";
    table = '<table id="scoreTable"><thead><tr>' +
            '<th class="tdname">Nickname</th><th class="tdscore">Score</th>' +
            '<th class="tdtime">Play Time</th></tr></thead><tbody>';

    for (i = 0; i < data.players.length; i++) {
      table += '<tr>' +
              '<td class="tdname">'  + data.players[i].nick  + '</td>' +
              '<td class="tdscore">' + data.players[i].score + '</td>' +
              '<td class="tdtime">'  + data.players[i].time  + '</td></tr>';
    }

    table += '</tbody></table>';
    scoreBox.innerHTML = table;
  }
}

// TODO: handle fetch error
function update() {
  let headers = new Headers();
  headers.append("Content-Type", "text/plain");

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
setInterval(update, 5000);
