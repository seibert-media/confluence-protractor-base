// conf.js
exports.config = {
	baseUrl: 'http://localhost:8090',
	params: {
		confluenceConfig: 'default'
	},
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.spec.js'],
	onPrepare: function() {
		var jasmineReporters = require('jasmine-reporters');
		jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			filePrefix: 'ui-test-results'
		}));
	}
};
