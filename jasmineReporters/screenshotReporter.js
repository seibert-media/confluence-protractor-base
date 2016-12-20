var pageObjectUtils = require('../utils/pageObjectUtils');

var enabled = true;
module.exports = {
	enable: function () {
		enabled = true;
	},
	disable: function () {
		enabled = false;
	},
	specDone: function(result) {
		if (enabled) {
			pageObjectUtils.takeScreenshot(result.fullName + '.png');
		}
	}
};
