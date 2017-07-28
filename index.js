
module.exports = {
	loadConfluenceConfig: require('./loadConfluenceConfig'),
	protractorConfig: require('./protractorConfig'),
	pageObjects: {
		ConfluenceLogin: require('./page-objects/ConfluenceLogin'),
		ConfluenceBase: require('./page-objects/ConfluenceBase'),
		UniversalPluginManager: require('./page-objects/UniversalPluginManager')
	},
	utils: {
		pageObjectUtils: require('./utils/pageObjectUtils')
	},
	jasmineReporters: {
		screenshotReporter: require('./jasmineReporters/screenshotReporter')
	}
};
