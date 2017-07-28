
var pageObjectUtils = {
	assert: function (promise, expectedValue, message) {
		promise.then(function (value) {
			if (value != expectedValue) {
				throw new Error('AssertionError for PageObject: ' + message);
			}
		});
	},
	logPromise: function (promise) {
		promise.then(function (value) {
			console.log(value);
		});
	},
	clickIfPresent: function (elementPromise) {
		elementPromise.isPresent().then(function (isPresent) {
			if (isPresent) {
				elementPromise.click();
			}
		});
	}
};

module.exports = pageObjectUtils;
