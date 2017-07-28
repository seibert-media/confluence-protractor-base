
module.exports = {
	confluenceConfig: require('./confluenceConfig'),
	pageObjects: {
		ConfluenceLogin: require('./page-objects/ConfluenceLogin')
	},
	utils: {
		pageObjectUtils: require('./utils/pageObjectUtils')
	}
};
