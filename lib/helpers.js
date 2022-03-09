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

// Create pseudorandom string of defined length
helpers.createRandomString = function (length) {
	strLength = typeof length === "number" && length > 0 ? length : false;

	if (strLength) {
		let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

		let tokenStr = "";

		for (i = 1; i <= strLength; i++) {
			// Get random character
			let randomCharacter = possibleCharacters.charAt(
				Math.floor(Math.random() * possibleCharacters.length)
			);
			// Add to the initial string
			tokenStr += randomCharacter;
		}

		return tokenStr;
	} else {
		return false;
	}
};

module.exports = helpers;
