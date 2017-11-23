import {ElementFinder} from "protractor/built";
import {By} from "selenium-webdriver";
import {pageObjectUtils} from "../pageObjectUtils";

const asyncElement = pageObjectUtils.asyncElement;

export class Button {

	private selector: By;

	constructor(selector: By) {
		this.selector = selector;
	}

	public element(): ElementFinder {
		return asyncElement(this.selector);
	}

	public click(): any {
		return this.element().click();
	}
}
