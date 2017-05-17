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

  let players =
    scoreLines.map(str => {
      /*
       *  String output will be something like:
       *  {1}    {2}      {3}         {4}
       *  #<num> nickname <int:score> <time_elapsed>
       *  
       *  {1} we can ignore this
       *  {2} nickname can cause problems while parsing,
       *      especially if it contains some spaces. It
       *      will be parsed last
       *  {3} integer representing score
       *  {4} time since this player joined the game
       */

      let prepared =
        str.replace(/\ +/g, ' ') // replace group of spaces with 1
           .split(' ') //divide the string into groups (see above)
           .reverse();

      let nickname =
        prepared.slice(2, prepared.length-1);

      return {
        "nickname": nickname.length === 1 ?
	      nickname[0] :
	      nickname.join(),
        "score": prepared[1],
        "time": prepared[0]
      };

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
  
  // Printing players info
  players.forEach(pl => {
    messageBox.innerHTML +=
      '<p>' + pl.nickname +
      ' ' + pl.score +
      ' ' + pl.time + '</p>';
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
