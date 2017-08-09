import {browser} from "protractor";

let cachedConfluenceConfig = null;

export function loadConfluenceConfig() {
	if (typeof browser === "undefined") {
		// only run when in protractor context
		throw new Error("Only call loadConfluenceConfig in protractor context");
	}

	if (cachedConfluenceConfig !== null) {
		return cachedConfluenceConfig;
	}

	const merge = require("lodash").merge;

	const confluenceConfig = {
		DASHBOARD_TITLE: "Dashboard - Confluence",
		ADMIN_TITLE: "Administration Console - Confluence",
		USERS: {
			ADMIN: {
				USERNAME: "admin",
				PASSWORD: "admin",
			},
			TEST_USER: {
				USERNAME: "user",
				PASSWORD: "user",
			},
		},
	};

	let extendedConfluenceConfig;

	const confluenceConfigParam = browser.params.confluenceConfig;

	if (confluenceConfigParam === "default") {
		extendedConfluenceConfig = {};
	} else if (typeof confluenceConfigParam === "string") {
		const confluenceConfigModule = "./config/" + confluenceConfigParam;
		extendedConfluenceConfig = require(confluenceConfigModule).confluenceConfig;
	} else {
		throw new Error("No valid confluenceConfig parameter in protractor config: " + confluenceConfigParam);
	}

	let configOverwriteParam = browser.params.configOverwrite;

	if (configOverwriteParam === undefined || typeof configOverwriteParam !== "object") {
		configOverwriteParam = {};
	}

	merge(confluenceConfig, extendedConfluenceConfig, configOverwriteParam);

	console.log("confluenceConfig: ", confluenceConfig);

	cachedConfluenceConfig = confluenceConfig;

	return confluenceConfig;
}
