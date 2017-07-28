import {browser, ExpectedConditions} from "protractor";
import {Key} from "selenium-webdriver";
import {pageObjectUtils} from "../pageObjectUtils";

const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

export class AutocompleteSearch {

	public foundExpectedResult;

	private searchTerm: string;
	private searchEndedCondition;
	private resultCondition;
	private inputElement;

	constructor(options) {
		const EC = ExpectedConditions;

		pageObjectUtils.assertNotNull(options.inputElement, "options.inputElement is required");
		pageObjectUtils.assertNotNull(options.searchTerm, "options.searchTerm is required");
		pageObjectUtils.assertNotNull(options.resultContainer, "options.resultContainer is required");

		this.searchTerm = options.searchTerm;
		this.inputElement = options.inputElement;

		if (options.resultElement) {
			this.resultCondition = EC.visibilityOf(options.resultElement);
		} else {
			this.resultCondition = EC.textToBePresentInElement(options.resultContainer, options.searchTerm);
		}

		if (options.noResultText) {
			const noResultCondition = EC.textToBePresentInElement(options.resultContainer, options.noResultText);
			this.searchEndedCondition = EC.or(this.resultCondition, noResultCondition);
		} else {
			this.searchEndedCondition = EC.visibilityOf(options.resultContainer);
		}

		this.foundExpectedResult = this.resultCondition;
	}

	public search(options) {
		options = options || {};
		const searchPrefix = options.searchPrefix || "";

		if (!options.skipClear) {
			this.inputElement.clear();
		}

		this.inputElement.sendKeys(searchPrefix + this.searchTerm);
		return this;
	}

	public selectResult() {
		this.inputElement.sendKeys(Key.ENTER);
		return this;
	}

	public clearAndLeave() {
		this.inputElement.clear();
		this.inputElement.sendKeys("\t");
		return this;
	}

	public waitForResult() {
		browser.wait(this.searchEndedCondition, DEFAULT_LOADING_TIMEOUT);
		return this;
	}

	public waitUntilResultsNotPresent() {
		browser.wait(ExpectedConditions.not(this.searchEndedCondition), DEFAULT_LOADING_TIMEOUT);
		return this;
	}

	public waitForMatchingResult() {
		browser.wait(this.resultCondition, DEFAULT_LOADING_TIMEOUT);
		return this;
	}

}
