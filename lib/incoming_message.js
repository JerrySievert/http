var util   = require('util'),
    events = require('events');



function IncomingMessage (connection) {
  this.connection = connection;

  var self = this;

  this.on("close", function () {
    self.emit("close");
  });

  this.on("error", function (e) {
    self.emit("error", e);
  });
}

util.inherits(IncomingMessage, events.EventEmitter);

