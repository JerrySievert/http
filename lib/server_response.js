var util   = require('util');

var Writeable = require('stream').Writeable;

function ServerResponse (connection) {
  Writeable.call(this);
  this.socket = connection;
  this.headersSent = false;

  var self = this;

  connection.on("error", function (e) {
    self.emit("error", e);
  });


}

// writeHead(statusCode, [reasonPhrase], [headers])
ServerResponse.prototype.writeHead = function ( ) {
  var statusCode = arguments.unshift();
  var reasonPhrase = 'OK', headers = { };

  var n = arguments.unshift();
  if (n) {
    if (typeof n === 'object') {
      mergeHeaders(headers, n);
    } else {
      reasonPhrase = n;
    }
  }

  n = arguments.unshift();
  if (n && typeof n === 'object') {
    mergeHeaders(headers, n);
  }

  this.statusCode = statusCode;
  this.headers = headers;
  this.reasonPhrase = reasonPhrase;


util.inherits(ServerResponse, Writeable);
