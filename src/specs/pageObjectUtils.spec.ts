import {browser, by, element, ElementFinder, ExpectedConditions} from "protractor";
import {CustomLocation} from "../utils/CustomLocation";
import {pageObjectUtils} from "../utils/pageObjectUtils";

const testUtils = require("../utils/testUtils").testUtils;
const screenshotReporter = require("../jasmineReporters/screenshotReporter").screenshotReporter;

describe("pageObjectUtils", function describePageObjectUtils() {

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	// switch to empty page
	beforeAll(() => {
		browser.get("data:,");
	});

	describe("assertNotNull()", () => {
		it("passes not null values", () => {
			pageObjectUtils.assertNotNull("");
			pageObjectUtils.assertNotNull({});
			pageObjectUtils.assertNotNull(10);
		});

		it("fails on unexpected values", () => {
			expect(() => {
				pageObjectUtils.assertNotNull(null);
			}).toThrow(new Error("AssertionError for PageObject: Expected non-null value, but was null"));
		});
	});

	describe("assertEquals()", () => {
		it("passes expected values", () => {
			pageObjectUtils.assertEquals("Ex", "Ex");
		});

		it("passes expected object values", () => {
			pageObjectUtils.assertEquals({x: 10}, {x: 10});
		});

		it("fails on unexpected values", () => {
			expect(() => {
				pageObjectUtils.assertEquals("Val", "Ex", "Error message");
			}).toThrow(new Error('AssertionError for PageObject: Error message (Expected "Ex", but was "Val")'));
		});

		it("fails on unexpected values with default message", () => {
			expect(() => {
				pageObjectUtils.assertEquals("Val", "Ex");
			}).toThrow(new Error('AssertionError for PageObject: Expected "Ex", but was "Val"'));
		});

		describe("promise handling", () => {
			it("has assert as alias", () => {
				expect(pageObjectUtils.assertEquals).toBe(pageObjectUtils.assert);
			});

			it("passes expected values", (done: DoneFn) => {
				const promiseWithExpectedValue = Promise.resolve("Ex");
				const assertPromise = pageObjectUtils.assertEquals(promiseWithExpectedValue, "Ex", "Error message");

				testUtils.expectPromiseToBeResolved(assertPromise, done);
			});

			it("fails on unexpected values", (done: DoneFn) => {
				const promiseWithUnexpectedValue = Promise.resolve("Val");
				const assertPromise = pageObjectUtils.assertEquals(promiseWithUnexpectedValue, "Ex", "Error message");
				testUtils.expectPromiseFail(assertPromise, done,
					new Error('AssertionError for PageObject: Error message (Expected "Ex", but was "Val")'));
			});

			it("fails on unexpected values with default message", (done: DoneFn) => {
				const promiseWithUnexpectedValue = Promise.resolve("Val");
				const assertPromise = pageObjectUtils.assertEquals(promiseWithUnexpectedValue, "Ex");
				testUtils.expectPromiseFail(assertPromise, done,
					new Error('AssertionError for PageObject: Expected "Ex", but was "Val"'));
			});
		});
	});

	describe("clickIfPresent()", () => {

		function clickableElementWithPresentState(isPresent: boolean) {
			return testUtils.mockElement({
				spy: "click",
				promise: {
					name: "isPresent",
					value: isPresent,
				},
			});
		}

		it("calls the element click function when isPresent() promise returns true", (done: DoneFn) => {
			const clickableElement = clickableElementWithPresentState(true);

			pageObjectUtils.clickIfPresent(clickableElement);

			clickableElement.registerDone(done, () => {
				expect(clickableElement.click).toHaveBeenCalled();
			});
		});

		it("calls the element click function when isPresent() promise returns false", (done: DoneFn) => {
			const clickableElement = clickableElementWithPresentState(false);

			pageObjectUtils.clickIfPresent(clickableElement);

			clickableElement.registerDone(done, () => {
				expect(clickableElement.click).not.toHaveBeenCalled();
			});
		});

	});

	describe("asyncElement()", () => {

		function addTestElementAsync(id: string) {
			setTimeout(() => {
				testUtils.createDomElement("h1", {
					id,
					content: id,
				});
			}, 1000); // default time out is 2000ms (see utils/pageObjectUtils.js)
		}

		it("not identical with element", () => {
			expect(pageObjectUtils.asyncElement).not.toBe(element);
		});

		it("fails when element() is used instead", () => {
			const id = "headline-for-element";
			const testElement = element(by.id(id));

			addTestElementAsync(id);

			expect(testElement.isPresent()).toBe(false);
		});

		it("waits until element is present in document", () => {
			const id = "headline-for-async-element";
			const testElement = pageObjectUtils.asyncElement(by.id(id));

			addTestElementAsync(id);

			expect(testElement.isPresent()).toBe(true);
		});

	});

	describe("urlToLocation()", () => {
		const testUrl = "login.action?permissionViolation=true#someHash";
		let location: CustomLocation;

		beforeEach(() => {
			pageObjectUtils.openPage(testUrl, {refreshAlways: true});

			location = pageObjectUtils.getLocation();
		});

		it('extracts the "href "from url', () => {
			expect(location.href).toEqual("http://confluence:8090/login.action?permissionViolation=true#someHash");
		});

		it('extracts the "protocol" from url', () => {
			expect(location.protocol).toBe("http:");
		});

		it('extracts the "host" from url', () => {
			expect(location.host).toBe("confluence:8090");
		});

		it('extracts the "hostname" from url', () => {
			expect(location.hostname).toBe("confluence");
		});

		it('extracts the "port" from url', () => {
			expect(location.port).toBe("8090");
		});

		it('extracts the "pathname" from url', () => {
			expect(location.pathname).toBe("/login.action");
		});

		it('extracts the "search" from url', () => {
			expect(location.search).toBe("?permissionViolation=true");
		});

		it('extracts the "hash" from url', () => {
			expect(location.hash).toBe("#someHash");
		});

		describe("non stardard helper attributes", () => {
			it('extracts the "path" (non-standard) from url', () => {
				expect(location.path).toBe("login.action");
			});

			it('extracts the "pathWithSearch" (non-standard) from url', () => {
				expect(location.pathWithSearch).toBe("login.action?permissionViolation=true");
			});

			it('extracts the "pathWithSearchAndHash" (non-standard) from url', () => {
				expect(location.pathWithSearchAndHash).toBe("login.action?permissionViolation=true#someHash");
			});
		});
	});

	describe("takeScreenshot()", () => {
		beforeEach(() => {
			spyOn(browser, "takeScreenshot").and.returnValue({
				then(): any {
					return undefined; // TODO: really?
				},
			});
		});

		it("calls takeScreenshot with same parameter", () => {
			pageObjectUtils.takeScreenshot("image_a.png");

			expect(browser.takeScreenshot).toHaveBeenCalled();
		});

		it("calls takeScreenshot only once", () => {
			pageObjectUtils.takeScreenshot("image_b.png");
			pageObjectUtils.takeScreenshot("image_b.png");
			pageObjectUtils.takeScreenshot("image_b.png");

			expect(browser.takeScreenshot).toHaveBeenCalledTimes(1);
		});

		it("calls takeScreenshot twice for different image names", () => {
			pageObjectUtils.takeScreenshot("image_c.png");
			pageObjectUtils.takeScreenshot("image_d.png");

			pageObjectUtils.takeScreenshot("image_c.png");

			expect(browser.takeScreenshot).toHaveBeenCalledTimes(2);
		});
	});

	describe("configure timeouts", () => {

		describe("DEFAULT_ELEMENT_TIMEOUT", () => {
			it("has a default of 3 seconds", () => {
				expect(pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT).toBe(6000);
			});

			it("loads a configured value", () => {
				pageObjectUtils.setDefaultElementTimeout(500);
				expect(require("../utils/pageObjectUtils").pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT).toBe(500);
			});
		});

		describe("DEFAULT_LOADING_TIMEOUT", () => {
			it("has a default of 30 seconds", () => {
				expect(pageObjectUtils.DEFAULT_LOADING_TIMEOUT).toBe(30000);
			});

			it("loads a configured value", () => {
				pageObjectUtils.setDefaultLoadingTimeout(5000);
				expect(require("../utils/pageObjectUtils").pageObjectUtils.DEFAULT_LOADING_TIMEOUT).toBe(5000);
			});
		});
	});

	describe("race condition workarounds (imported)", function describeRaceConditionWorkarounds() {
		const EC = ExpectedConditions;

		const RACE_CONDITION_ELEMENT_ID = "race-condition-element";
		let RACE_CONDITION_ELEMENT: ElementFinder;

		function createTestElement() {
			RACE_CONDITION_ELEMENT = element(by.id(RACE_CONDITION_ELEMENT_ID));

			testUtils.createDomElement("div", {
				id: RACE_CONDITION_ELEMENT_ID,
				content: RACE_CONDITION_ELEMENT_ID,
			});
		}

		function removeTestElement() {
			testUtils.removeDomElement("#" + RACE_CONDITION_ELEMENT_ID);
		}

		beforeEach(createTestElement);
		afterEach(removeTestElement);

		function prepareInterceptorToRemoveElementBeforeCall(fn: string) {
			const originalIsDisplayedFn = RACE_CONDITION_ELEMENT[fn];

			RACE_CONDITION_ELEMENT[fn] = function() {
				// Remove element between isPresent and isDisplayed call

				removeTestElement();

				expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(false);

				return originalIsDisplayedFn.call(this);
			};
		}

		describe("visibilityOf", () => {

			it("returns false when element is removed between isPresent and isDisplayed", () => {
				prepareInterceptorToRemoveElementBeforeCall("isDisplayed");

				const raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

				expect(raceConditionElement()).toBe(false);
			});

			it("returns true when element is present", () => {
				const raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

				expect(raceConditionElement()).toBe(true);
			});
		});

		describe("textToBePresentInElement", () => {

			it("returns false when element is removed between isPresent and getText", () => {
				prepareInterceptorToRemoveElementBeforeCall("getText");

				const raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);
				expect(raceConditionElement()).toBe(false);
			});

			it("returns true when text is present", () => {
				const raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);
				expect(raceConditionElement()).toBe(true);
			});

			it("returns true when wrong text is present", () => {
				const raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, "WRONG_TEXT");
				expect(raceConditionElement()).toBe(false);
			});
		});
	});

});
