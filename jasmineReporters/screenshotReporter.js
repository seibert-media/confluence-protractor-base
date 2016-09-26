var pageObjectUtils = require('./pageObjectUtils');

module.exports = {
	specDone: function(result) {
		pageObjectUtils.takeScreenshot(result.fullName + '.png');
	}
};
