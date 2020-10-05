/*jshint esversion: 10 */

// Primary file for the API

// Dependencies
const http = require("http");
const url = require("url");

// Server should respond to all requests with a string
let server = http.createServer(function (req, res) {
  // Get the path
  let parsedURL = url.parse(req.url, true);

  // Get path
  let path = parsedURL.pathname;

  // Trim off any extraneous slashes with regex
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Send the response
  res.end("Done. Check your response.\n");

  // Log the requested path
  console.log(`Request received on path: ${trimmedPath}`);
});

// Start the server and have it listen on port 3000
server.listen(3000, function () {
  console.log("The server is listening");
});
