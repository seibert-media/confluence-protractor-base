var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
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

	pageObjectUtils.assertNotNull(spaceKey, 'First param "spaceKey" must be set');

	function spaceEntry() {
		self.actions.spaceDirectory.open();
		return element(by.css('[data-spacekey="' + spaceKey + '"]'));
	}

	this.assertSpaceExists = function () {
		var currentSpaceEntry = spaceEntry();
		pageObjectUtils.assert(currentSpaceEntry.isPresent(), true, 'Space NOT in space directory. spaceKey: ' + spaceKey);
	};

	this.assertSpaceExistsNot = function () {
		var currentSpaceEntry = spaceEntry();
		pageObjectUtils.assert(currentSpaceEntry.isPresent(), false, 'Unexpected space in space directory. spaceKey: ' + spaceKey);
	};


	this.actions = {
		spaceDirectory: new ConfluenceAction({
			path: 'spacedirectory/view.action'
		}),
		spaceHome: new ConfluenceAction({
			path: 'display/' + spaceKey
		}),
		removeSpace: new ConfluenceAction({
			path: 'spaces/removespace.action?key=' + spaceKey
		}),
		spaceOverview: new ConfluenceAction({
			path: 'spaces/viewspacesummary.action?key=' + spaceKey
		}),
		spacePermissions: (function () {
			function getPermission(tablePrefix, permission, additionalSelector) {
				var tableSelector = 'table#' + tablePrefix + 'PermissionsTable ';
				var permissionSelector = '[data-permission="' + permission + '"]';

				additionalSelector = additionalSelector || '';
				var selector = tableSelector + permissionSelector + additionalSelector;
				return element(by.css(selector)).getAttribute('data-permission-set');
			}

			var tablePrefixes = {
				ANONYMOUS: 'a',
				GROUP: 'g',
				USER: 'u'
			};

			return new ConfluenceAction({
				path: 'spaces/spacepermissions.action?key=' + spaceKey,
				getGroupPermission: function (permisson, group) {
					pageObjectUtils.assertNotNull(group, 'getGroupPermission needs a group parameter');
					var additionalSelector = '[data-permission-group="' + group+ '"]';
					return getPermission(tablePrefixes.GROUP, permisson, additionalSelector);
				},
				getAnonymousPermission: function (permisson) {
					return getPermission(tablePrefixes.ANONYMOUS, permisson);
				},
				getUserPermission: function (permisson, user) {
					pageObjectUtils.assertNotNull(user, 'getUserPermisson needs a user parameter');
					var additionalSelector = '[data-permission-user="' + user + '"]';
					return getPermission(tablePrefixes.USER, permisson, additionalSelector);
				}
			});
		})()
	};

	this.create = function () {
		self.actions.spaceDirectory.open();

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

		// wait for new space home to be loaded
		browser.wait(EC.urlContains(self.actions.spaceHome.path), DEFAULT_LOADING_TIMEOUT);

		// wait some time until space is updated
		browser.sleep(DEFAULT_LOADING_TIMEOUT / 2);
	};

	this.remove = function () {
		this.actions.removeSpace.open();

		clickIfPresent(element(by.id('confirm')));

		// check and wait for plugin name
		var percentComplete = element(by.id('percentComplete'));
		browser.wait(function() {
			return percentComplete.getText().then(function (text) {
				return text === '100';
			});
		}, DEFAULT_LOADING_TIMEOUT);

		self.actions.spaceHome.open();

		pageObjectUtils.assert(browser.getTitle(), 'Page Not Found - Confluence', 'Expected page not found after remove');
	};

}

ConfluenceSpace.prototype = new ConfluenceBase();

module.exports = ConfluenceSpace;
