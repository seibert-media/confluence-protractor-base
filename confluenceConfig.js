"use strict";

if (typeof browser === 'undefined') {
	// only run when in protractor context
	return;
}

var merge = require('lodash').merge;

// ignoreSynchronization prevents protractor from waiting for angular
browser.ignoreSynchronization = true;

var confluenceConfig = {
	DASHBOARD_TITLE: 'Übersicht - Confluence',
	ADMIN_TITLE: 'Administrationskonsole - Confluence',
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
	extendedConfluenceConfig == {};
}
else if (typeof confluenceConfigParam === 'string') {
	var confluenceConfigModule = './config/' + confluenceConfigParam;
	extendedConfluenceConfig = require(confluenceConfigModule);
}
else {
	throw new Error('No valid confluenceConfig parameter in protractor config: ', confluenceConfigParam);
}

var configOverwriteParam = browser.params.configOverwrite;

if (configOverwriteParam === undefined || typeof configOverwriteParam !== 'object') {
	configOverwriteParam = {};
}


merge(confluenceConfig, extendedConfluenceConfig, configOverwriteParam);

console.log('confluenceConfig: ', confluenceConfig);

module.exports = confluenceConfig;

