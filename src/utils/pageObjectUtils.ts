import {isEqual} from "lodash";
import {By, promise} from "selenium-webdriver";

import {browser, element, protractor} from "protractor";
import {Url} from "url";

import MatchersUtil = jasmine.MatchersUtil;

const generateScreenshotName = ((() => {
	let screenshotCounter = 0;
	return () => "screenshot-" + (++screenshotCounter) + ".png";
})());

const fs = require("fs");
const screenshotPath = "screenshots/";

const parseUrl = require("url").parse;

let turnOffAlerts = false;

function EC() {
	return protractor.ExpectedConditions;
}

let DEFAULT_ELEMENT_TIMEOUT = 6 * 1000;
let DEFAULT_LOADING_TIMEOUT = 30 * 1000;

function resolveAttribute(promise, attributeName) {
	const attributPromise = promise.then((object) => object[attributeName]);

	promise[attributeName] = attributPromise;

	return attributPromise;
}

function resolveAttributes(promise, attributeList) {
	attributeList.forEach((attributeName) => {
		resolveAttribute(promise, attributeName);
	});
}

const screenshotsAlreadyTaken = {};

const assertUtils = {
	ASSERTION_ERROR: "AssertionError for PageObject: ",
	expectComparisonMessage: (value, expected) => {
		return "Expected " + JSON.stringify(expected) + ", but was " + JSON.stringify(value);
	},
	assertNotNullSync: (value: any, message?: string) => {
		if (value == null) {
			message = message || "Expected non-null value, but was " + JSON.stringify(value);
			throw new Error(assertUtils.ASSERTION_ERROR + message);
		}
	},
	assertEqualsSync: (value, expectedValue, message) => {
		if (!isEqual(value, expectedValue)) {
			const expectComparison = assertUtils.expectComparisonMessage(value, expectedValue);
			if (message) {
				message = message + " (" + expectComparison + ")";
			} else {
				message = expectComparison;
			}
			throw new Error(assertUtils.ASSERTION_ERROR + message);
		}
	},
};

export interface OpenPageOptions {
	ignoreSearch?: boolean;
	refreshAlways?: boolean;
}

export interface PageObjectUtils {
	DEFAULT_ELEMENT_TIMEOUT: number;
	DEFAULT_LOADING_TIMEOUT: number;
	assertEquals: any; // ((value: any, expectedValue: any, message?: string) => promise.Promise<R> | promise.Promise<any> | promise.Promise<T> | promise.Promise<R> | any | Promise<TResult2 | TResult1> | any);
	assertNotNull: any; // ((value, message?: string) => promise.Promise<R> | promise.Promise<any> | promise.Promise<T> | promise.Promise<R> | any | Promise<TResult2 | TResult1> | any);
	clickIfPresent: any; // ((element) => promise.Promise<R>);
	clickIfClickable: any; // ((element) => promise.Promise<R> | promise.Promise<any> | promise.Promise<T> | promise.Promise<any | promise.Promise<void> | void | ActionSequence> | any | Promise<TResult2 | TResult1> | any);
	logPromise: any; // ((promise) => promise.Promise<R> | promise.Promise<any> | promise.Promise<T> | promise.Promise<R> | any | Promise<TResult2 | TResult1> | any);
	takeScreenshot: any; // ((imageName) => (Promise<string> | promise.Promise<void>));
	cleanScreenshots: any; // (() => any);
	waitForElementToBeClickable: any; // ((element, timeout?: number) => any);
	asyncElement: any; // ((selector: By, timeout?: number) => ElementFinder);
	findFirstDisplayed: any; // ((elementSelector: By) => ElementFinder);
	openPage: any; // ((path?: string, {ignoreSearch = false, refreshAlways = false}?: OpenPageOptions) => promise.Promise<R> | promise.Promise<any> | promise.Promise<T> | promise.Promise<any> | any | Promise<TResult2 | TResult1> | any);
	getLocation: any; // (() => any);
	locationFromUrl: ((url) => Url);
	getCurrentPath: (() => promise.Promise<any>);
	setTurnOffAlerts: ((turnOffAlertsValue) => any);
	turnOffAlerts: (() => any);
	skipAlertIfPresent: (() => promise.Promise<any>);
	setDefaultElementTimeout: ((timeout) => any);
	setDefaultLoadingTimeout: ((timeout) => any);
	resetJasmineTimeoutForPageObjectTimeouts: (() => any);
	assert: any;
}

