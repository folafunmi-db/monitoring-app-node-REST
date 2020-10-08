/*jshint esversion: 10 */

// Primary file for the API

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

// Server should respond to all requests with a string
let server = http.createServer(function (req, res) {
  // Get the path
  let parsedURL = url.parse(req.url, true);

  // Get path
  let path = parsedURL.pathname;

  // Trim off any extraneous slashes with regex
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  let queryStringObject = parsedURL.query;

  // Get the HTTP method
  let method = req.method.toLowerCase();

  //  Get the headers as an object
  let headers = req.headers;

  // Get payloads, if any
  let decoder = new StringDecoder("utf-8");

  // To cater for streams
  let buffer = "";

  // Add to the buffer with each new stream of data object that's released
  // by the request
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });

  // On end of the request
  req.on("end", function () {
    buffer += decoder.end();

    // Choose the handler that should be used
    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called vack by the handler, or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      //Convert payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);

      // Send the response
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
});

// Start the server and have it listen on port 3000
server.listen(3000, function () {
  console.log("The server is listening");
});

// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
  // Callback a http status code and a payload object
  callback(406, { name: "sample handler" });
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define the request handler
let router = {
  sample: handlers.sample,
};
