import {pageObjectUtils} from "../utils/pageObjectUtils";

let enabled: boolean;
enabled = true;

export const screenshotReporter = {
	enable() {
		enabled = true;
	},
	disable() {
		enabled = false;
	},
	specDone(result) {
		if (result.status === "disabled" || !enabled) {
			return;
		}

		pageObjectUtils.takeScreenshot(result.status + " - " + result.fullName + ".png");
	},
};
