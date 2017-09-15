import {ElementFinder} from "protractor/built";
import {By, promise} from "selenium-webdriver";
import {pageObjectUtils} from "../pageObjectUtils";

const asyncElement = pageObjectUtils.asyncElement;

export class RadioOption {
	private selector: By;

	constructor(selector: By) {
		this.selector = selector;
	}

	public element(): ElementFinder {
		return asyncElement(this.selector);
	}

	public isSelected(): promise.Promise<boolean> {
		return this.element().getAttribute("checked").then((checked) => checked === "true");
	}

	public select(): any {
		return this.element().click();
	}
}
