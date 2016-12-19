
var testUtils = require('../utils/testUtils');
var pageObjectUtils = require('../utils/pageObjectUtils');

describe('pageObjectUtils', function() {

	// switch to empty page
	beforeAll(function () {
		browser.get('data:,');
	});

	fdescribe('assertNotNullSync()', function () {
		it('passes not null values', function () {
			pageObjectUtils.assertNotNullSync('');
			pageObjectUtils.assertNotNullSync({});
			pageObjectUtils.assertNotNullSync(10);
		});

		it('fails on unexpected values', function () {
			expect(function () {
				pageObjectUtils.assertNotNullSync(null);
			}).toThrow(new Error('AssertionError for PageObject: Expected non-null value, but was null.'))
		});
	});

	describe('assertEqualsSync()', function () {
		it('passes expected values', function () {
			pageObjectUtils.assertEqualsSync('Ex', 'Ex');
		});

		it('passes expected object values', function () {
			pageObjectUtils.assertEqualsSync({x:10}, {x:10});
		});

		it('fails on unexpected values', function () {
			expect(function () {
				pageObjectUtils.assertEqualsSync('Val', 'Ex', 'Error message');
			}).toThrow(new Error('AssertionError for PageObject: Error message'))
		});

		it('fails on unexpected values with default message', function () {
			expect(function () {
				pageObjectUtils.assertEqualsSync('Val', 'Ex');
			}).toThrow(new Error('AssertionError for PageObject: Expected "Ex", but was "Val".'))
		});
	});

	describe('assertEquals()', function () {
		it('has assert as alias', function () {
			expect(pageObjectUtils.assertEquals).toBe(pageObjectUtils.assert);
		})
		it('passes expected values', function (done) {
			var promiseWithExpectedValue = Promise.resolve('Ex');
			var assertPromise = pageObjectUtils.assertEquals(promiseWithExpectedValue, 'Ex', 'Error message');

			testUtils.expectPromiseToBeResolved(assertPromise, done);
		});

		it('fails on unexpected values', function (done) {
			var promiseWithUnexpectedValue = Promise.resolve('Val');
			var assertPromise = pageObjectUtils.assertEquals(promiseWithUnexpectedValue, 'Ex', 'Error message');
			testUtils.expectPromiseFail(assertPromise, done, new Error('AssertionError for PageObject: Error message'));
		});

		it('fails on unexpected values with default message', function (done) {
			var promiseWithUnexpectedValue = Promise.resolve('Val');
			var assertPromise = pageObjectUtils.assertEquals(promiseWithUnexpectedValue, 'Ex');
			testUtils.expectPromiseFail(assertPromise, done, new Error('AssertionError for PageObject: Expected "Ex", but was "Val".'));
		});
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
		})

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
	})
});
