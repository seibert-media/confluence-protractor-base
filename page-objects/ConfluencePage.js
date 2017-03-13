var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');
var ConfluenceEditor = require('./ConfluenceEditor');

var asyncElement = pageObjectUtils.asyncElement;
var waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;
var skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;

function ConfluencePage(pageName, spaceKey) {
	var EC = protractor.ExpectedConditions;
	var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
	var DEFAULT_ELEMENT_TIMEOUT = pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT;

	var pageEditor = new ConfluenceEditor();

	this.pageName = pageName;
	this.spaceKey = spaceKey;

	pageObjectUtils.assertNotNull(this.pageName, 'First param "pageName" must be set');
	pageObjectUtils.assertNotNull(this.spaceKey, 'Second param "spaceKey" must be set');

	this.actions = {
		createPage: new ConfluenceAction({
			path: 'pages/createpage.action?spaceKey=' + this.spaceKey
		}),
		displayPage: new ConfluenceAction({
			path: 'display/' + this.spaceKey + '/' + this.pageName
		})
	};

	this.create = function () {
		this.actions.createPage.open();
		element(by.id('content-title')).sendKeys(pageName);
		pageEditor.save();
		browser.wait(EC.visibilityOf(element(by.id('title-text'))), DEFAULT_LOADING_TIMEOUT);
	};

	this.open = function () {
		this.actions.displayPage.open();
	};

	this.edit = function () {
		var self = this;
		this.open();
		pageEditor.hasEditor().then(function (hasEditor) {
			if (!hasEditor) {
				asyncElement(by.id('editPageLink')).click();
				pageEditor.waitUntilEditorOpened();
				self.discardDraftIfPresent();
			}
		});
	};

	this.remove = function () {
		this.openActionMenu();

		asyncElement(by.id('action-remove-content-link')).click();
		var confirmSelector = 'confirm';
		if (this.confluenceVersion().greaterThan('5.10')) {
			confirmSelector = 'delete-dialog-next';
		}
		asyncElement(by.id(confirmSelector)).click();
	};

	this.discardDraftIfPresent = function () {
		var draftMessage = element(by.id('draft-messages'));
		draftMessage.isPresent().then(function (presence) {
			if (presence) {
				draftMessage.element(by.className("discard-draft")).click();
			}
		});
	};

	this.openActionMenu = function () {
		element(by.id('action-menu-link')).click();
	};

	this.addLabels = function (labels) {
		this.actions.displayPage.open();

		var labelsEditor = openLabelEditor();
		browser.wait(EC.visibilityOf(element(labelsEditor)), DEFAULT_LOADING_TIMEOUT);
		for (var i = 0; i < labels.length; i++) {
			sendLabelToInput(labels[i]);
			element(by.id('add-labels-editor-button')).click();
		}
	};

	this.getLabelSuggestions = function (label) {
		var labelsEditor = openLabelEditor();
		browser.wait(EC.visibilityOf(element(labelsEditor)), DEFAULT_LOADING_TIMEOUT);
		sendLabelToInput(label);
		browser.wait(EC.visibilityOf(element(by.css('#labels-autocomplete-list .aui-dropdown ol.last'))), DEFAULT_LOADING_TIMEOUT);
		return element.all(by.css('#labels-autocomplete-list .aui-dropdown ol.last li'));
	};

	this.getComments = function () {
		return element.all(by.css('#page-comments .comment'));
	};

	this.hasComments = function () {
		return this.getComments().count().then(function (count) {
			return count > 0;
		});
	};

	this.getLatestComment = function () {
		return this.getComments().last();
	};

	this.getLatestCommentContent = function () {
		return this.getLatestComment().element(by.css('.comment-content')).getText();
	};

	this.removeLatestComment = function () {
		var latestComment = this.getLatestComment();
		latestComment.element(by.css('.comment-action-remove')).click();

		skipAlertIfPresent();

		browser.wait(EC.stalenessOf(latestComment), DEFAULT_ELEMENT_TIMEOUT);
	};

	function sendLabelToInput(label) {
		var labelInput = element(by.id('labels-string'));
		waitForElementToBeClickable(labelInput);
		labelInput.sendKeys(label);
	}

	function openLabelEditor() {
		element(by.css('a.show-labels-editor')).click();
		return by.id('edit-labels-dialog');
	}

}

ConfluencePage.prototype = new ConfluenceBase();

module.exports = ConfluencePage;
