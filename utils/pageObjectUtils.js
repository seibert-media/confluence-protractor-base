var generateScreenshotName = (function () {
	var screenshotCounter = 0;
	return function () {
		return "screenshot-" + (++screenshotCounter) + ".png";
	};
}());

var fs = require('fs');
var screenshotPath = 'screenshots/'


function EC() {
	return protractor.ExpectedConditions;
}

var DEFAULT_ELEMENT_TIMEOUT = 2000;
var DEFAULT_LOADING_TIMEOUT = 5000;

var pageObjectUtils = {
	DEFAULT_ELEMENT_TIMEOUT: DEFAULT_ELEMENT_TIMEOUT,
	DEFAULT_LOADING_TIMEOUT: DEFAULT_LOADING_TIMEOUT,
	assert: function (promise, expectedValue, message) {
		return promise.then(function (value) {
			if (value != expectedValue) {
				throw new Error('AssertionError for PageObject: ' + message);
			}
		});
	},
	logPromise: function (promise) {
		return promise.then(function (value) {
			console.log(value);
		});
	},
	clickIfPresent: function (element) {
		return element.isPresent().then(function (isPresent) {
			if (isPresent) {
				return element.click();
			}
		});
	},
	takeScreenshot: function (imageName) {
		imageName = imageName || generateScreenshotName();

		if (!fs.existsSync(screenshotPath)) {
			fs.mkdirSync(screenshotPath);
		}
		return browser.takeScreenshot().then(function (base64Screenshot) {
			return require("fs").writeFile(screenshotPath + imageName, base64Screenshot, 'base64', function (error) {
				if (error) {
					console.log(error);
				}
			})
		});
	},
	waitForElementToBeClickable: function (element, timeout) {
		browser.wait(EC().elementToBeClickable(element), timeout || DEFAULT_ELEMENT_TIMEOUT).catch(function () {
			// call element.isPresent to get better message
			throw new Error('Element not clickable', element);
		});
		return element;
	},
	asyncElement: function (selector, timeout) {
		var asyncElement = element(selector);
		browser.wait(EC().presenceOf(asyncElement), timeout || DEFAULT_ELEMENT_TIMEOUT).catch(function () {
			// call element.isPresent to get better message
			asyncElement.isPresent();
		});
		return asyncElement;
	},
	findFirstDisplayed: function (elementSelector) {
		return element.all(elementSelector).filter(function (element) {
			return element.isDisplayed();
		}).first();
	},
	openPage: function (path) {
		path = path || '';
		if (!browser.baseUrl.endsWith('/')) {
			throw new Error('openPage need a baseUrl with a trailing / (baseUrl: ' + browser.baseUrl + ')');
		}
		if (path.startsWith('/')) {
			throw new Error('openPage need a path without a leading / (path: ' + path + ')');
		}
		return pageObjectUtils.getCurrentPath().then(function (currentPath) {
			if (currentPath !== path) {
				return browser.get(path);
			} else {
				console.log('Page is already opened: ' + path);
			}

		});
	},
	stripUrlToPath: function (url) {
		return url.replace(browser.baseUrl, '').replace(/\?.*/, '');
	},
	getCurrentPath: function () {
		return browser.getCurrentUrl().then(function (url) {
			return pageObjectUtils.stripUrlToPath(url)
		})
	}
};

module.exports = pageObjectUtils;
