#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('tBp-Web:server');
var https = require('https');
var http = require('http');
var fs = require('fs');

const options = {
  key: fs.readFileSync('rsa/server.key'),
  cert: fs.readFileSync('rsa/server.crt'),
  passphrase: 'bee98eb898ce2b220ec15ab79680f2a6ae849a1d5cadaed48b863bdaf7f2dd59',
};

/**
 * Get port from environment and store in Express.
 */

var port = app.config.httpsPort;
app.set('port', port);

/**
 * Create HTTPS and HTTP servers.
 */

var server = https.createServer(options, app);
var redirector = http.createServer(redirectToHttps);

/**
 * Listen on provided ports, on all network interfaces.
 */

server.listen(port, () =>
  console.log(`Server listening on port ${port}`));

redirector.listen(app.config.httpPort, () =>
  console.log(`HTTP redirector listening on port ${app.config.httpPort}`));

for (var server of [server, redirector]) {
  server.on('error', onError);
  server.on('listening', onListening);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function redirectToHttps(req, res) {
  res.writeHead(301, {
    'Location': `https://${req.headers.host}${req.url}`,
  });

  res.end();
}

module.exports = app
