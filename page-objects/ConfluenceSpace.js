var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');

var clickIfPresent = pageObjectUtils.clickIfPresent;
var asyncElement = pageObjectUtils.asyncElement;
var findFirstDisplayed = pageObjectUtils.findFirstDisplayed;
var waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;

var blackSpaceTemplateKey = 'com.atlassian.confluence.plugins.confluence-create-content-plugin:create-blank-space-item';

function ConfluenceSpace(spaceKey, spaceName) {
	var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
	var EC = protractor.ExpectedConditions;
	var self = this;

	spaceName = spaceName || spaceKey;

	pageObjectUtils.assertNotNull(spaceKey, 'First param "spaceKey" must be set');

	function spaceEntry() {
		element(by.css('[data-tab-name="all"]')).click();
		return asyncElement(by.css('[data-spacekey="' + spaceKey + '"]'));
	}

	this.assertSpaceExists = function () {
		pageObjectUtils.assert(this.isInSpaceDirectory(), true, 'Space NOT in space directory. spaceKey: ' + spaceKey);
	};

	this.assertSpaceExistsNot = function () {
		pageObjectUtils.assert(this.isInSpaceDirectory(), false, 'Unexpected space in space directory. spaceKey: ' + spaceKey);
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
				return asyncElement(by.css(selector)).getAttribute('data-permission-set');
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

	var createButtonSelector = '.create-dialog-create-button';

	this.spaceWizard = {
		open: function () {
			self.actions.spaceDirectory.open({refreshAlways: true});

			var createSpaceButton = asyncElement(by.css('#addSpaceLink'));
			waitForElementToBeClickable(createSpaceButton, DEFAULT_LOADING_TIMEOUT);
			createSpaceButton.click();

			var skipButtonSelector = by.css('.start-creating-space');
			var skipButtonVisibility = EC.presenceOf(element(skipButtonSelector));
			var templateContainerVisibility = EC.presenceOf(element(by.css('.template-select-container-body .templates')));

			return browser.wait(EC.or(skipButtonVisibility, templateContainerVisibility), DEFAULT_LOADING_TIMEOUT)
				.then(function () {
					skipButtonVisibility().then(function (skipButtonVisible) {
						if (skipButtonVisible) {
							element(skipButtonSelector).click();
						}
					});
				});
		},
		selectTemplate: function (itemModuleCompleteKey) {
			var templateSelector = '[data-item-module-complete-key="' + itemModuleCompleteKey + '"]';
			asyncElement(by.css(templateSelector)).click();
			asyncElement(by.css(createButtonSelector)).click();
		},
		clickCreateButton: function () {
			var createButton = waitForElementToBeClickable(findFirstDisplayed(by.css(createButtonSelector)));
			createButton.click();
		},
		fillSpaceForm: function () {
			// set space name
			asyncElement(by.name('name')).sendKeys(spaceName).sendKeys('\t');

			var spaceKeyInput = asyncElement(by.name('spaceKey'));

			// wait for create button before setting a space key
			spaceKeyInput.clear();
			var buttonNotClickable = EC.not(EC.elementToBeClickable(findFirstDisplayed(by.css(createButtonSelector))));
			browser.wait(buttonNotClickable, DEFAULT_LOADING_TIMEOUT);

			spaceKeyInput.sendKeys(spaceKey).sendKeys('\t');
		}
	};

	this.create = function () {
		this.spaceWizard.open();

		// select space template
		this.spaceWizard.selectTemplate(blackSpaceTemplateKey);

		// fill form
		this.spaceWizard.fillSpaceForm();

		// wait for create button again before click
		this.spaceWizard.clickCreateButton();

		// wait for new space home to be loaded
		browser.wait(EC.urlContains(self.actions.spaceHome.path), DEFAULT_LOADING_TIMEOUT);
	};

	this.isInSpaceDirectory = function () {
		this.actions.spaceDirectory.open({refreshAlways: true});
		return spaceEntry().isPresent();
	};

	this.waitForSpaceToAppearInSpaceDirectory = function () {
		browser.wait(this.isInSpaceDirectory.bind(this), DEFAULT_LOADING_TIMEOUT);
	};

	this.waitForSpaceToDisappearFromSpaceDirectory = function () {
		browser.wait(EC.not(this.isInSpaceDirectory.bind(this)), DEFAULT_LOADING_TIMEOUT);
	};

	this.remove = function () {
		this.actions.removeSpace.open();
		clickIfPresent(asyncElement(by.id('confirm')));
		// check and wait for plugin name
		var percentComplete = asyncElement(by.id('percentComplete'));
		browser.wait(function() {
			return percentComplete.getText().then(function (text) {
				return text === '100';
			});
		}, DEFAULT_LOADING_TIMEOUT);
	};

	this.getSpaceKey = function () {
		return spaceKey;
	};

	this.spaceHomeByPageId = function () {
		this.actions.spaceDirectory.open({refreshAlways: true});
		this.waitForSpaceToAppearInSpaceDirectory();
		asyncElement(by.css('[data-spacekey="' + spaceKey + '"] .space-name a')).click();
	};
}

ConfluenceSpace.prototype = new ConfluenceBase();

module.exports = ConfluenceSpace;
