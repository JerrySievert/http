var util   = require('util'),
    events = require('events'),
    parser = require('./http_parser');

var Readable = require('stream').Readable;


function IncomingMessage (connection) {
  Readable.call(this);
  this.socket = connection;
  this._ready = false;
  this._incoming = "";

  var self = this;

  connection.on("close", function () {
    self.emit("close");
  });

  connection.on("error", function (e) {
    self.emit("error", e);
  });

  connection.on("data", function (data) {
    if (self._ready) {
      self.push(data);
    } else {
      // parse the request, prepending any existing data
      self._incoming += data;
      var results = parser(self._incoming);

      if (results.method) {
        self._ready = true;

        self.httpVersion = results.version;
        self.url = results.url;
        self.method = results.method;

        if (results.fragment) {
          self.push(results.fragment);
        }

        self.emit("connect", self);
      }
    }
  });
}

util.inherits(IncomingMessage, Readable);

IncomingMessage.prototype._read = function () {
  return this.unshift();
};


exports.IncomingMessage = IncomingMessage;