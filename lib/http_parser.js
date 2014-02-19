var supportedRequestTypes = [
  "GET",
  "POST",
  "PUT",
  "DELETE"
];

function parse (data) {
  var parts = data.split("\r\n\r\n");

  // break the lines up for parts[0] - first should be request, rest should be headers
  var lines = parts.shift().split("\r\n");

  var request = lines.shift();
  var requestPart = request.split(" ");

  // check the request type regardless of completion
  if (supportedRequestTypes.indexOf(requestPart[0]) === -1) {
    return {
      "status":   "unknown request type",
      "type":     requestPart[0],
      "fragment": data
    };
  }

  // if the header is not complete, return status for further processing
  if (parts.length < 1) {
    return {
      "status":   "not ready",
      "type":     requestPart[0],
      "fragment": data
    };
  }

  var headers = { };

  // break out the headers
  for (var i = 0; i < lines.length; i++) {
    var values = lines[i].split(":");
    var key = values.shift();

    headers[key] = values.join(":").replace(/^\s+/, "");
  }

  return {
    "fragment": parts.join("\r\n"),
    "headers":  headers,
    "method":   requestPart[0],
    "url":      requestPart[1],
    "version":  processVersion(requestPart[2])
  };
}

function processVersion (version) {
  if (version === undefined) {
    return "1.1";
  }

  var parts = version.split("/");
  if (parts[1]) {
    return parts[1];
  }

  return "1.1";
}
module.exports = exports = parse;