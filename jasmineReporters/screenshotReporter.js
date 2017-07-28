var pageObjectUtils = require('../utils/pageObjectUtils');

module.exports = {
	specDone: function(result) {
		pageObjectUtils.takeScreenshot(result.fullName + '.png');
	}
};
