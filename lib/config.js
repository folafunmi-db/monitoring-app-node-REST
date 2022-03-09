/*jshint esversion: 10 */

// Create and export configuration variables

//  Container for all the environments
let environments = {};

// Staging (default) environment
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: "staging",
	hashingSecret: "thisIsAStagingSecret",
};

// Staging (default) environment
environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: "production",
	hashingSecret: "thisIsAProductionSecret",
};

// Determine which environment should be exported as CL argument
let currentEnvironment =
	typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "";

// Check that the environment being passed
// is the one listed above, else default to staging
let environmentToExport =
	typeof environments[currentEnvironment] == "object"
		? environments[currentEnvironment]
		: environments.staging;

module.exports = environmentToExport;
