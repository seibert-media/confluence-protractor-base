import * as _ from "lodash";
import {browser} from "protractor";
import MatchersUtil = jasmine.MatchersUtil;
import {promise} from "selenium-webdriver";

export {testUtils, TestUtils};

interface TestUtils {
	expectPromiseToBeResolved: ((promise, done: DoneFn, message) => any);
	expectPromiseFail: ((promise, done: DoneFn, expectedError) => any);
	createDomElement: ((name, properties) => promise.Promise<any>);
	removeDomElement: ((cssSelector) => promise.Promise<any>);
	mockElement: ((options) => { registerDone: ((done, beforeDone) => any) });
}

const testUtils: TestUtils = {
	expectPromiseToBeResolved(promise, done: DoneFn, message) {

		message = message || "Unexpected fail in assertion";
		promise.then(() => {
			done();
		}).catch((reason) => {
			done.fail(message + " // reason: " + reason);
		});
	},

	expectPromiseFail(promise, done: DoneFn, expectedError) {

		promise.then((value) => {
			done.fail("Expected assert to fail // value: " + value);
		}).catch((error) => {

			if (expectedError && !_.isEqual(error, expectedError)) {
				done.fail("Expected " + expectedError + ", but was " + error + ".");
			}
			done();
		});
	},
	createDomElement(name, properties) {
		return browser.executeScript((innerName, innerProperties) => {
			const element = document.createElement(innerName);

			innerProperties = innerProperties || {};

			if (innerProperties.content) {
				element.appendChild(document.createTextNode(innerProperties.content));
				delete innerProperties.content;
			}

			Object.keys(innerProperties).forEach((key) => {
				element[key] = innerProperties[key];
			});

			document.body.appendChild(element);

			return element;
		}, name, properties);
	},
	removeDomElement(cssSelector) {
		return browser.executeScript((innerCssSelector) => {
			const e = document.querySelector(innerCssSelector);
			if (e) {
				e.remove();
			}
		}, cssSelector);
	},
	mockElement(options) {
		let doneFn: DoneFn;

		if (!options.spy) {
			throw new Error("No spy in options");
		}

		if (!(options.promise && options.promise.name)) {
			throw new Error("No promise mock defined");
		}

		const promiseMock = Promise.resolve(options.promise.value);

		promiseMock.then(() => {
			if (!(doneFn instanceof Function && doneFn.fail instanceof Function)) {
				doneFn.fail("registerDone() must be called as last statement in it()");
			}
		});

		const element = {
			registerDone(done, beforeDone) {
				doneFn = done;

				promiseMock.then(() => {
					if (beforeDone) {
						beforeDone();
					}
					done();
				});
			},
		};

		// create dummy function add add as spy
		element[options.spy] = () => {
		};
		spyOn(element, options.spy);

		// add promise returning function
		element[options.promise.name] = () => promiseMock;

		return element;
	},
};
