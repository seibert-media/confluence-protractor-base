import {pageObjectUtils} from "../utils/pageObjectUtils";
import CustomReporterResult = jasmine.CustomReporterResult;

let enabled: boolean;
enabled = true;

export const screenshotReporter = {
	enable() {
		enabled = true;
	},
	disable() {
		enabled = false;
	},
	specDone(result: CustomReporterResult) {
		if (result.status === "disabled" || !enabled) {
			return;
		}

		pageObjectUtils.takeScreenshot(result.status + " - " + result.fullName + ".png");
	},
};
