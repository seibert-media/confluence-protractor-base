"use strict";

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
else if (typeof confluenceConfigParam === 'object') {
	extendedConfluenceConfig = confluenceConfigParam;
}
else {
	throw new Error('No valid confluenceConfig parameter in protractor config: ', confluenceConfigParam);
}

merge(confluenceConfig, extendedConfluenceConfig);

console.log('confluenceConfig: ', confluenceConfig);

module.exports = confluenceConfig;

