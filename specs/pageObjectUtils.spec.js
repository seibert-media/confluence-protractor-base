
var testUtils = require('../utils/testUtils');
var pageObjectUtils = require('../utils/pageObjectUtils');

describe('pageObjectUtils', function() {

	// switch to empty page
	beforeAll(function () {
		browser.get('data:,');
	});

	describe('assert()', function () {
		it('passes expected values', function (done) {
			var promiseWithExpectedValue = Promise.resolve('Expected value');
			var assertPromise = pageObjectUtils.assert(promiseWithExpectedValue, 'Expected value', 'Error message');

			testUtils.expectPromiseToBeResolved(assertPromise, done);
		});

		it('fails on unexpected values', function (done) {
			var promiseWithUnexpectedValue = Promise.resolve('Unexpected value');
			var assertPromise = pageObjectUtils.assert(promiseWithUnexpectedValue, 'Expected value', 'Error message');
			testUtils.expectPromiseFail(assertPromise, done);
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


		it('extracts the "path" (non-standard) from url', function () {
			expect(location.path).toBe('login.action');
		});

		it('extracts the "search" from url', function () {
			expect(location.search).toBe('?permissionViolation=true');
		});

		it('extracts the "hash" from url', function () {
			expect(location.hash).toBe('#someHash');
		});
	})
});
