var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator("");

var http = require('https');

function tokenPayload(event) {
  var _payload = {};

  _payload.uid = event.email;
  _payload.name = event.name;
  _payload.lastname = event.lastname;
  _payload.timestamp = new Date();
  _payload.nbf = parseInt(event.nbf);
  _payload.exp = parseInt(event.exp);
  _payload.admin = event.admin ? event.admin : false;

  return _payload;
}

console.log("Loading event");
exports.handler = function(event, context) {
  console.log( JSON.stringify(event, null, 2) );

  var token = tokenGenerator.createToken(tokenPayload(event));

  //let's add the link to the event
  event.link = "http://live.rightbrainnetworks.com?tkn=" + token;

  //JSON to query string FN
  function jsonToQueryString(json) {
    return '?' +
      Object.keys(json).map(function(key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      }).join('&');
  }

  //fire a request to send the email
  http.get('https://xxxxxx05.execute-api.us-east-1.amazonaws.com/prod/sendCreds' + jsonToQueryString(event), function (result) {
    console.log('Success, with: ' + result.statusCode);
    context.done(null, token);
  }).on('error', function (err) {
    console.log('Error, with: ' + err.message);
    context.done("Failed");
  });
};
