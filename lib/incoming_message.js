var util   = require('util'),
    events = require('events'),
    parser = require('./http_parser');

var Readable = require('stream').Readable;


function IncomingMessage (connection) {
  this.connection = connection;
  this._ready = false;
  this._incoming = "";

  var self = this;

  this.on("close", function () {
    self.emit("close");
  });

  this.on("error", function (e) {
    self.emit("error", e);
  });

  this.on("data", function (data) {
    if (self._ready) {
      self.push(data);
    } else {
      // parse the request, prepending any existing data
      var results = parser(self._incoming + data);

      if (results.method) {
        self._ready = true;

        self.emit("connect", results);

        if (results.fragment) {
          setImmediate(function () {
            self.emit("data", results.fragment);
          });
        }
      }
    }
  });
}

util.inherits(IncomingMessage, events.EventEmitter);
util.inherits(IncomingMessage, Readable);

