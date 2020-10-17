/*jshint esversion: 10 */

// Primary file for the API

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
let _data = require("./lib/data");

// Test
// TODO delete this
_data.delete("test", "newFile", function (err) {
	console.log("This is the error \n", err);
});

// Instantiating the http server
let httpServer = http.createServer(function (req, res) {
	unifiedServer(req, res);
});

// Start the server and have it listen on port 3000
httpServer.listen(config.httpPort, function () {
	console.log(`The server is listening on port ${config.httpPort}`);
});

// Instantiating the https server
let httpsServerOptions = {
	key: fs.readFileSync("./https/key.pem"),
	cert: fs.readFileSync("./https/cert.pem"),
};
let httpsServer = https.createServer(httpsServerOptions, function (req, res) {
	unifiedServer(req, res);
});

// Start the server and have it listen on port 3000
httpsServer.listen(config.httpsPort, function () {
	console.log(`The server is listening on port ${config.httpsPort}`);
});

// All the server logic for both the http and https server
let unifiedServer = function (req, res) {
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
};

// Define the handlers
let handlers = {};

// Ping handler
handlers.ping = function (data, callback) {
	callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
	callback(404);
};

// Define the request handler
let router = {
	sample: handlers.sample,
};
