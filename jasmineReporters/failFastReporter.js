var _ = require('lodash');

var enabled = true;

var refs;

function getSpecReferences() {
	var specs = [];
	var suites = [];

	// Use specFilter to gather references to all specs.
	jasmine.getEnv().specFilter = function (spec) {
		specs.push(spec);
		return true;
	};

	// Wrap jasmine's describe function to gather references to all suites.
	jasmine.getEnv().describe = _.wrap(jasmine.getEnv().describe, function (describe) {
		var args = Array.prototype.slice.call(arguments, 1);
		var suite = describe.apply(null, args);
		suites.push(suite);
		return suite;
	});

	return {
		specs: specs,
		suites: suites
	};
}

function disableSpecs() {
	if (!refs) {
		throw new Error('jasmine-fail-fast: Must call init() before calling disableSpecs()!');
	}

	refs.specs.forEach(function (spec) {
		spec.disable()
	});

	refs.suites.forEach(function (suite ) {
		suite.beforeFns = [];
		suite.afterFns = [];
		suite.beforeAllFns = [];
		suite.afterAllFns = [];
	});
}

module.exports = {
	init: function () {
		refs = getSpecReferences();
	},
	enable: function () {
		enabled = true;
	},
	disable: function () {
		enabled = false;
	},
	specDone: function(result) {
		if (result.status !== 'failed' || !enabled) {
			return;
		}

		disableSpecs();
	}
};
