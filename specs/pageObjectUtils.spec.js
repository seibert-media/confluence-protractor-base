
var testUtils = require('../utils/testUtils');
var pageObjectUtils = require('../utils/pageObjectUtils');

describe('pageObjectUtils', function() {

	// switch to empty page
	browser.get('data:,');

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

		function addTestElementAsync(elementId) {
			setTimeout(function () {
				testUtils.createDomElement('h1', {
					id: elementId,
					content: 'Test'
				});
			}, 1000); // default time out is 2000ms (see utils/pageObjectUtils.js)
		}

		it('fails when element() is used instead', function () {
			var elementIds = 'test-element';
			var selector = by.css('h1');
			var testElement = element(selector);

			addTestElementAsync('test-element');

			expect(testElement.isPresent()).toBe(false);
		});


		it('fails when element() is used instead', function () {
			var elementIds = 'test-element';
			var selector = by.css('h1');
			var testElement = pageObjectUtils.asyncElement(selector);

			addTestElementAsync('test-element');

			expect(testElement.isPresent()).toBe(true);
		});


	});
});
