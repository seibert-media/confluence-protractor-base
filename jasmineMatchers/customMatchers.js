var pageObjectUtils = require('../utils/pageObjectUtils');

module.exports = {
	toHaveText: function() {
		return {
			compare: function(actual, expectedText) {
				return {
					pass: actual.getText().then(function(actualText) {
						return actualText === expectedText;
					})
				};
			}
		};
	},
	toBePresent: function() {
		return {
			compare: function(actual) {
				return {
					pass: actual.isPresent().then(function(isPresent) {
						return isPresent === true;
					})
				};
			}
		};
	}
};
