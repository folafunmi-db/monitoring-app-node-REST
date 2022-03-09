let crypto = require("crypto");
let config = require("./config");

// Containers for helpers
let helpers = {};

// Create a SHA256 hash
helpers.hash = function (password) {
	if (typeof password === "string" && password.length > 0) {
		let hash = crypto
			.createHmac("sha256", config.hashingSecret)
			.update(password)
			.digest("hex");
		return hash;
	} else {
		return false;
	}
};

// Parse a JSON to an object
helpers.parseJsonToObject = function (str) {
	try {
		let obj = JSON.parse(str);
		return obj;
	} catch (err) {
		return {};
	}
};

module.exports = helpers;
