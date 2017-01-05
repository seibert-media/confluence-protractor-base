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
		if (result.status === 'disabled') {
			return;
		}

		if (!enabled) {
			return;
		}

		pageObjectUtils.takeScreenshot(result.fullName + '.png');
	}
};
