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

export interface PageActions {
	createPage: ConfluenceAction;
	displayPage: ConfluenceAction;
}

export class ConfluencePage extends ConfluenceBase {

	public pageEditor = new ConfluenceEditor();
	public pageActions: PageActions;

	private pageName: string;
	private spaceKey: string;

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

	public newPage() {
		this.pageActions.createPage.open();
		this.setPageName(this.pageName);
	}

	public create() {
		this.newPage();
		this.pageEditor.save();
		browser.wait(ExpectedConditions.visibilityOf(element(by.id("title-text"))), DEFAULT_LOADING_TIMEOUT);
	}

	public open() {
		this.pageActions.displayPage.open();
	}

	public edit() {
		this.open();
		this.pageEditor.hasEditor().then((hasEditor) => {
			if (!hasEditor) {
				asyncElement(by.id("editPageLink")).click();
				this.pageEditor.waitUntilEditorOpened();
				this.pageEditor.discardDraftIfPresent();
			}
		});
	}

	public getEditor() {
		return this.pageEditor;
	}

	public remove() {
		this.open();
		this.openActionMenu();

		asyncElement(by.id("action-remove-content-link")).click();
		let confirmSelector = "confirm";
		if (this.confluenceVersion().greaterThan("5.10")) {
			confirmSelector = "delete-dialog-next";
		}
		asyncElement(by.id(confirmSelector)).click();
		this.skipRemovalNotificationIfPresent();
	}

	public skipRemovalNotificationIfPresent() {
		const removalNotification = element(by.css(".aui-message-success .icon-close"));
		pageObjectUtils.clickIfPresentAsync(removalNotification);
	}

	public openActionMenu() {
		element(by.id("action-menu-link")).click();
	}

	public copyPage(pageName?: string): ConfluencePage {
		this.open();
		this.openActionMenu();
		asyncElement(by.id("action-copy-page-link")).click();

		pageObjectUtils.clickIfPresentAsync(element(by.id("copy-dialog-next")));

		let newPageName = "Copy of " + this.pageName;
		if (pageName) {
			newPageName = pageName;
			this.setPageName(newPageName);
		}
		return new ConfluencePage(newPageName, this.spaceKey);
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

	public getLabelSuggestions(label: string): ElementArrayFinder {
		const EC = ExpectedConditions;
		const labelsEditor = this.openLabelEditor();
		browser.wait(EC.visibilityOf(element(labelsEditor)), DEFAULT_LOADING_TIMEOUT);
		this.sendLabelToInput(label);
		browser.wait(EC.visibilityOf(element(by.css("#labels-autocomplete-list .aui-dropdown ol.last"))),
			DEFAULT_LOADING_TIMEOUT);
		return element.all(by.css("#labels-autocomplete-list .aui-dropdown ol.last li"));
	}

	public getPageName(): string {
		return this.pageName;
	}

	public getSpaceKey(): string {
		return this.pageName;
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

	private sendLabelToInput(label: string) {
		const labelInput = element(by.id("labels-string"));
		waitForElementToBeClickable(labelInput);
		labelInput.sendKeys(label);
	}

	private openLabelEditor() {
		element(by.css("a.show-labels-editor")).click();
		return by.id("edit-labels-dialog");
	}

	private setPageName(pageName: string) {
		const titleInputField = element(by.id("content-title"));
		titleInputField.clear();
		titleInputField.sendKeys(pageName);
	}

}
