(function() {
'use strict';

var http = require('http');
var exec = require('child_process').exec;

var healthState = {
  irssi: "running"
};

var server = http.createServer(function httpListener(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(healthState));
}).listen(29990);

// Crude process checker
setInterval(function checkProcesses() {
  exec('ps -ef | grep "irssi" | wc -l', function(err, stdout, stderr) {
    var numProcess = Number(stdout);
    if(numProcess < 3) {
      healthState.irssi = 'not running';
    }
    else {
      healthState.irssi = 'running';
    }
  });
}, 10000);

})();
