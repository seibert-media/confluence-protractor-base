import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {Version} from "../utils/Version";
import {ConfluenceLogin} from "./ConfluenceLogin";

const openPage = pageObjectUtils.openPage;

// cache confluence version for all ConfluenceLogin instances
let confluenceVersion;

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
}
