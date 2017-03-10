
module.exports = {
	loadConfluenceConfig: require('./loadConfluenceConfig'),
	protractorConfig: require('./protractorConfig'),
	pageObjects: {
		ConfluenceLogin: require('./page-objects/ConfluenceLogin'),
		ConfluenceBase: require('./page-objects/ConfluenceBase'),
		ConfluenceSpace: require('./page-objects/ConfluenceSpace'),
		ConfluencePage: require('./page-objects/ConfluencePage'),
		ConfluenceAction: require('./page-objects/ConfluenceAction'),
		ConfluenceGroup: require('./page-objects/ConfluenceGroup'),
		ConfluenceUser: require('./page-objects/ConfluenceUser'),
		ConfluenceEditor: require('./page-objects/ConfluenceEditor'),
		ConfluenceMacroBrowser: require('./page-objects/ConfluenceMacroBrowser'),
		UniversalPluginManager: require('./page-objects/UniversalPluginManager')
	},
	utils: {
		pageObjectUtils: require('./utils/pageObjectUtils'),
		confluenceSpaceTestUtils: require('./utils/confluenceSpaceTestUtils'),
		Version: require('./utils/Version'),
		elements: {
			RadioOption: require('./utils/elements/RadioOption'),
			CheckboxOption: require('./utils/elements/CheckboxOption'),
			AutocompleteSearch: require('./utils/elements/AutocompleteSearch')
		}
	},
	jasmineReporters: {
		screenshotReporter: require('./jasmineReporters/screenshotReporter'),
		failFastReporter: require('./jasmineReporters/failFastReporter')
	}
};
