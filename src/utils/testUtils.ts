import * as _ from "lodash";
import {browser} from "protractor";
import {promise} from "selenium-webdriver";

export {testUtils, TestUtils};

// TODO: Refactor this into class
// TODO: Some very vague typings in here, clean them up
interface TestUtils {
	expectPromiseToBeResolved: (promise: promise.Promise<any>, done: DoneFn, message: string) => any;
	expectPromiseFail: (promise: promise.Promise<any>, done: DoneFn, expectedError: Error) => any;
	createDomElement: (name: string, properties: any) => promise.Promise<any>;
	removeDomElement: (cssSelector: any) => promise.Promise<any>;
	mockElement: (options: {spy: any, promise: {name: any, value: any}}) => { registerDone: (done: DoneFn, beforeDone: () => void) => any };
}

const testUtils: TestUtils = {
	expectPromiseToBeResolved(resultPromise, done: DoneFn, message) {
		message = message || "Unexpected failure in assertion";
		resultPromise.then(() => {
			done();
		}).catch((reason: Error) => {
			done.fail(message + " // reason: " + reason);
		});
	},

	expectPromiseFail(resultPromise, done: DoneFn, expectedError) {
		resultPromise.then((value) => {
			done.fail("Expected assert to fail // value: " + value);
		}).catch((error: Error) => {
			if (expectedError && !_.isEqual(error, expectedError)) {
				done.fail("Expected " + expectedError + ", but was " + error + ".");
			}
			done();
		});
	},

	createDomElement(name, properties) {
		return browser.executeScript((innerName: string, innerProperties: any) => {
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
		return browser.executeScript((innerCssSelector: any) => {
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
			registerDone(done: DoneFn, beforeDone: () => void) {
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
		element[options.spy] = _.noop;
		spyOn(element, options.spy);

		// add promise returning function
		element[options.promise.name] = () => promiseMock;

		return element;
	},

};
