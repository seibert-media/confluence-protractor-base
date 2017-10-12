import {browser, by, element, ElementFinder, ExpectedConditions} from "protractor";
import {promise} from "selenium-webdriver";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceBase} from "./ConfluenceBase";
import {ConfluenceEditorFakeInput} from "./editor/ConfluenceEditorFakeInput";

const asyncElement = pageObjectUtils.asyncElement;
const skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;
const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

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

	public discardDraftIfPresent() {
		const draftMessage = element(by.id("draft-messages"));
		draftMessage.isPresent().then((presence) => {
			if (presence) {
				draftMessage.element(by.className("discard-draft")).click();
			}
		});
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
