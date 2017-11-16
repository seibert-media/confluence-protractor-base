// TODO: Move many of these functions into more dedicated files.
// TODO: Scope this more globally.
import {isEqual} from "lodash";
import {By, promise} from "selenium-webdriver";

import {browser, element, ElementFinder, protractor} from "protractor";
import {Url} from "url";
import {CustomLocation} from "./CustomLocation";

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

function resolveAttribute(resultPromise: promise.Promise<any>, attributeName: string) {
	const attributPromise = resultPromise.then((object) => object[attributeName]);

	resultPromise[attributeName] = attributPromise;

	return attributPromise;
}

function resolveAttributes(resultPromise: promise.Promise<any>, attributeList: string[]) {
	attributeList.forEach((attributeName) => {
		resolveAttribute(resultPromise, attributeName);
	});
}

const screenshotsAlreadyTaken = {};

const assertUtils = {
	ASSERTION_ERROR: "AssertionError for PageObject: ",
	expectComparisonMessage: (value: any, expected: any) => {
		return "Expected " + JSON.stringify(expected) + ", but was " + JSON.stringify(value);
	},
	assertNotNullSync: (value: any, message?: string) => {
		if (value == null) {
			message = message || "Expected non-null value, but was " + JSON.stringify(value);
			throw new Error(assertUtils.ASSERTION_ERROR + message);
		}
	},
	assertEqualsSync: (value: any, expectedValue: any, message: string) => {
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
	assertEquals: (value: any, expectedValue: any, message?: string) => promise.Promise<any>;
	assertNotNull: (value: any, message?: string) => promise.Promise<any>;
	clickIfPresent: (element: ElementFinder) => promise.Promise<void>;
	clickIfClickable: (element: ElementFinder) => promise.Promise<void>;
	clickIfPresentAsync: (element: ElementFinder) => promise.Promise<void>;
	clickIfPresentAndClickableAsync: (element: ElementFinder) => promise.Promise<void>;
	logPromise: (promise: Promise<any>) => Promise<void>;
	takeScreenshot: (imageName: string) => Promise<string> | promise.Promise<void>;
	cleanScreenshots: () => any;
	waitForElementToBeClickable: (element: ElementFinder, timeout?: number) => any;
	asyncElement: (selector: By, timeout?: number) => ElementFinder;
	findFirstDisplayed: (elementSelector: By) => ElementFinder;
	openPage: (path?: string, options?: OpenPageOptions) => promise.Promise<any>;
	getLocation: () => promise.Promise<CustomLocation> & CustomLocation;
	locationFromUrl: (url: string) => Url;
	getCurrentPath: () => promise.Promise<any>;
	setTurnOffAlerts: (turnOffAlertsValue: boolean) => any;
	turnOffAlerts: () => any;
	skipAlertIfPresent: () => promise.Promise<any>;
	setDefaultElementTimeout: (timeout: number) => any;
	setDefaultLoadingTimeout: (timeout: number) => any;
	resetJasmineTimeoutForPageObjectTimeouts: (() => any);
	assert: any;
}

export const pageObjectUtils: PageObjectUtils = {
	DEFAULT_ELEMENT_TIMEOUT,
	DEFAULT_LOADING_TIMEOUT,
	assertEquals: (value: any, expectedValue: any, message?: string) => {
		if (value && value.then) {
			return value.then((promisedValue: any) => {
				assertUtils.assertEqualsSync(promisedValue, expectedValue, message);
			});
		} else {
			assertUtils.assertEqualsSync(value, expectedValue, message);
		}
	},
	assertNotNull: (value, message?: string) => {
		if (value && value.then) {
			return value.then((promisedValue: any) => {
				assertUtils.assertNotNullSync(promisedValue, message);
			});
		} else {
			assertUtils.assertNotNullSync(value, message);
		}
	},
	clickIfPresent: (elementToClick) => elementToClick.isPresent().then((isPresent) => {
		if (isPresent) {
			return elementToClick.click();
		}
	}),
	clickIfPresentAsync: (elementToClick) => browser.wait(EC().visibilityOf(elementToClick), DEFAULT_ELEMENT_TIMEOUT).then((isVisible: boolean) => {
		if (isVisible) {
			return elementToClick.click();
		}
	}).catch(() => {
		// skip
	}),
	clickIfPresentAndClickableAsync: (elementToClick) => browser.wait(
		EC().and(EC().visibilityOf(elementToClick), EC().elementToBeClickable(elementToClick)), DEFAULT_ELEMENT_TIMEOUT)
		.then((isVisibleAndClickable: boolean) => {
			if (isVisibleAndClickable) {
				return elementToClick.click();
			}
		}).catch(() => {
			// skip
		}),
	clickIfClickable: (elementToClick) => EC().elementToBeClickable(elementToClick)().then((isClickable: boolean) => {
		if (isClickable) {
			return elementToClick.click();
		}
	}),
	logPromise: (resultPromise) => resultPromise.then((value) => {
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

		function saveSuccessfulScreenshot(base64Screenshot: any) {
			return fs.writeFile(screenshotPath + imageName, base64Screenshot, "base64", (error: Error) => {
				if (error) {
					console.log(error);
				}
			});
		}

		return browser.takeScreenshot().then(saveSuccessfulScreenshot, (error) => {
			console.log(error);

			// skip alerts and retry
			browser.wait(pageObjectUtils.skipAlertIfPresent()).then(() => {
				browser.takeScreenshot().then(saveSuccessfulScreenshot);
			});
		});
	},
	cleanScreenshots: () => {
		if (fs.existsSync(screenshotPath)) {
			fs.readdirSync(screenshotPath).forEach((file: string) => {
				fs.unlinkSync(screenshotPath + file);
			});
		}
	},
	waitForElementToBeClickable: (elementToClick, timeout = DEFAULT_ELEMENT_TIMEOUT) => {
		browser.wait(EC().elementToBeClickable(elementToClick), timeout).catch(() => {
			// call element.isPresent to get better message
			throw new Error("Element not clickable " + elementToClick);
		});
		return elementToClick;
	},
	asyncElement: (selector: By, timeout = DEFAULT_ELEMENT_TIMEOUT) => {
		const asyncElement = element(selector);
		browser.wait(EC().visibilityOf(asyncElement), timeout).catch(() => {
			// TODO call element.isPresent to get better message - investigate how to handle this better
			asyncElement.isPresent();
		});
		return asyncElement;
	},
	findFirstDisplayed: (elementSelector: By) => {
		return element.all(elementSelector).filter((elementFromSelector) => elementFromSelector.isDisplayed()).first();
	},
	openPage: (path = "", {ignoreSearch = false, refreshAlways = false}: OpenPageOptions = {}) => {
		if (!browser.baseUrl.endsWith("/")) {
			throw new Error("openPage need a baseUrl with a trailing / (baseUrl: " + browser.baseUrl + ")");
		}
		if (path.startsWith("/")) {
			throw new Error("openPage need a path without a leading / (path: " + path + ")");
		}

		const newLocation = pageObjectUtils.locationFromUrl(browser.baseUrl + path);

		return pageObjectUtils.getLocation().then((currentLocation) => {
			let resultPromise;

			if (refreshAlways) {
				resultPromise = browser.get(path);
			} else if (newLocation.pathname !== currentLocation.pathname) {
				resultPromise = browser.get(path);
			} else if (!ignoreSearch && newLocation.search !== currentLocation.search) {
				resultPromise = browser.get(path);
			}

			if (resultPromise) {
				if (turnOffAlerts) {
					pageObjectUtils.turnOffAlerts();
				}
				return resultPromise;
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

		return alertIsPresentPromise().then((alertIsPresent: boolean) => {
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
