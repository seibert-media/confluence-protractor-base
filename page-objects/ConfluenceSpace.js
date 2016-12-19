var ConfluenceBase = require('./ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');

// page object utils imports
var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;
var element = pageObjectUtils.asyncElement;
var findFirstDisplayed = pageObjectUtils.findFirstDisplayed;
var openPage = pageObjectUtils.openPage;
var waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;

var blankSpaceSelector = '[data-item-module-complete-key="com.atlassian.confluence.plugins.confluence-create-content-plugin:create-blank-space-item"]';
var extranetSpaceSelector = '[data-blueprint-module-complete-key="net.seibertmedia.extranet.core:extranet-space-blueprint"]';

function ConfluenceSpace(spaceKey, spaceName) {
	var self = this;
	var EC = protractor.ExpectedConditions;

	spaceName = spaceName || spaceKey;

	function checkSpaceKey() {
		if (!spaceKey) {
			throw new Error('No spaceKey set');
		}
	}
	function spaceEntry() {
		checkSpaceKey();
		self.openSpaceDirectory();
		return element(by.css('[data-spacekey="' + spaceKey + '"]'));
	}

	function spaceHome() {
		checkSpaceKey();
		return 'display/' + spaceKey;
	}

	this.assertSpaceExists = function () {
		checkSpaceKey();
		var currentSpaceEntry = spaceEntry();
		pageObjectUtils.assert(currentSpaceEntry.isPresent(), true, 'Space NOT in space directory. spaceKey: ' + spaceKey);
	};

	this.assertSpaceExistsNot = function () {
		checkSpaceKey();
		var currentSpaceEntry = spaceEntry();
		pageObjectUtils.assert(currentSpaceEntry.isPresent(), false, 'Unexpected space in space directory. spaceKey: ' + spaceKey);
	};

	this.openSpaceDirectory = function() {
		openPage('spacedirectory/view.action');
	};

	this.create = function () {
		this.openSpaceDirectory();

		var createSpaceButton = element(by.id('addSpaceLink'));
		createSpaceButton.click();

		var createSpaceFirstTime = element(by.css('.start-creating-space'));
		pageObjectUtils.clickIfPresent(createSpaceFirstTime);

		// select space template
		element(by.css(blankSpaceSelector)).click();

		// create button
		element(by.css('.aui-popup .create-dialog-create-button')).click();


		var createButtonSelector = '.create-dialog-create-button';

		// set space name
		element(by.name('name')).sendKeys(spaceName).sendKeys('\t');

		// wait for create button before setting a space ckey
		waitForElementToBeClickable(findFirstDisplayed(by.css(createButtonSelector)));
		element(by.name('spaceKey')).clear().sendKeys(spaceKey).sendKeys('\t');

		// wait for create button again before click
		var createButton = waitForElementToBeClickable(findFirstDisplayed(by.css(createButtonSelector)));
		browser.wait(createButton.click());

		// wait for new space home to be loadedM
		browser.wait(EC.urlContains(spaceHome()), DEFAULT_LOADING_TIMEOUT);

		// wait some time until space is updated
		browser.sleep(DEFAULT_LOADING_TIMEOUT);
	};

	this.remove = function () {
		checkSpaceKey();

		openPage('spaces/removespace.action?key=' + spaceKey);

		clickIfPresent(element(by.id('confirm')));

		// check and wait for plugin name
		var percentComplete = element(by.id('percentComplete'));
		browser.wait(function() {
			return percentComplete.getText().then(function (text) {
				return text === '100';
			});
		}, DEFAULT_LOADING_TIMEOUT);

		openPage(spaceHome());

		pageObjectUtils.assert(browser.getTitle(), 'Page Not Found - Confluence', 'Expected page not found after remove');
	};

}

ConfluenceSpace.prototype = new ConfluenceBase();

module.exports = ConfluenceSpace;
