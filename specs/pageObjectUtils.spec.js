
var pageObjectUtils = require('../utils/pageObjectUtils');
var customMatchers = require('../jasmineMatchers/customMatchers');

describe('pageObjectUtils', function() {

	beforeEach(function () {
		jasmine.addMatchers(customMatchers);
	});

	function expectPromiseToBeResolved(promise, done, message) {
		if (!done instanceof Function) {
			throw new Error('jasmine done() callback missing')
		}
		message = message || 'Unexpected fail in assertion';
		promise.then(function () {
			done();
		}).catch(function (reason) {
			done.fail(message + ' // reason: ' + reason);
		});
	}

	function expectPromiseFail(promise, done, message) {
		if (!done instanceof Function) {
			throw new Error('jasmine done() callback missing')
		}

		message = message || 'Expected assert to fail';

		promise.then(function (value) {
			done.fail(message + ' // value: ' + value);
		}).catch(function () {
			done();
		});
	}

	describe('assert()', function () {
		it('passes expected values', function (done) {
			var promiseWithExpectedValue = Promise.resolve('Expected value');
			var assertPromise = pageObjectUtils.assert(promiseWithExpectedValue, 'Expected value', 'Error message');

			expectPromiseToBeResolved(assertPromise, done);
		});

		it('fails on unexpected values', function (done) {
			var promiseWithUnexpectedValue = Promise.resolve('Unexpected value');
			var assertPromise = pageObjectUtils.assert(promiseWithUnexpectedValue, 'Expected value', 'Error message');
			expectPromiseFail(assertPromise, done);
		});
	})
});
