var util   = require('util'),
    events = require('events'),
    parser = require('./http_parser');



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
      self.emit("data", data);
    } else {
      // parse the request, prepending any existing data
      var results = parser(self._incoming + data);
    }
  });
}

util.inherits(IncomingMessage, events.EventEmitter);

