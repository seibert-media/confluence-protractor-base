
var testUtils = require('../utils/testUtils');
var pageObjectUtils = require('../utils/pageObjectUtils');

var screenshotReporter = require('../jasmineReporters/screenshotReporter');

describe('pageObjectUtils', function() {

	beforeEach(screenshotReporter.disable);
	afterAll(screenshotReporter.enable);

	// switch to empty page
	beforeAll(function () {
		browser.get('data:,');
	});

	describe('assertNotNull()', function () {
		it('passes not null values', function () {
			pageObjectUtils.assertNotNull('');
			pageObjectUtils.assertNotNull({});
			pageObjectUtils.assertNotNull(10);
		});

		it('fails on unexpected values', function () {
			expect(function () {
				pageObjectUtils.assertNotNull(null);
			}).toThrow(new Error('AssertionError for PageObject: Expected non-null value, but was null'))
		});
	});

	describe('assertEquals()', function () {
		it('passes expected values', function () {
			pageObjectUtils.assertEquals('Ex', 'Ex');
		});

		it('passes expected object values', function () {
			pageObjectUtils.assertEquals({x:10}, {x:10});
		});

		it('fails on unexpected values', function () {
			expect(function () {
				pageObjectUtils.assertEquals('Val', 'Ex', 'Error message');
			}).toThrow(new Error('AssertionError for PageObject: Error message (Expected "Ex", but was "Val")'));
		});

		it('fails on unexpected values with default message', function () {
			expect(function () {
				pageObjectUtils.assertEquals('Val', 'Ex');
			}).toThrow(new Error('AssertionError for PageObject: Expected "Ex", but was "Val"'));
		});

		describe('promise handling', function () {
			it('has assert as alias', function () {
				expect(pageObjectUtils.assertEquals).toBe(pageObjectUtils.assert);
			});

			it('passes expected values', function (done) {
				var promiseWithExpectedValue = Promise.resolve('Ex');
				var assertPromise = pageObjectUtils.assertEquals(promiseWithExpectedValue, 'Ex', 'Error message');

				testUtils.expectPromiseToBeResolved(assertPromise, done);
			});

			it('fails on unexpected values', function (done) {
				var promiseWithUnexpectedValue = Promise.resolve('Val');
				var assertPromise = pageObjectUtils.assertEquals(promiseWithUnexpectedValue, 'Ex', 'Error message');
				testUtils.expectPromiseFail(assertPromise, done, new Error('AssertionError for PageObject: Error message (Expected "Ex", but was "Val")'));
			});

			it('fails on unexpected values with default message', function (done) {
				var promiseWithUnexpectedValue = Promise.resolve('Val');
				var assertPromise = pageObjectUtils.assertEquals(promiseWithUnexpectedValue, 'Ex');
				testUtils.expectPromiseFail(assertPromise, done, new Error('AssertionError for PageObject: Expected "Ex", but was "Val"'));
			});
		})
	});

	describe('clickIfPresent()', function () {

		function clickableElementWithPresentState(isPresent) {
			return testUtils.mockElement({
				spy: 'click',
				promise: {
					name: 'isPresent',
					value: isPresent
				}
			});
		}

		it('calls the element click function when isPresent() promise returns true', function (done) {
			var clickableElement = clickableElementWithPresentState(true);

			pageObjectUtils.clickIfPresent(clickableElement);

			clickableElement.registerDone(done, function () {
				expect(clickableElement.click).toHaveBeenCalled();
			});
		});

		it('calls the element click function when isPresent() promise returns false', function (done) {
			var clickableElement = clickableElementWithPresentState(false);

			pageObjectUtils.clickIfPresent(clickableElement);

			clickableElement.registerDone(done, function () {
				expect(clickableElement.click).not.toHaveBeenCalled();
			});
		});

	});

	describe('asyncElement()', function () {

		function addTestElementAsync(id) {
			setTimeout(function () {
				testUtils.createDomElement('h1', {
					id: id,
					content: id
				});
			}, 1000); // default time out is 2000ms (see utils/pageObjectUtils.js)
		}

		it('not identical with element', function () {
			expect(pageObjectUtils.asyncElement).not.toBe(element);
		});

		it('fails when element() is used instead', function () {
			var id = 'headline-for-element';
			var testElement = element(by.id(id));

			addTestElementAsync(id);

			expect(testElement.isPresent()).toBe(false);
		});

		it('waits until element is present in document', function () {
			var id = 'headline-for-async-element';
			var testElement = pageObjectUtils.asyncElement(by.id(id));

			addTestElementAsync(id);

			expect(testElement.isPresent()).toBe(true);
		});

	});

	describe('urlToLocation()', function () {
		var testUrl = 'login.action?permissionViolation=true#someHash';
		var location;

		beforeEach(function () {
			pageObjectUtils.openPage(testUrl);

			location = pageObjectUtils.getLocation()
		});

		it('extracts the "href "from url', function () {
			expect(location.href).toEqual('http://localhost:8090/login.action?permissionViolation=true#someHash');
		});

		it('extracts the "protocol" from url', function () {
			expect(location.protocol).toBe('http:');
		});

		it('extracts the "host" from url', function () {
			expect(location.host).toBe('localhost:8090');
		});

		it('extracts the "hostname" from url', function () {
			expect(location.hostname).toBe('localhost');
		});

		it('extracts the "port" from url', function () {
			expect(location.port).toBe('8090');
		});

		it('extracts the "pathname" from url', function () {
			expect(location.pathname).toBe('/login.action');
		});

		it('extracts the "search" from url', function () {
			expect(location.search).toBe('?permissionViolation=true');
		});

		it('extracts the "hash" from url', function () {
			expect(location.hash).toBe('#someHash');
		});

		describe('non stardard helper attributes', function () {
			it('extracts the "path" (non-standard) from url', function () {
				expect(location.path).toBe('login.action');
			});

			it('extracts the "pathWithSearch" (non-standard) from url', function () {
				expect(location.pathWithSearch).toBe('login.action?permissionViolation=true');
			});

			it('extracts the "pathWithSearchAndHash" (non-standard) from url', function () {
				expect(location.pathWithSearchAndHash).toBe('login.action?permissionViolation=true#someHash');
			});
		})
	});

	describe('takeScreenshot()', function () {
		beforeEach(function () {
			spyOn(browser, 'takeScreenshot').and.returnValue({then: function () {}});
		});

		it('calls takeScreenshot with same parameter', function() {
			pageObjectUtils.takeScreenshot('image_a.png');

			expect(browser.takeScreenshot).toHaveBeenCalled();
		});

		it('calls takeScreenshot only once', function () {
			pageObjectUtils.takeScreenshot('image_b.png');
			pageObjectUtils.takeScreenshot('image_b.png');
			pageObjectUtils.takeScreenshot('image_b.png');

			expect(browser.takeScreenshot).toHaveBeenCalledTimes(1);
		});

		it('calls takeScreenshot twice for different image names', function () {
			pageObjectUtils.takeScreenshot('image_c.png');
			pageObjectUtils.takeScreenshot('image_d.png');

			pageObjectUtils.takeScreenshot('image_c.png');

			expect(browser.takeScreenshot).toHaveBeenCalledTimes(2);
		});
	});

	describe('configure timeouts', function () {

		describe('DEFAULT_ELEMENT_TIMEOUT', function () {
			it('has a default of 2 seconds', function () {
				expect(pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT).toBe(2000);
			});

			it('loads a configured value', function () {
				pageObjectUtils.setDefaultElementTimeout(500);
				expect(require('../utils/pageObjectUtils').DEFAULT_ELEMENT_TIMEOUT).toBe(500);
			});
		});

		describe('DEFAULT_LOADING_TIMEOUT', function () {
			it('has a default of 15 seconds', function () {
				expect(pageObjectUtils.DEFAULT_LOADING_TIMEOUT).toBe(15000);
			});

			it('loads a configured value', function () {
				pageObjectUtils.setDefaultLoadingTimeout(5000);
				expect(require('../utils/pageObjectUtils').DEFAULT_LOADING_TIMEOUT).toBe(5000);
			});
		});
	});

	describe('race condition workarounds (imported)', function () {
		var EC = protractor.ExpectedConditions;

		var RACE_CONDITION_ELEMENT_ID = 'race-condition-element';
		var RACE_CONDITION_ELEMENT;

		function createTestElement() {
			RACE_CONDITION_ELEMENT = element(by.id(RACE_CONDITION_ELEMENT_ID));

			testUtils.createDomElement('div', {
				id: RACE_CONDITION_ELEMENT_ID,
				content: RACE_CONDITION_ELEMENT_ID
			});
		}

		function removeTestElement() {
			testUtils.removeDomElement('#' + RACE_CONDITION_ELEMENT_ID)
		}

		beforeEach(createTestElement);
		afterEach(removeTestElement);

		function prepareInterceptorToRemoveElementBeforeCall(fn) {
			var originalIsDisplayedFn = RACE_CONDITION_ELEMENT[fn];

			RACE_CONDITION_ELEMENT[fn] = function () {
				// Remove element between isPresent and isDisplayed call

				removeTestElement();

				expect(RACE_CONDITION_ELEMENT.isPresent()).toBe(false);

				return originalIsDisplayedFn.call(this);
			};
		}

		describe('visibilityOf', function () {

			it('returns false when element is removed between isPresent and isDisplayed', function () {
				prepareInterceptorToRemoveElementBeforeCall('isDisplayed');

				var raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

				expect(raceConditionElement()).toBe(false);
			});

			it('returns true when element is present', function () {
				var raceConditionElement = EC.visibilityOf(RACE_CONDITION_ELEMENT);

				expect(raceConditionElement()).toBe(true);
			});
		});

		describe('textToBePresentInElement', function () {

			it('returns false when element is removed between isPresent and getText', function () {
				prepareInterceptorToRemoveElementBeforeCall('getText');

				var raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);
				expect(raceConditionElement()).toBe(false);
			});

			it('returns true when text is present', function () {
				var raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, RACE_CONDITION_ELEMENT_ID);
				expect(raceConditionElement()).toBe(true);
			});

			it('returns true when wrong text is present', function () {
				var raceConditionElement = EC.textToBePresentInElement(RACE_CONDITION_ELEMENT, 'WRONG_TEXT');
				expect(raceConditionElement()).toBe(false);
			});
		});
	});

});
