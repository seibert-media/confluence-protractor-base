import {browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions} from "protractor";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceAction} from "./ConfluenceAction";
import {ConfluenceBase} from "./ConfluenceBase";
import {ConfluenceEditor} from "./ConfluenceEditor";

const asyncElement = pageObjectUtils.asyncElement;
const waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;
const skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;
const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
const DEFAULT_ELEMENT_TIMEOUT = pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT;

export class ConfluencePage extends ConfluenceBase {

	private pageName: string;
	private spaceKey: string;

	private pageEditor = new ConfluenceEditor();

	private pageActions;

	constructor(pageName: string, spaceKey: string) {
		super();
		pageObjectUtils.assertNotNull(pageName, 'First param "pageName" must be set');
		pageObjectUtils.assertNotNull(spaceKey, 'Second param "spaceKey" must be set');

		this.pageName = pageName;
		this.spaceKey = spaceKey;

		this.pageActions = {
			createPage: new ConfluenceAction({
				path: "pages/createpage.action?spaceKey=" + this.spaceKey,
			}),
			displayPage: new ConfluenceAction({
				path: "display/" + this.spaceKey + "/" + this.pageName,
			}),
		};
	}

	public create() {
		this.pageActions.createPage.open();
		element(by.id("content-title")).sendKeys(this.pageName);
		this.pageEditor.save();
		browser.wait(ExpectedConditions.visibilityOf(element(by.id("title-text"))), DEFAULT_LOADING_TIMEOUT);
	}

	public remove() {
		this.openActionMenu();

		asyncElement(by.id("action-remove-content-link")).click();
		let confirmSelector = "confirm";
		if (this.confluenceVersion().greaterThan("5.10")) {
			confirmSelector = "delete-dialog-next";
		}
		asyncElement(by.id(confirmSelector)).click();
	}

	public openActionMenu() {
		element(by.id("action-menu-link")).click();
	}

	public addLabels(labels: string[]) {
		this.pageActions.displayPage.open();

		const labelsEditor = this.openLabelEditor();
		browser.wait(ExpectedConditions.visibilityOf(element(labelsEditor)), DEFAULT_LOADING_TIMEOUT);
		labels.forEach((label) => {
			this.sendLabelToInput(label);
			element(by.id("add-labels-editor-button")).click();
		});
	}

	public getLabelSuggestions(label): ElementArrayFinder {
		const EC = ExpectedConditions;
		const labelsEditor = this.openLabelEditor();
		browser.wait(EC.visibilityOf(element(labelsEditor)), DEFAULT_LOADING_TIMEOUT);
		this.sendLabelToInput(label);
		browser.wait(EC.visibilityOf(element(by.css("#labels-autocomplete-list .aui-dropdown ol.last"))),
			DEFAULT_LOADING_TIMEOUT);
		return element.all(by.css("#labels-autocomplete-list .aui-dropdown ol.last li"));
	}

	public getComments() {
		return element.all(by.css("#page-comments .comment"));
	}

	public hasComments(): any {
		return this.getComments().count().then((count) => count > 0);
	}

	public getLatestComment(): ElementFinder {
		return this.getComments().last();
	}

	public getLatestCommentContent(): any {
		return this.getLatestComment().element(by.css(".comment-content")).getText();
	}

	public removeLatestComment() {
		const latestComment = this.getLatestComment();
		latestComment.element(by.css(".comment-action-remove")).click();

		skipAlertIfPresent();

		browser.wait(ExpectedConditions.stalenessOf(latestComment), DEFAULT_ELEMENT_TIMEOUT);
	}

	private sendLabelToInput(label) {
		const labelInput = element(by.id("labels-string"));
		waitForElementToBeClickable(labelInput);
		labelInput.sendKeys(label);
	}

	private openLabelEditor() {
		element(by.css("a.show-labels-editor")).click();
		return by.id("edit-labels-dialog");
	}
}
