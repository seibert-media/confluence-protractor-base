const _ = require("lodash");

let enabled = false;

let refs: any;

function getSpecReferences(): any {
	const specs: any[] = [];
	const suites: any[] = [];

	// Use specFilter to gather references to all specs.
	jasmine.getEnv().specFilter = (spec) => {
		specs.push(spec);
		return true;
	};

	// Wrap jasmine's describe function to gather references to all suites.
	jasmine.getEnv().describe = _.wrap(jasmine.getEnv().describe, (describe: any, ...args: any[]) => {
		const suite = describe.apply(null, args);
		suites.push(suite);
		return suite;
	});

	return {
		specs,
		suites,
	};
}

function disableSpecs() {
	if (!refs) {
		throw new Error("jasmine-fail-fast: Must call init() before calling disableSpecs()!");
	}

	refs.specs.forEach((spec: any) => {
		spec.disable();
	});

	refs.suites.forEach((suite: any) => {
		suite.beforeFns = [];
		suite.afterFns = [];
		suite.beforeAllFns = [];
		suite.afterAllFns = [];
	});
}

export const failFastReporter = {
	init: () => {
		refs = getSpecReferences();
	},
	enable: () => {
		enabled = true;
	},
	disable: () => {
		enabled = false;
	},
	specDone: (result: any) => {
		if (result.status !== "failed" || !enabled) {
			return;
		}

		disableSpecs();
	},
};
