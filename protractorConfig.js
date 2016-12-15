// conf.js
exports.config = {
	baseUrl: 'http://localhost:8090/',
	params: {
		confluenceConfig: 'default'
	},
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.spec.js'],
	onPrepare: function() {
		// ignoreSynchronization prevents protractor from waiting for angular
		browser.ignoreSynchronization = true;

		var jasmineEnv = jasmine.getEnv();

		var jasmineReporters = require('jasmine-reporters');
		jasmineEnv.addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			filePrefix: 'ui-test-results'
		}));

		var screenshotReporter = require('./jasmineReporters/screenshotReporter');
		jasmineEnv.addReporter(screenshotReporter);
	}
};
