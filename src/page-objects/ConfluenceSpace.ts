import {browser, by, element, ExpectedConditions} from "protractor";
import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceAction} from "./ConfluenceAction";
import {ConfluenceBase} from "./ConfluenceBase";
import {SpacePermissionAction} from "./space/SpacePermissionAction";
import {SpaceWizard} from "./space/SpaceWizard";

const clickIfPresent = pageObjectUtils.clickIfPresent;
const asyncElement = pageObjectUtils.asyncElement;
const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

const blackSpaceTemplateKey =
	"com.atlassian.confluence.plugins.confluence-create-content-plugin:create-blank-space-item";

export interface SpaceActions {
	spaceDirectory: ConfluenceAction;
	spaceHome: ConfluenceAction;
	removeSpace: ConfluenceAction;
	spaceOverview: ConfluenceAction;
	spacePermissions: SpacePermissionAction;
}

export class ConfluenceSpace extends ConfluenceBase {
	public static createButtonSelector = ".create-dialog-create-button";

	public spaceKey: string;
	public spaceName: string;

	public spaceActions: SpaceActions;

	public spaceWizard: SpaceWizard;

	constructor(spaceKey: string, spaceName?: string) {
		super();
		pageObjectUtils.assertNotNull(spaceKey, 'First param "spaceKey" must be set');

		this.spaceKey = spaceKey;
		this.spaceName = spaceName || spaceKey;
		this.spaceWizard = new SpaceWizard(this);

		this.spaceActions = {
			spaceDirectory: new ConfluenceAction({
				path: "spacedirectory/view.action",
			}),
			spaceHome: new ConfluenceAction({
				path: "display/" + this.spaceKey,
			}),
			removeSpace: new ConfluenceAction({
				path: "spaces/removespace.action?key=" + this.spaceKey,
			}),
			spaceOverview: new ConfluenceAction({
				path: "spaces/viewspacesummary.action?key=" + this.spaceKey,

			}),
			spacePermissions: new SpacePermissionAction(this.spaceKey),
		};
	}

	public assertSpaceExists() {
		pageObjectUtils.assert(this.isInSpaceDirectory(), true,
			"Space NOT in space directory. spaceKey: " + this.spaceKey);
	}

	public assertSpaceExistsNot() {
		pageObjectUtils.assert(this.isInSpaceDirectory(), false,
			"Unexpected space in space directory. spaceKey: " + this.spaceKey);
	}

	public create() {
		this.spaceWizard.open();

		// select space template
		this.spaceWizard.selectTemplate(blackSpaceTemplateKey);

		// fill form
		this.spaceWizard.fillSpaceForm();

		// wait for create button again before click
		this.spaceWizard.clickCreateButton();

		// wait for new space home to be loaded
		browser.wait(ExpectedConditions.urlContains(this.spaceActions.spaceHome.getPath()), DEFAULT_LOADING_TIMEOUT);
	}

	public isInSpaceDirectory(): promise.Promise<boolean> {
		this.spaceActions.spaceDirectory.open({refreshAlways: true});
		return this.spaceEntry().isPresent();
	}

	public waitForSpaceToAppearInSpaceDirectory() {
		browser.wait(this.isInSpaceDirectory.bind(this), DEFAULT_LOADING_TIMEOUT);
	}

	public waitForSpaceToDisappearFromSpaceDirectory() {
		browser.wait(ExpectedConditions.not(this.isInSpaceDirectory.bind(this)), DEFAULT_LOADING_TIMEOUT);
	}

	public remove() {
		this.spaceActions.removeSpace.open();
		clickIfPresent(asyncElement(by.id("confirm")));
		// check and wait for plugin name
		const percentComplete = asyncElement(by.id("percentComplete"));
		browser.wait(() => percentComplete.getText().then((text) => text === "100"), DEFAULT_LOADING_TIMEOUT);
	}

	public getSpaceKey() {
		return this.spaceKey;
	}

	public spaceHomeByPageId() {
		this.spaceActions.spaceDirectory.open({refreshAlways: true});
		this.waitForSpaceToAppearInSpaceDirectory();
		asyncElement(by.css('[data-spacekey="' + this.spaceKey + '"] .space-name a')).click();
	}

	private spaceEntry() {
		element(by.css('[data-tab-name="all"]')).click();
		return asyncElement(by.css('[data-spacekey="' + this.spaceKey + '"]'));
	}
}
