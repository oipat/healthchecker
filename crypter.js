(function init() {
  var key, text;
  var readline = require('readline');
  var rl = readline.createInterface(process.stdin, process.stdout);
  rl.question('Gief key: ', function setKey(line) {
    key = line;
    rl.question('Gief text: ', function setKey(line) {
      text = line;
      rl.close();
      app(text, key);
    });
  });
}());


function app(text, key) {
  var crypto = require('crypto');
  var cipher = crypto.createCipher('aes-256-cbc', key);
  var crypted = cipher.update(text, 'utf-8', 'base64');
  crypted += cipher.final('base64');
  console.log('Ciphertext (base64):');
  console.log(crypted);
  process.exit(0);
}
