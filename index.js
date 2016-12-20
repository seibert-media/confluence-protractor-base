
module.exports = {
	loadConfluenceConfig: require('./loadConfluenceConfig'),
	protractorConfig: require('./protractorConfig'),
	pageObjects: {
		ConfluenceLogin: require('./page-objects/ConfluenceLogin'),
		ConfluenceBase: require('./page-objects/ConfluenceBase'),
		ConfluenceSpace: require('./page-objects/ConfluenceSpace'),
		ConfluenceAction: require('./page-objects/ConfluenceAction'),
		UniversalPluginManager: require('./page-objects/UniversalPluginManager')
	},
	utils: {
		pageObjectUtils: require('./utils/pageObjectUtils'),
		confluenceSpaceTestUtils: require('./utils/confluenceSpaceTestUtils'),
		Version: require('./utils/Version')
	},
	jasmineReporters: {
		screenshotReporter: require('./jasmineReporters/screenshotReporter')
	}
};
