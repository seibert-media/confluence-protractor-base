
module.exports = {
	confluenceConfig: require('./confluenceConfig'),
	pageObjects: {
		ConfluenceLogin: require('./page-objects/ConfluenceLogin'),
		ConfluenceBase: require('./page-objects/ConfluenceBase')
	},
	utils: {
		pageObjectUtils: require('./utils/pageObjectUtils')
	}
};
