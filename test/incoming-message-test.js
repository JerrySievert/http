var vows   = require('vows'),
    assert = require('assert'),
    fs     = require('fs');

var IncomingMessage = require(__dirname + '/../lib/incoming_message').IncomingMessage;

vows.describe("incoming message test").addBatch({
  'when dealing with a valid request that has a header': {
    topic: function () {
      var packet = fs.createReadStream(__dirname + '/input/request_with_header.txt');
      var message = new IncomingMessage(packet);

      var self = this;
      message.on("connect", function (data) { self.callback(null, data); });
    },
    'the header is parsed and a connect is emitted': function (topic) {
      assert.equal(topic.url, '/index.html');
    }
  },
  'when dealing with a valid request that has a header and data': {
    topic: function () {
      var packet = fs.createReadStream(__dirname + '/input/request_with_header_and_data.txt');
      var message = new IncomingMessage(packet);

      var self = this;
      message.on("connect", function (data) { self.callback(null, data); });
    },
    'the header is parsed and a connect is emitted': function (topic) {
      assert.equal(topic.url, '/index.html');
    },
    'the read returns the data': function (topic) {
      assert.equal(topic.read(), 'Some data!');
    }
  }
}).export(module);