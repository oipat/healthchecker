
(function init() {
  'use strict';

  var key;
  var readline = require('readline');
  var rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt('Gief password: ');
  rl.prompt();
  rl.on('line', function(line) {
      key = line;
      rl.close();
  }).on('close',function(){
    app(key);
  });
}());

function app(key) {
'use strict';

var http = require('http');
var https = require('https');
var config = require('./config.js');
var querystring = require('querystring');
var crypto = require('crypto');

var errorCount = 0;
var errorState = false;

var algorithm = 'aes-256-cbc';
var decipher = crypto.createDecipher(algorithm, key);
var apiKey = decipher.update(config.PUSHBULLET_KEY, 'base64', 'utf8') + decipher.final('utf8');
// Base64 encode for HTTP Basic auth.
var auth = new Buffer(apiKey + ':').toString('base64');

function sendNotification(body) {
  var postData = JSON.stringify({
    type: "note",
    title: "Healthcheck",
    body: body
  });

  var options = {
    host: config.PUSHBULLET_API_HOST,
    port: 443,
    path: config.PUSHBULLET_API_ENDPOINT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
      'Authorization': 'Basic ' + auth
    }
  };

  https.request(options, function cb(response) {
    response.setEncoding('utf-8');
    response.on('data', function(data) {
    });
  }).on('error', function(err) {
  }).write(postData);
}

setInterval(
  function intervalRequest() {
    var options = {
      host: config.TARGET_HOSTNAME,
      port: config.TARGET_PORT,
      path: ''
    };
    var req = http.request(options, function cb(response) {
      response.setEncoding('utf-8');
      response.on('data', function(data) {
        errorCount = 0;
        if(errorState) {
          sendNotification("Server has recovered.");
          errorState = false;
        }
      });
    })
    .on('error', function(err) {
      if(errorCount > 1) {
        if(!errorState) {
          errorState = true;
          sendNotification('Server down.');
        }
      }
      errorCount++;
    });
    // Set request timeout to 5 sec
    req.setTimeout(5000, function timeout() {
      req.abort();
    });
    req.end();
  }, 2000);
}
