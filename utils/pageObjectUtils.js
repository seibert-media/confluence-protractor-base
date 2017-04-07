var generateScreenshotName = (function () {
	var screenshotCounter = 0;
	return function () {
		return "screenshot-" + (++screenshotCounter) + ".png";
	};
}());

var fs = require('fs');
var screenshotPath = 'screenshots/';

var parseUrl = require('url').parse;

var turnOffAlerts = false;

function EC() {
	return protractor.ExpectedConditions;
}

var DEFAULT_ELEMENT_TIMEOUT = 5 * 1000;
var DEFAULT_LOADING_TIMEOUT = 30 * 1000;

function resolveAttribute(promise, attributeName) {
	var attributPromise = promise.then(function (object) {
		return object[attributeName];
	});

	promise[attributeName] = attributPromise;

	return attributPromise;
}

function resolveAttributes(promise, attributeList) {
	attributeList.forEach(function (attributeName) {
		resolveAttribute(promise, attributeName);
	});
}

var screenshotsAlreadyTaken = {};

var assertUtils = {
	ASSERTION_ERROR: 'AssertionError for PageObject: ',
	expectComparisonMessage: function (value, expected) {
		return 'Expected ' + JSON.stringify(expected) + ', but was ' + JSON.stringify(value);
	},
	assertNotNullSync: function (value, message) {
		if (value == null) {
			message = message || 'Expected non-null value, but was ' + JSON.stringify(value);
			throw new Error(assertUtils.ASSERTION_ERROR + message);
		}
	},
	assertEqualsSync: function (value, expectedValue, message) {
		if (!jasmine.matchersUtil.equals(value, expectedValue)) {
			var expectComparison =  assertUtils.expectComparisonMessage(value, expectedValue);
			if (message) {
				message = message + ' ('+ expectComparison + ')';
			} else {
				message = expectComparison;
			}
			throw new Error(assertUtils.ASSERTION_ERROR + message);
		}
	}
};

