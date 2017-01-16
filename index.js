
module.exports = {
	loadConfluenceConfig: require('./loadConfluenceConfig'),
	protractorConfig: require('./protractorConfig'),
	pageObjects: {
		ConfluenceLogin: require('./page-objects/ConfluenceLogin'),
		ConfluenceBase: require('./page-objects/ConfluenceBase'),
		ConfluenceSpace: require('./page-objects/ConfluenceSpace'),
		ConfluenceAction: require('./page-objects/ConfluenceAction'),
		ConfluenceGroup: require('./page-objects/ConfluenceGroup'),
		ConfluenceUser: require('./page-objects/ConfluenceUser'),
		ConfluencePageEditor: require('./page-objects/ConfluencePageEditor'),
		UniversalPluginManager: require('./page-objects/UniversalPluginManager')
	},
	utils: {
		pageObjectUtils: require('./utils/pageObjectUtils'),
		confluenceSpaceTestUtils: require('./utils/confluenceSpaceTestUtils'),
		Version: require('./utils/Version'),
		elements: {
			RadioOption: require('./utils/elements/RadioOption'),
			CheckboxOption: require('./utils/elements/CheckboxOption')
		}
	},
	jasmineReporters: {
		screenshotReporter: require('./jasmineReporters/screenshotReporter')
	}
};
