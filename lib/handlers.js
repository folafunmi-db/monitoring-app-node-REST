// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

// Define the handlers
let handlers = {};

// Users handler
handlers.users = function (data, callback) {
	let acceptableMethods = ["post", "get", "put", "delete"];

	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for user methods
handlers._users = {};

// Users - Post
// Requirements: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
	// Check that all the fields are provided
	let firstName =
		typeof data.payload.firstName === "string" && data.payload.firstName.length > 1
			? data.payload.firstName.trim()
			: false;
	let lastName =
		typeof data.payload.lastName === "string" && data.payload.lastName.length > 1
			? data.payload.lastName.trim()
			: false;
	let phone =
		typeof data.payload.phone === "string" && data.payload.phone.length === 11
			? data.payload.phone.trim()
			: false;
	let password =
		typeof data.payload.password === "string" && data.payload.password.length > 0
			? data.payload.password.trim()
			: false;
	let tosAgreement =
		typeof data.payload.tosAgreement === "boolean" && data.payload.tosAgreement === true
			? true
			: false;

	if (firstName && lastName && phone && password && tosAgreement) {
		// Make sure that the user doesn't already exist
		_data.read("users", phone, function (err, data) {
			// If it doesn't exist then...
			if (err) {
				let hashedPassword = helpers.hash(password);

				if (hashedPassword) {
					//Create user object
					let userObject = {
						firstName,
						lastName,
						phone,
						hashedPassword,
						tosAgreement,
					};

					_data.create("users", phone, userObject, function (err) {
						if (!err) {
							callback(200);
						} else {
							callback(500);
							console.log("Could not create the user");
						}
					});
				} else {
					callback(500);
					console.log("Could not hash password");
				}
			} else {
				callback(400, { Error: "Phone number already exists" });
			}
		});
	} else {
		callback(400, { Error: "Missing required fields" });
	}
};

// Users - Put
// Required data: phone
// Optional data: firstName, lastName, password
// @TODO - only let an authenticated user update their object
handlers._users.put = function (data, callback) {
	let firstName =
		typeof data.payload.firstName === "string" && data.payload.firstName.length > 1
			? data.payload.firstName.trim()
			: false;
	let lastName =
		typeof data.payload.lastName === "string" && data.payload.lastName.length > 1
			? data.payload.lastName.trim()
			: false;
	let phone =
		typeof data.payload.phone === "string" && data.payload.phone.trim().length === 11
			? data.payload.phone.trim()
			: false;
	let password =
		typeof data.payload.password === "string" && data.payload.password.length > 0
			? data.payload.password.trim()
			: false;
	// Error out if the phone is invalid
	if (phone) {
		if (firstName || lastName || password) {
			// Lookup the user
			_data.read("users", phone, function (err, userData) {
				if (!err && userData) {
					if (firstName) {
						userData.firstName = firstName;
					}
					if (lastName) {
						userData.lastName = lastName;
					}
					if (password) {
						userData.hashedPassword = helpers.hash(password);
					}

					// Update the fields that are necessary
					_data.update("users", phone, userData, function (err) {
						if (!err) {
							callback(200, data.payload);
						} else {
							callback(500, { Error: "Error updating user details by phone number" });
						}
					});
				} else {
					callback(400, { Error: "Error finding user details by phone number" });
				}
			});
		}
	} else {
		callback(404, { Error: "Missing phone number" });
	}
};

// Users - Get
// Required data: phone
// Optional data: none
// @TODO - only let an authenticated user access their object
handlers._users.get = function (data, callback) {
	let phone =
		typeof data.queryStringObject.phone === "string" &&
		data.queryStringObject.phone.trim().length === 11
			? data.queryStringObject.phone.trim()
			: false;

	if (phone) {
		// Lookup the user
		_data.read("users", phone, function (err, data) {
			if (!err && data) {
				delete data.hashedPassword;
				callback(200, data);
			} else {
				callback(404, { Error: "Error reading user details by phone number" });
			}
		});
	} else {
		callback(404, { Error: "Missing required fields" });
	}
};

// Users - Delete
// Required data: phone
// Optional data: none
// @TODO - only let an authenticated user delete their object
// @TODO - clean up any other data associated with this user
handlers._users.delete = function (data, callback) {
	let phone =
		typeof data.queryStringObject.phone === "string" &&
		data.queryStringObject.phone.trim().length === 11
			? data.queryStringObject.phone.trim()
			: false;

	if (phone) {
		// Lookup the user
		_data.read("users", phone, function (err, data) {
			if (!err && data) {
				// Delete the user
				_data.delete("users", phone, function (err) {
					if (!err) {
						callback(200);
					} else {
						callback(400, { Error: "Error deleting user details by phone number" });
					}
				});
			} else {
				callback(404, { Error: "Error finding user details by phone number" });
			}
		});
	} else {
		callback(404, { Error: "Missing required fields" });
	}
};

// Ping handler
handlers.ping = function (data, callback) {
	callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
	callback(404);
};

// Export the module
module.exports = handlers;
