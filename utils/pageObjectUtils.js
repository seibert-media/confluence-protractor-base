
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
	}
};

module.exports = pageObjectUtils;
