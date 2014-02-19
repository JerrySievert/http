var vows   = require('vows'),
    assert = require('assert');

var parse = require(__dirname + '/../lib/http_parser');

vows.describe("parser test").addBatch({
  'when passed a fully ready to parse header': {
    topic: function () {
      return parse("GET /index.html HTTP/1.1\r\nHeader1: foo\r\nHeader2: bar\r\n\r\ndata");
    },
    'method should parse': function (topic) {
      assert.equal(topic.method, "GET");
    },
    'version should equal 1.1': function (topic) {
      assert.equal(topic.version, "1.1");
    }
  }
}).export(module);