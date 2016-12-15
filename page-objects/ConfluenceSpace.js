var ConfluenceBase = require('./ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');

var asyncElement = pageObjectUtils.asyncElement;
var findFirstDisplayed = pageObjectUtils.findFirstDisplayed;
var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
var waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;
var openPage = pageObjectUtils.openPage;

var EC = protractor.ExpectedConditions;

var blankSpaceSelector = '[data-item-module-complete-key="com.atlassian.confluence.plugins.confluence-create-content-plugin:create-blank-space-item"]';
var extranetSpaceSelector = '[data-blueprint-module-complete-key="net.seibertmedia.extranet.core:extranet-space-blueprint"]';

function ConfluenceSpace(spaceKey, spaceName) {
	var self = this;

	spaceName = spaceName || spaceKey;

	function checkSpaceKey() {
		if (!spaceKey) {
			throw new Error('No spaceKey set');
		}
	}
	function spaceEntry() {
		checkSpaceKey();
		self.openSpaceDirectory();
		return asyncElement(by.css('[data-spacekey="' + spaceKey + '"]'));
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

		var createSpaceButton = asyncElement(by.id('addSpaceLink'));
		createSpaceButton.click();

		var createSpaceFirstTime = asyncElement(by.css('.start-creating-space'));
		pageObjectUtils.clickIfPresent(createSpaceFirstTime);

		// select space template
		asyncElement(by.css(blankSpaceSelector)).click();

		// create button
		asyncElement(by.css('.aui-popup .create-dialog-create-button')).click();


		// set space name
		asyncElement(by.name('name')).sendKeys(spaceName).sendKeys('\t');

		asyncElement(by.name('spaceKey')).clear().sendKeys(spaceKey).sendKeys('\t');

		var createSpacePromise = waitForElementToBeClickable(findFirstDisplayed(by.css('.create-dialog-create-button'))).click();

		browser.wait(EC.urlContains(spaceHome()), DEFAULT_LOADING_TIMEOUT);

		// wait some time until space is updated
		browser.sleep(DEFAULT_LOADING_TIMEOUT);
	};

	this.remove = function () {
		checkSpaceKey();

		openPage('spaces/removespace.action?key=' + spaceKey);

		asyncElement(by.id('confirm')).click();

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
