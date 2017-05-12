console.log('I\'m a pretty static file');

let headers = new Headers();

fetch('/api/score', {
  method: 'GET',
  headers: headers
})
  .then( (response) => (response.text()))
  .then( (text) => { console.log(text); });