var pageObjectUtils = {
	DEFAULT_ELEMENT_TIMEOUT: DEFAULT_ELEMENT_TIMEOUT,
	DEFAULT_LOADING_TIMEOUT: DEFAULT_LOADING_TIMEOUT,
	assertNotNull: function (value, message) {
		if (value && value.then) {
			return value.then(function (value) {
				assertUtils.assertNotNullSync(value, message);
			});
		} else {
			assertUtils.assertNotNullSync(value, message);
		}
	},
	assertEquals: function (value, expectedValue, message) {
		if (value && value.then) {
			return value.then(function (value) {
				assertUtils.assertEqualsSync(value, expectedValue, message);
			});
		} else {
			assertUtils.assertEqualsSync(value, expectedValue, message);
		}

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
	clickIfClickable: function (element) {
		return EC().elementToBeClickable(element)().then(function (isClickable) {
			if (isClickable) {
				return element.click();
			}
		});
	},
	takeScreenshot: function (imageName) {
		imageName = imageName || generateScreenshotName();

		if (!fs.existsSync(screenshotPath)) {
			fs.mkdirSync(screenshotPath);
		}

		if (screenshotsAlreadyTaken[imageName]) {
			return Promise.resolve('Screenshot already taken');
		}

		screenshotsAlreadyTaken[imageName] = imageName;

		function saveSuccessfullScreenshot(base64Screenshot) {
			return fs.writeFile(screenshotPath + imageName, base64Screenshot, 'base64', function (error) {
				if (error) {
					console.log(error);
				}
			})
		}

		return browser.takeScreenshot().then(saveSuccessfullScreenshot, function (error) {
			console.log(error);

			// skip alerts and retry
			browser.wait(pageObjectUtils.skipAlertIfPresent()).then(function () {
				browser.takeScreenshot().then(saveSuccessfullScreenshot())
			});
		});
	},
	cleanScreenshots: function () {
		if (fs.existsSync(screenshotPath)) {
			fs.readdirSync(screenshotPath).forEach(function (file) {
				fs.unlinkSync(screenshotPath + file);
			});
		}
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
	openPage: function (path, options) {
		options = options || {};

		if (options.ignoreSearch === undefined) {
			options.ignoreSearch = false;
		}

		path = path || '';
		if (!browser.baseUrl.endsWith('/')) {
			throw new Error('openPage need a baseUrl with a trailing / (baseUrl: ' + browser.baseUrl + ')');
		}
		if (path.startsWith('/')) {
			throw new Error('openPage need a path without a leading / (path: ' + path + ')');
		}

		var newLocation = pageObjectUtils.locationFromUrl(browser.baseUrl + path);

		return pageObjectUtils.getLocation().then(function (currentLocation) {
			var promise;

			if (options.refreshAlways) {
				promise = browser.get(path);
			} else if (newLocation.pathname !== currentLocation.pathname) {
				promise = browser.get(path);
			} else if (!options.ignoreSearch && newLocation.search !== currentLocation.search) {
				promise = browser.get(path);
			}

			if (promise) {
				if (turnOffAlerts) {
					pageObjectUtils.turnOffAlerts();
				}
				return promise;
			}
			console.log('Page is already opened: ' + path);
		});
	},
	getLocation: function () {
		var locationPromise = browser.getCurrentUrl().then(function (url) {
			return pageObjectUtils.locationFromUrl(url);
		});

		// wrap attributes as promises
		resolveAttributes(locationPromise, [
			'href',
			'protocol',
			'host',
			'hostname',
			'port',
			'pathname',
			'search',
			'hash',

			// non-standard
			'path',
			'pathWithSearch',
			'pathWithSearchAndHash',
		]);

		return locationPromise;
	},
	locationFromUrl: function (url) {
		var location = parseUrl(url);

		// path without leading / to be consistent with openPage()
		location.path = (location.pathname || "").slice(1);
		location.pathWithSearch = location.path + location.search;
		location.pathWithSearchAndHash = location.path + location.search + location.hash;

		return location;
	},
	getCurrentPath: function () {
		return pageObjectUtils.getLocation().then(function (location) {
			return location.path;
		});
	},
	setTurnOffAlerts: function (turnOffAlertsValue) {
		console.log('setTurnOffAlerts:' + turnOffAlertsValue);
		turnOffAlerts = turnOffAlertsValue
	},
	turnOffAlerts: function () {
		browser.executeScript(function () {
			window.alert = function () {
				return true;
			};
			window.confirm = function () {
				return true;
			};
		});
	},
	skipAlertIfPresent: function () {
		var alertIsPresentPromise = EC().alertIsPresent();

		return alertIsPresentPromise().then(function (alertIsPresent) {
			if (alertIsPresent) {
				return browser.switchTo().alert().accept();
			}
			return alertIsPresent;
		})
	},
	setDefaultElementTimeout: function (timeout) {
		DEFAULT_ELEMENT_TIMEOUT = timeout;
	},
	setDefaultLoadingTimeout: function (timeout) {
		DEFAULT_LOADING_TIMEOUT = timeout;
	},
	resetJasmineTimeoutForPageObjectTimeouts: function () {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_ELEMENT_TIMEOUT + DEFAULT_LOADING_TIMEOUT;
		console.log('Reset jasmine.DEFAULT_TIMEOUT_INTERVAL to ' + jasmine.DEFAULT_TIMEOUT_INTERVAL);
	}
};

// alias
pageObjectUtils.assert = pageObjectUtils.assertEquals;

Object.defineProperty(pageObjectUtils.asyncElement, 'all', {
	get: function () {
		return (element || {}).all
	}
});

Object.defineProperty(pageObjectUtils, 'DEFAULT_ELEMENT_TIMEOUT', {
	get: function () {
		return DEFAULT_ELEMENT_TIMEOUT;
	}
});

Object.defineProperty(pageObjectUtils, 'DEFAULT_LOADING_TIMEOUT', {
	get: function () {
		return DEFAULT_LOADING_TIMEOUT;
	}
});

module.exports = pageObjectUtils;
