let messageBox =
  document.getElementById('message');

function parseData(str) {
  if (str === "") {
    messageBox.innerHTML =
      'Cannot reach server';
    return;
  }
 
  let scoreLines = str.split('\n')
    .splice(7)
    .filter((s) => {
      return (s.search(/^\#/) !== -1);
    });

  // fetch the part of the player string
  // where active players are saved
  let playersNum = str
    .split('\n')[5]
    .substring(10, 18)
    .match(/\w*/);
  
  // Debug output on the page
  messageBox.innerHTML += 
    '<p>Num of players: ' +
    playersNum.toString() +
    '</p>';
  scoreLines.forEach((s) => {
    messageBox.innerHTML +=
      '<br>' + s;
  });

  // Here we should fetch the players data
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
