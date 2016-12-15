var generateScreenshotName = (function () {
	var screenshotCounter = 0;
	return function () {
		return "screenshot-" + (++screenshotCounter) + ".png";
	};
}());

var fs = require('fs');
var screenshotPath = 'screenshots/'

var pageObjectUtils = {
	assert: function (promise, expectedValue, message) {
		return promise.then(function (value) {
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
	},
	takeScreenshot: function (imageName) {
		imageName = imageName || generateScreenshotName();

		if (!fs.existsSync(screenshotPath)){
			fs.mkdirSync(screenshotPath);
		}
		browser.takeScreenshot().then(function (base64Screenshot) {
			require("fs").writeFile(screenshotPath + imageName, base64Screenshot, 'base64', function(error) {
				if (error) {
					console.log(error);
				}
			})
		});
	}
};

module.exports = pageObjectUtils;
