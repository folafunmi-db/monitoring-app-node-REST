/*jshint esversion: 10 */

// Library for storing and editing data

// Dependencies
const fs = require("fs"); // file system dependency
const path = require("path"); // to normalize the path various dependencies

// Container for the module to be exported

let lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, "../.data/");

// Write data to a file
lib.create = function (dir, file, data, callback) {
	// Open the file for writing
	fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", function (
		err,
		fileDescriptor
	) {
		// If there isn't an error and there is a file descriptor
		if (!err && fileDescriptor) {
			// Convert data to a string
			let stringData = JSON.stringify(data);

			// Write to file and close it
			fs.writeFile(fileDescriptor, stringData, function (err) {
				if (!err) {
					fs.close(fileDescriptor, function (err) {
						if (!err) {
							callback(false);
						} else {
							callback("Error closing new file");
						}
					});
				} else {
					callback("Error writing to new file");
				}
			});
		} else {
			callback("Could not create new file, it may already exist");
		}
	});
};

// Read data from a file
lib.read = function (dir, file, callback) {
	fs.readFile(
		lib.baseDir + dir + "/" + file + ".json",
		"utf8",
		function (err, data) {
			callback(err, data);
		}
	);
};

module.exports = lib;
