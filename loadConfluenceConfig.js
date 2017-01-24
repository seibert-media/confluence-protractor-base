"use strict";


var cachedConfluenceConfig = null;

function loadConfluenceConfig() {
	if (typeof browser === 'undefined') {
		// only run when in protractor context
		throw new Error('Only call loadConfluenceConfig in protractor context')
	}

	if (cachedConfluenceConfig !== null) {
		return cachedConfluenceConfig;
	}

	var merge = require('lodash').merge;

	var confluenceConfig = {
		DASHBOARD_TITLE: 'Dashboard - Confluence',
		ADMIN_TITLE: 'Administration Console - Confluence',
		USERS: {
			ADMIN: {
				USERNAME: 'admin',
				PASSWORD: 'admin'
			},
			TEST_USER: {
				USERNAME: 'Adara.Moss',
				PASSWORD: 'pass123456'
			}
		}
	};

	var extendedConfluenceConfig;

	var confluenceConfigParam = browser.params.confluenceConfig;

	if (confluenceConfigParam === 'default') {
		extendedConfluenceConfig = {};
	} else if (typeof confluenceConfigParam === 'string') {
		var confluenceConfigModule = './config/' + confluenceConfigParam;
		extendedConfluenceConfig = require(confluenceConfigModule);
	} else {
		throw new Error('No valid confluenceConfig parameter in protractor config: ', confluenceConfigParam);
	}

	var configOverwriteParam = browser.params.configOverwrite;

	if (configOverwriteParam === undefined || typeof configOverwriteParam !== 'object') {
		configOverwriteParam = {};
	}

	merge(confluenceConfig, extendedConfluenceConfig, configOverwriteParam);

	console.log('confluenceConfig: ', confluenceConfig);

	cachedConfluenceConfig = confluenceConfig;

	return confluenceConfig;
}

module.exports = loadConfluenceConfig;
