const _ = require("lodash");

// let enabled = false;
//
// let refs;
//
// function getSpecReferences() {
// 	const specs = [];
// 	const suites = [];
//
// 	// Use specFilter to gather references to all specs.
// 	jasmine.getEnv().specFilter = (spec) => {
// 		specs.push(spec);
// 		return true;
// 	};
//
// 	// Wrap jasmine's describe function to gather references to all suites.
// 	jasmine.getEnv().describe = _.wrap(jasmine.getEnv().describe, (describe) => {
// 		const args = Array.prototype.slice.call(arguments, 1);
// 		const suite = describe.apply(null, args);
// 		suites.push(suite);
// 		return suite;
// 	});
//
// 	return {
// 		specs,
// 		suites,
// 	};
// }
//
// function disableSpecs() {
// 	if (!refs) {
// 		throw new Error("jasmine-fail-fast: Must call init() before calling disableSpecs()!");
// 	}
//
// 	refs.specs.forEach((spec) => {
// 		spec.disable();
// 	});
//
// 	refs.suites.forEach((suite) => {
// 		suite.beforeFns = [];
// 		suite.afterFns = [];
// 		suite.beforeAllFns = [];
// 		suite.afterAllFns = [];
// 	});
// }

export const failFastReporter = {
	init() {
		// refs = getSpecReferences();
	},
	enable() {
		// enabled = true;
	},
	disable() {
		// enabled = false;
	},
	specDone(result) {
		// if (result.status !== "failed" || !enabled) {
		// 	return;
		// }
		//
		// disableSpecs();
	},
};
