import {browser, by, element, ElementFinder, ExpectedConditions} from "protractor";
import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceBase} from "./ConfluenceBase";
import {ConfluenceEditorFakeInput} from "./editor/ConfluenceEditorFakeInput";

const asyncElement = pageObjectUtils.asyncElement;
const skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;
const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
const DEFAULT_ELEMENT_TIMEOUT = pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT;

export class ConfluenceEditor extends ConfluenceBase {

	// fake input element methods to use page editor for Autocomplete components
	public editor: ConfluenceEditorFakeInput;

	constructor() {
		super();
		this.editor = new ConfluenceEditorFakeInput(this);
	}

	public getEditorFrame(): ElementFinder {
		return element(by.id("wysiwygTextarea_ifr"));
	}

	public hasEditor(): promise.Promise<boolean> {
		return this.getEditorFrame().isPresent();
	}

	public waitUntilEditorOpened() {
		return browser.wait(this.hasEditor.bind(this), DEFAULT_LOADING_TIMEOUT);
	}

	public waitUntilEditorClosed() {
		return browser.wait(ExpectedConditions.not(this.hasEditor.bind(this)), DEFAULT_LOADING_TIMEOUT);
	}

	public discardDraftInternal(discardButtonSelector: string) {
		const discardButton = element(by.css(discardButtonSelector));

		browser.wait(ExpectedConditions.visibilityOf(discardButton), DEFAULT_ELEMENT_TIMEOUT)
			.then((isVisible) => {
				if (isVisible) {
					discardButton.click();
				}
			}, () => {
				// ignore
			});
	}

	public discardDraftIfPresent() {
		let discardButtonSelector = ".discard-draft";
		if (this.confluenceVersion().greaterThanEquals("6.4")) {
			discardButtonSelector = "#qed-discard-button";
		}
		this.discardDraftInternal(discardButtonSelector);
	}

	public keepDraftIfPresent() {
		const discardButtonSelector = "#qed-save-exit-button";
		this.discardDraftInternal(discardButtonSelector);
	}

	public executeInEditorContext(fn: (element: ElementFinder) => any) {
		this.waitUntilEditorOpened();

		browser.switchTo().frame(this.getEditorFrame().getWebElement());

		const fnResult = fn(asyncElement(by.id("tinymce")));

		browser.switchTo().defaultContent();

		return fnResult;
	}

	public save() {
		asyncElement(by.id("rte-button-publish")).click();
	}

	public cancel() {
		asyncElement(by.id("rte-button-cancel")).click();
	}

	public cancelAndDiscardDraft() {
		this.cancel();
		this.discardDraftIfPresent();
	}

	public cancelAndSkipAlert() {
		this.cancel();
		skipAlertIfPresent();
		this.waitUntilEditorClosed();
	}

	public cancelAndClear() {
		this.editor.clear();
		this.cancel();
		this.waitUntilEditorClosed();
	}

	public openComment() {
		element.all(by.css(".quick-comment-prompt")).first().click();
		this.waitUntilEditorOpened();
	}

}
