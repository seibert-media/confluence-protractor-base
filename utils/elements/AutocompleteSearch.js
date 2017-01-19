var pageObjectUtils = require('../pageObjectUtils')

function AutocompleteSearch(options) {
	var EC = protractor.ExpectedConditions;
	var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

	var self = this;
	var searchTerm = options.searchTerm;
	var searchEndedCondition, resultCondition;

	pageObjectUtils.assertNotNull(options.inputElement, 'options.inputElement is required');
	pageObjectUtils.assertNotNull(options.searchTerm, 'options.searchTerm is required');
	pageObjectUtils.assertNotNull(options.resultContainer, 'options.resultContainer is required');

	var inputElement = options.inputElement;

	if (options.resultElement) {
		resultCondition = EC.visibilityOf(options.resultElement);
	} else {
		resultCondition = EC.textToBePresentInElement(options.resultContainer, options.searchTerm);
	}

	if (options.noResultText) {
		var noResultCondition = EC.textToBePresentInElement(options.resultContainer, options.noResultText);
		searchEndedCondition = EC.or(resultCondition, noResultCondition)
	} else {
		searchEndedCondition = EC.visibilityOf(options.resultContainer);
	}

	this.search = function (options) {
		var searchPrefix = (options || {}).searchPrefix || '';
		inputElement.clear().sendKeys(searchPrefix + searchTerm);
		return this;
	};

	this.selectResult = function () {
		inputElement.sendKeys(protractor.Key.ENTER);
		return this;
	};

	this.clearAndLeave = function () {
		inputElement.clear().sendKeys('\t');
		return this;
	};

	this.waitForResult = function () {
		browser.wait(searchEndedCondition, DEFAULT_LOADING_TIMEOUT);
		return this;
	};

	this.waitUntilResultsNotPresent = function () {
		browser.wait(EC.not(searchEndedCondition), DEFAULT_LOADING_TIMEOUT);
		return this;
	};

	this.waitForMatchingResult = function () {
		browser.wait(resultCondition, DEFAULT_LOADING_TIMEOUT);
		return this;
	};

	this.foundExpectedResult = resultCondition;
}

module.exports = AutocompleteSearch;
