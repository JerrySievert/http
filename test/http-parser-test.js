var vows   = require('vows'),
    assert = require('assert');

var parse = require(__dirname + '/../lib/http_parser');

vows.describe("parser test").addBatch({
  'when passed a fully ready to parse header': {
    topic: function () {
      return parse("GET /index.html HTTP/1.1\r\nHeader1: foo\r\nHeader2: bar\r\n\r\n");
    },
    'method should parse': function (topic) {
      assert.equal(topic.method, "GET");
    },
    'version should equal 1.1': function (topic) {
      assert.equal(topic.version, "1.1");
    },
    'headers should parse correctly': function (topic) {
      assert.equal(topic.headers['Header1'], 'foo');
      assert.equal(topic.headers['Header2'], 'bar');
    },
    'url should be correct': function (topic) {
      assert.equal(topic.url, '/index.html');
    }
  },
  'when passed a full http request': {
    topic: function () {
      return parse("GET /index.html HTTP/1.1\r\nHeader1: foo\r\nHeader2: bar\r\n\r\ndata");
    },
    'method should parse': function (topic) {
      assert.equal(topic.method, "GET");
    },
    'version should equal 1.1': function (topic) {
      assert.equal(topic.version, "1.1");
    },
    'headers should parse correctly': function (topic) {
      assert.equal(topic.headers['Header1'], 'foo');
      assert.equal(topic.headers['Header2'], 'bar');
    },
    'url should be correct': function (topic) {
      assert.equal(topic.url, '/index.html');
    },
    'the fragment should be returned': function (topic) {
      assert.equal(topic.fragment, 'data');
    }
  },
  'when passed a partial http request': {
    topic: function () {
      return parse("GET /index.html HTTP/1.1\r\nHeader1: foo\r\nHeader2: bar\r\n");
    },
    'not ready status should be returned': function (topic) {
      assert.equal(topic.status, 'not ready');
    },
    'the fragment should be returned': function (topic) {
      assert.equal(topic.fragment, 'GET /index.html HTTP/1.1\r\nHeader1: foo\r\nHeader2: bar\r\n');
    },
    'the type should still be parser': function (topic) {
      assert.equal(topic.type, 'GET');
    }
  }
}).export(module);