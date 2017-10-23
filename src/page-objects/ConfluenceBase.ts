import {by, element, ElementFinder} from "protractor";
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

	public disableSynchrony() {
		if (this.confluenceVersion().greaterThan("5.10")) {
			console.log("disable synchrony");
			this.openAdminPage("admin/confluence-collaborative-editor-plugin/configure.action");
			takeScreenshot("disabling_synchrony.png");

			asyncElement(by.css(".action-button"), DEFAULT_LOADING_TIMEOUT).click();

			asyncElement(by.id("mode-disabled"), DEFAULT_LOADING_TIMEOUT).click();

			takeScreenshot("disabled_synchrony.png");

			asyncElement(by.id("dialog-submit-button"), DEFAULT_LOADING_TIMEOUT).click();
		} else {
			console.log("skipped disable synchrony as Confluence version <= 5.10");
		}
	}

	public disableNotifications() {
		if (this.confluenceVersion().greaterThan("5.9")) {
			if (this.confluenceVersion().lessThan("6.5")) {
				this.openAdminPage("plugins/servlet/stp/view/?source=notification");
			} else {
				this.openAdminPage("plugins/servlet/troubleshooting/view");
			}
			takeScreenshot("disabling_notifications.png");

			asyncElement(by.css(".notification-toggle"), DEFAULT_LOADING_TIMEOUT).click();

			takeScreenshot("disabled_notifications.png");

			element(by.css('option[value="critical"]')).click();
		} else {
			console.log("skipped disable notifications as Confluence version <= 5.9");
		}
	}

	public skipNotifications() {
		takeScreenshot("skip_notifications.png");
		element.all(by.css(".dismiss-notification")).each((notification: ElementFinder) => {
			console.log("skipped notification");
			notification.click();
		});
	}
}
