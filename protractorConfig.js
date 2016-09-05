// conf.js
exports.config = {
	baseUrl: 'http://localhost:8090',
	params: {
		confluenceConfig: 'default'
	},
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.spec.js']
};
