import {by} from "protractor";
import {ElementFinder} from "protractor/built";
import {By, promise} from "selenium-webdriver";
import {pageObjectUtils} from "../pageObjectUtils";

const asyncElement = pageObjectUtils.asyncElement;

export class SelectBox {

	private selector: By;

	constructor(selector: By) {
		this.selector = selector;
	}

	public element(): ElementFinder {
		return asyncElement(this.selector);
	};

	public getSelectedValue(): promise.Promise<string> {
		return this.element().element(by.css('option:checked')).getText();
	};

	public selectValue(value: string): any {
		return this.element().element(by.cssContainingText('option', value)).click();
	};
}
