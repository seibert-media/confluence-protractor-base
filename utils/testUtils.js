var testUtils = {
	expectPromiseToBeResolved: function (promise, done, message) {
		if (!done instanceof Function) {
			throw new Error('jasmine done() callback missing')
		}
		message = message || 'Unexpected fail in assertion';
		promise.then(function () {
			done();
		}).catch(function (reason) {
			done.fail(message + ' // reason: ' + reason);
		});
	},

	expectPromiseFail: function (promise, done, message) {
		if (!done instanceof Function) {
			throw new Error('jasmine done() callback missing')
		}

		message = message || 'Expected assert to fail';

		promise.then(function (value) {
			done.fail(message + ' // value: ' + value);
		}).catch(function () {
			done();
		});
	},
	mockElement: function (options) {
		var doneFn;

		if (!options.spy) {
			throw new Error('No spy in options');
		}

		if (!(options.promise && options.promise.name)) {
			throw new Error('No promise mock defined');
		}

		var promiseMock = Promise.resolve(options.promise.value);

		promiseMock.then(function () {
			if (!(doneFn instanceof Function && doneFn.fail instanceof Function)) {
				done.fail('registerDone() must be called as last statement in it()')
			}
		});

		var element = {
			registerDone: function (done, beforeDone) {
				doneFn = done;

				promiseMock.then(function () {
					if (beforeDone) {
						beforeDone();
					}
					done();
				});
			}
		};

		// create dummy function add add as spy
		element[options.spy] = function () {
		};
		spyOn(element, options.spy);

		element[options.promise.name] = function () {
			return promiseMock;
		};

		return element;
	}
};

module.exports = testUtils;