export const pageObjectUtils: PageObjectUtils = {
	DEFAULT_ELEMENT_TIMEOUT,
	DEFAULT_LOADING_TIMEOUT,
	assertEquals: (value: any, expectedValue: any, message?: string) => {
		if (value && value.then) {
			return value.then((promisedValue) => {
				assertUtils.assertEqualsSync(promisedValue, expectedValue, message);
			});
		} else {
			assertUtils.assertEqualsSync(value, expectedValue, message);
		}

	},
	assertNotNull: (value, message?: string) => {
		if (value && value.then) {
			return value.then((promisedValue) => {
				assertUtils.assertNotNullSync(promisedValue, message);
			});
		} else {
			assertUtils.assertNotNullSync(value, message);
		}
	},
	clickIfPresent: (element) => element.isPresent().then((isPresent) => {
		if (isPresent) {
			return element.click();
		}
	}),
	clickIfClickable: (element) => EC().elementToBeClickable(element)().then((isClickable) => {
		if (isClickable) {
			return element.click();
		}
	}),
	logPromise: (promise) => promise.then((value) => {
		console.log(value);
	}),
	takeScreenshot: (imageName) => {
		imageName = imageName || generateScreenshotName();

		if (!fs.existsSync(screenshotPath)) {
			fs.mkdirSync(screenshotPath);
		}

		if (screenshotsAlreadyTaken[imageName]) {
			return Promise.resolve("Screenshot already taken");
		}

		screenshotsAlreadyTaken[imageName] = imageName;

		function saveSuccessfullScreenshot(base64Screenshot) {
			return fs.writeFile(screenshotPath + imageName, base64Screenshot, "base64", (error) => {
				if (error) {
					console.log(error);
				}
			});
		}

		return browser.takeScreenshot().then(saveSuccessfullScreenshot, (error) => {
			console.log(error);

			// skip alerts and retry
			browser.wait(pageObjectUtils.skipAlertIfPresent()).then(() => {
				browser.takeScreenshot().then(saveSuccessfullScreenshot);
			});
		});
	},
	cleanScreenshots: () => {
		if (fs.existsSync(screenshotPath)) {
			fs.readdirSync(screenshotPath).forEach((file) => {
				fs.unlinkSync(screenshotPath + file);
			});
		}
	},
	waitForElementToBeClickable: (element, timeout = DEFAULT_ELEMENT_TIMEOUT) => {
		browser.wait(EC().elementToBeClickable(element), timeout).catch(() => {
			// call element.isPresent to get better message
			throw new Error("Element not clickable " + element);
		});
		return element;
	},
	asyncElement: (selector: By, timeout = DEFAULT_ELEMENT_TIMEOUT) => {
		const asyncElement = element(selector);
		browser.wait(EC().presenceOf(asyncElement), timeout).catch(() => {
			// call element.isPresent to get better message
			asyncElement.isPresent();
		});
		return asyncElement;
	},
	findFirstDisplayed: (elementSelector: By) => {
		return element.all(elementSelector).filter((element) => element.isDisplayed()).first();
	},
	openPage: (path = "", {ignoreSearch = false, refreshAlways = false}: OpenPageOptions = {}) => {

		if (ignoreSearch === undefined) {
			ignoreSearch = false;
		}

		if (!browser.baseUrl.endsWith("/")) {
			throw new Error("openPage need a baseUrl with a trailing / (baseUrl: " + browser.baseUrl + ")");
		}
		if (path.startsWith("/")) {
			throw new Error("openPage need a path without a leading / (path: " + path + ")");
		}

		const newLocation = pageObjectUtils.locationFromUrl(browser.baseUrl + path);

		return pageObjectUtils.getLocation().then((currentLocation) => {
			let promise;

			if (refreshAlways) {
				promise = browser.get(path);
			} else if (newLocation.pathname !== currentLocation.pathname) {
				promise = browser.get(path);
			} else if (!ignoreSearch && newLocation.search !== currentLocation.search) {
				promise = browser.get(path);
			}

			if (promise) {
				if (turnOffAlerts) {
					pageObjectUtils.turnOffAlerts();
				}
				return promise;
			}
			console.log("Page is already opened: " + path);
		});
	},
	getLocation: () => {
		const locationPromise = browser.getCurrentUrl().then((url) => pageObjectUtils.locationFromUrl(url));

		// wrap attributes as promises
		resolveAttributes(locationPromise, [
			"href",
			"protocol",
			"host",
			"hostname",
			"port",
			"pathname",
			"search",
			"hash",

			// non-standard
			"path",
			"pathWithSearch",
			"pathWithSearchAndHash",
		]);

		return locationPromise;
	},
	locationFromUrl: (url) => {
		const location = parseUrl(url);

		// path without leading / to be consistent with openPage()
		location.path = (location.pathname || "").slice(1);
		location.pathWithSearch = location.path + location.search;
		location.pathWithSearchAndHash = location.path + location.search + location.hash;

		return location;
	},
	getCurrentPath: () => pageObjectUtils.getLocation().then((location) => location.path),
	setTurnOffAlerts: (turnOffAlertsValue) => {
		console.log("setTurnOffAlerts:" + turnOffAlertsValue);
		turnOffAlerts = turnOffAlertsValue;
	},
	turnOffAlerts: () => {
		browser.executeScript(() => {
			window.alert = () => true;
			window.confirm = () => true;
		});
	},
	skipAlertIfPresent: () => {
		const alertIsPresentPromise = EC().alertIsPresent();

		return alertIsPresentPromise().then((alertIsPresent) => {
			if (alertIsPresent) {
				return browser.switchTo().alert().accept();
			}
			return alertIsPresent;
		});
	},
	setDefaultElementTimeout: (timeout) => {
		DEFAULT_ELEMENT_TIMEOUT = timeout;
	},
	setDefaultLoadingTimeout: (timeout) => {
		DEFAULT_LOADING_TIMEOUT = timeout;
	},
	resetJasmineTimeoutForPageObjectTimeouts: () => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_ELEMENT_TIMEOUT + DEFAULT_LOADING_TIMEOUT;
		console.log("Reset jasmine.DEFAULT_TIMEOUT_INTERVAL to " + jasmine.DEFAULT_TIMEOUT_INTERVAL);
	},
	assert: null,
};

// alias
pageObjectUtils.assert = pageObjectUtils.assertEquals;

Object.defineProperty(pageObjectUtils.asyncElement, "all", {
	// tslint:disable-next-line
	get: () => (element || {})["all"],
});

Object.defineProperty(pageObjectUtils, "DEFAULT_ELEMENT_TIMEOUT", {
	get: () => DEFAULT_ELEMENT_TIMEOUT,
});

Object.defineProperty(pageObjectUtils, "DEFAULT_LOADING_TIMEOUT", {
	get: () => DEFAULT_LOADING_TIMEOUT,
});
