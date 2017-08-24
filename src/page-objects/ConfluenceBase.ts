import {by, element} from "protractor";
import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {Version} from "../utils/Version";
import {ConfluenceLogin} from "./ConfluenceLogin";

const openPage = pageObjectUtils.openPage;
const takeScreenshot = pageObjectUtils.takeScreenshot;
const asyncElement = pageObjectUtils.asyncElement;
const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

// cache confluence version for all ConfluenceLogin instances
let confluenceVersion: Version;

export class ConfluenceBase extends ConfluenceLogin {

	public openAdminPage(path: string = "admin") {
		openPage(path);
		pageObjectUtils.getCurrentPath().then((currentPath) => {
			if (currentPath === "authenticate.action" || currentPath === "login.action") {
				this.authenticateAsAdmin();
				openPage(path);
			}
		});
	}

	public resetConfluenceVersion() {
		confluenceVersion = undefined;
	}

	public loadConfluenceVersion(): promise.Promise<Version> {
		return this.getParamFromAJS("versionNumber").then((version) => {
			confluenceVersion = Version.parse(version);
			return confluenceVersion;
		});
	}

	public confluenceVersion() {
		if (!confluenceVersion) {
			throw new Error("No confluenceVersion is loaded. Use loadConfluenceVersion in a setup function (onPrepare)");
		}
		return confluenceVersion;
	}

	public disableNotifications() {
		if (this.confluenceVersion().greaterThan('5.9')) {
			console.log('disable notifications');
			this.openAdminPage('plugins/servlet/stp/view/?source=notification');
			takeScreenshot('disabling_notifications.png');

			asyncElement(by.css('.notification-toggle'), DEFAULT_LOADING_TIMEOUT).click();

			takeScreenshot('disabled_notifications.png');

			element(by.css('option[value="critical"]')).click();
		} else {
			console.log('skipped disable notifications as version is <= 5.9');
		}
	};

}
