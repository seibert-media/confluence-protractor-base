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

	expectPromiseFail: function (promise, done, expectedError) {
		if (!done instanceof Function) {
			throw new Error('jasmine done() callback missing')
		}

		promise.then(function (value) {
			done.fail('Expected assert to fail // value: ' + value);
		}).catch(function (error) {
			if (expectedError && !jasmine.matchersUtil.equals(error, expectedError)) {
				done.fail('Expected ' + expectedError + ', but was ' + error + '.');
			}
			done();
		});
	},
	createDomElement: function (name, properties) {
		return browser.executeScript(function (name, properties) {
			var element = document.createElement(name);

			properties = properties || {};

			if (properties.content) {
				element.appendChild(document.createTextNode(properties.content));
				delete properties.content;
			}

			Object.keys(properties).forEach(function (key) {
				element[key] = properties[key];
			});

			document.body.appendChild(element);

			return element;
		}, name, properties);
	},
	removeDomElement: function (cssSelector) {
		return browser.executeScript(function (cssSelector) {
			var e = document.querySelector(cssSelector);
			if (e) {
				e.remove();
			}
		}, cssSelector);
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

		// add promise returning function
		element[options.promise.name] = function () {
			return promiseMock;
		};

		return element;
	}
};

module.exports = testUtils;