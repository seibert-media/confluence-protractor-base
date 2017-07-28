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
		if (result.status === 'disabled' || !enabled) {
			return;
		}

		pageObjectUtils.takeScreenshot(result.status + ' - ' + result.fullName + '.png');
	}
};
