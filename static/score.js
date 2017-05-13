function parseData(str) {
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
  document.body.innerHTML += 
    '<p>Num of players: ' +
    playersNum.toString() +
    '</p>';
  scoreLines.forEach((s) => {
    document.body.innerHTML +=
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
    .then((response) => (response.text()))
    .then((text) => {
      parseData(text);
    });
}

update();
